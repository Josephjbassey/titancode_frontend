/**
 * TitanCode Technologies - Dual-Mode API Service Layer
 * 
 * Directly targets FastAPI endpoints (http://localhost:8000) while providing
 * robust, production-ready mock fallbacks that define the exact contract
 * for upcoming backend endpoints.
 */

import type {
  User,
  ClientRecord,
  Task,
  Meeting,
  Wallet,
  UserSession,
  AuthResponse,
  SumsubVerificationInitResponse,
  DepartmentInfo,
  InboundLead,
  TeamMemberWorkload,
  ClientMilestone,
  ApplicantRecord,
  Project,
  WithdrawalRecord,
  ProductRecord,
} from '../types';

const configuredApiUrl = (import.meta.env.VITE_API_URL || 'http://localhost:8000').replace(/\/$/, '');
const API_BASE_URL = configuredApiUrl.endsWith('/api/v1')
  ? configuredApiUrl
  : `${configuredApiUrl}/api/v1`;

// Mock current logged-in employee/member
export const MOCK_MEMBER_USER: User = {
  id: 1,
  email: 'alex.morgan@titancode.tech',
  full_name: 'Alex Morgan',
  first_name: 'Alex',
  last_name: 'Morgan',
  role: 'Member',
  department_id: 1,
  department_name: 'Frontend Engineering',
  country: 'Nigeria',
  phone_number: '+234 812 345 6789',
  github_url: 'https://github.com/alexmorgan-tc',
  portfolio_url: 'https://alexmorgan.dev',
  status: 'active',
  avatar_url: '/assets/dashprofile.jpg',
  gender: 'Male',
  address: '14 Admiralty Way, Lekki Phase 1',
  city: 'Lekki',
  state: 'Lagos',
  dob: '1995-08-14',
  kyc_status: 'verified',
  kyc_applicant_id: 'sb_app_9823412',
  kyc_verified_at: '2026-02-10T11:20:00Z',
  created_at: '2026-01-05T09:00:00Z',
};

// Mock admin user
export const MOCK_ADMIN_USER: User = {
  id: 2,
  email: 'elena.rostova@titancode.tech',
  full_name: 'Elena Rostova',
  first_name: 'Elena',
  last_name: 'Rostova',
  role: 'Admin',
  department_id: null,
  department_name: 'Executive Management',
  country: 'Nigeria',
  phone_number: '+234 803 987 6543',
  status: 'active',
  avatar_url: '/assets/dashprofile.jpg',
  gender: 'Female',
  address: '7 Victoria Island Crescent',
  city: 'Victoria Island',
  state: 'Lagos',
  dob: '1990-04-22',
  kyc_status: 'verified',
  created_at: '2025-11-01T08:00:00Z',
};

// Mock CEO user
export const MOCK_CEO_USER: User = {
  id: 3,
  email: 'admin@titancode.com',
  full_name: 'Chidubem Okafor',
  first_name: 'Chidubem',
  last_name: 'Okafor',
  role: 'CEO',
  department_id: null,
  department_name: 'Executive Leadership',
  country: 'Nigeria',
  phone_number: '+234 802 000 1122',
  status: 'active',
  avatar_url: '/assets/joseph.jpg',
  gender: 'Male',
  kyc_status: 'verified',
  created_at: '2025-09-01T08:00:00Z',
};

// Mock HR Talent Lead user
export const MOCK_HR_USER: User = {
  id: 4,
  email: 'hr.lead@titancode.tech',
  full_name: 'Blessing Adewale',
  first_name: 'Blessing',
  last_name: 'Adewale',
  role: 'HR',
  department_id: 14,
  department_name: 'Human Resources & Talent Acquisition',
  country: 'Nigeria',
  phone_number: '+234 810 555 7890',
  status: 'active',
  avatar_url: '/assets/blessing.jpg',
  gender: 'Female',
  kyc_status: 'verified',
  created_at: '2025-10-15T09:00:00Z',
};

// Mock Department Manager / Team Lead user
export const MOCK_MANAGER_USER: User = {
  id: 5,
  email: 'frontend.lead@titancode.tech',
  full_name: 'Benedicta Atagamen',
  first_name: 'Benedicta',
  last_name: 'Atagamen',
  role: 'Manager',
  department_id: 1,
  department_name: 'Frontend Engineering',
  country: 'Nigeria',
  phone_number: '+234 814 222 3344',
  github_url: 'https://github.com/benedicta-titan',
  portfolio_url: 'https://benedicta.design',
  status: 'active',
  avatar_url: '/assets/benedicta.png',
  gender: 'Female',
  kyc_status: 'verified',
  created_at: '2025-11-20T10:00:00Z',
};

// Mock Client user
export const MOCK_CLIENT_USER: User = {
  id: 6,
  email: 'aliko@dangotegroup.com',
  full_name: 'Aliko Dangote',
  first_name: 'Aliko',
  last_name: 'Dangote',
  role: 'Client',
  country: 'Nigeria',
  phone_number: '+234 1 271 2200',
  status: 'active',
  avatar_url: '/assets/munis.jpg',
  gender: 'Male',
  created_at: '2026-01-15T10:00:00Z',
};

// Mock Applicant user
export const MOCK_APPLICANT_USER: User = {
  id: 7,
  email: 'candidate.dev@gmail.com',
  full_name: 'Tariq Al-Mansoor',
  first_name: 'Tariq',
  last_name: 'Al-Mansoor',
  role: 'Applicant',
  department_id: 2,
  department_name: 'Backend & Cloud Infrastructure',
  country: 'Nigeria',
  phone_number: '+234 818 999 4433',
  github_url: 'https://github.com/tariq-dev',
  portfolio_url: 'https://tariq.codes',
  status: 'pending',
  avatar_url: '/assets/joseph.jpg',
  gender: 'Male',
  kyc_status: 'pending',
  created_at: '2026-09-18T14:30:00Z',
};

