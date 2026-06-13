# برومبت لوكيل برمجي — إصلاح ثغرات وأخطاء noor_academy

> **طريقة الاستخدام:** هذا البرومبت موجّه مباشرة لوكيل برمجي (Coding Agent) لديه صلاحية تعديل الكود وتشغيل أوامر (npm install, npm run build...) على ريبو `noor_academy`. الصق هذا الملف كاملاً كرسالة أولى للوكيل، أو نفّذ مرحلة واحدة في كل مرة (الأفضل للدقة والتحقق).

---

## 0. السياق

مشروع Next.js 15 (App Router) + TypeScript + NextAuth v4 + Firebase (Firestore، حالياً client SDK فقط). تم عمل تدقيق أمني/وظيفي شامل على المشروع وتم إصلاح بعض البنود (راجع commit `c69d18b`). المطلوب الآن إكمال بقية الإصلاحات بدقة دون كسر أي وظيفة موجودة أو تغيير التصميم/الواجهات الحالية.

---

## 1. قواعد عامة صارمة (Global Rules) — تطبَّق طوال التنفيذ

1. **اقرأ كل ملف قبل تعديله** عبر أداة القراءة — لا تفترض محتواه من هذا البرومبت، فقد يكون تغيّر.
2. **لا تُدخل أي بيانات اعتماد (credentials) في الكود** بأي شكل (لا إيميلات، لا باسوردات افتراضية، لا API keys). كل سر يجب أن يأتي من `process.env`.
3. **لا تُرجع أي secret/OTP/password في أي API response** تحت أي ظرف، حتى في development، إلا إذا كان البرومبت يطلب ذلك صراحة لبيئة `development` فقط (كما هو حالياً في `otp-send`).
4. **التزم بأسلوب الكود الحالي**: TypeScript صارم، نفس أسلوب تسمية الملفات، الرسائل والنصوص الموجّهة للمستخدم بالعربية، التصميم (Tailwind classes الحالية) لا يُغيَّر إلا عند الضرورة لإضافة عناصر جديدة (مثل حقل كلمة مرور جديد).
5. **لا تخترع رقم إصدار حزمة (package version)**. عند تثبيت حزمة جديدة استخدم `npm install <package>` بدون تحديد رقم إصدار (يثبّت آخر إصدار صحيح تلقائياً)، ثم تحقق من نجاح `npm run build`.
6. **Edge Runtime constraint (مهم جداً):** `middleware.ts` يعمل على Edge Runtime ولا يدعم Node APIs. **لا تستورد `firebase-admin` أو `bcryptjs` أو `firestore-admin.ts` في `middleware.ts` أو في أي ملف "use client"**. middleware يجب أن يعتمد فقط على `token.role` / `token.permissions` الموجودة بالفعل في JWT.
7. **بعد كل مرحلة:** شغّل `npm run build` (أو `npx tsc --noEmit` كحد أدنى) وتأكد من عدم وجود أخطاء، ثم اطبع ملخصاً بالملفات التي تم تعديلها/إنشاؤها وأي env vars جديدة مطلوبة، وتوقف لمراجعة المستخدم قبل الانتقال للمرحلة التالية (إلا إذا طُلب تنفيذ كل المراحل دفعة واحدة).
8. الهدف النهائي للبنية: **كل وصول إلى Firestore (قراءة أو كتابة) لأي بيانات حساسة أو إدارية يتم فقط عبر `firebase-admin` من Server Components أو Route Handlers — وليس عبر `firebase/firestore` (client SDK) من أي "use client" component**.

---

## 2. الإعداد الأساسي المطلوب قبل المرحلة 1

### 2.1 تثبيت الحزم
```bash
npm install firebase-admin bcryptjs
npm install -D @types/bcryptjs
```

### 2.2 متغيرات بيئة جديدة
أضف في `.env.example` (مع تعليق توضيحي بالعربية يشرح من أين تُجلب هذه القيم: Firebase Console → Project Settings → Service Accounts → Generate new private key):

```
# ---- Firebase Admin SDK (Server-side only) ----
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@your-project.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nXXXX\n-----END PRIVATE KEY-----\n"
```

