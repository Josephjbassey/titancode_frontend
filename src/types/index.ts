/**
 * TitanCode Technologies - Core TypeScript Type Definitions
 * Designed to strictly mirror backend Pydantic models and upcoming API endpoints.
 */

export type UserRole =
  | 'Member'
  | 'Admin'
  | 'Client'
  | 'Project Manager'
  | 'Team Lead'
  | 'CEO'
  | 'Manager'
  | 'Assistant'
  | 'HR'
  | 'Applicant';

export type KycStatus = 'not_verified' | 'pending' | 'verified' | 'rejected';

export interface User {
  id: number;
  email: string;
  full_name: string;
  name?: string; // Backward compatibility alias for full_name
  first_name?: string;
  last_name?: string;
  role: UserRole;
  department_id?: number | null;
  department_name?: string;
  department?: string; // Backward compatibility alias for department_name
  country?: string;
  phone_number?: string;
  phone?: string; // Backward compatibility alias for phone_number
  github_url?: string;
  portfolio_url?: string;
  status: 'active' | 'inactive' | 'pending';
  avatar_url?: string;
  avatar?: string; // Backward compatibility alias for avatar_url
  gender?: 'Male' | 'Female' | 'Other';
  address?: string;
  city?: string;
  state?: string;
  dob?: string;
  // Sumsub KYC integration (for employees/members only)
  kyc_status?: KycStatus;
  kyc_applicant_id?: string;
  kyc_verified_at?: string;
  created_at: string;
}

export interface ClientRecord {
  id: number;
  full_name: string;
  name?: string; // Backward compatibility alias for full_name
  email: string;
  company?: string;
  phone?: string;
  phone_number?: string; // Backward compatibility alias for phone
  service_interest?: string;
  message?: string;
  status: 'Active' | 'Lead' | 'Pending' | 'Closed';
  contract_value?: number;
  currency?: string;
  created_at: string;
}

export interface InboundLead {
  id: number;
  client_name: string;
  full_name?: string; // Backward compatibility alias for client_name
  email: string;
  phone: string;
  phone_number?: string; // Backward compatibility alias for phone
  company: string;
  budget_range: string;
  project_title: string;
  service_category: string;
  description: string;
  status: 'new' | 'contacted' | 'qualified' | 'converted' | 'archived';
  whatsapp_ready: boolean;
  assigned_department?: string;
  created_at: string;
}

export interface DepartmentInfo {
  id: string;
  name: string;
  code: string;
  description: string;
  manager_name: string;
  manager_avatar: string | null;
  manager_email: string;
  assistant_name?: string;
  assistant_avatar?: string;
  member_count: number;
  active_projects_count: number;
  monthly_budget: number;
  currency: string;
  profit_pool_share_percent: number;
  category: 'Engineering' | 'Product' | 'Growth' | 'Operations' | 'Finance';
}

export interface TeamMemberWorkload {
  id: number | string;
  name: string;
  email?: string;
  phone?: string;
  slack_url?: string;
  role: string;
  avatar: string | null;
  department: string;
  active_tasks_count: number;
  completed_tasks_count: number;
  allocation_status: 'Optimal' | 'High' | 'Overloaded' | 'Available';
  current_project: string;
  seniority: 'Principal' | 'Senior' | 'Mid-Level' | 'Junior' | 'Intern';
  hours_logged_this_sprint: number;
}

export interface ClientMilestone {
  id: number | string;
  project_id: number;
  title: string;
  description: string;
  amount: number;
  currency: string;
  due_date: string;
  status: 'pending' | 'in_progress' | 'ready_for_review' | 'approved' | 'paid';
  deliverables: string[];
  payment_url?: string;
}

export interface ApplicantRecord {
  id: number;
  applicant_name: string;
  full_name?: string; // Backward compatibility alias for applicant_name
  name?: string; // Backward compatibility alias for applicant_name
  email: string;
  phone: string;
  phone_number?: string; // Backward compatibility alias for phone
  department_id: number;
  department_name: string;
  experience_years: number;
  github_url?: string;
  portfolio_url?: string;
  cv_filename?: string;
  skills: string[];
  status: 'pending' | 'under_review' | 'interview_scheduled' | 'approved' | 'rejected';
  rejection_reason?: string;
  cooldown_until?: string;
  created_at: string;
}

