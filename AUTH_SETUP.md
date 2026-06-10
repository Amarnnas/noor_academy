# إعداد نظام المصادقة - أكاديمية نور

## 1. Firebase Authentication

### إنشاء مشروع Firebase
1. توجه إلى [Firebase Console](https://console.firebase.google.com)
2. أنشئ مشروعاً جديداً أو استخدم مشروعاً موجوداً
3. فعّل **Firebase Authentication** من القائمة الجانبية

### تفعيل Authentication Providers
1. في قسم Authentication، اذهب إلى **Sign-in method**
2. فعّل **Email/Password** provider
3. فعّل **Google** provider
4. (اختياري) فعّل providers أخرى حسب الحاجة

### الحصول على إعدادات Firebase
1. في إعدادات المشروع (Project Settings) > **General**
2. تحت **Your apps**، اختر **Web**
3. انسخ قيم التهيئة:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your-api-key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
NEXT_PUBLIC_FIREBASE_APP_ID=your-app-id
```

4. ضع هذه القيم في ملف `.env.local`

## 2. Google Sign-In (OAuth)

### إنشاء OAuth Credentials في Google Cloud Console
1. توجه إلى [Google Cloud Console](https://console.cloud.google.com)
2. اذهب إلى **APIs & Services** > **Credentials**
3. اضغط **Create Credentials** > **OAuth client ID**
4. اختر **Web application**
5. أضف **Authorized JavaScript origins**:
   - `http://localhost:3000` (للتطوير)
   - `https://your-domain.com` (للإنتاج)
6. أضف **Authorized redirect URIs**:
   - `http://localhost:3000/api/auth/callback/google`
   - `https://your-domain.com/api/auth/callback/google`
7. انسخ **Client ID** و **Client Secret**

### متغيرات البيئة المطلوبة
```env
GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-google-client-secret
```

## 3. Firebase Admin SDK (للمستخدمين المتقدمين)

لتفعيل إنشاء المستخدمين وإدارة الأدوار عبر Firebase Admin SDK:
1. اذهب إلى **Project Settings** > **Service accounts**
2. اضغط **Generate new private key**
3. احفظ ملف JSON في مكان آمن
4. ضع المسار في متغير البيئة:
```env
FIREBASE_ADMIN_KEY_PATH=./firebase-admin-key.json
```

## 4. إعداد قاعدة البيانات (Firestore)

### إنشاء المجموعات المطلوبة
في Firebase Firestore، أنشئ المجموعات التالية:

```text
admins/    → id, name, email, password, role, permissions[], createdAt
teachers/  → id, name, email, password, role, specialties[], createdAt
students/  → id, name, email, password, role, phone, createdAt
```

### مثال إضافة مشرف أول
```json
{
  "id": "admin-1",
  "name": "مشرف النظام",
  "email": "admin@nooracademy.com",
  "password": "your-admin-password",
  "role": "admin",
  "permissions": ["manage_admins", "manage_courses", "manage_instructors", "manage_testimonials", "manage_orders", "manage_messages", "manage_certificates", "manage_students"],
  "createdAt": "2025-01-01T00:00:00Z"
}
```

## 5. نظام الأدوار والصلاحيات

### الأدوار المتاحة
| الدور | الوصف | المسارات المحمية |
|-------|-------|-----------------|
| `student` | طالب - يتابع الدورات | `/portal/*` |
| `teacher` | مدرب - يدير الدورات | `/dashboard/*` |
| `admin` | مشرف - صلاحيات كاملة | `/dashboard/*` |

### الصلاحيات المتاحة
| الصلاحية | الوصف |
|----------|-------|
| `view_student_portal` | دخول بوابة الطالب |
| `view_dashboard` | دخول لوحة التحكم |
| `manage_courses` | إدارة الدورات |
| `manage_instructors` | إدارة المدربين |
| `manage_testimonials` | إدارة التقييمات |
| `manage_orders` | إدارة الطلبات |
| `manage_messages` | إدارة الرسائل |
| `manage_certificates` | إدارة الشهادات |
| `manage_admins` | إدارة المشرفين |
| `manage_students` | إدارة الطلاب |

## 6. صفحات تسجيل الدخول

- **بوابة الطالب**: `/auth/login` (الوضع الافتراضي)
- **لوحة المشرف**: `/auth/login?role=admin`

## 7. متغيرات البيئة الكاملة

```env
# ---- NextAuth ----
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key-min-32-chars

# ---- Google OAuth ----
GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-client-secret

# ---- Firebase ----
NEXT_PUBLIC_FIREBASE_API_KEY=your-api-key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
NEXT_PUBLIC_FIREBASE_APP_ID=your-app-id

# ---- Admin Fallback (عند عدم توفر Firebase) ----
ADMIN_EMAIL=admin@noor.com
ADMIN_PASSWORD=admin123

# ---- Google Maps ----
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your-maps-api-key

# ---- SMTP (للبريد الإلكتروني) ----
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
SMTP_FROM=noreply@nooracademy.com
```
