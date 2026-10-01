# TitanCode Frontend

> **Production-ready frontend for TitanCode Technologies** — a multi-role team/client management platform with marketing site, authentication, role-based dashboards, and real-time collaboration features.

Built with **Next.js 16 (App Router)**, **React 19**, **TypeScript**, **Vite**, and **Lucide React** icons. Designed to match Figma specs pixel-perfectly with a custom dark theme (gold accent `#DFAE32`).

---

## 🎯 Project Overview

This frontend serves the **TitanCode platform** — a SaaS workspace for software development agencies to manage:
- **Clients & Projects** — CRM, project tracking, milestones, billing
- **Team Operations** — Tasks, sprints, meetings, workload visualization
- **HR & Recruiting** — Applicant tracking, onboarding, department management
- **Financials** — Wallets, payouts, revenue products, salary projections
- **Multi-role Dashboards** — CEO, Manager, HR, Member, Client, Applicant views

---

## 🛠 Tech Stack

| Layer | Technology | Version |
|-------|------------|---------|
| **Framework** | Next.js (App Router) | 16.x |
| **Runtime** | React | 19.x |
| **Build Tool** | Vite | 8.x |
| **Language** | TypeScript | 6.x |
| **Styling** | CSS Modules + CSS Variables | — |
| **Icons** | Lucide React | 1.47.x |
| **Linting** | Oxlint | 1.81.x |
| **Package Manager** | npm | — |

**Backend Integration:** Targets FastAPI at `http://localhost:8000/api/v1` with JWT auth (access + refresh tokens), automatic token refresh, and role-based access control.

---

## 📁 Project Structure

```
src/
├── App.tsx                 # Root component — routing, auth hydration, view switching
├── main.tsx                # Entry point
├── index.css               # Global styles, CSS variables, reset
├── App.css                 # App-level layout styles
├── types/
│   └── index.ts            # 290+ lines of strict TypeScript interfaces (User, Project, Task, Meeting, Wallet, etc.)
├── services/
│   └── api.ts              # ApiService class — auth, token refresh, all REST endpoints
├── components/
│   ├── Sidebar.tsx         # Role-based navigation (6 role configs)
│   ├── Header.tsx          # Top bar with user menu, notifications
│   ├── AuthLayout.tsx      # Centered card layout for auth/wizard pages
│   ├── PublicLayout.tsx    # Marketing pages layout with header/footer
│   ├── SettingsLayout.tsx  # Tabbed settings container
│   ├── Modal.tsx           # Reusable modal wrapper
│   ├── NotificationModal.tsx
│   ├── ErrorBoundary.tsx   # React error boundary
│   ├── OtpInput.tsx        # 6-digit OTP input component
│   ├── MetricCard.tsx      # Dashboard metric display
│   ├── DonutChart.tsx      # SVG donut chart (task status)
│   ├── FigmaIcons.tsx      # 30+ auto-exported Figma SVG icons (102KB)
│   ├── common/
│   │   ├── PublicHero.tsx
│   │   ├── FigmaCard.tsx
│   │   ├── FigmaButton.tsx
│   │   ├── CornerGradients.tsx  # 8 corner gradient SVGs (Contact/HireUs × 4 corners)
│   │   └── index.ts
│   └── index.ts
├── views/
│   ├── errors/
│   │   ├── NotFoundView.tsx
│   │   ├── ForbiddenView.tsx
│   │   ├── ServerErrorView.tsx
│   │   ├── BadRequestView.tsx
│   │   └── index.ts
│   ├── public/             # Marketing pages (no auth)
│   │   ├── HomepageView.tsx
│   │   ├── AboutUsView.tsx
│   │   ├── ServicesView.tsx
│   │   ├── HireUsView.tsx
│   │   ├── ContactUsView.tsx
│   │   ├── FaqsView.tsx
│   │   ├── TestimonialsView.tsx
│   │   └── ApplicationFormView.tsx
│   ├── SignInView.tsx      # Email/password + Google OAuth
│   ├── SignUpView.tsx      # Multi-step registration
│   ├── QualificationView.tsx # Role selection after signup
│   ├── OnboardView.tsx     # Client magic-link onboarding
│   ├── ForgotPasswordWizard.tsx # 3-step: request OTP → verify → reset
│   ├── TeamDashboardView.tsx   # Member dashboard
│   ├── ManagerDashboardView.tsx
│   ├── HrDashboardView.tsx
│   ├── CeoDashboardView.tsx
│   ├── ClientDashboardView.tsx
│   ├── ApplicantDashboardView.tsx
│   ├── ClientsView.tsx
│   ├── ProjectsView.tsx
│   ├── TasksView.tsx
│   ├── MeetingsView.tsx
│   ├── LiveMeetingRoomView.tsx
│   ├── UsersManagementView.tsx
│   ├── ApplicationsManagementView.tsx
│   ├── DepartmentsView.tsx
│   ├── FinancialsView.tsx
│   ├── RevenueProductsView.tsx
│   ├── ClientRequestProjectView.tsx
│   ├── SystemSettingsView.tsx
│   ├── SettingsLayout.tsx
│   ├── ProfileSettingsView.tsx
│   ├── PasswordSettingsView.tsx
│   └── ChangePasswordView.tsx
├── styles/
│   └── public.css          # Marketing page specific styles
└── assets/                 # Static assets (logo, images, icons)
    ├── logo.png
    ├── google.png
    ├── apple.png
    ├── landingpage1.jpg
    ├── dashprofile.jpg
    ├── joseph.jpg
    ├── benedicta.png
    └── blessing.jpg
```

