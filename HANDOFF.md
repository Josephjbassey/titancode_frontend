# TitanCode Frontend — Production-Readiness Handoff

**Session date:** Current session  
**Picking up from:** Bob autopilot, Phase 0 recon + partial Phase 1/2 implementation  
**Next AI agent:** Read this entire document before touching any file.

---

## 1. Confirmed Backend State (do not re-derive)

| Property | Value |
|---|---|
| Framework | **FastAPI** (not Django/DRF) |
| ORM | SQLAlchemy 2.0 async |
| Auth mechanism | **JWT** — OAuth2 password flow. Access token: 15 min. Refresh token: 7 days. |
| Database | PostgreSQL (async via asyncpg + Alembic migrations) |
| Background jobs | Celery + Redis |
| File storage | Local disk (`uploads/`), togglable to AWS S3 via `USE_S3=true` |
| CORS | `BACKEND_CORS_ORIGINS` env var — NOT wildcard. Already correctly configured. |
| Email | SMTP via Celery tasks (`enqueue_email_task`) |
| WebSockets | FastAPI native + Redis pub/sub |
| Default admin | `admin@titancode.com` / `FIRST_SUPERUSER_PASSWORD` env var |
| API base URL | `http://localhost:8000/api/v1` (frontend reads `VITE_API_URL`) |

---

## 2. What Was Done This Session

### Backend — `titanCode_backend/app/api/v1/endpoints/auth.py`
**Added 4 new endpoints** at the bottom of the file:

1. `POST /auth/forgot-password/request-otp` — Generates a 6-digit OTP, stores it in `_otp_store` dict (in-memory, 10-min expiry), sends email. **Production note: swap `_otp_store` for Redis.**
2. `POST /auth/forgot-password/verify-otp` — Validates OTP, issues a 15-min JWT with `type=password_reset`.
3. `POST /auth/forgot-password/reset` — Validates reset JWT, updates `password_hash`.
4. `POST /auth/change-password` — Authenticated endpoint; verifies current password before updating.

Also added Pydantic request body models: `OtpRequestBody`, `OtpVerifyBody`, `PasswordResetBody`, `ChangePasswordBody`.

### Backend — `titanCode_backend/app/api/v1/endpoints/leads.py`
**Added** `POST /leads/contact` — Handles the public Contact Us form. Stores as `ClientInquiry`, notifies internal team, sends auto-reply. Added `ContactCreate` Pydantic model at bottom of file.