### 2.3 إنشاء `src/lib/firebase-admin.ts` (ملف Server-only جديد)
- يهيّئ Firebase Admin App مرة واحدة فقط (نفس نمط `getApps().length === 0 ? ... : ...` الموجود في `firebase.ts`).
- يقرأ `FIREBASE_PRIVATE_KEY` ويستبدل `\\n` بـ `\n` فعلياً (`.replace(/\\n/g, "\n")`) قبل تمريره لـ `cert()`.
- يصدّر:
  - `adminDb` = `getFirestore(adminApp)`
  - `adminAuthIsConfigured()` → `true` إذا كانت الثلاث env vars موجودة، و`false` غير ذلك (نفس فكرة `isFirebaseConfigured` لكن لإعدادات Admin).
- إذا لم تكن env vars موجودة، **لا تُفجّر التطبيق** (لا `throw` عند الـ import) — فقط اجعل `adminAuthIsConfigured()` ترجع `false`، والدوال التي تستخدم `adminDb` يجب أن تتعامل مع هذه الحالة (مثلاً ترجع `null`/`[]` مع `logger.error`).

---

## 3. المرحلة 1 (الأهم): تشفير كلمات المرور + نقل إدارة admins/teachers إلى Server-side (يعالج 1.2 + 1.3)

### 3.1 إنشاء `src/lib/password.ts`
دالتان فقط:
```ts
export async function hashPassword(plain: string): Promise<string>
export async function verifyPassword(plain: string, hash: string): Promise<boolean>
```
باستخدام `bcryptjs` بـ `saltRounds = 10`.

### 3.2 إنشاء `src/lib/firestore-admin.ts`
ملف Server-only جديد (لا يُستورد أبداً في "use client"). يحتوي دوال CRUD لـ `admins` و `teachers` باستخدام `adminDb` (firebase-admin/firestore، أي `adminDb.collection("admins").doc(id).set/update/delete/get`, و `adminDb.collection("admins").where("email","==",email).limit(1).get()`):

- `getAllAdmins()`, `getAdminByEmail(email)`, `createAdmin(data)`, `updateAdmin(id, data)`, `deleteAdmin(id)`
- نفس الأربعة لـ `teachers`
- **مهم:** `createAdmin` / `updateAdmin` (عند وجود `password` في البيانات) يجب أن يستدعي `hashPassword()` من `password.ts` قبل الحفظ — **لا تُخزَّن أي كلمة مرور بنص صريح بعد هذه المرحلة**.

### 3.3 تعديل `src/lib/auth.ts`
- استبدل كل استعلامات `firebase/firestore` (client SDK) لـ `admins`/`teachers`/`students` بدوال من `firestore-admin.ts` (و `getAllAdmins`/مكافئ للطلاب من المرحلة 2).
- استبدل المقارنة `credentials.password === data.password` بـ:
```ts
const passwordValid = data.password ? await verifyPassword(credentials.password, data.password) : false;
```
- استبدل فحص `isFirebaseConfigured()` بـ `adminAuthIsConfigured()` من `firebase-admin.ts` في كل الأماكن التي تتحقق من قاعدة admins/teachers/students.
- لا تغيّر باقي منطق الأدوار/الصلاحيات (`ALL_ROLE_PERMISSIONS`, الـ jwt/session callbacks) إلا بما يلزم لتبديل مصدر البيانات.

### 3.4 إنشاء API routes محمية لإدارة المشرفين والمدرّسين
ملفات جديدة:
- `src/app/api/admin/admins/route.ts` → `GET` (قائمة), `POST` (إنشاء)
- `src/app/api/admin/admins/[id]/route.ts` → `PUT` (تعديل), `DELETE` (حذف)
- نفس البنية لـ `src/app/api/admin/teachers/...` (إن وُجدت صفحة مدرّسين، وإلا أضف الـ API فقط للاستخدام المستقبلي)

