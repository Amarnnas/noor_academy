# PROJECT_MAP - أكاديمية نور (Noor Academy)

## [TECH_STACK]

| Layer | Technology | Version |
|---|---|---|---|
| Framework | Next.js | 15.5.18 |
| UI Library | React | 19.2.6 |
| Language | TypeScript | 5.9.3 |
| Styling | Tailwind CSS | 3.4.19 |
| Animation | Framer Motion | 12.40.0 |
| Dark Mode | next-themes | 0.4.6 |
| Icons | lucide-react | 1.17.0 |
| UI Primitives | Radix UI | (avatar, dialog, dropdown, select, toast, tabs) |
| Utility | clsx + tailwind-merge + cva | latest |
| Auth | NextAuth (Auth.js) | 4.24.14 |
| Auth/DB | Firebase (Firestore) | 11.7.1 |
| RBAC | Custom (roles.ts + permissions.ts) | - |
| PDF | jsPDF + html2canvas | 4.2.1 / 1.4.1 |
| Placeholder Images | SVG-based course thumbnails | - |
| Hosting | Vercel | - |
| DB (pending) | Google Cloud Firestore | - |

## [ARCHITECTURE]

```
src/
├── __tests__/                    # Test files
├── AUTH_SETUP.md                 # Firebase + Google OAuth setup guide
BRAND_REPORT.md               # Brand audit and image replacement report
middleware.ts                 # NextAuth role-based route protection (/dashboard/*, /portal/*)
├── vercel.json                   # Vercel deployment config
├── .env.example                  # Environment variables template
├── src/
│   ├── app/                          # Next.js App Router
│   │   ├── (public)/                 # Public routes group
│   │   │   ├── page.tsx              # Home (Hero + WhyUs + CoursesPreview + Testimonials + CTA)
│   │   │   ├── courses/
│   │   │   │   ├── page.tsx          # Course listing + filter/search
│   │   │   │   └── [slug]/
│   │   │   │       ├── page.tsx      # Server: unwraps params
│   │   │   │       └── course-detail-client.tsx  # Client: detail + enroll form
│   │   │   ├── about/page.tsx        # Vision, Mission, Goals
│   │   │   ├── instructors/page.tsx  # Instructor cards
│   │   │   ├── contact/page.tsx      # Contact form + info + Google Maps embed
│   │   │   └── auth/
│   │   │       ├── login/page.tsx    # Login form (NextAuth credentials + Google)
│   │   │       ├── register/page.tsx # Registration form
│   │   │       └── reset-password/page.tsx  # Password reset
│   │   ├── (dashboard)/              # Admin (auth-guarded by middleware.ts)
│   │   │   └── dashboard/
│   │   │       ├── layout.tsx        # Sidebar + mobile responsive
│   │   │       ├── page.tsx          # Stats overview
│   │   │       ├── courses/page.tsx  # Courses table
│   │   │       ├── instructors/page.tsx  # Instructor cards
│   │   │       ├── testimonials/page.tsx # Testimonials list
│   │   │       ├── orders/page.tsx   # Orders table with status badges
│   │   │       ├── certificates/page.tsx # PDF certificate generator
│   │   │       ├── admins/page.tsx   # Admin management (Firestore CRUD + permissions)
│   │   │       └── messages/page.tsx # Contact messages list
│   │   ├── api/                      # REST API handlers
│   │   │   ├── auth/[...nextauth]/route.ts  # NextAuth handler
│   │   │   ├── courses/route.ts      # GET /api/courses
│   │   │   ├── instructors/route.ts  # GET /api/instructors
│   │   │   ├── contact/route.ts      # POST /api/contact
│   │   │   └── orders/route.ts       # POST /api/orders
│   │   ├── not-found.tsx             # 404 page
│   │   ├── layout.tsx                # Root: fonts, theme, auth, nav, footer, whatsapp
│   │   └── globals.css               # Tailwind + CSS variables + dark mode
├── components/
│   ├── ui/                       # shadcn-style primitives (button, card, input, badge, avatar, label, select, textarea, toast, skeleton)
│   ├── layout/                   # navbar, footer, theme-provider, whatsapp-button
│   ├── shared/                   # section-heading
│   │   └── social-icons.tsx      # Brand social media SVG icons
│   ├── home/                     # hero, why-us, courses-preview, cta-section
│   ├── testimonials/             # testimonial-slider
│   ├── courses/                  # (empty, logic in page files)
│   └── dashboard/                # (empty, logic in page files)
├── lib/
│   ├── utils.ts                  # cn() helper
│   ├── constants.ts              # SITE config, BRAND_ASSETS, NAV_LINKS, SOCIAL_LINKS
│   ├── currency.ts               # Course price currency label/formatter (SDG)
│   ├── logger.ts                 # Async info/warn/error logger
│   ├── firebase.ts               # Firebase config + Firestore export (hardcoded keys)
│   ├── firestore.ts              # Firestore CRUD operations for all collections
│   ├── permissions.ts            # Admin permission labels + check utilities
│   └── auth.ts                   # NextAuth config (credentials + Google providers, Firestore admin lookup)
├── types/
│   ├── course.ts                 # Course, CurriculumItem
│   ├── instructor.ts             # Instructor
│   ├── testimonial.ts            # Testimonial
│   ├── admin.ts                  # Admin, AdminPermission
│   └── user.ts                   # User, AuthState, ContactMessage, Order
└── data/                         # Static mock data
    ├── courses.ts                # 6 courses + helper functions
    ├── instructors.ts            # 5 instructors + helper
    ├── testimonials.ts           # 6 testimonials
    └── orders.ts                 # Initial orders with paid flag
```