### Frontend — `titanCode_frontend/src/services/api.ts`
**Major rewrite of the `ApiService` class:**
- Added `refreshToken` storage in localStorage (`tc_refresh_token`)
- Added `clearAuth()`, `isAuthenticated()`, `setRefreshToken()` methods
- Added `_refreshAccessToken()` — silently exchanges refresh token
- Added `ensureFreshToken()` — deduplicated, prevents parallel refresh calls
- Added `authFetch()` — all authenticated calls go through this; auto-retries once on 401
- **`login()` now throws on failure** — no more mock fallback
- **Added `register()`** — calls real `POST /auth/register`
- **Added `logout()`** — clears both tokens from localStorage
- **`getCurrentUser()` now throws on failure** — no more mock fallback
- **All password reset methods** now call real endpoints and throw on error
- **`getTasks()`** — uses `authFetch`, returns mock as degraded fallback (not silent lie)
- **`getWallet()`** — returns `null` on 404 (wallet not created yet)
- **`getClients()`** — now calls `GET /users/?role=Client` (correct endpoint — `/clients` doesn't exist)
- **`getInboundLeads()`** — maps backend `ClientInquiry` shape to frontend `InboundLead` shape
- **Added `submitHireUs()`** — calls `POST /leads`
- **Added `submitContact()`** — calls `POST /leads/contact`
- **`updateProfile()`** — uses `authFetch`, throws on failure
- **`changePassword()`** — removed hardcoded `'titan2026'` check, calls real endpoint
- **`initiateSumsubKyc()`** — throws `Error('KYC not available yet')` instead of returning fake token
- **`getCeoOverview()`** — now fetches from 3 real endpoints in parallel: `/dashboard/overview`, `/financials/company-wallet`, `/users/?role=Member`. Calculates `developerPoolPaid = totalRevenue * 0.7` from real data.
- **`getApplicantRecords()`** — maps real `Application` records to `ApplicantRecord` shape

### Frontend — `titanCode_frontend/src/views/public/HireUsView.tsx`
- `handleSubmit` now async, calls `api.submitHireUs()`
- Shows loading state (`isLoading`), error state (`error`), clears form on success
- Submit button disabled + shows "Submitting…" while loading

### Frontend — `titanCode_frontend/src/views/public/ContactUsView.tsx`
- `handleSubmit` now async, calls `api.submitContact()`
- Shows loading/error states, clears form on success
- Submit button shows "Sending…" while loading

### Frontend — `titanCode_frontend/src/views/SignUpView.tsx`
- Now calls `api.register()` with real credentials
- On success, creates a `status: 'pending'` user (correct — backend sets pending for new registrations)
- Shows real error messages from backend

### Frontend — `titanCode_frontend/src/App.tsx` (PARTIAL — was interrupted)
- Changed `currentUser` initial state from `MOCK_MEMBER_USER` to `null`
- **INTERRUPTED before fixing `handleRoleSelect` and workspace guard**

---

## 3. What Is NOT Done — Must Continue

### 🔴 CRITICAL: App.tsx left in broken state
The session was cut short mid-edit of `App.tsx`. The file has:
- `currentUser` typed as `User | null` (correct) 
- BUT `handleRoleSelect` still sets mock users (line 158–190)
- BUT Sidebar/Header still pass `currentUser.role` which will crash on `null`
- BUT `ProfileSettingsView` and workspace views still receive `currentUser` (now possibly null)

**Fix required in `App.tsx`:**
```tsx
// 1. Guard workspace routes — redirect to sign_in if not authenticated
if (isWorkspaceView && !currentUser) {
  return <SignInView ... />  // or setCurrentView('sign_in')
}

// 2. Fix Sidebar userRole prop (null guard)
userRole={currentUser?.role ?? 'Member'}

// 3. Fix Header user prop
user={currentUser!}  // safe after the guard above

// 4. Fix ProfileSettingsView user prop
user={currentUser!}

// 5. Fix handleRoleSelect — remove mock users, this should not exist in production.
//    The qualification screen should only route based on the REAL user.role from login.
//    Replace with: const dashboardForRole = (role: UserRole): ScreenId => { ... }
```

**Suggested `handleLoginSuccess` pattern** (replace `handleRoleSelect`):
```tsx
const handleLoginSuccess = (user: User) => {
  setCurrentUser(user);
  switch (user.role) {
    case 'CEO': case 'Admin': setCurrentView('ceo_dashboard'); break;
    case 'Manager': case 'Assistant': setCurrentView('manager_dashboard'); break;
    case 'HR': setCurrentView('hr_dashboard'); break;
    case 'Client': setCurrentView('client_dashboard'); break;
    case 'Applicant': setCurrentView('applicant_dashboard'); break;
    default: setCurrentView('dashboard'); break;
  }
};
```

Then in `<SignInView onSuccess={handleLoginSuccess} />`.

**Also add logout handler:**
```tsx
const handleLogout = async () => {
  await api.logout();
  setCurrentUser(null);
  setCurrentView('sign_in');
};
// Pass to Sidebar: onLogout={handleLogout}
```

---

### 🔴 ApplicationFormView.tsx — not wired

File: `titanCode_frontend/src/views/public/ApplicationFormView.tsx`

The public application form (public site, unauthenticated visitors) currently just sets `appState = 'submitted'` with no API call.

The backend endpoint is `POST /auth/register` (creates user) + `POST /applications/apply` (creates application — requires auth). 

**Decision needed:** The application form is on the public site for unauthenticated users. Current backend flow is:
1. `POST /auth/register` → creates `Member` with `status=pending`
2. Then user logs in, then `POST /applications/apply`

The simplest fix is to wire the form to `POST /auth/register` only, and show "Account created — we'll contact you" messaging (matching `SignUpView` behavior). The department-apply step happens after login.

**Fix:**
```tsx
// In ApplicationFormView.tsx handleSubmit:
import { api } from '../../services/api';

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  try {
    await api.register({
      full_name: `${formData.firstName} ${formData.lastName}`,
      email: formData.email,
      password: 'TempPass_' + Math.random().toString(36).slice(2, 10), // or add password field
      phone_number: formData.phoneNumber,
      country: formData.location,
    });
    setAppState('submitted');
  } catch (err: any) {
    if (err.message?.includes('already exists')) setAppState('email_exists');
    else setAppState('required'); // show error
  }
};
```

**Note:** The form doesn't collect a password. You need to either:  
a) Add a password field to the public application form, OR  
b) Auto-generate one and email it (add a `temp_password_required=true` flag to backend)

