# TitanCode Frontend — Design System & QA Log

## Last Updated
Workspace consistency pass (Tier 1 + 2 complete, Tier 3 verified clean)

---

## Established Design Tokens

| Token | Value | Usage |
|---|---|---|
| `--tc-figma-black` | `#0B0B0C` | Page / site background |
| `--tc-figma-gold` | `#DFAE32` | Primary accent, CTAs, active states |
| Metric card bg | `#FFFFFF1A` (`rgba(255,255,255,0.10)`) | Workspace KPI / metric cards (`figma-card` class) |
| Metric card border | `#FFFFFF26` (`rgba(255,255,255,0.15)`) | Workspace KPI card outline |
| Section panel bg | `#232324` | Large content sections / tables / section cards |
| Section panel border | `rgba(255,255,255,0.08)` | Section panel outline |
| Sub-card / inner bg | `rgba(255,255,255,0.02–0.03)` | Nested items inside section panels |
| Sub-card border | `rgba(255,255,255,0.06)` | Nested item outline |
| Modal overlay | `rgba(0,0,0,0.75–0.80)` + `backdropFilter:blur(6px)` | Full-screen overlays |
| Modal panel bg | `#1C1C1E` | Modal / drawer panels |
| Modal panel border | `rgba(255,255,255,0.15)` | Modal outline |
| Icon pill bg | `#DFAE324D` (`rgba(223,174,50,0.30)`) | Gold icon pills in dashboards |
| Icon pill color | `#DFAE32` | Icon inside gold pill |
| Dashboard highlight | `#DDC998` | Team dashboard top accent stripe |
| Input border | `#FFFFFF59` (`rgba(255,255,255,0.35)`) | Form inputs (workspace modals) |
| Input bg (modal) | `#121214` | Inputs inside modals |
| Tab switcher bg | `rgba(255,255,255,0.04)` | Pill/tab toggle wrappers |
| Ghost button bg | `rgba(255,255,255,0.05–0.08)` | Secondary workspace buttons |
| Ghost button border | `rgba(255,255,255,0.12)` | Secondary workspace button outline |
| Status green | `#10B981` | Success states |
| Status red | `#EF4444` | Error / rejected states |
| Status blue | `#3B82F6` | In-progress / info states |
| Text muted | `#9CA3AF` | Subtitles, labels, ghost text |
| Text dim | `#6B7280` | Tertiary information |

---

## CSS Classes (dashboards.css)

| Class | Purpose |
|---|---|
| `.tc-fade-in` | Page mount animation — apply to every workspace view root div |
| `.figma-card` / `.tc-workspace-card` | `#FFFFFF1A` bg / `#FFFFFF26` border / `border-radius:16px` / hover gold |
| `.tc-workspace-container` | Flex col, gap 28px, full width |
| `.tc-dashboard-header` | Flex, space-between, wrap, gap 16px |
| `.tc-dashboard-title` | 26px, 800, white, -0.4px letter-spacing |
| `.tc-dashboard-subtitle` | 14px, `#9CA3AF` |
| `.tc-metrics-grid-4` | auto-fit, minmax(240px,1fr), gap 20px |
| `.tc-metrics-grid-3` | auto-fit, minmax(300px,1fr), gap 20px |
| `.tc-table-wrap` / `.tc-data-table` | Table wrapper + table with th/td/tr:hover |
| `.tc-status-pill` + `.success`/`.warning`/`.info`/`.danger` | Semantic status chips |
| `.tc-dropdown-select` | `#232324` bg, height 40px, gold focus ring |
| `.tc-action-btn-gold` | Primary gold CTA: `#DFAE32` bg, `#0B0B0C` text, 40px height, 8px radius |
| `.tc-btn` | Alias base class (inline-flex, gap 8px, border none, cursor pointer) |
| `.tc-btn.tc-btn-primary` | Alias → same gold tokens as `tc-action-btn-gold` |
| `.tc-btn.tc-btn-primary:disabled` | Opacity 0.55, not-allowed cursor |

---

## Reference Implementation
**`TeamDashboardView.tsx`** — the canonical workspace view. All other views must align to its:
- Outer wrapper: `className="tc-fade-in"` + `display:flex, flexDirection:column, paddingBottom:40px, width:100%`
- Section panels: `backgroundColor:'#232324'`, `border:'1px solid rgba(255,255,255,0.08)'`, `borderRadius:'16px'`, `padding:'24px'`
- Metric cards: `className="figma-card"` (→ `#FFFFFF1A` / `#FFFFFF26`)
- Icon pills: 36×36px, `borderRadius:'10px'`, `backgroundColor:'#DFAE324D'`, `color:'#DFAE32'`
- Inner sub-cards: `backgroundColor:'rgba(255,255,255,0.03)'`, `border:'1px solid rgba(255,255,255,0.06)'`
- Page title: `fontSize:'26px'`, `fontWeight:800`, `color:'#FFFFFF'`, `letterSpacing:'-0.4px'`

---

## SettingsLayout.tsx Finding
**Deliberately separate sub-shell** — 2-column layout (240px left nav + fluid content area). Not wrapped in the main Sidebar/Header. Uses the same token system (`#232324` panels, `rgba(255,255,255,0.08)` borders) but has its own layout structure. Do NOT force 1:1 structural match with `TeamDashboardView.tsx`.

---

## Completed QA Passes

