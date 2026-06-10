# تقرير العلامة التجارية - أكاديمية نور

## تاريخ التقرير: 2026-06-10

---

## 1. الصور المستبدلة

| الموقع السابق | الموقع الجديد | النوع | الحالة |
|---------------|--------------|-------|--------|
| `public/images/a.jpeg` | `public/images/placeholders/arabic.svg` | صورة دورة العربية | ✅ مستبدل |
| `public/images/e.jpeg` | `public/images/placeholders/english.svg` | صورة دورة الإنجليزية | ✅ مستبدل |
| `public/images/f.jpeg` | `public/images/placeholders/french.svg` | صورة دورة الفرنسية | ✅ مستبدل |
| `public/images/l.jpeg` | `public/images/placeholders/german.svg` | صورة دورة الألمانية | ✅ مستبدل |
| `public/images/logo.png` | `public/images/placeholders/spanish.svg` | صورة دورة الإسبانية | ✅ مستبدل |
| (جديد) | `public/images/placeholders/ielts.svg` | صورة دورة IELTS | ✅ تم الإنشاء |
| `public/images/just-logo.png` | `public/images/placeholders/instructor.svg` | صور المدربين | ✅ مستبدل بـ SVG |
| `public/images/just-logo.png` | `public/images/placeholders/testimonial.svg` | صور التقييمات | ✅ مستبدل بـ SVG |
| (جديد) | `public/images/placeholders/languages.svg` | placeholder عام | ✅ تم الإنشاء |

## 2. الصور التي لا تزال بحاجة لصور رسمية

| الملف | الموقع | النوع المطلوب | الأبعاد الموصى بها |
|-------|-------|--------------|-------------------|
| `public/images/placeholders/english.svg` | بيانات الدورات | صورة فوتوغرافية احترافية (فصل دراسي) | 800×450 بكسل |
| `public/images/placeholders/french.svg` | بيانات الدورات | صورة فوتوغرافية احترافية (ثقافة فرنسا) | 800×450 بكسل |
| `public/images/placeholders/german.svg` | بيانات الدورات | صورة فوتوغرافية احترافية (ثقافة ألمانيا) | 800×450 بكسل |
| `public/images/placeholders/spanish.svg` | بيانات الدورات | صورة فوتوغرافية احترافية (ثقافة إسبانيا) | 800×450 بكسل |
| `public/images/placeholders/arabic.svg` | بيانات الدورات | صورة فوتوغرافية احترافية (الخط العربي) | 800×450 بكسل |
| `public/images/placeholders/ielts.svg` | بيانات الدورات | صورة فوتوغرافية احترافية (اختبار) | 800×450 بكسل |
| `public/images/placeholders/instructor.svg` | بيانات المدربين | صور شخصية احترافية للمدربين | 400×400 بكسل |
| `public/images/placeholders/testimonial.svg` | بيانات التقييمات | صور رمزية للطلاب | 200×200 بكسل |
| `public/images/design-reference.jpg` | - | مرجع تصميم غير مستخدم | - |

## 3. مواقع شعار الأكاديمية التي يجب إدراج الشعار الرسمي فيها

| الموقع | المكون/الملف | الاستخدام الحالي | ملاحظات |
|--------|-------------|-----------------|---------|
| الشريط العلوي | `src/components/layout/navbar.tsx` | `BRAND_ASSETS.symbol` (just-logo.png) | يستخدم الشعار الفعلي - مقبول مؤقتاً |
| التذييل | `src/components/layout/footer.tsx` | `BRAND_ASSETS.full` (noorpro.png) | يستخدم الشعار الفعلي - مقبول مؤقتاً |
| القسم الرئيسي (Hero) | `src/components/home/hero.tsx` | `BRAND_ASSETS.symbol` (just-logo.png) | صورة خلفية - يمكن استبدالها بصورة تصويرية |
| شهادة PDF | `src/components/dashboard/certificate-generator.tsx` | قد يستخدم BRAND_ASSETS | تحقق من وجود شعار على الشهادة |

## 4. الأبعاد الموصى بها للصور المستقبلية

| نوع الصورة | الأبعاد (عرض × ارتفاع) | الصيغة | الحجم الأقصى |
|-----------|----------------------|--------|-------------|
| صورة مصغرة لدورة (Course Thumbnail) | 800 × 450 بكسل (16:9) | WebP (يفضل) / JPEG | 200 كيلوبايت |
| صورة مدرب (Instructor) | 400 × 400 بكسل (1:1) | WebP (يفضل) / JPEG | 100 كيلوبايت |
| صورة رمزية (Avatar) | 200 × 200 بكسل (1:1) | WebP (يفضل) / JPEG | 50 كيلوبايت |
| شعار الأكاديمية (Symbol) | 120 × 120 بكسل | PNG (شفاف) / SVG | 30 كيلوبايت |
| شعار الأكاديمية (Full) | 400 × 160 بكسل | PNG (شفاف) / SVG | 60 كيلوبايت |
| صورة Hero | 1200 × 900 بكسل | WebP (يفضل) / JPEG | 300 كيلوبايت |

## 5. تحسين أداء الويب

- جميع الـ placeholders الجديدة هي **SVG** (خفيفة الوزن، قابلة للتدرج)
- تم تحويل صورة الشعار إلى PNG شفاف
- يوصى باستخدام تنسيق **WebP** للصور الفوتوغرافية المستقبلية
- يوصى باستخدام `next/image` مع خاصية `loading="lazy"` للصور غير المرئية في البداية
- استخدم أداة مثل [squoosh.app](https://squoosh.app) لضغط الصور قبل الرفع

## 6. ملاحظات نهائية

- ملف `public/images/design-reference.jpg` غير مستخدم في الكود - يمكن حذفه
- الملفات `public/images/a.jpeg`, `e.jpeg`, `f.jpeg`, `h.jpeg`, `l.jpeg`, `logo.png` لم تعد مستخدمة في البيانات ولكنها قد تبقى في المجلد
- عند استبدال placeholders بصور حقيقية، تأكد من تحديث المسارات في ملفات البيانات:
  - `src/data/courses.ts`
  - `src/data/instructors.ts`
  - `src/data/testimonials.ts`
