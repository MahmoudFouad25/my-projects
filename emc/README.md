# EMC CRM — MVP الأسبوع 0

نظام إدارة رحلة العميل لأكاديمية Executive Mastery Camp.

## 📁 البنية

```
/emc/
├── index.html                  ← نقطة دخول العرض + كاتالوج الصفحات
├── admin/
│   ├── login.html              ← صفحة الدخول
│   ├── dashboard.html          ← لوحة التحكم (الخمسة أرقام + القمع)
│   ├── contacts.html           ← قائمة جهات الاتصال + الفلاتر
│   ├── contact-detail.html?id= ← تفاصيل بـ 9 تبويبات (طبقة لكل تبويب)
│   └── add-contact.html        ← نموذج إضافة متعدد الأقسام
├── css/
│   └── emc-styles.css          ← هوية EMC (نيفي + أحمر + كريمي)
└── js/
    ├── emc-firebase.js         ← تهيئة Firebase + localStorage adapter
    ├── emc-utils.js            ← الـ 14 مرحلة + helpers + قواميس
    ├── emc-contacts.js         ← CRUD لـ emc_contacts
    └── emc-layout.js           ← Sidebar + Topbar مشترك
```

## 🚀 التشغيل

### للعرض المحلي
افتح `emc/index.html` في المتصفح. هتلاقي كاتالوج كامل لكل الصفحات.

**بيانات الدخول للديمو:**
- 📧 `abdullah@emc.academy`
- 🔑 `demo2026`

أول مرة بتسجل، النظام بيعبّى 6 جهات اتصال نموذجية موزعة على مراحل مختلفة عشان تشوف الواجهة بكامل بياناتها.

### للنشر على GitHub Pages
المجلد `/emc/` بأكمله جاهز للنشر مباشرة. حط الـ folder كله في الـ repo `fouad-perspective`، وافتح:
```
https://mahmoudfouad25.github.io/fouad-perspective/emc/
```

## 🔥 ربط Firebase (خطوات سريعة)

النظام حالياً بيستخدم localStorage كـ adapter بنفس واجهة Firestore. للتبديل لـ Firestore الحقيقي:

### 1. أضف Firebase SDK لكل صفحة admin
قبل `emc-firebase.js` في كل صفحة:
```html
<script src="https://www.gstatic.com/firebasejs/9.22.0/firebase-app-compat.js"></script>
<script src="https://www.gstatic.com/firebasejs/9.22.0/firebase-auth-compat.js"></script>
<script src="https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore-compat.js"></script>
```

### 2. عدّل `emc-firebase.js`
استبدل `LocalStore` بدوال Firestore:
```js
const FirestoreAdapter = {
  async create(coll, data, id) {
    const ref = id
      ? window.emcFirestore.collection(coll).doc(id)
      : window.emcFirestore.collection(coll).doc();
    await ref.set({ ...data, createdAt: firebase.firestore.FieldValue.serverTimestamp() });
    return ref.id;
  },
  async get(coll, id) {
    const doc = await window.emcFirestore.collection(coll).doc(id).get();
    return doc.exists ? { id: doc.id, ...doc.data() } : null;
  },
  // ... باقي الدوال بنفس الـ signatures
};
window.EMC.store = FirestoreAdapter; // بدل LocalStore
```

نفس الواجهة بالضبط، فالـ pages كلها هتشتغل بدون أي تعديل.

### 3. أنشئ أول Admin يدوياً
في Firebase Console → Authentication → Users:
- أنشئ مستخدم بإيميل `abdullah@emc.academy`

في Firestore Console → Collection `emc_admins`:
- اعمل document بـ ID = uid الخاص بالمستخدم
- المحتوى:
  ```json
  {
    "email": "abdullah@emc.academy",
    "fullName": "عبدالله عامر",
    "role": "super_admin",
    "isActive": true,
    "createdAt": "..."
  }
  ```

### 4. حدّث `firestore.rules`
```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    function isEmcAdmin() {
      return request.auth != null &&
        exists(/databases/$(database)/documents/emc_admins/$(request.auth.uid)) &&
        get(/databases/$(database)/documents/emc_admins/$(request.auth.uid)).data.isActive == true;
    }
    match /emc_{collection}/{doc} {
      allow read, write: if isEmcAdmin();
    }
    match /emc_contacts/{doc} {
      allow create: if true;  // عشان النماذج العامة في المراحل القادمة
      allow read, update, delete: if isEmcAdmin();
    }
    // باقي القواعد الحالية لمنظور الفؤاد تفضل كما هي
  }
}
```

## 🗂 الـ Collections

| Collection         | الوظيفة                              | الحالة      |
|--------------------|--------------------------------------|------------|
| `emc_contacts`     | ملف العميل بالطبقات الـ 9            | ✅ MVP      |
| `emc_events`       | سجل كل تفاعل وتغيير مرحلة             | ✅ MVP      |
| `emc_cohorts`      | الكوهورتات الدراسية                  | ✅ schema   |
| `emc_templates`    | قوالب الإيميل والواتساب              | ⏳ أسبوع 3+ |
| `emc_admins`       | مدراء النظام والصلاحيات              | ✅ schema   |
| `emc_opportunities`| الفرص النشطة (تفاصيل أعمق)            | ⏳ أسبوع 5  |
| `emc_automations`  | قواعد الأتمتة                        | ⏳ أسبوع 4+ |

## 📋 الـ 14 مرحلة

| منطقة | المراحل | الحالة في الـ MVP |
|-------|--------|------------------|
| 1 — العملاء المحتملون | 1-4 (Suspect → MQL) | ✅ تتبع يدوي |
| 2 — إدارة الفرص | 5-9 (SQL → Decision) | ✅ تتبع يدوي |
| 3 — دورة حياة العميل | 10-12 (Onboarding → Implementation) | ✅ تتبع يدوي |
| 4 — الانتماء والإحالة | 13-14 (Alumni → Advocate) | ✅ تتبع يدوي |

**MVP بيدعم:** عرض المراحل، تتبع جهات الاتصال عليها، نقل يدوي بين المراحل، سجل التحولات.
**في الإصدارات القادمة:** أتمتة الانتقالات، Triggers، نماذج عامة، قنوات تواصل مؤتمتة (إيميل + واتساب).

## 🎨 الـ Design System

- **Navy** `#0B2545` — اللون الأساسي (مأخوذ من خلفية الشعار)
- **Red** `#D72638` — اللون التركيزي (شرائط كرسي المخرج)
- **Cream** `#F7F4ED` — خلفية الصفحات
- **Gold** `#C9A961` — منطقة الخريجين والنجاحات
- **Font:** Cairo (Google Fonts) + JetBrains Mono للأرقام والكود

## ➡️ الأسبوع 1 القادم

بناء صفحة المرحلة 1 (المراقب) — تعريف الشرائح + نظام التوسيم + استيراد جماعي لجهات اتصال نظرية من LinkedIn search.

---
بُني خصيصاً لـ **عبدالله عامر · Executive Mastery Camp** · مايو 2026
