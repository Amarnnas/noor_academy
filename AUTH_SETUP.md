# إعداد نظام المصادقة - أكاديمية نور

## 1. Firebase Project Setup

1. أنشئ مشروعاً في [Firebase Console](https://console.firebase.google.com)
2. فعّل **Authentication** > **Sign-in method** > **Email/Password** و **Google**
3. فعّل **Cloud Firestore** (قاعدة البيانات)
4. (اختياري) فعّل **Storage** لرفع الصور

## 2. متغيرات البيئة

انسخ `.env.example` إلى `.env.local` واملأ القيم:

### Firebase Client SDK (للمتصفح - يُستخدم في login page)
من Firebase Console > Project Settings > General > Your apps > Web:
```env
NEXT_PUBLIC_FIREBASE_API_KEY=your-api-key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
NEXT_PUBLIC_FIREBASE_APP_ID=your-app-id
```

### Firebase Admin SDK (للخادم - يُستخدم لجميع عمليات DB)
من Firebase Console > Project Settings > Service accounts > Generate new private key:
```env
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@your-project.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nXXXX\n-----END PRIVATE KEY-----\n"
```

**مهم**: في `.env.local`، يجب أن يكون `FIREBASE_PRIVATE_KEY` على سطر واحد مع `\n` للأسطر الجديدة.

### Google OAuth (لتسجيل الدخول بقوقل)
من Google Cloud Console > APIs & Services > Credentials > OAuth client ID:
```env
GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-client-secret
```

**Authorized redirect URIs**: `http://localhost:3000/api/auth/callback/google`

### SMTP (لإرسال كود OTP عبر البريد)
```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
SMTP_FROM=noreply@nooracademy.com
```
**ملاحظة**: بدون SMTP، يعمل OTP فقط في وضع التطوير (يظهر الكود في الواجهة).

### أخرى
```env
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=openssl rand -base64 32
FIREBASE_STORAGE_BUCKET=your-project.appspot.com
```

## 3. بذر قاعدة البيانات (Seeding)

```bash
npx tsx --env-file=.env.local scripts/seed-firestore.ts
```

هذا سينشئ:
- **6 دورات** (الإنجليزية، الفرنسية، الألمانية، IELTS، الإسبانية، العربية)
- **5 مدربين**
- **6 آراء طلاب**
- **مشرف افتراضي**: `admin@nooracademy.com` / `Admin@123456`

## 4. قاعدة بيانات Firestore - هيكل المجموعات

```
admins/        → { id, name, email, password (bcrypt), role, permissions[], createdAt }
teachers/      → { id, name, email, password (bcrypt), role, createdAt }
students/      → { id, name, email, password (bcrypt), role, phone, createdAt }
courses/       → { id, slug, title, description, fullDescription, image, category, level, duration, studentsCount, rating, reviewsCount, price, objectives[], curriculum[], instructorId, featured?, createdAt }
instructors/   → { id, name, title, bio, image, specialties[], experience, rating, studentsCount, createdAt }
testimonials/  → { id, name, avatar, role, content, rating, hidden?, createdAt }
orders/        → { id, courseId, courseTitle, studentName, studentEmail, phone, status, paid, createdAt }
messages/      → { id, name, email, phone, message, read, createdAt }
otp_codes/     → { email, code, type, expiresAt, createdAt }
otp_attempts/  → { count, windowStart }
```

## 5. نظام الأدوار والصلاحيات

| الدور | صلاحياته |
|-------|----------|
| `student` | بوابة الطالب فقط |
| `teacher` | لوحة التحكم + الدورات + التقييمات |
| `admin` | كل الصلاحيات (بما في ذلك إدارة المشرفين والمدربين والطلبات والرسائل) |

## 6. حماية المسارات

- **middleware.ts**: يسمح لـ admin/teacher فقط بدخول `/dashboard/*`، ويمنع teacher من صفحات admin-only (admins, instructors, orders, messages, certificates)
- **API routes**: جميع `/api/admin/*` تتحقق من `getServerSession()` ومن `role`
- **firestore.rules**: تمنع كل الوصول المباشر من المتصفح (allow read/write: if false)

## 7. تدفق OTP (إعادة تعيين كلمة المرور)

1. إدخال البريد الإلكتروني → `POST /api/auth/otp-send` → حفظ الكود في Firestore
2. إدخال OTP → `POST /api/auth/otp-verify` → التحقق دون استهلاك (للنوع reset)
3. إدخال كلمة المرور الجديدة → `POST /api/auth/reset-password` → استهلاك الكود + حفظ كلمة المرور (bcrypt)
4. تم - يمكن تسجيل الدخول
