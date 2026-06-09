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
| PDF | jsPDF + html2canvas | 4.2.1 / 1.4.1 |
| Hosting | Vercel | - |
| DB (pending) | Google Cloud Firestore | - |

## [ARCHITECTURE]

```
src/
├── __tests__/                    # Test files
├── middleware.ts                 # NextAuth route protection (/dashboard/*)
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
User → Next.js Router → middleware.ts (guard /dashboard/*)
                        → RootLayout (ThemeProvider + AuthProvider + RTL + Nav/Footer)
  ├── (public) → Static pages (SSG) / Course detail (SSR with ISR)
  │   ├── Home: Hero → WhyUs → CoursesPreview → Testimonials → CTA
  │   ├── Courses: Filter/Search → CourseCard → Click → /courses/[slug]
  │   │   └── [slug]: Detail + Curriculum + Instructor + Enroll Form
  │   ├── About: Vision / Mission / Goals
  │   ├── Instructors: Cards with specialties + rating
  │   ├── Contact: Form (→ POST /api/contact) + Info + Google Maps embed
  │   └── Auth: Login (NextAuth credentials/Google) / Register / Reset Password
  ├── (dashboard) → Protected by middleware.ts (redirect to /auth/login if unauthenticated)
  │   ├── / → Stats cards + quick overview + recent courses
  │   ├── /courses → Data table (all courses, requires manage_courses)
  │   ├── /instructors → Card grid (requires manage_instructors)
  │   ├── /testimonials → Card list with star ratings (requires manage_testimonials)
  │   ├── /orders → Table with status badges (requires manage_orders)
  │   ├── /certificates → CertificateGenerator (jsPDF + html2canvas, requires manage_certificates)
  │   ├── /messages → Message list with read/unread indicator (requires manage_messages)
  │   └── /admins → Admin CRUD table with permission checkboxes (requires manage_admins)
  ├── /api/
  │   ├── /auth/[...nextauth] → NextAuth (credentials + Google providers)
  │   ├── /auth/otp-send → POST (send OTP code to email)
  │   ├── /auth/otp-verify → POST (verify OTP code)
  │   ├── /courses → GET (list + filter/search)
  │   ├── /instructors → GET (list)
  │   ├── /contact → POST (submit form)
  │   └── /orders → POST (create order)
  └── Global: WhatsApp FAB, Dark mode toggle, Toast notifications
```

## [ORPHANS & PENDING]

| Item | Status | Notes |
|---|---|---|
| Firebase Firestore integration | DONE | src/lib/firebase.ts created with config + Firestore export |
| Google OAuth real keys | PENDING | Requires Google Cloud Console setup for OAuth consent + credentials |
| Admin management (Firestore CRUD) | DONE | /dashboard/admins page with add/edit/delete, permission checkboxes |
| Permission-based sidebar filtering | DONE | Sidebar links hidden per user permissions |
| Firestore-based admin auth | DONE | auth.ts checks Firestore admins collection for credentials + Google login |
| permissions.ts utility | DONE | Permission labels, check function, default sets |
| OTP email verification system | DONE | src/lib/otp.ts + in-memory store (no Firebase dep) + API routes + OTP step in register/reset-password |
| SMTP email sending (nodemailer) | PENDING | Requires SMTP_HOST/SMTP_USER/SMTP_PASS in env vars, falls back to showing code in UI |
| Admin page loading bug fix | DONE | Added status check for useSession loading state |
| Google button error handling | DONE | Added loading state + catch block with user-facing error message |
| Image placeholders → real media | DONE | Replaced with shared brand symbol asset across all data files |
| PDF Certificate generation | DONE | jsPDF + html2canvas (scale 4) in /dashboard/certificates, A4 size, border, stamp/signature upload |
| Google Maps embed | DONE | Real iframe with API key placeholder in contact page |
| JWT/auth (NextAuth) | DONE | Credentials + Google providers, middleware guard |
| Admin auth guard middleware | DONE | middleware.ts protects /dashboard/* |
| API route handlers | DONE | GET /api/courses, /api/instructors, POST /api/contact, /api/orders |
| Vercel deployment config | DONE | vercel.json with env variable references |
| .env.example | DONE | Template with all required env vars |
| Logo in navbar/footer | DONE | Navbar uses /images/just-logo.png symbol; footer uses /images/noorpro.png full logo |
| Test files | DONE | Basic __tests__/basic.test.ts created |
| Loading skeletons | DONE | Skeleton component created |
| Toast notifications | DONE | Toast component created |
| SEO metadata | DONE | Root layout has template + description per page |
| 404 page | DONE | Custom not-found page |
| RTL layout | DONE | dir="rtl" on html, Cairo font |
| Dark mode | DONE | next-themes with class strategy |
| Responsive design | DONE | Mobile menu, sidebar collapse, grid breakpoints |
| WhatsApp button | DONE | Fixed FAB with animation |
| Accessibility | DONE | aria-labels, semantic HTML, sr-only texts |
| Navbar: logo only, no text | DONE | Removed site name, logo size 48×48 |
| Certificate description field | DONE | Optional textarea rendered under name in PDF |
| Dashboard Courses CRUD | DONE | Add/edit/delete with modal form |
| Dashboard Instructors edit/delete | DONE | Edit modal + delete button per card |
| Dashboard Testimonials hide/delete | DONE | Toggle hidden state + delete button per card |
| Dashboard Messages WhatsApp link | DONE | wa.me link button per message |
| Public testimonials: login to review | DONE | Review form gated by useSession, includes WhatsApp phone field |
| Register page phone field | DONE | WhatsApp number field in registration form |
| Certificate A4 + border + stamp/signature | DONE | A4 portrait, double border, upload stamp/signature images, scale 4 quality |
| Orders: student registration form | DONE | Modal form with course select, auto-generated student ID |
| Auto-generated IDs for courses/instructors/students | DONE | Date.now() based IDs on create in dashboard CRUD |
| Orders: status selector + edit modal + paid flag | DONE | Status dropdown, paid checkbox, edit per row in orders table |
| Certificate: validate student registration + payment | DONE | Select student from orders, reject if not confirmed/paid |
| Certificate: orientation (portrait/landscape) | DONE | Radio buttons switch preview + jsPDF orientation |
| Certificate: purpose DPI (print 300 / social 72) | DONE | Radio buttons control html2canvas scale (4 vs 1) |
| Course images 100% fill | DONE | Public course cards and detail hero use object-cover without padding |
| Social media brand icons | DONE | Footer uses shared SVG brand icons instead of generic globe icon |
| Course currency | DONE | Course prices display with shared Sudanese pound formatter |
| Brand logo assets | DONE | BRAND_ASSETS maps symbol/full logos to public/images/just-logo.png and public/images/noorpro.png |