## [SYSTEM_FLOW]

```
User → Next.js Router → middleware.ts (guard /dashboard/* and /portal/* by role)
                        → RootLayout (ThemeProvider + AuthProvider + RTL + Nav/Footer)
  ├── (public) → Static pages (SSG) / Course detail (SSR with ISR)
  │   ├── Home: Hero → WhyUs → CoursesPreview → Testimonials → CTA
  │   ├── Courses: Filter/Search → CourseCard → Click → /courses/[slug]
  │   │   └── [slug]: Detail + Curriculum + Instructor + Enroll Form
  │   ├── About: Vision / Mission / Goals
  │   ├── Instructors: Cards with specialties + rating
  │   ├── Contact: Form (→ POST /api/contact) + Info + Google Maps embed
  │   └── Auth: Login (NextAuth credentials/Google) / Register / Reset Password
  ├── (student) → Protected by middleware.ts (authenticated users only)
  │   ├── /portal → Student dashboard (enrolled courses, progress, certificates)
  │   └── /portal/profile → Student profile edit (name, profile picture upload)
  ├── (dashboard) → Protected by middleware.ts (admin/teacher only, redirects students to /auth/login?role=admin)
  │   ├── / → Stats cards + quick overview + recent courses
  │   ├── /courses → Data table (all courses, requires manage_courses)
  │   ├── /instructors → Card grid (requires manage_instructors)
  │   ├── /testimonials → Card list with star ratings (requires manage_testimonials)
  │   ├── /orders → Table with status badges (requires manage_orders)
  │   ├── /certificates → CertificateGenerator (jsPDF + html2canvas, requires manage_certificates)
  │   ├── /messages → Message list with read/unread indicator (requires manage_messages)
  │   ├── /admins → Admin CRUD table with permission checkboxes (requires manage_admins)
  │   └── /profile → Profile edit (name, profile picture upload)
  ├── /api/
  │   ├── /auth/[...nextauth] → NextAuth (credentials + Google providers)
  │   ├── /auth/otp-send → POST (send OTP code to email)
  │   ├── /auth/otp-verify → POST (verify OTP code)
  │   ├── /courses → GET (list + filter/search)
  │   ├── /instructors → GET (list)
  │   ├── /contact → POST (submit form)
  │   ├── /orders → POST (create order)
  │   └── /upload → POST (image upload for courses, profile, etc.)
  └── Global: WhatsApp FAB, Dark mode toggle, Toast notifications
```

## [ORPHANS & PENDING]