---

## 🚀 Getting Started

### Prerequisites
- **Node.js** ≥ 20.x
- **npm** ≥ 10.x
- **Backend API** running at `http://localhost:8000` (FastAPI)

### Installation

```bash
cd titanCode_frontend
npm install
```

### Environment Variables

Create `.env.local` (or `.env`):

```env
VITE_API_URL=http://localhost:8000
VITE_GOOGLE_CLIENT_ID=your_google_oauth_client_id
```

| Variable | Required | Description |
|----------|----------|-------------|
| `VITE_API_URL` | Yes | Base URL of FastAPI backend (without `/api/v1`) |
| `VITE_GOOGLE_CLIENT_ID` | No | Google OAuth client ID for "Sign in with Google" |

### Development

```bash
npm run dev
# Runs on http://localhost:5173 (Vite default)
```

### Build

```bash
npm run build
# Outputs to dist/
```

### Preview Production Build

```bash
npm run preview
```

### Lint

```bash
npm run lint
# Uses oxlint — fast, no config needed
```

---

## 🔐 Authentication Flow

```
┌─────────────┐     ┌─────────────┐     ┌──────────────────┐
│  Sign In    │────▶│  Qualify    │────▶│  Role Dashboard  │
│  (email/    │     │  (role      │     │  (CEO/Manager/   │
│   Google)   │     │   select)   │     │   HR/Member/     │
└─────────────┘     └─────────────┘     │   Client/Applicant)│
       │                   │             └──────────────────┘
       │                   │
       ▼                   ▼
┌─────────────┐     ┌─────────────┐
│  Forgot     │     │  Sign Up    │
│  Password   │     │  (3-step)   │
│  (3-step)   │     └─────────────┘
└─────────────┘
```

**Token Storage:** `localStorage` keys — `tc_access_token`, `tc_refresh_token`, `tc_user`

**Auto-refresh:** `ApiService` deduplicates concurrent 401s → single refresh call → retries original request.

---

## 👥 Role-Based Access

| Role | Dashboard | Key Permissions |
|------|-----------|-----------------|
| **CEO / Admin** | `ceo_dashboard` | Full system: clients, projects, staff, financials, settings |
| **Manager / Team Lead / PM** | `manager_dashboard` | Departments, sprint tasks, projects, meetings |
| **HR** | `hr_dashboard` | Inbound leads, ATS, departments, meetings |
| **Member** | `dashboard` | My tasks, projects, meetings, wallet |
| **Client** | `client_dashboard` | My projects, request project, meetings |
| **Applicant** | `applicant_dashboard` | Application status, edit application |

Navigation items in `Sidebar.tsx` are data-driven per role — 6 distinct configs.

---

## 🎨 Design System

**Colors (CSS Variables in `index.css`):**
```css
--tc-figma-black: #0B0B0C;
--tc-figma-gold: #DFAE32;
--tc-figma-card-border: rgba(255,255,255,0.08);
--tc-icon-bg: rgba(255,255,255,0.05);
--tc-icon-bg-active: rgba(223,174,50,0.15);
```

**Typography:** System font stack (Inter/Poppins via CSS), gold accent for headlines.

**Components:** Reusable `FigmaCard`, `FigmaButton`, `MetricCard`, `DonutChart`, corner gradient SVGs.

**Dark mode only** — no light theme.

---

## 🔌 API Integration

All endpoints in `src/services/api.ts` — **single source of truth**.

Key methods:
```typescript
api.login(email, password)
api.googleLogin(credential)
api.register(payload)
api.qualify(role)
api.activateClientOnboard(token)
api.getCurrentUser()
api.getTasks(params?)
api.getProjects(params?)
api.getMeetings()
api.getWallet()
api.createTask(data)
api.updateTask(id, updates)
api.createProject(data)
// ... 40+ more
```

**Error handling:** Throws `Error` with `err.detail` from backend — caught in views for toast/inline display.

---

## 📱 Key Views Breakdown

### Marketing (Public)
| View | Route | Description |
|------|-------|-------------|
| Homepage | `/` | Hero, What We Do/Offer, Why Choose Us, Footer |
| About Us | `/about` | Company story, team, values |
| Services | `/services` | 6 service cards with icons |
| Hire Us | `/hire` | Lead capture form → inbound lead |
| Contact Us | `/contact` | Contact form + info |
| FAQs | `/faqs` | Accordion FAQ |
| Testimonials | `/testimonials` | Client quotes carousel |
| Application Form | `/careers` | Multi-step job application |