---

### 🟡 ProjectsView.tsx — 100% mock, must wire to real API

File: `titanCode_frontend/src/views/ProjectsView.tsx`

Currently uses a local `INITIAL_PROJECTS` array. Needs complete rewrite to call backend.

**Backend endpoints available:**
- `GET /projects/` — paginated, per-role filtered (clients see their own, members see assigned)
- `POST /projects/create` — requires Manager/CEO/Admin role
- `PUT /projects/update?project_id=X`
- `DELETE /projects/{project_id}`

**Required work:**
1. Add to `api.ts`:
```ts
async getProjects(params?: { status?: string; limit?: number }): Promise<any[]> {
  const qs = new URLSearchParams({ limit: '100', ...(params?.status ? { status: params.status } : {}) });
  const res = await this.authFetch(`${API_BASE_URL}/projects/?${qs}`);
  if (!res.ok) return [];
  const data = await res.json();
  return data.items ?? [];
}

async createProject(project: { name: string; description?: string; client_id: number; budget: number; deadline?: string; member_ids?: number[] }): Promise<any> {
  const res = await this.authFetch(`${API_BASE_URL}/projects/create`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(project),
  });
  if (!res.ok) { const e = await res.json().catch(()=>{}); throw new Error(e?.detail || 'Failed'); }
  return res.json();
}
```
2. Rewrite `ProjectsView.tsx` with `useEffect` to call `api.getProjects()`, show loading/empty/error states.

---

### 🟡 TasksView.tsx — 100% mock

File: `titanCode_frontend/src/views/TasksView.tsx`  
Backend: `GET /tasks/`, `POST /tasks/create`, `PUT /tasks/update?task_id=X`

`api.getTasks()` already exists and calls the real endpoint. The view just doesn't use it. Rewrite to `useEffect(() => { api.getTasks().then(setTasks) }, [])` with loading/empty/error states.

---

### 🟡 MeetingsView.tsx — 100% mock

File: `titanCode_frontend/src/views/MeetingsView.tsx`  
Backend: `GET /meetings/`, `POST /meetings/create`, `DELETE /meetings/{id}`

Add to `api.ts`:
```ts
async getMeetings(): Promise<any[]> {
  const res = await this.authFetch(`${API_BASE_URL}/meetings/?limit=50`);
  if (!res.ok) return [];
  const data = await res.json();
  return data.items ?? [];
}

async createMeeting(m: { title: string; scheduled_at: string; meeting_type?: string; meeting_link?: string; department_id?: number; client_id?: number }): Promise<any> {
  const res = await this.authFetch(`${API_BASE_URL}/meetings/create`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(m),
  });
  if (!res.ok) { const e = await res.json().catch(()=>{}); throw new Error(e?.detail || 'Failed'); }
  return res.json();
}
```

---

### 🟡 FinancialsView.tsx — 100% mock

File: `titanCode_frontend/src/views/FinancialsView.tsx`  
Backend endpoints: `GET /wallets/me`, `POST /financials/withdrawals/request`, `GET /financials/withdrawals`, `POST /financials/withdrawals/{id}/action`

`api.getWallet()` already calls the real endpoint. The view just uses hardcoded state. 

**Rewrite required:**
- `myBalance` → from `api.getWallet()` → `wallet.balance`
- `withdrawals` list → from `api.authFetch('/financials/withdrawals')`
- `handleWithdrawSubmit` → call `POST /financials/withdrawals/request`
- Admin approve/reject → call `POST /financials/withdrawals/{id}/action`

---

### 🟡 DepartmentsView.tsx — partial mock

File: `titanCode_frontend/src/views/DepartmentsView.tsx`  
`api.getDepartments()` is already wired. The create form calls nothing.

Add to `api.ts`:
```ts
async createDepartment(dept: { name: string; description?: string }): Promise<any> {
  const res = await this.authFetch(`${API_BASE_URL}/departments/create`, {
    method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify(dept),
  });
  if (!res.ok) { const e = await res.json().catch(()=>{}); throw new Error(e?.detail || 'Failed'); }
  return res.json();
}
```

---

### 🟡 CeoDashboardView.tsx — approvals are 100% mock