// Mock client records for the CRM view
export const MOCK_CLIENTS: ClientRecord[] = [
  {
    id: 101,
    full_name: 'Aliko Dangote',
    email: 'contact@dangotegroup.com',
    company: 'Dangote Industries',
    phone: '+234 1 271 2200',
    service_interest: 'Enterprise ERP & Logistics Suite',
    status: 'Active',
    contract_value: 12500000,
    currency: 'NGN',
    created_at: '2026-01-15T10:00:00Z',
  },
  {
    id: 102,
    full_name: 'Sim Shagaya',
    email: 'sim@ubongo.africa',
    company: 'uLesson Education',
    phone: '+234 700 853 7766',
    service_interest: 'Cross-platform Mobile Learning App',
    status: 'Active',
    contract_value: 8400000,
    currency: 'NGN',
    created_at: '2026-02-01T14:30:00Z',
  },
  {
    id: 103,
    full_name: 'Mitchell Elegbe',
    email: 'info@interswitch.com',
    company: 'Interswitch Group',
    phone: '+234 1 628 3888',
    service_interest: 'PCI-DSS Payment Gateway Microservices',
    status: 'Lead',
    contract_value: 18000000,
    currency: 'NGN',
    created_at: '2026-02-18T09:15:00Z',
  },
  {
    id: 104,
    full_name: 'Tosin Eniolorunda',
    email: 'partnerships@moniepoint.com',
    company: 'Moniepoint Financial',
    phone: '+234 1 888 8440',
    service_interest: 'High-Throughput Fraud Detection Engine',
    status: 'Pending',
    contract_value: 6500000,
    currency: 'NGN',
    created_at: '2026-03-02T11:45:00Z',
  },
  {
    id: 105,
    full_name: 'Iyinoluwa Aboyeji',
    email: 'iyin@future.africa',
    company: 'Future Africa Fund',
    phone: '+234 810 400 9011',
    service_interest: 'Venture Capital Investor Portal',
    status: 'Active',
    contract_value: 4200000,
    currency: 'NGN',
    created_at: '2026-03-10T16:20:00Z',
  },
  {
    id: 106,
    full_name: 'Ngozi Okonjo',
    email: 'ngozi@africacapital.org',
    company: 'Pan-African Trade Hub',
    phone: '+234 9 461 4000',
    service_interest: 'Custom Analytics Dashboard',
    status: 'Closed',
    contract_value: 3000000,
    currency: 'NGN',
    created_at: '2025-12-05T08:00:00Z',
  },
];

// Mock tasks for member dashboard
export const MOCK_TASKS: Task[] = [
  {
    id: 201,
    project_id: 1,
    project_name: 'TitanCode Web Platform',
    assigned_user: 1,
    assigned_user_name: 'Alex Morgan',
    task_title: 'Implement Dark Mode Auth Flow & Hero Carousel',
    description: 'Ensure 100% pixel fidelity with the approved Figma design specifications.',
    status: 'in_progress',
    priority: 'High',
    progress_percent: 85,
    deadline: '2026-09-24T18:00:00Z',
    created_at: '2026-09-18T09:00:00Z',
  },
  {
    id: 202,
    project_id: 2,
    project_name: 'Dangote ERP Logistics',
    assigned_user: 1,
    assigned_user_name: 'Alex Morgan',
    task_title: 'Real-time WebSocket Fleet Tracking Feed',
    description: 'Connect Redis pub/sub to frontend telemetry dashboard.',
    status: 'in_progress',
    priority: 'Urgent',
    progress_percent: 60,
    deadline: '2026-09-28T17:00:00Z',
    created_at: '2026-09-15T11:30:00Z',
  },
  {
    id: 203,
    project_id: 1,
    project_name: 'TitanCode Web Platform',
    assigned_user: 1,
    assigned_user_name: 'Alex Morgan',
    task_title: 'Sumsub Employee KYC Modal Integration',
    description: 'Create KYC trigger for employees with Sumsub token handler.',
    status: 'completed',
    priority: 'Medium',
    progress_percent: 100,
    deadline: '2026-09-20T12:00:00Z',
    created_at: '2026-09-14T08:15:00Z',
  },
  {
    id: 204,
    project_id: 3,
    project_name: 'Moniepoint Security Gateway',
    assigned_user: 1,
    assigned_user_name: 'Alex Morgan',
    task_title: 'Audit Multi-Factor Session Revocation Flow',
    description: 'Allow users to invalidate remote sessions across devices.',
    status: 'open',
    priority: 'Low',
    progress_percent: 10,
    deadline: '2026-10-05T15:00:00Z',
    created_at: '2026-09-19T14:00:00Z',
  },
];

// Mock upcoming meeting
export const MOCK_MEETING: Meeting = {
  id: 301,
  title: 'Weekly Engineering Sync & Sprint Planning',
  project_id: 1,
  project_name: 'TitanCode Core',
  date: 'Today, Sep 20, 2026',
  time: '05:30 PM - 06:15 PM WAT',
  duration_minutes: 45,
  meet_url: 'https://meet.google.com/titancode-sync',
  attendees: [
    { id: 1, name: 'Alex Morgan', avatar: '/assets/joseph.jpg', role: 'Frontend Lead' },
    { id: 2, name: 'Elena Rostova', avatar: '/assets/dashprofile.jpg', role: 'VP Engineering' },
    { id: 3, name: 'David Kalu', avatar: '/assets/munis.jpg', role: 'Backend Lead' },
    { id: 4, name: 'Sara Danjuma', avatar: '/assets/benedicta.png', role: 'Product Manager' },
  ],
};

// Mock member wallet with Option B Hybrid breakdown
export const MOCK_WALLET: Wallet = {
  id: 401,
  user_id: 1,
  balance: 125000,
  currency: 'NGN',
  total_earned: 940000,
  pending_payout: 45000,
  monthly_salary_accrued: 350000,
  project_bonus_accrued: 125000,
  corporate_treasury_split_percent: 30,
  updated_at: '2026-09-20T16:00:00Z',
};