### Pass 1 — Figma QA + Public CSS Modularisation
All 9 Figma pixel-accuracy fixes applied:
1. `ApplicationFormView.tsx` — desktop (≥768px) renders 1440px layout, mobile renders 412px layout
2. Public page container width — no 1440px cap on wider viewports
3. Logo consistency — header 158×38px, footer 115×28px, auth 172×42px (intentional variants)
4. Homepage hero — `1440×742`, `top:140px`, no border-radius; dark overlay + gold blur block (not box-shadow)
5. Subpage heroes — all four at `x:0, y:154, w:1440, h:463`, sharp corners
6. Workspace tokens — `#FFFFFF1A` cards, `#DFAE324D` icon pills, `#DDC998` highlight
7. Forms — flat solid field fills; gradient only on two 100×90px corner accent decorations
8. About Us alignment — right text top-aligned to image block top, not vertically centered
9. "Our Process" arrow — exact SVG from Figma, 164×14px, `transform:scaleY(-1)`

`public.css` fully modularised (~560 lines of reusable classes). All public TSX files refactored.

### Pass 2 — Workspace Design Consistency Pass

**Tier 1 (Role dashboards) — All Complete:**
- `ManagerDashboardView.tsx` — added `tc-fade-in` + flex wrapper; section panels (sprint roster, deliverables, ATS queue) corrected from `#FFFFFF1A` to `#232324`; `tc-btn`/`tc-btn-primary` class added to `dashboards.css`
- `HrDashboardView.tsx` — full re-audit; `boxShadow` slop removed from section panel; `figma-card` class already applied; `#DFAE324D` icon pills already correct
- `CeoDashboardView.tsx` — added `tc-fade-in`; 70/30 split bar, capital approvals, governance panels corrected to `#232324`
- `ClientDashboardView.tsx` — added `tc-fade-in`; milestones tracker panel corrected to `#232324`
- `ApplicantDashboardView.tsx` — added `tc-fade-in`

**Tier 2 (Operations views) — All Complete:**
- `ClientsView.tsx` — added `width:100%` / `paddingBottom:40px`; already used correct tokens
- `ProjectsView.tsx` — added `tc-fade-in`; all `#11151F` → `#FFFFFF1A` (cards), `#1C1C1E` (modals); CTA button → `tc-action-btn-gold`
- `TasksView.tsx` — same fixes; view-mode toggle → `rgba(255,255,255,0.04)`
- `MeetingsView.tsx` — same fixes; filter tabs inactive → `rgba(255,255,255,0.04)`
- `LiveMeetingRoomView.tsx` — `#11151F` → `rgba(255,255,255,0.06)` (intentional: ultra-dark video room base)
- `UsersManagementView.tsx` — added `tc-fade-in`; table → `#232324`; modal → `#1C1C1E`; count badge → `rgba(223,174,50,0.10)`
- `ApplicationsManagementView.tsx` — added `tc-fade-in`; table → `#232324`; modal → `#1C1C1E`
- `DepartmentsView.tsx` — added `tc-fade-in`; already correct tokens; modal already `#1C1C1E`
- `FinancialsView.tsx` — added `tc-fade-in`; all `#11151F` → `#232324`; CTA buttons → `tc-action-btn-gold`; `boxShadow` slop removed
- `RevenueProductsView.tsx` — added `tc-fade-in`; all `#11151F` → `#FFFFFF1A`; CTA → `tc-action-btn-gold`; modal → `#1C1C1E`
- `ClientRequestProjectView.tsx` — added `tc-fade-in` + `width:100%`; `#11151F` → tokens; tab switcher → `rgba(255,255,255,0.04)`
- `SystemSettingsView.tsx` — added `tc-fade-in`; all `#11151F`/`#0f121bff` → `#232324`; save button → `tc-action-btn-gold`

**Tier 3 (Settings views) — Verified clean, no changes needed:**
- `ProfileSettingsView.tsx` — already uses `#232324`, correct tokens, `tc-fade-in`
- `PasswordSettingsView.tsx` — already correct
- `ChangePasswordView.tsx` — already correct

**`dashboards.css` additions:**
- `.tc-btn` base alias class
- `.tc-btn.tc-btn-primary` — maps to same gold CTA as `tc-action-btn-gold`
- `.tc-btn.tc-btn-primary:hover` — gold hover
- `.tc-btn.tc-btn-primary:disabled` — 0.55 opacity

---

## "No Direct Reference" Flags
These component types have no direct equivalent in `TeamDashboardView.tsx` — tokens applied but structure not forced:
- **70/30 concierge split bar** (`CeoDashboardView.tsx`) — unique multi-segment progress bar
- **Deliverables sign-off panel** (`ManagerDashboardView.tsx`) — unique QA gate panel
- **ATS technical screening queue** (`ManagerDashboardView.tsx`) — unique candidate pipeline
- **KYC/Sumsub stepper** (`ApplicantDashboardView.tsx`) — unique 4-state stepper
- **Milestone roadmap** (`ClientDashboardView.tsx`) — unique timeline tracker
- **WebRTC video grid** (`LiveMeetingRoomView.tsx`) — full-screen room, intentional ultra-dark base
- **Withdrawal approval flow** (`FinancialsView.tsx`) — unique admin payout table
- **Payout invoice splits** (`FinancialsView.tsx`) — unique invoice breakdown table
- **Department ranking table** (`CeoDashboardView.tsx`) — unique multi-column table

---

## Validation Gates (Pass 2)
- `tsc -b --noEmit` ✅ 0 errors
- `oxlint src/views/` ✅ 0 warnings, 0 errors
- `vite build` ✅ built in ~2.4s (pre-existing chunk-size warning unrelated to these changes)

---

## Files Not in Scope (Confirmed Untouched)
`AboutUsView.tsx`, `ContactUsView.tsx`, `HireUsView.tsx`, `FaqsView.tsx`, `HomepageView.tsx`, `ServicesView.tsx`, `PublicLayout.tsx`, `ApplicationFormView.tsx`, `public.css` — all complete from Pass 1, must not be modified.
