/**
 * TitanCode Technologies - Core TypeScript Type Definitions
 * Designed to strictly mirror backend Pydantic models and upcoming API endpoints.
 */

export type UserRole = 'Member' | 'Admin' | 'Client' | 'Project Manager' | 'Team Lead';

export type KycStatus = 'not_verified' | 'pending' | 'verified' | 'rejected';

export interface User {
  id: number;
  email: string;
  full_name: string;
  first_name?: string;
  last_name?: string;
  role: UserRole;
  department_id?: number | null;
  department_name?: string;
  country?: string;
  phone_number?: string;
  github_url?: string;
  portfolio_url?: string;
  status: 'active' | 'inactive' | 'pending';
  avatar_url?: string;
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
  email: string;
  company?: string;
  phone?: string;
  service_interest?: string;
  message?: string;
  status: 'Active' | 'Lead' | 'Pending' | 'Closed';
  contract_value?: number;
  currency?: string;
  created_at: string;
}

export type TaskStatus = 'open' | 'in_progress' | 'completed';
export type TaskPriority = 'Low' | 'Medium' | 'High' | 'Urgent';

export interface Task {
  id: number;
  project_id: number;
  project_name?: string;
  assigned_user: number;
  assigned_user_name?: string;
  assigned_user_avatar?: string;
  task_title: string;
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
  currency: 'NGN' | 'USD';
  total_earned: number;
  pending_payout: number;
  // Option B: Hybrid Split Accounting
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

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  error?: string;
}