// Mock user active sessions
export const MOCK_SESSIONS: UserSession[] = [
  {
    id: 'sess_current',
    device: 'MacBook Pro 16" (macOS Sonoma)',
    browser: 'Google Chrome 128.0',
    location: 'Lekki Phase 1, Lagos, Nigeria',
    ip_address: '102.89.44.12',
    is_current: true,
    last_active: 'Active now',
  },
  {
    id: 'sess_iphone',
    device: 'iPhone 15 Pro Max (iOS 18.1)',
    browser: 'Mobile Safari',
    location: 'Victoria Island, Lagos, Nigeria',
    ip_address: '102.89.44.89',
    is_current: false,
    last_active: '2 hours ago',
  },
  {
    id: 'sess_office',
    device: 'Windows 11 Workstation',
    browser: 'Microsoft Edge 127.0',
    location: 'Ikeja, Lagos, Nigeria',
    ip_address: '197.210.55.3',
    is_current: false,
    last_active: '3 days ago',
  },
];

// 14 Core Startup Tech Firm Departments
export const MOCK_DEPARTMENTS: DepartmentInfo[] = [
  {
    id: 'DEP-01',
    code: 'frontend',
    name: 'Frontend Engineering',
    description: 'Next.js, Vite, React 19, high-performance UI systems, WebGL & design system engineering.',
    manager_name: 'Benedicta Atagamen',
    manager_avatar: '/assets/benedicta.png',
    manager_email: 'benedicta@titancode.tech',
    assistant_name: 'Alex Morgan',
    assistant_avatar: '/assets/dashprofile.jpg',
    member_count: 14,
    active_projects_count: 5,
    monthly_budget: 18500000,
    currency: 'NGN',
    profit_pool_share_percent: 18,
    category: 'Engineering',
  },
  {
    id: 'DEP-02',
    code: 'backend',
    name: 'Backend & Cloud Infrastructure',
    description: 'FastAPI microservices, distributed caching, PostgreSQL sharding, Kubernetes & message queues.',
    manager_name: 'Joseph John',
    manager_avatar: '/assets/joseph.jpg',
    manager_email: 'joseph@titancode.tech',
    assistant_name: 'David Mensah',
    assistant_avatar: '/assets/munis.jpg',
    member_count: 12,
    active_projects_count: 6,
    monthly_budget: 19500000,
    currency: 'NGN',
    profit_pool_share_percent: 20,
    category: 'Engineering',
  },
  {
    id: 'DEP-03',
    code: 'mobile',
    name: 'Mobile Development (iOS & Android)',
    description: 'React Native, Expo SDK, Kotlin, Swift, offline-first architectures and WebRTC mobile audio/video.',
    manager_name: 'Munis Samuel',
    manager_avatar: '/assets/munis.jpg',
    manager_email: 'munis@titancode.tech',
    assistant_name: 'Tariq Al-Mansoor',
    assistant_avatar: '/assets/joseph.jpg',
    member_count: 9,
    active_projects_count: 4,
    monthly_budget: 14000000,
    currency: 'NGN',
    profit_pool_share_percent: 14,
    category: 'Engineering',
  },
  {
    id: 'DEP-04',
    code: 'design',
    name: 'UI/UX & Product Design',
    description: 'End-to-end design systems, spatial composition, Figma prototyping, usability testing & micro-interactions.',
    manager_name: 'Benedicta Atagamen',
    manager_avatar: '/assets/benedicta.png',
    manager_email: 'design.lead@titancode.tech',
    assistant_name: 'Chioma Obi',
    assistant_avatar: '/assets/blessing.jpg',
    member_count: 7,
    active_projects_count: 5,
    monthly_budget: 11000000,
    currency: 'NGN',
    profit_pool_share_percent: 10,
    category: 'Product',
  },
  {
    id: 'DEP-05',
    code: 'qa',
    name: 'QA & Automated Testing',
    description: 'Playwright E2E suites, load testing via k6, visual regression pipelines, and zero-defect QA gates.',
    manager_name: 'Olukayode Tioluwanimi',
    manager_avatar: '/assets/blessing.jpg',
    manager_email: 'qa.lead@titancode.tech',
    assistant_name: 'Samuel Ade',
    assistant_avatar: '/assets/dashprofile.jpg',
    member_count: 6,
    active_projects_count: 6,
    monthly_budget: 8500000,
    currency: 'NGN',
    profit_pool_share_percent: 7,
    category: 'Engineering',
  },
  {
    id: 'DEP-06',
    code: 'devops',
    name: 'DevOps, SecOps & Cybersecurity',
    description: 'AWS CDK, Terraform, SOC2 compliance, automated secret rotation, SIEM monitoring, DDoS mitigation.',
    manager_name: 'Alex Morgan',
    manager_avatar: '/assets/dashprofile.jpg',
    manager_email: 'security@titancode.tech',
    member_count: 5,
    active_projects_count: 6,
    monthly_budget: 9500000,
    currency: 'NGN',
    profit_pool_share_percent: 8,
    category: 'Engineering',
  },
  {
    id: 'DEP-07',
    code: 'product',
    name: 'Product Management',
    description: 'PRD synthesis, user journey roadmaps, KPI attribution, sprint backlogs, and stakeholder alignment.',
    manager_name: 'Sara Danjuma',
    manager_avatar: '/assets/benedicta.png',
    manager_email: 'product@titancode.tech',
    member_count: 5,
    active_projects_count: 6,
    monthly_budget: 7500000,
    currency: 'NGN',
    profit_pool_share_percent: 5,
    category: 'Product',
  },
  {
    id: 'DEP-08',
    code: 'rnd',
    name: 'Research & Development (R&D / AI)',
    description: 'LLM agents, vector embeddings, LangGraph orchestrators, agentic memory graph systems, on-device AI.',
    manager_name: 'Dr. Chinedu Eze',
    manager_avatar: '/assets/joseph.jpg',
    manager_email: 'ai.research@titancode.tech',
    member_count: 6,
    active_projects_count: 3,
    monthly_budget: 15000000,
    currency: 'NGN',
    profit_pool_share_percent: 12,
    category: 'Product',
  },
  {
    id: 'DEP-09',
    code: 'sales',
    name: 'Sales & Enterprise Partnerships',
    description: 'B2B enterprise pipeline, deal structuring, software RFP proposals, and venture client onboarding.',
    manager_name: 'Emeka Nwosu',
    manager_avatar: '/assets/munis.jpg',
    manager_email: 'sales@titancode.tech',
    member_count: 4,
    active_projects_count: 7,
    monthly_budget: 8000000,
    currency: 'NGN',
    profit_pool_share_percent: 6,
    category: 'Growth',
  },
  {
    id: 'DEP-10',
    code: 'marketing',
    name: 'Growth Marketing & Brand Content',
    description: 'SEO strategy, viral developer advocacy, social proof generation, technical newsletters & brand storytelling.',
    manager_name: 'Zainab Bello',
    manager_avatar: '/assets/blessing.jpg',
    manager_email: 'marketing@titancode.tech',
    member_count: 5,
    active_projects_count: 5,
    monthly_budget: 6500000,
    currency: 'NGN',
    profit_pool_share_percent: 5,
    category: 'Growth',
  },
  {
    id: 'DEP-11',
    code: 'support',
    name: 'Customer Support & Client Success',
    description: '24/7 client SLA management, ticket escalation, user onboarding walkthroughs, and NPS feedback tracking.',
    manager_name: 'Khadija Umar',
    manager_avatar: '/assets/benedicta.png',
    manager_email: 'support@titancode.tech',
    member_count: 6,
    active_projects_count: 6,
    monthly_budget: 5000000,
    currency: 'NGN',
    profit_pool_share_percent: 4,
    category: 'Operations',
  },
  {
    id: 'DEP-12',
    code: 'finance',
    name: 'Finance, Treasury & Billing',
    description: '70/30 developer profit share distributions, automated Stripe billing webhooks, corporate treasury reserves.',
    manager_name: 'Femi Oladipo',
    manager_avatar: '/assets/joseph.jpg',
    manager_email: 'finance@titancode.tech',
    member_count: 4,
    active_projects_count: 6,
    monthly_budget: 4500000,
    currency: 'NGN',
    profit_pool_share_percent: 3,
    category: 'Finance',
  },
  {
    id: 'DEP-13',
    code: 'audit',
    name: 'Internal Audit, Compliance & Legal',
    description: 'IP assignments, NDAs, smart contract safety reviews, PCI-DSS compliance audits, code audit verification.',
    manager_name: 'Barr. Ngozi Okeke',
    manager_avatar: '/assets/blessing.jpg',
    manager_email: 'legal@titancode.tech',
    member_count: 3,
    active_projects_count: 6,
    monthly_budget: 5500000,
    currency: 'NGN',
    profit_pool_share_percent: 3,
    category: 'Operations',
  },
  {
    id: 'DEP-14',
    code: 'hr',
    name: 'Human Resources & Talent Acquisition',
    description: 'Candidate screening, technical skills vetting, employee KYC verification with Sumsub, culture & onboarding.',
    manager_name: 'Blessing Adewale',
    manager_avatar: '/assets/blessing.jpg',
    manager_email: 'hr@titancode.tech',
    member_count: 4,
    active_projects_count: 6,
    monthly_budget: 4000000,
    currency: 'NGN',
    profit_pool_share_percent: 3,
    category: 'Operations',
  },
  {
    id: 'DEP-15',
    code: 'data',
    name: 'Data Science & Business Intelligence',
    description: 'Product telemetry, ETL data warehouses, churn prediction, cohort retention modeling & A/B testing infrastructure.',
    manager_name: 'Dr. Tunde Fashola',
    manager_avatar: '/assets/joseph.jpg',
    manager_email: 'data.science@titancode.tech',
    member_count: 5,
    active_projects_count: 4,
    monthly_budget: 11500000,
    currency: 'NGN',
    profit_pool_share_percent: 8,
    category: 'Engineering',
  },
  {
    id: 'DEP-16',
    code: 'partnerships',
    name: 'Strategic Partnerships & DevRel',
    description: 'Developer advocacy, API SDK developer experiences, open-source community building, and hackathons.',
    manager_name: 'Damian Clarke',
    manager_avatar: '/assets/munis.jpg',
    manager_email: 'devrel@titancode.tech',
    member_count: 4,
    active_projects_count: 5,
    monthly_budget: 7000000,
    currency: 'NGN',
    profit_pool_share_percent: 5,
    category: 'Growth',
  },
  {
    id: 'DEP-17',
    code: 'bizops',
    name: 'Business Operations & Strategy',
    description: 'Cross-functional OKR execution, operating cadence, vendor procurement, workflow automation & strategic scaling.',
    manager_name: 'Grace Bassey',
    manager_avatar: '/assets/benedicta.png',
    manager_email: 'bizops@titancode.tech',
    member_count: 4,
    active_projects_count: 5,
    monthly_budget: 6000000,
    currency: 'NGN',
    profit_pool_share_percent: 4,
    category: 'Operations',
  },
];