The financial KPIs are now wired via `api.getCeoOverview()`. But the `approvals` array (pending budget requests) is hardcoded with fake people/amounts. There is no backend endpoint for this yet. **Flag it clearly in the UI** with a `// TODO: wire to pending withdrawals endpoint` comment until a withdrawal-approvals endpoint is built.

---

### 🟡 UsersManagementView.tsx — hardcoded PII in form state

File: `titanCode_frontend/src/views/UsersManagementView.tsx`  
Lines 38, 58: `editPhone: '+44 7911 123456'` and `bankAccount: '0123456789'` are hardcoded in initial form state. These should default to `''`.

Backend endpoint for list: `GET /users/` (already works).

---

### 🟡 RevenueProductsView.tsx — API key is Math.random()

File: `titanCode_frontend/src/views/RevenueProductsView.tsx` line 87:
```tsx
apiKey: `tc_live_${Math.random().toString(36)...}` // fake
```
Backend: `POST /products/add` returns a real `api_key` (generated server-side via `generate_product_api_key()`). Wire the create form to call the real endpoint.

---

## 4. Remaining Backend Gaps (from Phase 0, still open)

| Gap ID | Description | Priority |
|---|---|---|
| G-07 | `GET /auth/sessions`, `DELETE /auth/sessions/{id}` — session management endpoint | Medium |
| G-09 | `GET /client/projects/{id}/milestones` — client milestone tracking | Medium |
| G-10 | `GET /dashboard/team-workload` — team workload aggregated by department | Medium |
| G-11 | `POST /kyc/sumsub/initiate` — Sumsub KYC (third-party, needs API key) | Low |
| G-14 | Public `ApplicationFormView` needs a password field, OR backend needs `POST /auth/register-applicant` that auto-creates a temp password | Medium |
| G-15 | `SystemSettingsView` has no backend — commission rates, webhook URLs are client-side only | Low |

---

## 5. Security Items Not Yet Completed

| # | Issue | Status |
|---|---|---|
| S-01 | `App.tsx` `currentUser` starts as `null` (fixed this session) but workspace route guard NOT yet added — unauth user can still navigate to workspace views | ❌ Not done |
| S-02 | `changePassword()` hardcoded check on `'titan2026'` — REMOVED this session | ✅ Done |
| S-03 | Mock auth fallback in `login()` — REMOVED this session | ✅ Done |
| S-04 | `refresh_token` now stored in localStorage — acceptable for SPA, but consider `httpOnly` cookie for production | ⚠️ Noted |
| S-05 | Backend: OTP store is in-memory Python dict — **must be replaced with Redis** before multi-instance deploy | ❌ Not done (flagged in code comment) |
| S-06 | Backend: Flutterwave webhook uses static hash comparison instead of HMAC per-request (from SENIOR_BACKEND_REVIEW.md) | ❌ Not done |
| S-07 | Backend default admin password `TitanCodeAdmin123!` is blocked in production by config validation | ✅ Already enforced |

---

## 6. Validation Not Run (Phase 4)

The following commands **must be run** before declaring this production-ready:

```bash
# Frontend
cd titanCode_frontend
npx tsc -b --noEmit        # TypeScript type check
npx oxlint src/            # Lint
npx vite build             # Build check

# Backend
cd titanCode_backend
python -m pytest tests/    # requires .env with SECRET_KEY + DATABASE_URL
```

**Known TypeScript issue to expect:** `App.tsx` passes `currentUser` (now `User | null`) to views that expect `User`. The fix is the `null` guard described in Section 3.

---

## 7. Files Changed This Session

```
titanCode_backend/app/api/v1/endpoints/auth.py     ← Added 4 endpoints + Pydantic models
titanCode_backend/app/api/v1/endpoints/leads.py    ← Added POST /leads/contact endpoint
titanCode_frontend/src/services/api.ts             ← Major rewrite of ApiService class
titanCode_frontend/src/views/public/HireUsView.tsx ← Wired to POST /leads
titanCode_frontend/src/views/public/ContactUsView.tsx ← Wired to POST /leads/contact
titanCode_frontend/src/views/SignUpView.tsx         ← Wired to POST /auth/register
titanCode_frontend/src/App.tsx                     ← PARTIAL (currentUser typed as null, interrupted)
```

---

## 8. Recommended Next Session Order