export type TaskStatus = 'open' | 'in_progress' | 'completed';
export type TaskPriority = 'Low' | 'Medium' | 'High' | 'Urgent';

export interface Task {
  id: number;
  project_id: number;
  project_name?: string;
  assigned_user: number;
  assigned_to?: number; // Backward compatibility alias for assigned_user
  assigned_user_name?: string;
  assigned_user_avatar?: string;
  task_title: string;
  title?: string; // Backward compatibility alias for task_title
  description?: string;
  status: TaskStatus;
  priority: TaskPriority;
  progress_percent?: number;
  deadline?: string;
  created_at: string;
}

export interface Project {
  id: number;
  project_name: string;
  name?: string; // Backward compatibility alias for project_name
  title?: string; // Backward compatibility alias for project_name
  description?: string;
  client_id?: number;
  client_name?: string;
  budget: number;
  currency: string;
  status: 'planning' | 'in_progress' | 'completed' | 'on_hold';
  deadline?: string;
  progress_percentage: number;
  team_members_count?: number;
  created_at: string;
}

export interface Meeting {
  id: number;
  title: string;
  project_id?: number;
  project_name?: string;
  date: string;
  time: string;
  duration_minutes: number;
  meet_url: string;
  attendees: Array<{
    id: number;
    name: string;
    avatar: string;
    role?: string;
  }>;
}

export interface Wallet {
  id: number;
  user_id: number;
  balance: number;
  currency: 'USD';
  total_earned: number;
  pending_payout: number;
  monthly_salary_accrued?: number;
  project_bonus_accrued?: number;
  corporate_treasury_split_percent?: number;
  updated_at: string;
}

export interface UserSession {
  id: string;
  device: string;
  browser: string;
  location: string;
  ip_address: string;
  is_current: boolean;
  last_active: string;
}

export interface AuthResponse {
  access_token: string;
  refresh_token: string;
  token_type: string;
  user: User;
}

export interface SumsubVerificationInitResponse {
  applicant_id: string;
  sdk_token: string;
  status: KycStatus;
  message: string;
}

export interface WithdrawalRecord {
  id: number;
  user_id: number;
  amount: number;
  bank_info: string;
  status: 'pending' | 'approved' | 'rejected' | 'paid';
  created_at: string;
  notes?: string;
}

export interface ProductRecord {
  id: number;
  name: string;
  product_type: string;
  revenue_endpoint?: string;
  product_url?: string;
  api_key_id?: string;
  api_key_masked?: string;
  api_key?: string;
  created_at: string;
  created_by?: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  error?: string;
}

export interface FinancialSettings {
  company_name: string;
  support_email: string;
  currency: string;
  timezone: string;
  split_model?: 'standard_70_30' | 'three_tier_60_15_25' | 'custom';
  platform_split_percent: number;
  overhead_split_percent?: number;
  member_split_percent: number;
  notify_on_milestone: boolean;
  notify_on_withdrawal: boolean;
  // Dynamic pricing tiers for client projects
  pricing_tiers: PricingTier[];
}

export interface PricingTier {
  id: string;
  label: string;
  min_amount: number;
  max_amount: number | null; // null = unlimited
  description: string;
  is_active: boolean;
}

export interface SalaryProjection {
  total_budget: number;
  split_model?: string;
  platform_split_percent: number;
  overhead_split_percent?: number;
  member_split_percent: number;
  platform_treasury_share: number;
  overhead_pool_share?: number;
  team_pool_share: number;
  member_count: number;
  projected_salary_per_member: number;
}

export interface ProjectComment {
  id: number;
  project_id: number;
  content: string;
  author_id?: number | null;
  author_name: string;
  author_role: string;
  author_avatar?: string | null;
  created_at: string;
}

