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
| Auth | NextAuth (Auth.js) v4 | 4.24.14 |
| Database | Google Cloud Firestore (via Admin SDK) | firebase-admin 14 |
| Password Hashing | bcryptjs | 3.0.3 |
| Email (OTP) | nodemailer | 7.0.13 |
| PDF | jsPDF + html2canvas | 4.2.1 / 1.4.1 |
| Hosting | Vercel | - |

## [ARCHITECTURE]

```
noor-academy/
├── middleware.ts                 # Role-based route protection + teacher path restrictions
├── firestore.rules              # Deny all client access (Admin SDK only)
├── scripts/
│   └── seed-firestore.ts        # Seed Firestore from static data (npx tsx)
├── src/
│   ├── app/
│   │   ├── (public)/             # Public routes (no auth required)
│   │   │   ├── page.tsx          # Home
│   │   │   ├── courses/          # Listing + detail pages
│   │   │   ├── about/
│   │   │   ├── instructors/
│   │   │   ├── contact/
│   │   │   └── auth/
│   │   │       ├── login/        # Credentials + Google OAuth
│   │   │       ├── register/     # Student registration → Firestore
│   │   │       └── reset-password/ # 4-step flow: email → otp → newPassword → done
│   │   ├── (dashboard)/          # Admin dashboard (admin/teacher)
│   │   │   └── dashboard/
│   │   │       ├── layout.tsx    # Sidebar with permission-based link filtering
│   │   │       ├── page.tsx      # Stats overview
│   │   │       ├── courses/      # Fetch from /api/admin/courses
│   │   │       ├── instructors/  # Fetch from /api/admin/instructors
│   │   │       ├── testimonials/ # Fetch from /api/admin/testimonials
│   │   │       ├── orders/       # Fetch from /api/admin/orders
│   │   │       ├── messages/     # Fetch from /api/admin/messages
│   │   │       ├── certificates/ # PDF certificate generator
│   │   │       ├── admins/       # Fetch from /api/admin/admins
│   │   │       └── profile/
│   │   ├── (student)/            # Student portal
│   │   │   └── portal/
│   │   │       ├── page.tsx
│   │   │       └── profile/
│   │   └── api/
│   │       ├── auth/
│   │       │   ├── [...nextauth]/     # NextAuth handler
│   │       │   ├── register/          # POST → Admin SDK createStudent
│   │       │   ├── otp-send/          # POST → Firestore OTP
│   │       │   ├── otp-verify/        # POST (register consumes, reset validates)
│   │       │   └── reset-password/    # POST → consume OTP + update password
│   │       ├── admin/
│   │       │   ├── admins/ + [id]/     # CRUD (admin only)
│   │       │   ├── courses/ + [id]/    # CRUD (admin/post, admin+teacher/get)
│   │       │   ├── instructors/ + [id]/ # CRUD (admin only)
│   │       │   ├── testimonials/ + [id]/ # CRUD (admin/post, admin+teacher/get)
│   │       │   ├── orders/ + [id]/     # List (admin only), update
│   │       │   └── messages/ + [id]/   # List (admin only), mark-read, delete
│   │       ├── courses/           # GET (public list)
│   │       ├── instructors/       # GET (public list)
│   │       ├── contact/           # POST → Admin SDK createMessage
│   │       ├── orders/            # POST → Admin SDK createOrder
│   │       └── upload/            # POST → Firebase Storage (fallback local)
│   ├── components/
│   │   ├── ui/                    # shadcn-style primitives
│   │   ├── layout/                # navbar, footer, theme-provider, whatsapp-button
│   │   ├── home/                  # hero, why-us, courses-preview, cta-section
│   │   └── testimonials/          # testimonial-slider
│   ├── lib/
│   │   ├── firebase-admin.ts      # Admin SDK init (Firestore + Storage)
│   │   ├── firestore-admin.ts     # All Admin SDK CRUD operations
│   │   ├── firebase-storage.ts    # Upload/delete files to Firebase Storage
│   │   ├── password.ts            # bcryptjs hash/verify wrappers
│   │   ├── auth.ts                # NextAuth config (Admin SDK user lookup)
│   │   ├── otp.ts + otp-store.ts  # OTP generation, send, verify (Firestore-backed)
│   │   ├── permissions.ts + roles.ts # RBAC types and utilities
│   │   ├── currency.ts            # SDG price formatter
│   │   ├── logger.ts              # Async logger
│   │   ├── constants.ts           # Site config, nav links, social links
│   │   ├── utils.ts               # cn() helper
│   │   ├── firebase.ts            # Client SDK init (unused, kept as reference)
│   │   └── firestore.ts           # Client SDK CRUD (unused, kept as reference)
│   ├── types/
│   │   ├── course.ts, instructor.ts, testimonial.ts, admin.ts, user.ts, roles.ts
│   └── data/                      # Static seed data (source for seed-firestore.ts)
│       ├── courses.ts, instructors.ts, testimonials.ts, orders.ts
```