1. **Fix `App.tsx`** (route guard, login handler, logout) — this is blocking everything else
2. **Run `tsc --noEmit`** — fix type errors from `currentUser: User | null` propagation
3. **Wire `ProjectsView`** — highest-traffic workspace view, still 100% mock
4. **Wire `TasksView`** — `api.getTasks()` already exists, just needs the view rewritten
5. **Wire `FinancialsView`** — `api.getWallet()` already exists
6. **Wire `MeetingsView`**
7. **Fix `ApplicationFormView`** (needs password field decision)
8. **Fix `UsersManagementView`** hardcoded PII
9. **Fix `RevenueProductsView`** fake API key
10. **Replace OTP `_otp_store` with Redis** (backend, one file change)
11. Run `tsc`, `oxlint`, `vite build` clean
12. Walk routes as each of 6 roles

---

## 9. Quick Reference — Key Endpoint Map

| Frontend Action | Real Backend Endpoint | Notes |
|---|---|---|
| Sign in | `POST /auth/login` (form-urlencoded) | Returns `{access_token, refresh_token}` |
| Sign up | `POST /auth/register` (JSON) | Returns `User`, status=pending |
| Refresh token | `POST /auth/refresh?refresh_token=...` | Returns new `access_token` |
| Get profile | `GET /auth/profile` | Bearer token required |
| Forgot password OTP | `POST /auth/forgot-password/request-otp` | |
| Verify OTP | `POST /auth/forgot-password/verify-otp` | Returns `reset_token` |
| Reset password | `POST /auth/forgot-password/reset` | |
| Change password | `POST /auth/change-password` | Bearer token required |
| Hire Us form | `POST /leads` | Public, no auth |
| Contact Us form | `POST /leads/contact` | Public, no auth |
| Get projects | `GET /projects/` | Per-role filtered |
| Create project | `POST /projects/create` | Manager/CEO/Admin only |
| Get tasks | `GET /tasks/` | Per-role filtered |
| Create task | `POST /tasks/create` | Manager/CEO/Admin only |
| Get meetings | `GET /meetings/` | Per-role filtered |
| Create meeting | `POST /meetings/create` | Manager/CEO/Admin only |
| Get wallet | `GET /wallets/me` | 404 if no wallet yet |
| Request withdrawal | `POST /financials/withdrawals/request` | |
| Get withdrawals | `GET /financials/withdrawals` | Admins see all; users see own |
| Approve withdrawal | `POST /financials/withdrawals/{id}/action` | CEO/Admin only |
| Get clients (as users) | `GET /users/?role=Client` | |
| Get leads (HR view) | `GET /leads/` | CEO/Admin only |
| Get departments | `GET /departments/` | Any authenticated user |
| Create department | `POST /departments/create` | CEO/Admin only |
| Get applications | `GET /applications/` | Managers see all; users see own |
| Approve application | `PUT /applications/approve?application_id=X` | Manager/CEO/Admin |
| CEO overview | `GET /dashboard/overview` | CEO/Admin only |
| Company wallet | `GET /financials/company-wallet` | CEO/Admin only |
| Magic link send | `POST /client/send-magic-link` | CEO/Admin only |
| Magic link activate | `GET /client/onboard?token=...` | Public |

---

Phase 0 Reconnaissance Report
Awaiting your confirmation before any code changes.

Backend Confirmed State
Attribute	Confirmed Value
Framework	FastAPI (not Django/DRF)
ORM	SQLAlchemy 2.0 async
Auth	JWT — OAuth2 password flow, access token 15 min, refresh token 7 days
Database	PostgreSQL (async via asyncpg)
Background jobs	Celery + Redis
File storage	Local disk (toggle-able to AWS S3)
CORS	Config-driven (BACKEND_CORS_ORIGINS), not wildcard
Email	SMTP/Celery-queued
WebSockets	FastAPI WebSockets + Redis pub/sub
Default admin	admin@titancode.com / FIRST_SUPERUSER_PASSWORD env var (password no longer in code)
Deployment	Dockerized; Alembic migrations present
Backend — What Is Implemented vs. Scoped
✅ Fully implemented endpoints:

Router prefix	Status
POST /auth/register	✅ Real — bcrypt hash, pending status, welcome email
POST /auth/login	✅ Real — OAuth2 form, returns access + refresh tokens
POST /auth/refresh	✅ Real — validates refresh token type
GET /auth/profile	✅ Real — returns authenticated user
GET/PUT/DELETE /users	✅ Real — RBAC enforced (CEO/Admin only for admin ops)
GET/POST/PUT/DELETE /departments	✅ Real — RBAC enforced
GET/POST/PUT/DELETE /applications (apply, approve, reject)	✅ Real — full workflow with email + WebSocket
GET/POST/PUT/DELETE /projects	✅ Real — project members via M2M, per-role filtering
GET/POST/PUT/DELETE /tasks	✅ Real — BOLA protected, notifications
GET/POST/PUT/DELETE /meetings	✅ Real — auto-link generation, client notifications
GET/POST /wallets/me, /wallets/{user_id}, /transaction	✅ Real — BOLA protected, transactions table
POST/GET/PATCH /leads	✅ Real — new canonical intake (replaced /client/hire-us)
POST /leads/{id}/convert-to-project	✅ Real
GET /dashboard/overview, /leads, /projects, /revenue, /payouts	✅ Real
GET/POST /financials/company-wallet, /withdrawals, /withdrawals/{id}/action	✅ Real — state machine transitions
POST/GET/DELETE /products, POST/GET /revenue	✅ Real (see products.py, revenue.py)
POST /client/send-magic-link, GET /client/onboard	✅ Real — full magic-link client onboarding
POST/GET /billing (invoices, Paystack/Flutterwave)	✅ Real
GET/POST /files	✅ Real — S3/local storage, type/size validation server-side
GET/POST /notifications (WebSocket)	✅ Real
🔴 Backend Gap List (Missing Endpoints the Frontend Needs)
#	Gap	Frontend View Affected	Severity
G-01	GET /auth/me returns UserPrivate but no refresh_token is stored — frontend doesn't call /auth/refresh at all, so 15-min access tokens silently fall back to mocks	All workspace views	Critical
G-02	POST /auth/register exists but SignUpView doesn't call it — it creates a fake local user	SignUpView	Critical
G-03	/client/hire-us returns 410 Gone — frontend HireUsView still submits nowhere. Canonical endpoint is POST /leads	HireUsView	Critical
G-04	No /client/request-project anymore (returns 410) — frontend ClientRequestProjectView has no target	ClientRequestProjectView	High
G-05	No POST /auth/forgot-password/request-otp, /verify-otp, /reset — these are stubs that fall back to mock	ForgotPasswordWizard	High
G-06	No POST /auth/change-password endpoint — changePassword hard-codes 'titan2026' as the "correct" password	ChangePasswordView	High
G-07	No GET /auth/sessions or DELETE /auth/sessions/{id} — session management is 100% mocked	PasswordSettingsView	Medium
G-08	No GET /clients or POST /clients endpoint — frontend ClientsView calls /clients but that route doesn't exist (the model is User with role=Client, accessed via /users?role=Client)	ClientsView, HrDashboardView	High
G-09	No /client/projects/{id}/milestones — client milestone data is 100% mocked	ClientDashboardView	Medium
G-10	No GET /dashboard/team-workload — manager workload roster never calls backend	ManagerDashboardView	Medium
G-11	No GET /kyc/sumsub/initiate — Sumsub KYC is a mock stub	ProfileSettingsView	Low (third-party dep)
G-12	dashboard/overview returns active_projects, total_revenue but getCeoOverview() hardcodes treasuryBalance and developerPoolPaid from the company-wallet and payout-invoices endpoints not being wired	CeoDashboardView	High
G-13	POST /contact endpoint does not exist — ContactUsView form goes nowhere	ContactUsView	High
G-14	POST /applications/apply public route (requires auth) — but ApplicationFormView on public site submits for unauthenticated visitors	ApplicationFormView	Medium
G-15	SystemSettingsView has no backend endpoint — commission rate, webhook URL, currency settings are all client-side only	SystemSettingsView	Medium
Frontend — Mock Data Inventory (per-file, pre-change)
File	Mock Data / Issues	Type
api.ts	MOCK_MEMBER_USER, MOCK_ADMIN_USER, MOCK_CEO_USER, MOCK_HR_USER, MOCK_MANAGER_USER, MOCK_CLIENT_USER, MOCK_APPLICANT_USER, MOCK_CLIENTS, MOCK_TASKS, MOCK_MEETING, MOCK_WALLET, MOCK_SESSIONS, MOCK_DEPARTMENTS, MOCK_INBOUND_LEADS, MOCK_TEAM_WORKLOAD, MOCK_CLIENT_MILESTONES, MOCK_APPLICANT_RECORDS	All mock fallback data
api.ts:login()	On any API failure, silently returns a fake user based on email substring match — auth always succeeds even with wrong password	Critical security gap
api.ts:changePassword()	Hard-codes 'titan2026' as the valid current password for fallback	Critical security gap
api.ts:getCeoOverview()	treasuryBalance: 25350000, developerPoolPaid: 59150000, totalStaff: 78 — hardcoded even when API call succeeds	Hardcoded KPI
App.tsx:103	currentUser initialized to MOCK_MEMBER_USER — startup state is always logged in as a mock user	Auth gap
App.tsx:156	handleRoleSelect switches currentUser to mock users — no real auth	Auth gap
SignUpView.tsx	Creates fake user object locally, sets mock token, never calls api.register()	No API call
HireUsView.tsx	handleSubmit only sets submitted=true — never submits to backend	No API call
ContactUsView.tsx	handleSubmit only sets submitted=true — never submits to backend	No API call
ApplicationFormView.tsx	phoneNumber: '1234567890', location: 'Lagos' pre-filled; handleSubmit never calls API	Mock data + no API call
ProjectsView.tsx	INITIAL_PROJECTS array (4 hardcoded projects with fake names); handleCreateProject adds locally only	100% mock
TasksView.tsx	Hardcoded task array; handleCreateTask generates random ID locally	100% mock
MeetingsView.tsx	Hardcoded meetings; handleScheduleMeeting adds locally	100% mock
FinancialsView.tsx	myBalance: 14850, hardcoded withdrawals array, hardcoded payout invoices; handleWithdrawSubmit updates state locally	100% mock
CeoDashboardView.tsx	Hardcoded approvals array (fake staff names, amounts); overview initializes with hardcoded KPIs	Partial mock
ManagerDashboardView.tsx	Imports MOCK_DEPARTMENTS, MOCK_TEAM_WORKLOAD; roster never replaced with real data	Mock fallback
HrDashboardView.tsx	Initializes with MOCK_INBOUND_LEADS, MOCK_APPLICANT_RECORDS	Mock fallback
ClientDashboardView.tsx	Initializes with MOCK_CLIENT_MILESTONES	Mock fallback
DepartmentsView.tsx	Initializes with MOCK_DEPARTMENTS; handleCreate adds locally	Mock fallback
ClientsView.tsx	handleAddClient falls back to a fake ClientRecord with id: Date.now()	Mock fallback
UsersManagementView.tsx	Hardcoded editPhone: '+44 7911 123456', bankAccount: '0123456789' in initial form state	Hardcoded PII
RevenueProductsView.tsx	handleCreateProduct generates fake apiKey with Math.random()	Mock API key
SystemSettingsView.tsx	handleSave only logs to console	No API call
ApplicantDashboardView.tsx	handleReapplySubmit appears UI-only	No API call
ClientRequestProjectView.tsx	Generates id: REQ-${random} locally; no backend call	No API call
Security Issues Pre-Existing in Frontend
Issue	Location	Severity
Auth always succeeds (mock fallback on any failure)	api.ts:login()	🔴 Critical
Hardcoded password 'titan2026' in changePassword	api.ts:1217	🔴 Critical
Startup user is MOCK_MEMBER_USER — no unauthenticated state	App.tsx:103	🔴 Critical
No route guards — URL manipulation can reach any dashboard	App.tsx	🔴 Critical
No token refresh — 15-min access tokens expire silently, fall back to mock	api.ts	🔴 Critical
refresh_token stored nowhere (not localStorage)	api.ts:setToken()	High
Not Yet Existing Backend Endpoints That Need to Be Built
To complete the wiring without leaving UI elements pointing at nothing:

POST /auth/register — exists ✅, just needs frontend to call it
POST /leads — exists ✅ (replaces HireUs form)
POST /auth/forgot-password/* — needs to be built (OTP flow)
POST /auth/change-password — needs to be built
GET /users?role=Client — exists ✅ (use for ClientsView)
GET /client/projects/{id}/milestones — needs to be built (or stub)
GET /users?role=Member&… team workload — can aggregate from /users + /tasks
POST /contact (ContactUs form) — needs to be built (simple, or reuse leads)
POST /auth/refresh — exists ✅, frontend just doesn't call it



*Generated by Bob autopilot session. Pick up from Section 3 "App.tsx left in broken state".*