كل route handler:
1. `const session = await getServerSession(authOptions);`
2. تحقق: `session?.user?.permissions` تحتوي `"manage_admins"` (استخدم `hasSpecificPermission` من `@/lib/permissions`)، وإلا `403`.
3. ينفّذ العملية عبر `firestore-admin.ts` (بما فيها تشفير الباسورد عند الإنشاء/التعديل).
4. **Validation:** الإيميل صيغة صحيحة (regex بسيط)، الباسورد ≥ 6 أحرف عند الإنشاء، عدم السماح بحذف آخر admin يملك `manage_admins` (نفس المنطق الموجود حالياً في الواجهة — انقله للسيرفر).
5. منع المستخدم من حذف نفسه (تحقق `session.user.email === target.email`).

### 3.5 تعديل `src/app/(dashboard)/dashboard/admins/page.tsx`
- احذف كل `import { ... } from "firebase/firestore"` و`import { db } from "@/lib/firebase"`.
- استبدل `getDocs/addDoc/updateDoc/deleteDoc` باستدعاءات `fetch("/api/admin/admins", ...)` (`GET`/`POST`/`PUT`/`DELETE`).
- اترك حقل "كلمة المرور" في الواجهة كما هو (سيُشفَّر في السيرفر تلقائياً).
- ابقِ فحص `hasSpecificPermission(...)` + `router.push` في الواجهة (تجربة مستخدم جيدة)، لكنه الآن **دفاع ثانوي فقط** — الحماية الحقيقية في الـ API (3.4).

### 3.6 إنشاء `firestore.rules` في جذر المشروع
```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if false;
    }
  }
}
```
(الوصول الوحيد المسموح هو عبر Firebase Admin SDK من السيرفر، الذي يتجاوز هذه القواعد بالكامل). أضف ملاحظة في `AUTH_SETUP.md` تشرح أن على المستخدم نشر هذا الملف عبر `firebase deploy --only firestore:rules` أو لصقه في Firebase Console → Firestore → Rules.

### ✅ معيار قبول المرحلة 1
- `npm run build` ينجح.
- لا يوجد أي `import ... from "firebase/firestore"` متبقٍ في أي ملف "use client" يخص admins/teachers.
- إنشاء/تعديل مشرف جديد من الواجهة يخزّن `password` كهاش (bcrypt) في Firestore، لا نص صريح.
- استدعاء `/api/admin/admins` بدون session مسجّلة يرجع `403`.

---

## 4. المرحلة 2: تسجيل الطلاب + OTP عبر Firestore (يعالج 2.4 ويُكمل 1.5)

### 4.1 توسعة `firestore-admin.ts`
أضف لـ `students`: `getStudentByEmail(email)`, `createStudent(data)` (مع `hashPassword`)، `updateStudentPassword(id, newHashedPassword)`.

### 4.2 تعديل `src/app/api/auth/register/route.ts`
- استبدل `registerUser()` (من `user-store.ts`) باستدعاء `getStudentByEmail` (لرفض التكرار إن وُجد إيميل مسجّل بالفعل → خطأ "البريد مستخدم بالفعل") ثم `createStudent()`.
- أضف validation لصيغة الإيميل.
- يمكن حذف `src/lib/user-store.ts` بالكامل بعد هذه الخطوة (تأكد من إزالة كل استيراداته، بما فيها من `auth.ts`).

### 4.3 تعديل `src/lib/auth.ts` (تكملة)
- استعلام الطلاب يصبح عبر `getStudentByEmail` (Admin SDK) + `verifyPassword`، بدل `getUserByEmail` من `user-store.ts`.

### 4.4 نقل OTP store + rate limiting إلى Firestore (عبر Admin SDK)
- `src/lib/otp-store.ts`: استبدل `Map` بـ collection جديدة `otp_codes` (doc id = `` `${email}_${type}` ``)، نفس توقيع الدوال الحالية (`setOtp`, `consumeOtp`) لكن الآن `async` تستخدم `adminDb`.
- `src/app/api/auth/otp-verify/route.ts`: استبدل `Map` الخاص بـ rate limiting بـ collection `otp_attempts` (doc id = email)، باستخدام `FieldValue.increment(1)` + حذف الحقل بعد نجاح التحقق أو بعد انتهاء `WINDOW_MS`.
- هذا يحل مشكلة عدم استمرارية الذاكرة بين instances على Vercel **بدون** الحاجة لبنية تحتية إضافية (Redis/KV)، لأن Firestore مركزي بالفعل.

