// ═══════════════════════════════════════════════════════
// emc-contacts.js — CRUD لجهات الاتصال
// ═══════════════════════════════════════════════════════

window.EMC = window.EMC || {};

window.EMC.contacts = {
  COLLECTION: 'emc_contacts',

  // ─── إنشاء جهة اتصال جديدة ───
  async create(data) {
    const blank = this.blankContact();
    const contact = this._deepMerge(blank, data);
    contact.createdAt = new Date().toISOString();
    contact.updatedAt = contact.createdAt;
    contact.stageHistory = [{
      stage: contact.currentStage || 1,
      enteredAt: contact.createdAt,
      reason: 'إضافة يدوية'
    }];
    const id = await EMC.store.create(this.COLLECTION, contact);
    await EMC.events.log({
      contactId: id,
      type: 'manual_note',
      stage: contact.currentStage,
      channel: 'manual',
      data: { action: 'created', name: contact.identity.fullName }
    });
    return id;
  },

  // ─── جلب واحد ───
  async get(id) {
    return await EMC.store.get(this.COLLECTION, id);
  },

  // ─── جلب الكل ───
  async list(filters = {}) {
    let docs = await EMC.store.list(this.COLLECTION);

    // فلترة
    if (filters.stage) docs = docs.filter(d => d.currentStage === filters.stage);
    if (filters.zone) {
      const stageIds = EMC.STAGES.filter(s => s.zone === filters.zone).map(s => s.id);
      docs = docs.filter(d => stageIds.includes(d.currentStage));
    }
    if (filters.temperature) docs = docs.filter(d => d.engagement?.temperature === filters.temperature);
    if (filters.source) docs = docs.filter(d => d.context?.source === filters.source);
    if (filters.search) {
      const q = filters.search.toLowerCase();
      docs = docs.filter(d => {
        const id = d.identity || {};
        return (id.fullName || '').toLowerCase().includes(q) ||
               (id.companyName || '').toLowerCase().includes(q) ||
               (id.title || '').toLowerCase().includes(q);
      });
    }

    // ترتيب — الأحدث أولاً
    docs.sort((a, b) => {
      const ta = new Date(a.context?.lastInteractionAt || a.createdAt || 0).getTime();
      const tb = new Date(b.context?.lastInteractionAt || b.createdAt || 0).getTime();
      return tb - ta;
    });

    return docs;
  },

  // ─── تحديث ───
  async update(id, updates) {
    return await EMC.store.update(this.COLLECTION, id, updates);
  },

  // ─── حذف ───
  async remove(id) {
    return await EMC.store.remove(this.COLLECTION, id);
  },

  // ─── نقل مرحلة ───
  async moveToStage(id, newStage, reason = '') {
    const contact = await this.get(id);
    if (!contact) throw new Error('Contact not found');
    const oldStage = contact.currentStage;
    const now = new Date().toISOString();
    const history = contact.stageHistory || [];

    // أغلق المرحلة السابقة
    if (history.length > 0) {
      history[history.length - 1].exitedAt = now;
    }
    history.push({
      stage: newStage,
      enteredAt: now,
      reason,
      performedBy: EMC.auth.getSession()?.email || 'system'
    });

    await this.update(id, {
      currentStage: newStage,
      stageHistory: history,
      'context.lastInteractionAt': now,
      context: { ...contact.context, lastInteractionAt: now }
    });

    await EMC.events.log({
      contactId: id,
      type: 'stage_change',
      stage: newStage,
      channel: 'manual',
      data: { from: oldStage, to: newStage, reason }
    });

    return true;
  },

  // ─── إحصاءات ───
  async stats() {
    const all = await this.list();
    const byStage = {};
    const byZone = { 1: 0, 2: 0, 3: 0, 4: 0 };
    const byTemp = { cold: 0, warm: 0, hot: 0, burning: 0 };
    let totalOppValue = 0;
    let avgScore = 0;

    EMC.STAGES.forEach(s => { byStage[s.id] = 0; });

    all.forEach(c => {
      byStage[c.currentStage] = (byStage[c.currentStage] || 0) + 1;
      const stage = EMC.utils.getStage(c.currentStage);
      if (stage) byZone[stage.zone]++;
      const t = c.engagement?.temperature || 'cold';
      byTemp[t]++;
      if (c.opportunity?.expectedValue) totalOppValue += c.opportunity.expectedValue;
      avgScore += c.engagement?.engagementScore || 0;
    });

    avgScore = all.length ? Math.round(avgScore / all.length) : 0;

    return { total: all.length, byStage, byZone, byTemp, totalOppValue, avgScore };
  },

  // ─── ملف فارغ ───
  blankContact() {
    return {
      identity: {
        fullName: '', firstName: '', lastName: '', title: '', companyName: '',
        industry: '', companySize: '', revenueRange: '', yearsInBusiness: '',
        country: 'EG', city: '', preferredLanguage: 'ar'
      },
      channels: {
        primaryEmail: '', mobile: '', whatsapp: '', linkedinUrl: '', facebookUrl: '',
        preferredChannel: 'whatsapp', bestContactTime: '', isContactable: true, optedOutChannels: []
      },
      context: {
        source: '', sourceDetails: '', firstTouchAt: null, lastInteractionAt: null,
        referrerId: '', tags: [], notes: ''
      },
      eosProfile: {
        currentRole: '', eosFamiliarity: '', companyStage: '', ceiling: '',
        pains: [], primaryComponent: '', goals12Months: ''
      },
      engagement: {
        emailOpens: 0, emailClicks: 0, contentConsumed: [], eventsAttended: [],
        callsCount: 0, engagementScore: 0, lastEngagedAt: null, temperature: 'cold'
      },
      opportunity: {
        expectedValue: 0, closeProbability: 0, expectedCloseDate: null,
        objections: [], decisionRole: '', stakeholders: [],
        budgetConfirmed: '', timelineUrgency: ''
      },
      customer: {
        cohortId: '', enrollmentDate: null, paymentStatus: '', paymentAmount: 0,
        attendanceRate: 0, rocksCompletionRate: 0, sessionsAttended: [], assignedCoach: ''
      },
      outcomes: {
        resultsNarrative: '', metricsBefore: {}, metricsAfter: {},
        nps3Month: null, nps6Month: null, nps12Month: null,
        testimonialStatus: 'not_requested', testimonialContent: '',
        caseStudyApproved: false, eosComponentsImplemented: []
      },
      advocacy: {
        referralsCount: 0, successfulReferrals: 0, referralsValue: 0,
        referredContactIds: [], contentContributions: [], eventsSpoken: [],
        advocateLevel: ''
      },
      currentStage: 3,
      stageHistory: [],
      assignedTo: '',
      status: 'active'
    };
  },

  _deepMerge(target, source) {
    const out = { ...target };
    for (const key in source) {
      if (source[key] && typeof source[key] === 'object' && !Array.isArray(source[key])) {
        out[key] = this._deepMerge(target[key] || {}, source[key]);
      } else {
        out[key] = source[key];
      }
    }
    return out;
  }
};

window.EMC.events = {
  COLLECTION: 'emc_events',

  async log(eventData) {
    const event = {
      ...eventData,
      timestamp: new Date().toISOString(),
      performedBy: eventData.performedBy || EMC.auth.getSession()?.email || 'system'
    };
    return await EMC.store.create(this.COLLECTION, event);
  },

  async listForContact(contactId) {
    const all = await EMC.store.list(this.COLLECTION);
    return all
      .filter(e => e.contactId === contactId)
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  },

  async listRecent(limit = 20) {
    const all = await EMC.store.list(this.COLLECTION);
    return all
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
      .slice(0, limit);
  }
};