// Mock Inbound Leads for HR Dashboard
export const MOCK_INBOUND_LEADS: InboundLead[] = [
  {
    id: 901,
    client_name: 'Aliko Dangote',
    email: 'contact@dangotegroup.com',
    phone: '+234 1 271 2200',
    company: 'Dangote Industries',
    budget_range: '₦10M - ₦25M',
    project_title: 'Enterprise ERP & Logistics Fleet Suite',
    service_category: 'Full Stack & Cloud Systems',
    description: 'Looking to overhaul our cross-country fleet dispatch system with real-time GPS telemetry and automated fuel ledger.',
    status: 'new',
    whatsapp_ready: true,
    assigned_department: 'Backend & Cloud Infrastructure',
    created_at: '2026-09-21T09:30:00Z',
  },
  {
    id: 902,
    client_name: 'Sim Shagaya',
    email: 'sim@ubongo.africa',
    phone: '+234 700 853 7766',
    company: 'uLesson Education',
    budget_range: '₦5M - ₦10M',
    project_title: 'Interactive Mobile Learning Platform',
    service_category: 'Mobile App Development',
    description: 'Cross-platform mobile application with offline video downloading and gamified quiz leaderboards.',
    status: 'contacted',
    whatsapp_ready: true,
    assigned_department: 'Mobile Development (iOS & Android)',
    created_at: '2026-09-20T14:15:00Z',
  },
  {
    id: 903,
    client_name: 'Mitchell Elegbe',
    email: 'info@interswitch.com',
    phone: '+234 1 628 3888',
    company: 'Interswitch Group',
    budget_range: '₦15M - ₦30M',
    project_title: 'PCI-DSS Payment Gateway Microservices',
    service_category: 'Fintech & Security',
    description: 'High-throughput payment orchestration engine with 99.999% uptime SLA and real-time fraud scoring.',
    status: 'qualified',
    whatsapp_ready: true,
    assigned_department: 'DevOps, SecOps & Cybersecurity',
    created_at: '2026-09-19T11:45:00Z',
  },
  {
    id: 904,
    client_name: 'Tosin Eniolorunda',
    email: 'partnerships@moniepoint.com',
    phone: '+234 1 888 8440',
    company: 'Moniepoint Financial',
    budget_range: '₦8M - ₦15M',
    project_title: 'Agent Banking Web Portal Redesign',
    service_category: 'UI/UX & Product Design',
    description: 'Need modern dark-mode interface system for our POS merchant transaction management dashboard.',
    status: 'converted',
    whatsapp_ready: true,
    assigned_department: 'UI/UX & Product Design',
    created_at: '2026-09-17T16:20:00Z',
  },
];