### ✅ معيار قبول المرحلة 2
- تسجيل حساب جديد → تسجيل دخول بعد "إعادة نشر/cold start" محاكاة (أو فقط تأكد البيانات في Firestore لا في الذاكرة) يعمل.
- `src/lib/user-store.ts` محذوف ولا توجد استيرادات معطّلة.
- محاولات OTP الخاطئة المتكررة تُرفض بعد 5 محاولات حتى لو افترضنا تبديل instance (لأن العداد في Firestore).

---

## 5. المرحلة 3: ربط لوحة التحكم بالطلبات والرسائل الحقيقية (يكمل 2.1 و2.2)

### 5.1 `src/app/api/admin/orders/route.ts` (جديد) + `[id]/route.ts`
- `GET`: محمي بـ `manage_orders`، يستدعي `getAllOrders()` (حوّل دوال `orders` في `firestore.ts` الحالية إلى `firestore-admin.ts` أو أضفها هناك بنفس نمط 3.2).
- `PUT /api/admin/orders/[id]`: تعديل الحالة (`status`) عبر `updateOrder()`.

### 5.2 `src/app/api/admin/messages/route.ts` (جديد) + `[id]/route.ts`
- `GET`: محمي بـ `manage_messages`، يستدعي `getAllMessages()`.
- `PUT [id]`: `markMessageRead()`. `DELETE [id]`: `deleteMessage()`.

### 5.3 تعديل `src/app/(dashboard)/dashboard/orders/page.tsx`
- احذف `import { initialOrders } from "@/data/orders"`.
- اجلب البيانات عبر `useEffect` + `fetch("/api/admin/orders")`.
- اربط أي زر "تحديث الحالة" بـ `PUT /api/admin/orders/[id]`.
- لا تحذف `src/data/orders.ts` الآن إن كان مستخدماً في مكان آخر (مثل `/portal`) — اترك ذلك للمرحلة 4 إذا لزم.

### 5.4 تعديل `src/app/(dashboard)/dashboard/messages/page.tsx`
- احذف المصفوفة الثابتة `const messages = [...]`.
- اجلب عبر `fetch("/api/admin/messages")`، وفعّل أزرار "تمييز كمقروء" و"حذف" لتستدعي `PUT`/`DELETE`.

### ✅ معيار قبول المرحلة 3
- إرسال طلب جديد من صفحة دورة، أو رسالة من "تواصل معنا"، **يظهر فوراً** في `/dashboard/orders` أو `/dashboard/messages` بعد تحديث الصفحة (بدون أي تعديل يدوي في الكود).

---

## 6. المرحلة 4 (أولوية أقل، وظيفية لا أمنية): ربط الدورات/المدربين/الآراء بـ Firestore (يعالج 2.3)

> ⚠️ هذه المرحلة الأكبر حجماً. نفّذها فقط بعد تأكيد المستخدم، ويمكن تقسيمها (دورات أولاً، ثم مدربين، ثم آراء).

### 6.1 سكربت Seed وحيد
أنشئ `scripts/seed-firestore.ts` يستخدم `firebase-admin` (نفس init من 2.3) ليقرأ `src/data/courses.ts`, `src/data/instructors.ts`, `src/data/testimonials.ts` ويكتبها مرة واحدة في Firestore (تحقق أولاً: لا تكتب فوق بيانات موجودة — إن كانت collection غير فارغة، تجاهل/أبلغ). أضف سكربت npm: `"seed": "tsx scripts/seed-firestore.ts"` (أضف `tsx` كـ devDependency بدون تحديد إصدار).

### 6.2 API routes محمية (نفس نمط 3.4/5.1)
`src/app/api/admin/courses/...` و `.../instructors/...` و `.../testimonials/...` — محمية بـ `manage_courses` / `manage_instructors` / `manage_testimonials` على التوالي، باستخدام دوال `firestore-admin.ts` الموجودة فعلاً (`createCourse`, `updateCourse`, `deleteCourse`, إلخ — حوّلها من client SDK إلى Admin SDK).

