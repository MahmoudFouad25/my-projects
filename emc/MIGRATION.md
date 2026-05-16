# دليل التحويل من LocalStorage لـ Firestore

النظام مصمم بحيث التحويل من بيئة التطوير (LocalStorage) لبيئة
الإنتاج (Firebase Firestore) يتم بتعديلات محدودة بدون كسر أي
صفحة موجودة.

## متى يحدث هذا التحويل؟
بعد إكمال المراحل 1 + 2 + 3 من رحلة العميل، وقبل المرحلة 4.
في هذه النقطة تكون البنية مُختبرة على 3 مراحل، وأي بيانات تدخل
من المرحلة 3 وما بعدها = بيانات حقيقية تستحق التخزين السحابي.

---

## خطوات التحويل (للتنفيذ على مشروع Firebase الخاص بالعميل)

### الخطوة 1: إنشاء Firebase Project
1. اذهب إلى https://console.firebase.google.com
2. أنشئ مشروع جديد (مثلاً: `emc-academy-crm`)
3. فعّل **Authentication** → Sign-in method → Email/Password
4. فعّل **Firestore Database** → Start in production mode

### الخطوة 2: استبدال Firebase Config
في `/emc/js/emc-firebase.js`، استبدل قيمة `firebaseConfig`
بالـ config الجديد من المشروع الجديد.

### الخطوة 3: إضافة Firebase SDK في كل صفحة admin
في كل ملف داخل `/emc/admin/*.html` و `/emc/index.html`، أضف قبل
`<script src="../js/emc-firebase.js">`:

```html
<script src="https://www.gstatic.com/firebasejs/9.22.0/firebase-app-compat.js"></script>
<script src="https://www.gstatic.com/firebasejs/9.22.0/firebase-auth-compat.js"></script>
<script src="https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore-compat.js"></script>
```

### الخطوة 4: تفعيل الـ Adapters
في `/emc/js/emc-firebase.js`، غيّر السطرين في أعلى الملف:

```js
const STORAGE_MODE = 'firestore';  // كان: 'local'
const AUTH_MODE    = 'firebase';   // كان: 'local'
```

### الخطوة 5: نشر القواعد الأمنية
في Firebase Console → Firestore → Rules:
- الصق محتوى `/firestore.rules`
- اضغط Publish

### الخطوة 6: إنشاء أول Admin
**Authentication → Users → Add User:**
- Email: إيميل المدير
- Password: كلمة سر قوية (12+ حرف)
- انسخ الـ User UID بعد الإنشاء

**Firestore → Start Collection `emc_admins`:**
- Document ID: الـ UID المنسوخ
- Fields:
  - `email`: الإيميل
  - `fullName`: الاسم الكامل
  - `role`: `super_admin`
  - `initials`: الحروف الأولى
  - `isActive`: `true`
  - `createdAt`: server timestamp

### الخطوة 7: الاختبار
1. افتح `/emc/admin/login.html`
2. سجّل دخول بالحساب الجديد
3. تأكد إن البيانات تُحفظ في Firestore (شوفها مباشرة من Firebase Console)
4. افتح من جهاز ثاني → سجّل دخول بنفس الحساب → تأكد إن البيانات تظهر

### الخطوة 8 (اختياري): تنظيف بيانات Seed
لو لا تريد البيانات النموذجية تظهر، احذف استدعاء
`EMC.seedIfEmpty()` من صفحات admin (موجودة في login.html و
dashboard.html و contacts.html و contact-detail.html).

---

## ملاحظات
- اللوحات والصفحات الموجودة لن تحتاج أي تعديل إضافي
- جميع signatures دوال `EMC.store.*` و `EMC.auth.*` و `EMC.contacts.*`
  تبقى متطابقة في الوضعين
- بيانات LocalStorage لن تُنقل تلقائياً (تُعتبر بيانات اختبار)