// Mock Team Workload for Department Managers
export const MOCK_TEAM_WORKLOAD: TeamMemberWorkload[] = [
  {
    id: 1,
    name: 'Alex Morgan',
    role: 'Principal Frontend Architect',
    avatar: '/assets/dashprofile.jpg',
    department: 'Frontend Engineering',
    active_tasks_count: 2,
    completed_tasks_count: 28,
    allocation_status: 'Optimal',
    current_project: 'TitanCode Platform',
    seniority: 'Principal',
    hours_logged_this_sprint: 36,
  },
  {
    id: 2,
    name: 'Benedicta Atagamen',
    role: 'Design System Lead',
    avatar: '/assets/benedicta.png',
    department: 'UI/UX & Product Design',
    active_tasks_count: 3,
    completed_tasks_count: 34,
    allocation_status: 'High',
    current_project: 'Aurelia FinTech Mobile App',
    seniority: 'Senior',
    hours_logged_this_sprint: 42,
  },
  {
    id: 3,
    name: 'Joseph John',
    role: 'Lead Backend Engineer',
    avatar: '/assets/joseph.jpg',
    department: 'Backend & Cloud Infrastructure',
    active_tasks_count: 1,
    completed_tasks_count: 45,
    allocation_status: 'Available',
    current_project: 'TitanCore SaaS Cloud Engine',
    seniority: 'Senior',
    hours_logged_this_sprint: 28,
  },
  {
    id: 4,
    name: 'Munis Samuel',
    role: 'Senior Mobile Engineer',
    avatar: '/assets/munis.jpg',
    department: 'Mobile Development (iOS & Android)',
    active_tasks_count: 3,
    completed_tasks_count: 22,
    allocation_status: 'Optimal',
    current_project: 'PulseHealth Telemedicine',
    seniority: 'Senior',
    hours_logged_this_sprint: 38,
  },
  {
    id: 5,
    name: 'Olukayode Tioluwanimi',
    role: 'Lead QA Automation Engineer',
    avatar: '/assets/blessing.jpg',
    department: 'QA & Automated Testing',
    active_tasks_count: 2,
    completed_tasks_count: 19,
    allocation_status: 'Optimal',
    current_project: 'OmniTrade Bot',
    seniority: 'Mid-Level',
    hours_logged_this_sprint: 32,
  },
  {
    id: 6,
    name: 'Dr. Chinedu Eze',
    role: 'Staff AI Research Scientist',
    avatar: '/assets/joseph.jpg',
    department: 'Research & Development (R&D / AI)',
    active_tasks_count: 3,
    completed_tasks_count: 16,
    allocation_status: 'Optimal',
    current_project: 'Titan Autonomous Code Agent',
    seniority: 'Principal',
    hours_logged_this_sprint: 40,
  },
  {
    id: 7,
    name: 'Emeka Nwosu',
    role: 'Enterprise Accounts Director',
    avatar: '/assets/munis.jpg',
    department: 'Sales & Enterprise Partnerships',
    active_tasks_count: 4,
    completed_tasks_count: 25,
    allocation_status: 'High',
    current_project: 'Enterprise Tier Closing',
    seniority: 'Senior',
    hours_logged_this_sprint: 44,
  },
  {
    id: 8,
    name: 'Zainab Bello',
    role: 'Head of Growth Marketing',
    avatar: '/assets/blessing.jpg',
    department: 'Growth Marketing & Brand Content',
    active_tasks_count: 2,
    completed_tasks_count: 30,
    allocation_status: 'Optimal',
    current_project: 'DevOps Funnel Campaign',
    seniority: 'Senior',
    hours_logged_this_sprint: 35,
  },
  {
    id: 9,
    name: 'Khadija Umar',
    role: 'Customer Success Operations Manager',
    avatar: '/assets/benedicta.png',
    department: 'Customer Support & Client Success',
    active_tasks_count: 2,
    completed_tasks_count: 52,
    allocation_status: 'Optimal',
    current_project: '24/7 SLA Concierge',
    seniority: 'Senior',
    hours_logged_this_sprint: 37,
  },
  {
    id: 10,
    name: 'Femi Oladipo',
    role: 'Corporate Treasurer & Financial Controller',
    avatar: '/assets/joseph.jpg',
    department: 'Finance, Treasury & Billing',
    active_tasks_count: 1,
    completed_tasks_count: 41,
    allocation_status: 'Available',
    current_project: '70/30 Profit Pool Escrow Settlement',
    seniority: 'Senior',
    hours_logged_this_sprint: 30,
  },
  {
    id: 11,
    name: 'Barr. Ngozi Okeke',
    role: 'Chief Compliance & Legal Officer',
    avatar: '/assets/blessing.jpg',
    department: 'Internal Audit, Compliance & Legal',
    active_tasks_count: 2,
    completed_tasks_count: 27,
    allocation_status: 'Optimal',
    current_project: 'SOC2 Type II Audit & IP Scaffolding',
    seniority: 'Senior',
    hours_logged_this_sprint: 34,
  },
  {
    id: 12,
    name: 'Blessing Adewale',
    role: 'People Operations & Talent Lead',
    avatar: '/assets/blessing.jpg',
    department: 'Human Resources & Talent Acquisition',
    active_tasks_count: 3,
    completed_tasks_count: 38,
    allocation_status: 'Optimal',
    current_project: 'Quarterly Tech Hiring Cohort',
    seniority: 'Senior',
    hours_logged_this_sprint: 39,
  },
  {
    id: 13,
    name: 'Dr. Tunde Fashola',
    role: 'Head of Data Science & BI',
    avatar: '/assets/joseph.jpg',
    department: 'Data Science & Business Intelligence',
    active_tasks_count: 2,
    completed_tasks_count: 23,
    allocation_status: 'Optimal',
    current_project: 'Real-time Client Telemetry Warehouse',
    seniority: 'Principal',
    hours_logged_this_sprint: 36,
  },
  {
    id: 14,
    name: 'Damian Clarke',
    role: 'Lead Developer Advocate & Partnerships',
    avatar: '/assets/munis.jpg',
    department: 'Strategic Partnerships & DevRel',
    active_tasks_count: 3,
    completed_tasks_count: 29,
    allocation_status: 'Optimal',
    current_project: 'Titan SDK Ecosystem Integration',
    seniority: 'Senior',
    hours_logged_this_sprint: 38,
  },
  {
    id: 15,
    name: 'Grace Bassey',
    role: 'Chief of Staff & Head of BizOps',
    avatar: '/assets/benedicta.png',
    department: 'Business Operations & Strategy',
    active_tasks_count: 2,
    completed_tasks_count: 31,
    allocation_status: 'Optimal',
    current_project: 'Cross-functional OKR Alignment',
    seniority: 'Senior',
    hours_logged_this_sprint: 35,
  },
];