| Item | Status | Notes |
|---|---|---|
| Firebase Firestore integration | DONE | src/lib/firebase.ts reads config from env vars only |
| Google OAuth real keys | PENDING | Requires Google Cloud Console setup (see AUTH_SETUP.md) |
| Student/Teacher/Admin RBAC | DONE | roles.ts with ROLE_PERMISSIONS, middleware.ts guards /dashboard and /portal |
| Student portal page | DONE | /portal with enrolled courses view |
| Admin + Teacher dashboard | DONE | Role-based sidebar filtering |
| Dedicated login flows | DONE | Login page has Student/Admin tabs, role-aware redirect |
| Firebase auth (hardcoded keys removed) | DONE | firebase.ts uses NEXT_PUBLIC_FIREBASE_* env vars |
| Admin management (Firestore CRUD) | DONE | /dashboard/admins page with add/edit/delete, permission checkboxes |
| Permission-based sidebar filtering | DONE | Sidebar links hidden per user permissions |
| Firestore-based multi-role auth | DONE | auth.ts checks admins/teachers/students collections |
| permissions.ts utility | DONE | Role-based permission checker (student/teacher/admin) |
| OTP email verification system | DONE | src/lib/otp.ts + in-memory store + API routes |
| SMTP email sending (nodemailer) | PENDING | Requires SMTP_HOST/SMTP_USER/SMTP_PASS in env vars |
| Context-aware course placeholders | DONE | Per-language SVG thumbnails (english, french, german, spanish, arabic, ielts) |
| Instructor real images from PIC folder | DONE | Real photos for all 5 instructors from PIC/ |
| Testimonial avatar images | REPLACED | Personal images replaced with randomuser.me external URLs |
| Dashboard profile page | DONE | /dashboard/profile with name edit, profile picture upload |
| Student portal profile page | DONE | /portal/profile with name edit, profile picture upload |
| Image upload API | DONE | /api/upload accepts images up to 5MB, returns URL |
| User registration flow | FIXED | Added `/api/auth/register` + user-store.ts to persist registered users in memory; credentials provider checks store |
| Google sign-in error handling | FIXED | Uses `redirect: false`, catches errors, shows message; OAuth error query param detected on page load |
| SVG instructor/testimonial placeholders | REPLACED | Replaced with real photos from PIC/ and local images |
| Logo placeholder component | DONE | src/components/shared/logo-placeholder.tsx with symbol/full variants |
| CourseThumbnail component | DONE | src/components/shared/course-thumbnail.tsx with category icons |
| Brand report | DONE | BRAND_REPORT.md with image audit + recommendations |
| AUTH_SETUP.md guide | DONE | Complete Firebase + Google OAuth + RBAC setup instructions |
| Google button error handling | DONE | Loading state + catch block with user-facing error message |
| PDF Certificate generation | DONE | jsPDF + html2canvas (scale 4) in /dashboard/certificates |
| Google Maps embed | DONE | Real iframe with API key placeholder in contact page |
| JWT/auth (NextAuth) | DONE | Credentials + Google providers, middleware guard |
| API route handlers | DONE | GET /api/courses, /api/instructors, POST /api/contact, /api/orders |
| Vercel deployment config | DONE | vercel.json with env variable references |
| .env.example | DONE | Updated with ADMIN_EMAIL/ADMIN_PASSWORD + comments |
| Logo in navbar/footer | DONE | Navbar uses BRAND_ASSETS.symbol; footer uses BRAND_ASSETS.full |
| Test files | DONE | RBAC tests, placeholder image tests |
| Loading skeletons | DONE | Skeleton component created |
| Toast notifications | DONE | Toast component created |
| SEO metadata | DONE | Root layout has template + description per page |
| 404 page | DONE | Custom not-found page |
| RTL layout | DONE | dir="rtl" on html, Cairo font |
| Dark mode | DONE | next-themes with class strategy |
| Responsive design | DONE | Mobile menu, sidebar collapse, grid breakpoints |
| WhatsApp button | DONE | Fixed FAB with animation |
| Accessibility | DONE | aria-labels, semantic HTML, sr-only texts |
| Dashboard Courses CRUD | DONE | Add/edit/delete with modal form |
| Dashboard Instructors edit/delete | DONE | Edit modal + delete button per card |
| Dashboard Testimonials hide/delete | DONE | Toggle hidden state + delete button per card |
| Dashboard Messages WhatsApp link | DONE | wa.me link button per message |
| Certificate: validate + orientation + DPI | DONE | Student/payment validation, portrait/landscape, 300/72 DPI |
| Orders management | DONE | Status selector, edit modal, paid flag, auto-generated IDs |
| Course images 100% fill | DONE | object-cover without padding |
| Instructor images rendered in Avatars | FIXED | Added `<AvatarImage>` to instructors page (public+dashboard) and testimonial-slider — was showing only initials |
| Social media brand icons | DONE | Footer uses shared SVG brand icons |
| Course currency (SDG) | DONE | Sudanese pound formatter |