### 6.3 تعديل صفحات لوحة التحكم
`dashboard/courses/page.tsx`, `dashboard/instructors/page.tsx`, `dashboard/testimonials/page.tsx`: استبدل `useState(initialCourses)` وما شابه بجلب/حفظ عبر الـ API routes أعلاه (نفس نمط 5.3/5.4).

### 6.4 تعديل الصفحات العامة لتصبح Server Components تقرأ من Firestore
`src/app/(public)/courses/page.tsx`, `src/app/(public)/courses/[slug]/page.tsx`, `src/app/(public)/instructors/page.tsx`, و`src/components/home/courses-preview.tsx` (وأي مكان آخر يستورد من `@/data/courses` أو `@/data/instructors`):
- إن كانت الصفحة Server Component (لا "use client")، استبدل `import {courses} from "@/data/courses"` باستدعاء مباشر لـ `getAllCourses()/getCourseBySlug()` (Admin SDK يعمل في Server Components).
- إن كان المكوّن "use client" ويحتاج البيانات، مرّرها كـ `props` من صفحة Server Component أبٍ.

### ✅ معيار قبول المرحلة 4
- إضافة/تعديل/حذف دورة من لوحة التحكم يظهر فوراً على `/courses` و`/courses/[slug]` بعد تحديث الصفحة، ويبقى بعد إعادة تشغيل السيرفر.

---

## 7. المرحلة 5: إكمال "استعادة كلمة المرور" فعلياً (يعالج 2.5)

### 7.1 تعديل `src/app/api/auth/otp-verify/route.ts`
- لنوع `type === "reset"` فقط: عند نجاح التحقق، **لا تستهلك (consume) الكود بعد** — أعد `{ success: true }` فقط (الكود سيُستهلك في 7.2).
- لنوع `"register"`: السلوك الحالي (استهلاك فوري) يبقى كما هو.

### 7.2 إنشاء `src/app/api/auth/reset-password/route.ts`
- Body: `{ email, code, newPassword }`.
- Validation: `newPassword.length >= 6`.
- استدعِ `consumeOtp(email, code, "reset")` (من `otp-store.ts` بعد المرحلة 2) — إن فشل: `400` "كود غير صحيح أو منتهي".
- ابحث عن المستخدم بالإيميل في `students` ثم `teachers` ثم `admins` (عبر `firestore-admin.ts`) لتحديد أي collection/doc.
- إن لم يوجد: `404`.
- شفّر `newPassword` عبر `hashPassword()` وحدّث الحقل `password` في الـ doc المطابق.
- أرجع `{ success: true }`.

### 7.3 تعديل `src/app/(public)/auth/reset-password/page.tsx`
- أضف خطوة UI رابعة (`step === "newPassword"`) بعد نجاح OTP: حقلين "كلمة المرور الجديدة" و"تأكيدها" (نفس استايل صفحة التسجيل)، عند الإرسال يستدعي `/api/auth/reset-password`، وفي حال النجاح يحوّل المستخدم لـ `/auth/login` مع رسالة نجاح (بدل شاشة "سيتم إعادة التعيين قريباً" الحالية).

### ✅ معيار قبول المرحلة 5
- تدفّق كامل: طلب استعادة → كود OTP → تعيين كلمة مرور جديدة → تسجيل دخول بالكلمة الجديدة ينجح، والقديمة لا تعمل.

---

## 8. المرحلة 6: رفع الصور عبر Firebase Storage (يعالج 2.6)

### 8.1 تعديل `src/app/api/upload/route.ts`
- يبقى فحص الجلسة/الصلاحية الموجود حالياً (تم إصلاحه مسبقاً) كما هو.
- استبدل `writeFile`/`mkdir` (نظام ملفات) بـ:
  - `const bucket = getStorage(adminApp).bucket();` (من `firebase-admin/storage`، نفس `adminApp` من `firebase-admin.ts`).
  - `await bucket.file(`courses/${filename}`).save(buffer, { contentType: file.type, public: true });`
  - احصل على الرابط العام (`https://storage.googleapis.com/<bucket>/courses/<filename>` أو `file.publicUrl()`).