// Mock Client Milestones for Client Dashboard
export const MOCK_CLIENT_MILESTONES: ClientMilestone[] = [
  {
    id: 801,
    project_id: 1,
    title: 'Phase 1: Architecture Blueprint & Wireframe Handoff',
    description: 'System architectural diagrams, database schema models, and interactive Figma prototypes.',
    amount: 3500000,
    currency: 'NGN',
    due_date: 'Sep 10, 2026',
    status: 'paid',
    deliverables: ['System Architecture PDF', 'Figma Design System Spec', 'PostgreSQL Schema DDL'],
    stripe_invoice_url: 'https://checkout.stripe.com/mock_inv_801',
  },
  {
    id: 802,
    project_id: 1,
    title: 'Phase 2: Core Microservices & Dark Mode Auth Frontend',
    description: 'FastAPI auth endpoints with JWT revocation, responsive React 19 views, and Sumsub KYC hook.',
    amount: 5500000,
    currency: 'NGN',
    due_date: 'Sep 25, 2026',
    status: 'ready_for_review',
    deliverables: ['Live Staging URL', 'API Swagger Documentation', 'Automated Test Report'],
    stripe_invoice_url: 'https://checkout.stripe.com/mock_inv_802',
  },
  {
    id: 803,
    project_id: 1,
    title: 'Phase 3: Production Deployment & Telemetry Monitoring',
    description: 'Cloud deployment on AWS with Sentry observability, Redis cluster, and Stripe payment webhooks.',
    amount: 3500000,
    currency: 'NGN',
    due_date: 'Oct 15, 2026',
    status: 'pending',
    deliverables: ['Production Docker Images', 'Terraform Runbooks', 'Security Audit Certificate'],
  },
];

// Mock Applicant Pipeline Records for ATS
export const MOCK_APPLICANT_RECORDS: ApplicantRecord[] = [
  {
    id: 701,
    applicant_name: 'Tariq Al-Mansoor',
    email: 'tariq.dev@gmail.com',
    phone: '+234 818 999 4433',
    department_id: 2,
    department_name: 'Backend & Cloud Infrastructure',
    experience_years: 4,
    github_url: 'https://github.com/tariq-dev',
    portfolio_url: 'https://tariq.codes',
    skills: ['Python', 'FastAPI', 'PostgreSQL', 'Docker', 'Redis'],
    status: 'under_review',
    created_at: '2026-09-18T14:30:00Z',
  },
  {
    id: 702,
    applicant_name: 'Zainab Abubakar',
    email: 'zainab.ux@yahoo.com',
    phone: '+234 809 111 2233',
    department_id: 4,
    department_name: 'UI/UX & Product Design',
    experience_years: 5,
    portfolio_url: 'https://zainab.design',
    skills: ['Figma', 'Design Systems', 'User Research', 'Prototyping'],
    status: 'interview_scheduled',
    created_at: '2026-09-17T10:00:00Z',
  },
  {
    id: 703,
    applicant_name: 'Emeka Eze',
    email: 'emeka.mobile@gmail.com',
    phone: '+234 803 777 8899',
    department_id: 3,
    department_name: 'Mobile Development (iOS & Android)',
    experience_years: 3,
    github_url: 'https://github.com/emeka-apps',
    skills: ['React Native', 'Expo', 'TypeScript', 'Redux'],
    status: 'approved',
    created_at: '2026-09-14T11:20:00Z',
  },
];

/**
 * High-level API client with graceful mock fallbacks
 */
class ApiService {
  private token: string | null = null;
  private refreshToken: string | null = null;
  private refreshPromise: Promise<string | null> | null = null;

  constructor() {
    this.token = localStorage.getItem('tc_access_token');
    this.refreshToken = localStorage.getItem('tc_refresh_token');
  }

  setToken(token: string | null) {
    this.token = token;
    if (token) {
      localStorage.setItem('tc_access_token', token);
    } else {
      localStorage.removeItem('tc_access_token');
    }
  }

  setRefreshToken(token: string | null) {
    this.refreshToken = token;
    if (token) {
      localStorage.setItem('tc_refresh_token', token);
    } else {
      localStorage.removeItem('tc_refresh_token');
    }
  }

  clearAuth() {
    this.setToken(null);
    this.setRefreshToken(null);
  }

  isAuthenticated(): boolean {
    return !!this.token && !this.token.startsWith('mock_');
  }

  /** Silently exchange the refresh token for a new access token. */
  private async _refreshAccessToken(): Promise<string | null> {
    if (!this.refreshToken) return null;
    try {
      const res = await fetch(`${API_BASE_URL}/auth/refresh?refresh_token=${encodeURIComponent(this.refreshToken)}`, {
        method: 'POST',
      });
      if (res.ok) {
        const data = await res.json();
        this.setToken(data.access_token);
        if (data.refresh_token) this.setRefreshToken(data.refresh_token);
        return data.access_token;
      }
    } catch {
      // network error — leave current token intact
    }
    return null;
  }

