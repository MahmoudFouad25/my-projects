// ═══════════════════════════════════════════════════════
// emc-layout.js — Sidebar + Topbar مشترك بين كل صفحات الأدمن
// استخدامها: EMC.layout.render({ page: 'dashboard' })
// ═══════════════════════════════════════════════════════

window.EMC = window.EMC || {};

window.EMC.layout = {
  navItems: [
    { id: 'dashboard',  label: 'لوحة التحكم',   href: 'dashboard.html',  icon: 'home' },
    { id: 'contacts',   label: 'جهات الاتصال',  href: 'contacts.html',   icon: 'users', countKey: 'total' },
    { id: 'pipeline',   label: 'خط الفرص',      href: 'contacts.html?zone=2', icon: 'columns' },
    { id: 'students',   label: 'العملاء النشطون', href: 'contacts.html?zone=3', icon: 'graduation' },
    { id: 'alumni',     label: 'الخريجون والسفراء', href: 'contacts.html?zone=4', icon: 'star' },
  ],
  navItemsSecondary: [
    { id: 'cohorts',    label: 'الكوهورتات',    href: '#',  icon: 'calendar', soon: true },
    { id: 'templates',  label: 'قوالب الرسائل', href: '#',  icon: 'mail', soon: true },
    { id: 'automations',label: 'الأتمتة',       href: '#',  icon: 'zap', soon: true },
    { id: 'reports',    label: 'التقارير',      href: '#',  icon: 'chart', soon: true }
  ],

  icons: {
    home: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M3 12l9-9 9 9"/><path d="M5 10v10h14V10"/></svg>',
    users: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="8" r="3.5"/><path d="M2.5 20c0-3.5 3-6 6.5-6s6.5 2.5 6.5 6"/><circle cx="17.5" cy="7" r="2.5"/><path d="M16 13.5c2.5 0 5 1.5 5 4"/></svg>',
    columns: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="5" height="16" rx="1"/><rect x="9.5" y="4" width="5" height="11" rx="1"/><rect x="16" y="4" width="5" height="7" rx="1"/></svg>',
    graduation: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M2 9l10-5 10 5-10 5z"/><path d="M6 11v5c0 1.5 2.7 3 6 3s6-1.5 6-3v-5"/></svg>',
    star: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15 9 22 9.5 17 14.5 18.5 22 12 18 5.5 22 7 14.5 2 9.5 9 9"/></svg>',
    calendar: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="5" width="18" height="16" rx="2"/><line x1="3" y1="10" x2="21" y2="10"/><line x1="8" y1="3" x2="8" y2="7"/><line x1="16" y1="3" x2="16" y2="7"/></svg>',
    mail: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 7l9 7 9-7"/></svg>',
    zap: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><polygon points="13 2 4 14 12 14 11 22 20 10 12 10"/></svg>',
    chart: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M3 3v18h18"/><path d="M7 14l4-4 3 3 5-6"/></svg>',
    search: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="7"/><line x1="21" y1="21" x2="16.6" y2="16.6"/></svg>',
    bell: '<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M18 16v-5a6 6 0 0 0-12 0v5l-2 2h16z"/><path d="M10 21a2 2 0 0 0 4 0"/></svg>',
    plus: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>',
    chevron: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"/></svg>',
    chevronLeft: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"/></svg>',
    settings: '<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 0 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 0 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3h0a1.7 1.7 0 0 0 1-1.5V3a2 2 0 0 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8v0a1.7 1.7 0 0 0 1.5 1H21a2 2 0 0 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z"/></svg>'
  },

  async render({ page = 'dashboard', count = null }) {
    const session = await EMC.auth.protect();
    if (!session) return null;

    // counts
    let counts = {};
    try {
      const s = await EMC.contacts.stats();
      counts = { total: s.total };
    } catch (e) { counts = { total: 0 }; }

    const root = document.getElementById('emc-shell-root');
    if (!root) return;

    root.innerHTML = `
      <div class="emc-shell">
        <aside class="emc-sidebar">
          <div class="emc-logo">
            ${this._logoBlock()}
            <div>
              <div class="emc-logo-text-1">EXECUTIVE<br/>MASTERY</div>
              <div class="emc-logo-text-2">CRM · Camp</div>
            </div>
          </div>

          <div class="emc-nav-label">العمليات</div>
          <nav class="emc-nav">
            ${this.navItems.map(n => `
              <a href="${n.href}" class="${n.id === page ? 'active' : ''}">
                ${this.icons[n.icon] || ''}
                <span>${n.label}</span>
                ${n.countKey && counts[n.countKey] != null ? `<span class="nav-badge">${counts[n.countKey]}</span>` : ''}
              </a>
            `).join('')}
          </nav>

          <div class="emc-nav-label">قريباً</div>
          <nav class="emc-nav">
            ${this.navItemsSecondary.map(n => `
              <a href="${n.href}" class="${n.id === page ? 'active' : ''}" style="opacity:.55; cursor:default;" onclick="event.preventDefault()">
                ${this.icons[n.icon] || ''}
                <span>${n.label}</span>
              </a>
            `).join('')}
          </nav>

          <div class="emc-sidebar-footer">
            <div style="display:flex; align-items:center; gap:8px; margin-bottom:4px;">
              <span style="width:7px; height:7px; border-radius:50%; background:#5BB475; box-shadow:0 0 0 3px rgba(91,180,117,0.15);"></span>
              <span style="color:rgba(255,255,255,0.75); font-weight:600;">${EMC.firebaseReady ? 'متصل بـ Firebase' : 'وضع العرض المحلي'}</span>
            </div>
            <div>قاعدة البيانات · ${EMC.config.namespace}</div>
            <div class="emc-storage-bar"><div style="width: ${Math.min(100, counts.total * 3)}%"></div></div>
            <div>${counts.total} جهة اتصال · حد مجاني</div>
          </div>
        </aside>

        <div>
          <header class="emc-topbar">
            <div class="emc-topbar-search">
              ${this.icons.search}
              <input id="global-search" type="search" placeholder="ابحث عن جهة اتصال، شركة، أو منصب…" />
            </div>
            <div class="emc-topbar-actions">
              <a href="add-contact.html" class="btn btn-accent btn-sm">${this.icons.plus} جهة اتصال جديدة</a>
              <button class="emc-icon-btn" aria-label="الإشعارات">${this.icons.bell}<span class="dot"></span></button>
              <button class="emc-icon-btn" aria-label="الإعدادات">${this.icons.settings}</button>
              <div class="emc-user-chip" role="button" tabindex="0" id="user-chip">
                <div>
                  <div class="emc-user-chip-name">${session.name}</div>
                  <div class="emc-user-chip-role">${session.role === 'super_admin' ? 'مشرف عام' : 'مساعد'}</div>
                </div>
                <div class="emc-user-avatar">${session.initials}</div>
              </div>
            </div>
          </header>

          <main class="emc-main" id="emc-main">
            <!-- محتوى الصفحة هيتحط هنا -->
          </main>
        </div>
      </div>
    `;

    // events
    const userChip = document.getElementById('user-chip');
    userChip.addEventListener('click', () => {
      if (confirm('تسجيل خروج؟')) EMC.auth.signOut();
    });

    const search = document.getElementById('global-search');
    search.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        const q = search.value.trim();
        if (q) window.location.href = 'contacts.html?search=' + encodeURIComponent(q);
      }
    });

    return document.getElementById('emc-main');
  },

  _logoBlock() {
    return `<div class="emc-logo-mark" style="background: #FFFFFF; border-radius: 6px; padding: 2px;">
      <svg width="100%" height="100%" viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <!-- Director's chair mark, navy + red -->
        <rect x="16" y="18" width="32" height="7" rx="1" fill="#0B2545"/>
        <line x1="22" y1="21.5" x2="42" y2="21.5" stroke="#D72638" stroke-width="2"/>
        <rect x="14" y="31" width="36" height="6" rx="1" fill="#D72638"/>
        <line x1="18" y1="25" x2="14" y2="50" stroke="#0B2545" stroke-width="2.5" stroke-linecap="round"/>
        <line x1="46" y1="25" x2="50" y2="50" stroke="#0B2545" stroke-width="2.5" stroke-linecap="round"/>
        <line x1="14" y1="50" x2="46" y2="25" stroke="#0B2545" stroke-width="2.5" stroke-linecap="round"/>
        <line x1="11" y1="50" x2="22" y2="50" stroke="#0B2545" stroke-width="2.5" stroke-linecap="round"/>
        <line x1="42" y1="50" x2="53" y2="50" stroke="#0B2545" stroke-width="2.5" stroke-linecap="round"/>
      </svg>
    </div>`;
  }
};