- أضف متغير بيئة `FIREBASE_STORAGE_BUCKET` (إن لم يكن موجوداً، استخدم قيمة `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET` كـ fallback عبر `process.env`).
- أرجع `{ url, filename }` كما سابقاً (نفس الشكل المتوقَّع في `dashboard/courses/page.tsx`).

### ✅ معيار قبول المرحلة 6
- رفع صورة من لوحة التحكم في بيئة محاكاة Vercel (filesystem read-only) ينجح ويُرجع رابطاً صالحاً يُعرض فوراً.

---

## 9. المرحلة 7: محاذاة صلاحيات teacher على مستوى السيرفر (يعالج 3.1)

### 9.1 لا تعدّل `middleware.ts` لإضافة استيرادات Node (راجع القاعدة 1.6)
أضف فقط منطق إعادة توجيه إضافي إن لزم بالاعتماد على `token.role`/`token.permissions` الموجودين بالفعل في الـ JWT — لا حاجة لاستعلامات جديدة هنا.

### 9.2 الحماية الحقيقية
كل API route تم إنشاؤه في المراحل 3-6 (`/api/admin/*`) **يجب** أن يتحقق من الصلاحية الدقيقة (`manage_admins`, `manage_orders`, `manage_courses`, ...) لا فقط `role === admin || teacher`. (هذا منطق أصلاً مطلوب في 3.4/5.1/6.2 — هذه المرحلة هي "تأكيد" أن كل route التزم بذلك، وراجعها جميعاً).

### 9.3 في `src/app/(dashboard)/dashboard/layout.tsx`
أضف (إن لم يكن موجوداً) فحص `getServerSession` على مستوى الـ layout (Server Component) يعيد توجيه أي مستخدم بدون `view_dashboard` permission — كطبقة دفاع إضافية قبل حتى تحميل أي صفحة فرعية.

### ✅ معيار قبول المرحلة 7
- مستخدم بدور `teacher` يحاول فتح `/dashboard/admins` → يُعاد توجيهه من الـ layout، وأي استدعاء مباشر لـ `/api/admin/admins` من حسابه يرجع `403`.

---

## 10. المرحلة 8: تدقيق `package.json` (يعالج 4.1)

1. شغّل `npm install` على نسخة نظيفة (`rm -rf node_modules package-lock.json && npm install`).
2. لاحظ أي تحذيرات/أخطاء حول إصدارات غير موجودة (خصوصاً `lucide-react`, `react`, `react-dom`, `jspdf`).
3. لكل حزمة فشلت أو بدت غير منطقية: تحقق من آخر إصدار حقيقي عبر `npm view <package> version`، وحدّث `package.json` للإصدار الصحيح (استخدم `^<latest-major>` المتوافق مع الكود الحالي — لا تُحدّث major version بشكل قد يكسر الاستيرادات الحالية لـ icons من `lucide-react` إلا إذا تحققت من توافق أسماء الأيقونات المستوردة في الكود).
4. شغّل `npm run build` و`npm run lint` للتأكد من عدم وجود كسر بعد أي تعديل إصدارات.

### ✅ معيار قبول المرحلة 8
- `npm install` ينجح من الصفر بدون أخطاء على بيئة نظيفة، و`npm run build` ينجح.

---

## 11. تنظيف نهائي (بعد كل المراحل)

- ابحث عن أي استيراد متبقٍ لـ `@/lib/firebase` (client) أو `firebase/firestore` خارج `firestore-admin.ts`/`firebase-admin.ts`، وقرر إن كان يمكن حذف `src/lib/firebase.ts` و`NEXT_PUBLIC_FIREBASE_*` بالكامل (إذا لم يتبق أي استخدام).
- حدّث `AUTH_SETUP.md` و`PROJECT_MAP.md` لتعكس البنية الجديدة (Admin SDK، API routes الجديدة، خطوات نشر `firestore.rules`، متغيرات البيئة الجديدة).
- قدّم ملخصاً نهائياً: كل ما تم تنفيذه، كل env vars الجديدة المطلوبة في Vercel، وأي خطوات يدوية متبقية على المستخدم (مثل: إنشاء أول admin يدوياً في Firestore، تشغيل seed script مرة واحدة، نشر firestore.rules).