  /**
   * Deduplicated token refresh — multiple concurrent 401s
   * trigger only one refresh call.
   */
  async ensureFreshToken(): Promise<void> {
    if (!this.refreshPromise) {
      this.refreshPromise = this._refreshAccessToken().finally(() => {
        this.refreshPromise = null;
      });
    }
    await this.refreshPromise;
  }

  /** Auth-aware fetch that transparently retries once after a 401. */
  private async authFetch(input: RequestInfo, init: RequestInit = {}): Promise<Response> {
    const headers = new Headers(init.headers || {});
    if (this.token) headers.set('Authorization', `Bearer ${this.token}`);
    const res = await fetch(input, { ...init, headers });

    if (res.status === 401 && this.refreshToken) {
      await this.ensureFreshToken();
      if (this.token) headers.set('Authorization', `Bearer ${this.token}`);
      return fetch(input, { ...init, headers });
    }
    return res;
  }

  // --- AUTHENTICATION ---
  async login(email: string, password: string): Promise<AuthResponse> {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({ username: email, password }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.detail || 'Invalid email or password.');
    }

    const data = await response.json();
    this.setToken(data.access_token);
    if (data.refresh_token) this.setRefreshToken(data.refresh_token);
    const user = await this.getCurrentUser();
    return { ...data, user };
  }

  async register(payload: {
    full_name: string;
    email: string;
    password: string;
    phone_number?: string;
    country?: string;
  }): Promise<User> {
    const res = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.detail || 'Registration failed. Please try again.');
    }
    return res.json();
  }

  async logout(): Promise<void> {
    this.clearAuth();
  }

  async getCurrentUser(): Promise<User> {
    if (!this.token) throw new Error('Not authenticated');
    const res = await this.authFetch(`${API_BASE_URL}/auth/profile`);
    if (!res.ok) throw new Error('Failed to load user profile');
    return res.json();
  }

  // --- PASSWORD RECOVERY WIZARD (3 STEPS) ---
  async requestPasswordResetOtp(email: string): Promise<{ success: boolean; message: string }> {
    const res = await fetch(`${API_BASE_URL}/auth/forgot-password/request-otp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.detail || 'Failed to send reset code.');
    }
    return res.json();
  }

  async verifyOtp(email: string, code: string): Promise<{ success: boolean; reset_token: string }> {
    const res = await fetch(`${API_BASE_URL}/auth/forgot-password/verify-otp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, code }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.detail || 'Incorrect code. Please try again.');
    }
    return res.json();
  }

  async resetPassword(resetToken: string, newPassword: string): Promise<{ success: boolean; message: string }> {
    const res = await fetch(`${API_BASE_URL}/auth/forgot-password/reset`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ reset_token: resetToken, new_password: newPassword }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.detail || 'Failed to reset password. The link may have expired.');
    }
    return res.json();
  }

  // --- DASHBOARD / TASKS ---
  async getTasks(): Promise<Task[]> {
    const res = await this.authFetch(`${API_BASE_URL}/tasks/?limit=100`);
    if (!res.ok) return MOCK_TASKS; // degraded: show mock tasks if backend unavailable
    const data = await res.json();
    return Array.isArray(data) ? data : (data.items ?? MOCK_TASKS);
  }

  async getUpcomingMeeting(): Promise<Meeting | null> {
    const res = await this.authFetch(`${API_BASE_URL}/meetings/?limit=1`);
    if (!res.ok) return MOCK_MEETING;
    const data = await res.json();
    const meeting = (Array.isArray(data) ? data : data.items)?.[0];
    if (!meeting) return null;
    const scheduledAt = new Date(meeting.scheduled_at);
    return {
      id: meeting.id,
      title: meeting.title,
      date: scheduledAt.toLocaleDateString(),
      time: scheduledAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      duration_minutes: 0,
      meet_url: meeting.meeting_link || '',
      attendees: [],
    };
  }

  async getWallet(): Promise<Wallet | null> {
    const res = await this.authFetch(`${API_BASE_URL}/wallets/me`);
    if (res.status === 404) return null; // wallet not created yet
    if (!res.ok) return MOCK_WALLET;
    return res.json();
  }

  // --- CLIENTS CRM ---
  // ClientsView should use /users?role=Client (leads are separate from activated clients)
  async getClients(): Promise<ClientRecord[]> {
    const res = await this.authFetch(`${API_BASE_URL}/users/?role=Client&limit=100`);
    if (!res.ok) return MOCK_CLIENTS;
    const data = await res.json();
    const users = data.items ?? data;
    // Map User records with role=Client to ClientRecord shape
    return users.map((u: any) => ({
      id: u.id,
      full_name: u.full_name,
      email: u.email,
      phone: u.phone_number ?? '',
      status: u.status === 'approved' ? 'Active' : u.status === 'pending' ? 'Pending' : 'Closed',
      created_at: u.created_at,
    }));
  }

  async getInboundLeads(): Promise<InboundLead[]> {
    const res = await this.authFetch(`${API_BASE_URL}/leads/?limit=100`);
    if (!res.ok) return MOCK_INBOUND_LEADS;
    const data = await res.json();
    const items = data.items ?? data;
    return items.map((lead: any) => ({
      id: lead.id,
      client_name: lead.full_name,
      email: lead.email,
      phone: lead.phone ?? '',
      company: lead.company ?? '',
      budget_range: '',
      project_title: lead.service_interest ?? '',
      service_category: lead.service_interest ?? '',
      description: lead.message ?? '',
      status: lead.status ?? 'new',
      whatsapp_ready: !!lead.phone,
      created_at: lead.created_at,
    }));
  }

  /** Submit the public Hire Us form → POST /leads */
  async submitHireUs(payload: {
    name: string;
    email: string;
    phone?: string;
    company?: string;
    project_type?: string;
    description?: string;
  }): Promise<{ success: boolean }> {
    const res = await fetch(`${API_BASE_URL}/leads`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.detail || 'Failed to submit inquiry. Please try again.');
    }
    return { success: true };
  }

  /** Submit the public Contact Us form → POST /leads/contact */
  async submitContact(payload: {
    first_name: string;
    last_name: string;
    email: string;
    subject: string;
    message: string;
  }): Promise<{ success: boolean; message: string }> {
    const res = await fetch(`${API_BASE_URL}/leads/contact`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.detail || 'Failed to send message. Please try again.');
    }
    return res.json();
  }

  // --- PROFILE & SETTINGS ---
  async updateProfile(updates: Partial<User>): Promise<User> {
    const res = await this.authFetch(`${API_BASE_URL}/users/update`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.detail || 'Failed to update profile.');
    }
    return res.json();
  }

  async changePassword(currentPass: string, newPass: string): Promise<{ success: boolean; message: string }> {
    const res = await this.authFetch(`${API_BASE_URL}/auth/change-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ current_password: currentPass, new_password: newPass }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.detail || 'Failed to change password.');
    }
    return res.json();
  }

  // --- SESSIONS (not yet backed by a real endpoint — kept as stub) ---
  async getSessions(): Promise<UserSession[]> {
    // No backend sessions endpoint exists yet. Return mock until implemented.
    return MOCK_SESSIONS;
  }

  async revokeSession(_sessionId: string): Promise<{ success: boolean }> {
    // Stub — no backend endpoint yet
    return { success: true };
  }

  // --- SUMSUB KYC INTEGRATION (EMPLOYEES ONLY) ---
  async initiateSumsubKyc(userId: number): Promise<SumsubVerificationInitResponse> {
    try {
      const res = await this.authFetch(`${API_BASE_URL}/kyc/sumsub/initiate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: userId, verification_level: 'employee-identity-proof' }),
      });
      if (res.ok) return res.json();
    } catch {
      // Sumsub not configured — fall through to stub
    }
    // Not yet integrated — indicate unavailability rather than pretending success
    throw new Error('KYC verification is not available yet. Please contact support.');
  }

  getWhatsAppOutreachLink(phone: string, clientName: string, projectTitle: string): string {
    const cleanPhone = phone.replace(/[^0-9]/g, '');
    const message = encodeURIComponent(
      `Hello ${clientName}, this is TitanCode Technologies regarding your inquiry for "${projectTitle}". I'd love to discuss your technical requirements and timeline!`
    );
    return `https://wa.me/${cleanPhone}?text=${message}`;
  }

  // --- DEPARTMENTS ---
  async getDepartments(): Promise<DepartmentInfo[]> {
    const res = await this.authFetch(`${API_BASE_URL}/departments/`);
    if (!res.ok) return MOCK_DEPARTMENTS;
    const data = await res.json();
    if (Array.isArray(data) && data.length > 0) return data;
    return MOCK_DEPARTMENTS; // DB is empty — show mock for demo
  }

  async getTeamWorkload(departmentCode?: string): Promise<TeamMemberWorkload[]> {
    // No dedicated endpoint yet — filter mock data by department
    if (!departmentCode || departmentCode === 'all') return MOCK_TEAM_WORKLOAD;
    return MOCK_TEAM_WORKLOAD.filter((m) =>
      m.department.toLowerCase().includes(departmentCode.toLowerCase())
    );
  }

  // --- CLIENT MILESTONES ---
  async getClientMilestones(projectId: number = 1): Promise<ClientMilestone[]> {
    // No milestones endpoint yet — documented gap G-09
    return MOCK_CLIENT_MILESTONES;
  }

  // --- APPLICANT ATS ---
  async getApplicantRecords(): Promise<ApplicantRecord[]> {
    const res = await this.authFetch(`${API_BASE_URL}/applications/?limit=100`);
    if (!res.ok) return MOCK_APPLICANT_RECORDS;
    const data = await res.json();
    const items = data.items ?? data;
    if (!Array.isArray(items) || items.length === 0) return MOCK_APPLICANT_RECORDS;
    return items.map((app: any) => ({
      id: app.id,
      applicant_name: app.user?.full_name ?? `Applicant #${app.user_id}`,
      email: app.user?.email ?? '',
      phone: app.user?.phone_number ?? '',
      department_id: app.department_id,
      department_name: app.department?.name ?? '',
      experience_years: app.user?.experience_years ?? 0,
      github_url: app.github_url,
      portfolio_url: app.portfolio,
      skills: app.user?.skills ? app.user.skills.split(',').map((s: string) => s.trim()) : [],
      status: app.status,
      created_at: app.reviewed_at ?? '',
    }));
  }

  // --- CEO EXECUTIVE OVERVIEW ---
  async getCeoOverview(): Promise<{
    totalRevenue: number;
    treasuryBalance: number;
    developerPoolPaid: number;
    activeProjects: number;
    totalStaff: number;
    splitMemberPercent: number;
    splitTreasuryPercent: number;
  }> {
    try {
      const [overviewRes, walletRes, staffRes] = await Promise.all([
        this.authFetch(`${API_BASE_URL}/dashboard/overview`),
        this.authFetch(`${API_BASE_URL}/financials/company-wallet`),
        this.authFetch(`${API_BASE_URL}/users/?role=Member&limit=1`),
      ]);

      const overview = overviewRes.ok ? await overviewRes.json() : {};
      const wallet = walletRes.ok ? await walletRes.json() : {};
      const staff = staffRes.ok ? await staffRes.json() : {};

      const totalRevenue = Number(overview.total_revenue ?? 0);
      const treasuryBalance = Number(wallet.balance ?? 0);
      const totalStaff = staff.total ?? 0;

      return {
        totalRevenue,
        treasuryBalance,
        developerPoolPaid: totalRevenue * 0.7,
        activeProjects: overview.active_projects ?? 0,
        totalStaff,
        splitMemberPercent: 70,
        splitTreasuryPercent: 30,
      };
    } catch {
      // Full fallback when backend is unreachable
      return {
        totalRevenue: 0,
        treasuryBalance: 0,
        developerPoolPaid: 0,
        activeProjects: 0,
        totalStaff: 0,
        splitMemberPercent: 70,
        splitTreasuryPercent: 30,
      };
    }
  }
}

export const api = new ApiService();