## [SYSTEM_FLOW]

```
User → Next.js Router → middleware.ts (Edge Runtime)
                         → Guards /dashboard/* (admin/teacher only; teacher blocked from admins,instructors,orders,messages,certificates)
                         → Guards /portal/* (authenticated only)
                         → RootLayout (ThemeProvider + AuthProvider + RTL + Nav/Footer)

Public pages (static) → Courses, Instructors, Contact, Auth (login/register/reset-password)

Server API routes (all use Firebase Admin SDK):
  ├── GET /api/courses, /api/instructors → Public read
  ├── POST /api/contact → createMessageAdmin()
  ├── POST /api/orders → createOrderAdmin()
  ├── POST /api/auth/register → createStudent() with bcrypt
  ├── POST /api/auth/otp-send → setOtpAdmin() in Firestore
  ├── POST /api/auth/otp-verify → validateOtp() (reset) / consumeOtp() (register)
  ├── POST /api/auth/reset-password → consumeOtp() + updateStudentPassword()
  ├── POST /api/upload → uploadToStorage() (Firebase Storage, fallback local)

Dashboard API routes (admin/teacher, server-side session check):
  ├── GET/POST /api/admin/courses, instructors, testimonials, admins, orders, messages
  └── PUT/DELETE /api/admin/*/[id]

Dashboard pages (client components, fetch via API):
  ├── Fetch data on mount via useEffect → setState
  ├── CRUD operations via fetch() → API route → Admin SDK → Firestore
  └── Permission links filtered in sidebar via hasSpecificPermission()
```

## [KEY_SECURITY_DECISIONS]

| Decision | Rationale |
|---|---|
| Admin SDK for ALL server DB ops | Client SDK blocked by firestore.rules (deny all) |
| bcryptjs for password hashing | saltRounds=10, no plaintext storage anywhere |
| OTP stored in Firestore (not memory) | Survives Vercel serverless cold starts |
| Rate limiting via Firestore | 5 attempts / 10 min per email, persisted |
| OTP code returned only in dev without SMTP | Production without SMTP returns 503 |
| Server session check on all admin API routes | Extends beyond client-side sidebar filtering |
| middleware.ts blocks teachers from admin-only paths | Prevents direct URL access to unauthorized pages |
| Firebase Storage with local fallback | Works without Storage config during development |

## [REMAINING_ITEMS]

| Item | Status | Priority |
|---|---|---|
| Firebase Admin SDK env vars in .env.local | PENDING (user) | High |
| Firestore seed (scripts/seed-firestore.ts) | PENDING (user) | High |
| SMTP config for email OTP delivery | PENDING (user) | Medium |
| Google OAuth real keys | PENDING (user) | Medium |
| Firebase Storage bucket config | PENDING (user) | Low |
| Public pages read from Firestore (instead of static data) | FUTURE | Low |
| Student portal data from Firestore | FUTURE | Low |
| next v16 / tailwind v4 upgrade | FUTURE | Low |

## [PACKAGE_AUDIT]

Outdated (safe minor/patch bumps, not applied):
- @radix-ui/* packages (patch bumps + 1 minor for select)
- lucide-react 1.17→1.18, react/react-dom 19.2.6→19.2.7
- next 15.5.18→15.5.19

Major upgrades requiring migration effort (deferred):
- next 15→16, tailwindcss 3→4, eslint 9→10, typescript 5→6