### Auth & Wizards
| View | Route | Description |
|------|-------|-------------|
| Sign In | `/signin` | Email/password + Google OAuth |
| Sign Up | `/signup` | Name, email, password, role, phone |
| Qualification | `/qualification` | Role picker (Client/Member/Applicant) |
| Forgot Password | `/forgot-password` → `/otp` → `/reset-password` | 3-step OTP flow |
| Onboard | `/onboard` | Client magic-link token consumption |

### Workspace (Authenticated)
| View | Route | Role Access |
|------|-------|-------------|
| Team Dashboard | `/dashboard` | Member |
| Manager Dashboard | `/manager_dashboard` | Manager/Team Lead/PM |
| HR Dashboard | `/hr_dashboard` | HR |
| CEO Dashboard | `/ceo_dashboard` | CEO/Admin |
| Client Dashboard | `/client_dashboard` | Client |
| Applicant Dashboard | `/applicant_dashboard` | Applicant |
| Clients CRM | `/clients` | CEO/Admin/HR |
| Projects Hub | `/projects` | All except Applicant |
| Tasks | `/tasks` | All except Applicant/Client |
| Meetings | `/meetings` | All |
| Live Meeting Room | `/meeting_room` | All |
| Users Management | `/users_management` | CEO/Admin |
| Applications ATS | `/applications_management` | CEO/Admin/HR |
| Departments | `/departments` | CEO/Admin/Manager/HR |
| Financials | `/financials` | CEO/Admin |
| Revenue Products | `/revenue_products` | CEO/Admin |
| Client Project Request | `/client_request_project` | Client |
| System Settings | `/system_settings` | CEO/Admin |
| Profile/Password Settings | `/profile_settings` `/password_settings` | All |

### Errors
| View | Route | Context |
|------|-------|---------|
| 404 | `/not_found` | Unknown route |
| 403 | `/forbidden` | Pending approval / role mismatch |
| 500 | `/server_error` | API failure |
| 400 | `/bad_request` | Validation error |

---

## 🧪 Testing Notes

- **No test framework configured yet** — add Vitest + React Testing Library when needed
- **Manual QA checklist:**
  - [ ] Sign in → role redirect works
  - [ ] Google OAuth popup flows
  - [ ] Forgot password 3-step completes
  - [ ] Token refresh on 401 (wait for access token expiry)
  - [ ] Sidebar nav matches role
  - [ ] All dashboard metrics load
  - [ ] Create/update task → reflects in list
  - [ ] Responsive: mobile menu, table scroll

---

## 🚢 Deployment

### Vercel (Recommended)
```bash
# Connect repo to Vercel
# Set environment variables in Vercel dashboard
# Deploy — auto-detects Vite + Next.js
```

### Docker
```dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "run", "preview", "--", "--port", "3000", "--host"]
```

### Static Export (if no SSR needed)
```bash
# Add to vite.config.ts: build: { outDir: 'dist' }
npm run build
# Deploy dist/ to any static host (Netlify, Cloudflare Pages, S3+CloudFront)
```

---

## 📦 Scripts Reference

| Command | Description |
|---------|-------------|
| `npm run dev` | Start Vite dev server (HMR) |
| `npm run build` | Type-check + production build |
| `npm run lint` | Run oxlint |
| `npm run preview` | Serve production build locally |

---

## 🧭 Architecture Decisions

| Decision | Rationale |
|----------|-----------|
| **Vite over Next.js CLI** | Faster dev startup, simpler config, no SSR needed for this SPA |
| **Inline styles (current)** | Rapid Figma-to-code translation; migration to CSS Modules planned |
| **Single `App.tsx` router** | Explicit control over view hydration, auth guards, error boundaries |
| **localStorage for tokens** | Simpler than cookie parsing; backend sets `HttpOnly` cookies as backup |
| **Lucide React + Figma SVGs** | Lucide for UI icons (consistent), Figma SVGs for brand-specific graphics |
| **No Redux/Zustand yet** | State is view-scoped; `App.tsx` holds auth + view; dashboard views fetch own data |

---

## 🐛 Known Issues / Tech Debt

1. **Inline styles everywhere** — migrate to CSS Modules or Tailwind v4
2. **`App.tsx` is 600 lines** — extract router config + route guards
3. **No global state management** — add Zustand for user, notifications, UI state
4. **SVG icons not tree-shaken** — `FigmaIcons.tsx` imports all 30+ icons
5. **No test coverage** — add Vitest
6. **Accessibility audit needed** — focus management, ARIA labels, contrast
7. **Hardcoded role strings** — centralize in `types/index.ts` as `UserRole` enum

---

## 🤝 Contributing

1. **Branch naming:** `feat/`, `fix/`, `refactor/`, `chore/`
2. **Commits:** Conventional Commits (`feat: add client dashboard metrics`)
3. **PRs:** Require lint pass + manual QA checklist
4. **Design changes:** Update Figma → re-export SVGs → update components

---

## 📄 License

Proprietary — TitanCode Technologies. All rights reserved.

---

## 🔗 Related Repos

- **Backend API:** `titanCode_backend` (FastAPI + PostgreSQL + Redis)
- **Design System:** Figma file (link in team workspace)
- **Mobile:** `titanCode_mobile` (React Native — planned)

---

**Built with ❤️ by the TitanCode team** — turning Figma pixels into production React.