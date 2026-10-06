/**
 * TitanCode Technologies - Production API Service Layer
 * 
 * Directly targets FastAPI endpoints (http://localhost:8000) with JWT authentication,
 * automatic token refresh, and full type safety across all TitanCode modules.
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
  FinancialSettings,
  SalaryProjection,
} from '../types';
import { offlineSync } from './offlineSync';

const configuredApiUrl = (import.meta.env.VITE_API_URL || 'http://localhost:8000').replace(/\/$/, '');
const API_BASE_URL = configuredApiUrl.endsWith('/api/v1')
  ? configuredApiUrl
  : `${configuredApiUrl}/api/v1`;

/**
 * High-level API client for TitanCode Technologies
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
    this.saveActiveUser(null);
  }

  getActiveUser(): User | null {
    const raw = localStorage.getItem('tc_user');
    if (!raw) return null;
    try {
      const u = JSON.parse(raw);
      if (u && typeof u === 'object') {
        u.name = u.name || u.full_name;
        u.department = u.department || u.department_name;
        u.phone = u.phone || u.phone_number;
        u.avatar = u.avatar || u.avatar_url;
      }
      return u;
    } catch {
      return null;
    }
  }

  saveActiveUser(user: User | null): void {
    if (user) {
      localStorage.setItem('tc_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('tc_user');
    }
  }

  isAuthenticated(): boolean {
    return !!this.token;
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
    this.saveActiveUser(user);
    return { ...data, user };
  }

  async googleLogin(credential: string): Promise<AuthResponse> {
    const response = await fetch(`${API_BASE_URL}/auth/google`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ credential }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.detail || 'Google sign-in failed.');
    }

    const data = await response.json();
    this.setToken(data.access_token);
    if (data.refresh_token) this.setRefreshToken(data.refresh_token);
    const user = await this.getCurrentUser();
    this.saveActiveUser(user);
    return { ...data, user };
  }

  async register(payload: {
    full_name: string;
    email: string;
    password: string;
    role?: string;
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

  async qualify(role: 'Client' | 'Member' | 'Applicant'): Promise<User> {
    const res = await this.authFetch(`${API_BASE_URL}/auth/qualify`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ role }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.detail || 'Failed to update qualification role.');
    }
    const updated: User = await res.json();
    this.saveActiveUser(updated);
    return updated;
  }

  /**
   * Consumes a client magic onboarding link token and returns user and tokens.
   */
  async activateClientOnboard(token: string): Promise<{ access_token: string; refresh_token: string; user: User; message: string }> {
    const res = await fetch(`${API_BASE_URL}/client/onboard?token=${encodeURIComponent(token)}`);
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.detail || 'This magic link is invalid or has expired.');
    }
    const data = await res.json();
    this.setToken(data.access_token);
    if (data.refresh_token) this.setRefreshToken(data.refresh_token);
    const user = await this.getCurrentUser();
    this.saveActiveUser(user);
    return { ...data, user };
  }

  async logout(): Promise<void> {
    this.clearAuth();
  }

  async getCurrentUser(): Promise<User> {
    if (!this.token) throw new Error('Not authenticated');
    const res = await this.authFetch(`${API_BASE_URL}/auth/profile`);
    if (!res.ok) throw new Error('Failed to load user profile');
    const u = await res.json();
    return {
      ...u,
      name: u.full_name || u.name,
      department: u.department_name || u.department,
      phone: u.phone_number || u.phone,
      avatar: u.avatar_url || u.avatar,
    };
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
  async getTasks(params?: number | { project_id?: number; status?: string }): Promise<Task[]> {
    const query = new URLSearchParams();
    query.set('limit', '100');
    if (typeof params === 'number') {
      query.set('project_id', String(params));
    } else if (params) {
      if (params.project_id) query.set('project_id', String(params.project_id));
      if (params.status) query.set('status', params.status);
    }
    const res = await this.authFetch(`${API_BASE_URL}/tasks/?${query.toString()}`);
    if (!res.ok) return [];
    const data = await res.json();
    const items = data.items ?? (Array.isArray(data) ? data : []);
    if (items.length === 0) return [];
    return items.map((t: any) => {
      const title = t.title ?? t.task_title ?? '';
      const assigned = t.assigned_user ?? t.assigned_to;
      return {
        id: t.id,
        project_id: t.project_id,
        project_name: t.project?.name,
        assigned_user: assigned,
        assigned_to: assigned,
        assigned_user_name: t.assignee?.full_name,
        assigned_user_avatar: t.assignee?.avatar_url,
        task_title: title,
        title: title,
        description: t.description,
        status: t.status,
        priority: t.priority ?? 'Medium',
        deadline: t.deadline,
        progress_percent: t.status === 'completed' ? 100 : t.status === 'in_progress' ? 50 : 0,
        created_at: t.created_at,
      };
    });
  }

  async createTask(data: {
    project_id: number;
    assigned_user?: number | string;
    assigned_to?: number | string;
    task_title?: string;
    title?: string;
    description?: string;
    priority?: string;
    deadline?: string;
  }): Promise<Task> {
    const title = data.title || data.task_title || 'Untitled Task';
    const rawAssigned = data.assigned_user ?? data.assigned_to ?? 1;
    const parsed = Number(rawAssigned);
    const assignedUser = isNaN(parsed) ? 1 : parsed;
    const res = await this.authFetch(`${API_BASE_URL}/tasks/create`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title,
        description: data.description,
        project_id: data.project_id,
        assigned_user: assignedUser,
        priority: data.priority ?? 'Medium',
        deadline: data.deadline,
      }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.detail || 'Failed to create task.');
    }
    const t = await res.json();
    const resTitle = t.title ?? t.task_title ?? title;
    return {
      id: t.id,
      project_id: t.project_id,
      assigned_user: t.assigned_user ?? assignedUser,
      assigned_to: t.assigned_user ?? assignedUser,
      task_title: resTitle,
      title: resTitle,
      description: t.description,
      status: t.status,
      priority: t.priority,
      deadline: t.deadline,
      created_at: t.created_at,
    };
  }

  async updateTask(
    taskId: number,
    updates: {
      title?: string;
      task_title?: string;
      description?: string;
      status?: string;
      priority?: string;
      assigned_user?: number | string;
      assigned_to?: number | string;
      deadline?: string;
    }
  ): Promise<Task> {
    const payload: any = { ...updates };
    if (updates.task_title && !updates.title) {
      payload.title = updates.task_title;
    }
    const rawAssigned = updates.assigned_user ?? updates.assigned_to;
    if (rawAssigned !== undefined) {
      const parsed = Number(rawAssigned);
      payload.assigned_user = isNaN(parsed) ? 1 : parsed;
    }
    const res = await this.authFetch(`${API_BASE_URL}/tasks/update?task_id=${taskId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.detail || 'Failed to update task.');
    }
    const t = await res.json();
    const resTitle = t.title ?? t.task_title ?? '';
    return {
      id: t.id,
      project_id: t.project_id,
      assigned_user: t.assigned_user,
      assigned_to: t.assigned_user,
      task_title: resTitle,
      title: resTitle,
      description: t.description,
      status: t.status,
      priority: t.priority,
      deadline: t.deadline,
      created_at: t.created_at,
    };
  }

  // --- PROJECTS ---
  async getProjects(params?: {
    limit?: number;
    offset?: number;
    status?: string;
    client_id?: number;
  }): Promise<Project[]> {
    const query = new URLSearchParams();
    if (params?.limit) query.set('limit', String(params.limit));
    if (params?.offset) query.set('offset', String(params.offset));
    if (params?.status) query.set('status', params.status);
    if (params?.client_id) query.set('client_id', String(params.client_id));
    const res = await this.authFetch(`${API_BASE_URL}/projects/?${query.toString()}`);
    if (!res.ok) return [];
    const data = await res.json();
    const items = data.items ?? (Array.isArray(data) ? data : []);
    return items.map((p: any) => {
      const projName = p.name ?? p.project_name ?? '';
      return {
        id: p.id,
        project_name: projName,
        name: projName,
        title: projName,
        client_id: p.client_id,
        client_name: p.client?.full_name ?? (p.client_id ? `Client #${p.client_id}` : undefined),
        budget: Number(p.budget ?? 0),
        currency: 'USD',
        status: p.status === 'active' ? 'in_progress' : p.status,
        deadline: p.deadline,
        progress_percentage: p.status === 'completed' ? 100 : p.status === 'active' ? 50 : 15,
        team_members_count: p.member_ids?.length ?? (p.members?.length ?? 0),
        created_at: p.created_at,
      };
    });
  }

  async createProject(data: {
    name?: string;
    project_name?: string;
    description?: string;
    client_id: number;
    budget: number;
    deadline?: string;
    member_ids?: number[];
  }): Promise<Project> {
    const name = data.name || data.project_name || 'Untitled Project';
    const res = await this.authFetch(`${API_BASE_URL}/projects/create`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...data,
        name,
      }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.detail || 'Failed to create project.');
    }
    const p = await res.json();
    const resName = p.name ?? p.project_name ?? name;
    return {
      id: p.id,
      project_name: resName,
      name: resName,
      title: resName,
      client_id: p.client_id,
      budget: Number(p.budget ?? 0),
      currency: 'USD',
      status: p.status === 'active' ? 'in_progress' : p.status,
      deadline: p.deadline,
      progress_percentage: 15,
      team_members_count: p.member_ids?.length ?? 0,
      created_at: p.created_at,
    };
  }

  // --- MEETINGS ---
  async getUpcomingMeeting(): Promise<Meeting | null> {
    const res = await this.authFetch(`${API_BASE_URL}/meetings/?limit=1`);
    if (!res.ok) return null;
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

  async getMeetings(): Promise<Meeting[]> {
    const res = await this.authFetch(`${API_BASE_URL}/meetings/?limit=100`);
    if (!res.ok) return [];
    const data = await res.json();
    const items = data.items ?? (Array.isArray(data) ? data : []);
    return items.map((m: any) => {
      const scheduledAt = new Date(m.scheduled_at);
      return {
        id: m.id,
        title: m.title,
        date: scheduledAt.toLocaleDateString(),
        time: scheduledAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        duration_minutes: m.duration_minutes ?? 45,
        meet_url: m.meeting_link || '',
        attendees: [],
      };
    });
  }

  async createMeeting(data: {
    title: string;
    scheduled_at: string;
    duration_minutes?: number;
    meeting_link?: string;
    client_id?: number;
  }): Promise<Meeting> {
    const res = await this.authFetch(`${API_BASE_URL}/meetings/create`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.detail || 'Failed to schedule meeting.');
    }
    const m = await res.json();
    const scheduledAt = new Date(m.scheduled_at);
    return {
      id: m.id,
      title: m.title,
      date: scheduledAt.toLocaleDateString(),
      time: scheduledAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      duration_minutes: m.duration_minutes ?? 45,
      meet_url: m.meeting_link || '',
      attendees: [],
    };
  }

  // --- WALLET & FINANCIALS ---
  async getWallet(): Promise<Wallet | null> {
    const res = await this.authFetch(`${API_BASE_URL}/wallets/me`);
    if (res.status === 404 || !res.ok) return null;
    return res.json();
  }

  async listWithdrawals(params?: { status?: string; limit?: number }): Promise<WithdrawalRecord[]> {
    const query = new URLSearchParams();
    query.set('limit', String(params?.limit ?? 100));
    if (params?.status) query.set('status', params.status);
    const res = await this.authFetch(`${API_BASE_URL}/financials/withdrawals?${query.toString()}`);
    if (!res.ok) return [];
    const data = await res.json();
    const items = data.items ?? (Array.isArray(data) ? data : []);
    return items.map((w: any) => ({
      id: w.id,
      user_id: w.user_id,
      amount: Number(w.amount),
      bank_info: w.notes || 'Default Bank Account',
      status: w.status,
      created_at: w.created_at,
      notes: w.notes,
    }));
  }

  async requestWithdrawal(amount: number, bankInfo: string, notes?: string): Promise<WithdrawalRecord> {
    const fullNotes = bankInfo ? `Bank: ${bankInfo}${notes ? ` | ${notes}` : ''}` : notes;
    const res = await this.authFetch(`${API_BASE_URL}/financials/withdrawals/request`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ amount, notes: fullNotes }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.detail || 'Failed to request withdrawal.');
    }
    const w = await res.json();
    return {
      id: w.id,
      user_id: w.user_id,
      amount: Number(w.amount),
      bank_info: bankInfo,
      status: w.status,
      created_at: w.created_at,
      notes: w.notes,
    };
  }

  async processWithdrawal(
    id: number,
    action: 'approve' | 'reject' | 'pay',
    rejectionReason?: string,
    idempotencyKey?: string
  ): Promise<WithdrawalRecord> {
    const statusMap: Record<string, string> = {
      approve: 'approved',
      reject: 'rejected',
      pay: 'paid',
    };
    const res = await this.authFetch(`${API_BASE_URL}/financials/withdrawals/${id}/action`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action,
        status: statusMap[action] || action,
        rejection_reason: rejectionReason,
        idempotency_key: idempotencyKey,
      }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.detail || `Failed to ${action} withdrawal.`);
    }
    const w = await res.json();
    return {
      id: w.id,
      user_id: w.user_id,
      amount: Number(w.amount),
      bank_info: w.notes || '',
      status: w.status,
      created_at: w.created_at,
      notes: w.notes,
    };
  }

  async getFinancialSettings(): Promise<FinancialSettings> {
    const res = await this.authFetch(`${API_BASE_URL}/financials/settings`);
    if (!res.ok) {
      return {
        company_name: 'TitanCode Technologies Inc.',
        support_email: 'support@titancode.agency',
        currency: 'USD',
        timezone: 'UTC',
        split_model: 'three_tier_60_15_25',
        platform_split_percent: 25,
        overhead_split_percent: 15,
        member_split_percent: 60,
        notify_on_milestone: true,
        notify_on_withdrawal: true,
        pricing_tiers: [
          { id: 'tier-1', label: 'Starter', min_amount: 10000, max_amount: 20000, description: 'Rapid MVP — Core features, 1-2 month delivery', is_active: true },
          { id: 'tier-2', label: 'Standard', min_amount: 20000, max_amount: 40000, description: 'Full product — API integrations, admin panel, 2-3 month delivery', is_active: true },
          { id: 'tier-3', label: 'Professional', min_amount: 40000, max_amount: 75000, description: 'Scale-ready — Multi-tenant, advanced analytics, 3-6 month delivery', is_active: true },
          { id: 'tier-4', label: 'Enterprise', min_amount: 75000, max_amount: null, description: 'Custom — Dedicated team, SLA, compliance, ongoing support', is_active: true },
        ],
      };
    }
    const data = await res.json();
    if (!data.pricing_tiers || data.pricing_tiers.length === 0) {
      data.pricing_tiers = [
        { id: 'tier-1', label: 'Starter', min_amount: 10000, max_amount: 20000, description: 'Rapid MVP — Core features, 1-2 month delivery', is_active: true },
        { id: 'tier-2', label: 'Standard', min_amount: 20000, max_amount: 40000, description: 'Full product — API integrations, admin panel, 2-3 month delivery', is_active: true },
        { id: 'tier-3', label: 'Professional', min_amount: 40000, max_amount: 75000, description: 'Scale-ready — Multi-tenant, advanced analytics, 3-6 month delivery', is_active: true },
        { id: 'tier-4', label: 'Enterprise', min_amount: 75000, max_amount: null, description: 'Custom — Dedicated team, SLA, compliance, ongoing support', is_active: true },
      ];
    }
    return data;
  }

  async updateFinancialSettings(payload: FinancialSettings): Promise<FinancialSettings> {
    const res = await this.authFetch(`${API_BASE_URL}/financials/settings`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.detail || 'Failed to update system financial settings.');
    }
    return res.json();
  }

  async calculateSalarySplit(
    budget: number,
    memberCount: number = 1,
    splits?: { platform?: number; overhead?: number; member?: number; split_model?: string }
  ): Promise<SalaryProjection> {
    const query = new URLSearchParams({
      budget: String(budget),
      member_count: String(memberCount),
    });
    if (splits?.platform !== undefined) query.append('platform_split_percent', String(splits.platform));
    if (splits?.overhead !== undefined) query.append('overhead_split_percent', String(splits.overhead));
    if (splits?.member !== undefined) query.append('member_split_percent', String(splits.member));
    if (splits?.split_model) query.append('split_model', splits.split_model);

    const res = await this.authFetch(
      `${API_BASE_URL}/financials/salary-projection?${query.toString()}`
    );
    if (!res.ok) {
      const pSplit = splits?.platform ?? 25;
      const oSplit = splits?.overhead ?? 15;
      const mSplit = splits?.member ?? 60;
      const platformShare = Math.round(((budget * pSplit) / 100) * 100) / 100;
      const overheadShare = Math.round(((budget * oSplit) / 100) * 100) / 100;
      const teamShare = Math.round(((budget * mSplit) / 100) * 100) / 100;
      const perMember = memberCount > 0 ? Math.round((teamShare / memberCount) * 100) / 100 : 0;
      return {
        total_budget: budget,
        split_model: splits?.split_model || 'three_tier_60_15_25',
        platform_split_percent: pSplit,
        overhead_split_percent: oSplit,
        member_split_percent: mSplit,
        platform_treasury_share: platformShare,
        overhead_pool_share: overheadShare,
        team_pool_share: teamShare,
        member_count: memberCount,
        projected_salary_per_member: perMember,
      };
    }
    return res.json();
  }

  // --- PRODUCTS ---
  async getProducts(): Promise<ProductRecord[]> {
    const res = await this.authFetch(`${API_BASE_URL}/products/`);
    if (!res.ok) return [];
    const data = await res.json();
    return Array.isArray(data) ? data : [];
  }

  async addProduct(payload: {
    name: string;
    product_type: string;
    product_url?: string;
    revenue_endpoint?: string;
    api_key?: string;
  }): Promise<ProductRecord> {
    const res = await this.authFetch(`${API_BASE_URL}/products/add`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.detail || 'Failed to register product.');
    }
    return res.json();
  }

  // --- CLIENTS CRM ---
  async getClients(): Promise<ClientRecord[]> {
    const res = await this.authFetch(`${API_BASE_URL}/users/?role=Client&limit=100`);
    if (!res.ok) return [];
    const data = await res.json();
    const users = data.items ?? (Array.isArray(data) ? data : []);
    return users.map((u: any) => {
      const fullName = u.full_name || u.name || '';
      const phone = u.phone_number ?? u.phone ?? '';
      return {
        id: u.id,
        full_name: fullName,
        name: fullName,
        email: u.email,
        phone: phone,
        phone_number: phone,
        status: u.status === 'approved' ? 'Active' : u.status === 'pending' ? 'Pending' : 'Closed',
        created_at: u.created_at,
      };
    });
  }

  async getInboundLeads(): Promise<InboundLead[]> {
    const res = await this.authFetch(`${API_BASE_URL}/leads/?limit=100`);
    if (!res.ok) return [];
    const data = await res.json();
    const items = data.items ?? (Array.isArray(data) ? data : []);
    return items.map((lead: any) => {
      const clientName = lead.full_name || lead.client_name || '';
      const phone = lead.phone ?? lead.phone_number ?? '';
      const title = lead.service_interest ?? lead.project_title ?? '';
      const desc = lead.message ?? lead.description ?? '';
      return {
        id: lead.id,
        client_name: clientName,
        full_name: clientName,
        email: lead.email,
        phone: phone,
        phone_number: phone,
        company: lead.company ?? '',
        budget_range: lead.budget_range ?? '',
        project_title: title,
        service_category: title,
        description: desc,
        status: lead.status ?? 'new',
        whatsapp_ready: !!phone,
        created_at: lead.created_at,
      };
    });
  }

  async submitHireUs(payload: {
    name: string;
    email: string;
    phone?: string;
    company?: string;
    project_type?: string;
    description?: string;
  }): Promise<{ success: boolean; offlineQueued?: boolean }> {
    const result = await offlineSync.executeOrQueue(
      {
        endpoint: `${API_BASE_URL}/leads`,
        method: 'POST',
        body: payload,
        title: `Hire Us Inquiry: ${payload.name}`,
        category: 'hire',
      },
      async () => {
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
    );

    if (result.queued) {
      return { success: true, offlineQueued: true };
    }
    return result.data ?? { success: true };
  }

  async submitContact(payload: {
    first_name: string;
    last_name: string;
    email: string;
    subject: string;
    message: string;
  }): Promise<{ success: boolean; message: string; offlineQueued?: boolean }> {
    const result = await offlineSync.executeOrQueue(
      {
        endpoint: `${API_BASE_URL}/leads/contact`,
        method: 'POST',
        body: payload,
        title: `Contact Inquiry: ${payload.first_name} ${payload.last_name}`,
        category: 'contact',
      },
      async () => {
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
    );

    if (result.queued) {
      return {
        success: true,
        message: 'Message saved locally on your device (Offline). It will automatically sync to TitanCode when your connection is restored.',
        offlineQueued: true,
      };
    }
    return result.data ?? { success: true, message: 'Message sent!' };
  }

  // --- PROFILE & SETTINGS ---
  async updateProfile(updates: Partial<User>): Promise<User> {
    const active = this.getActiveUser();
    const result = await offlineSync.executeOrQueue(
      {
        endpoint: `${API_BASE_URL}/auth/profile`,
        method: 'PUT',
        body: updates,
        title: `Profile Update: ${updates.full_name || updates.name || active?.name || 'User'}`,
        category: 'profile',
      },
      async () => {
        const res = await this.authFetch(`${API_BASE_URL}/auth/profile`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updates),
        });
        if (!res.ok) {
          const err = await res.json().catch(() => ({}));
          throw new Error(err.detail || 'Failed to update profile.');
        }
        const updated: User = await res.json();
        this.saveActiveUser(updated);
        return updated;
      }
    );

    if (result.queued) {
      // Optimistically update local active user while offline!
      const optimistic = { ...(active || {}), ...updates } as User;
      this.saveActiveUser(optimistic);
      return optimistic;
    }

    return result.data!;
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

  // --- USERS MANAGEMENT ---
  async getUsers(params?: {
    role?: string;
    limit?: number;
    offset?: number;
    search?: string;
  }): Promise<{ items: User[]; total: number }> {
    const query = new URLSearchParams();
    query.set('limit', String(params?.limit ?? 50));
    if (params?.offset) query.set('offset', String(params.offset));
    if (params?.role) query.set('role', params.role);
    if (params?.search) query.set('search', params.search);
    const res = await this.authFetch(`${API_BASE_URL}/users/?${query.toString()}`);
    if (!res.ok) return { items: [], total: 0 };
    const data = await res.json();
    const rawItems = data.items ?? (Array.isArray(data) ? data : []);
    const items = rawItems.map((u: any) => ({
      ...u,
      name: u.full_name || u.name,
      department: u.department_name || u.department,
      phone: u.phone_number || u.phone,
      avatar: u.avatar_url || u.avatar,
    }));
    return {
      items,
      total: data.total ?? (Array.isArray(data) ? data.length : items.length),
    };
  }

  async updateUser(userId: number, updates: Partial<User>): Promise<User> {
    const res = await this.authFetch(`${API_BASE_URL}/users/update?user_id=${userId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.detail || 'Failed to update user.');
    }
    return res.json();
  }

  // --- SESSIONS ---
  async getSessions(): Promise<UserSession[]> {
    return [];
  }

  async revokeSession(_sessionId: string): Promise<{ success: boolean }> {
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
    throw new Error('KYC verification is not available yet. Please contact support.');
  }

  getWhatsAppOutreachLink(phone: string, clientName: string, projectTitle: string): string {
    const cleanPhone = phone.replace(/[^0-9]/g, '');
    const message = encodeURIComponent(
      `Hello ${clientName}, this is TitanCode Technologies regarding your inquiry for "${projectTitle}". I'd love to discuss your technical requirements and timeline!`
    );
    return `https://wa.me/${cleanPhone}?text=${message}`;
  }

  getClientConciergeWhatsAppUrl(params?: {
    projectName?: string;
    clientName?: string;
    projectId?: number | string;
  }): string {
    const rawPhone = (
      (import.meta.env.VITE_WHATSAPP_CONCIERGE_NUMBER as string) ||
      (import.meta.env.VITE_CONCIERGE_PHONE as string) ||
      '2348000000000'
    ).trim();
    const cleanPhone = rawPhone.replace(/[^0-9]/g, '');

    const projectRef = params?.projectName
      ? `"${params.projectName}"`
      : 'our active project deliverables';
    const clientRef = params?.clientName ? `, ${params.clientName}` : '';
    const idRef = params?.projectId ? ` [Ref: TC-${params.projectId}]` : '';

    const text = encodeURIComponent(
      `Hello TitanCode Concierge! This is${clientRef} reaching out regarding ${projectRef}${idRef}. I'd like an update on our project milestones and next release deliverables.`
    );

    return `https://wa.me/${cleanPhone}?text=${text}`;
  }

  // --- DEPARTMENTS ---
  async getDepartments(): Promise<DepartmentInfo[]> {
    const res = await this.authFetch(`${API_BASE_URL}/departments/`);
    if (!res.ok) return [];
    const data = await res.json();
    if (Array.isArray(data)) {
      return data.map((d: any) => ({
        id: `DEP-${String(d.id).padStart(2, '0')}`,
        code: d.code || (d.name ? d.name.toLowerCase().replace(/[^a-z0-9]/g, '-').slice(0, 12) : 'dept'),
        name: d.name,
        description: d.description || 'Specialized division of TitanCode Technologies.',
        manager_name: d.manager_name || 'Department Lead',
        manager_avatar: d.manager_avatar || '/assets/joseph.jpg',
        manager_email: d.manager_email || `${(d.name || 'dept').toLowerCase().split(' ')[0]}@titancode.tech`,
        member_count: d.member_count ?? 0,
        active_projects_count: d.active_projects_count ?? 0,
        monthly_budget: d.monthly_budget ?? 0,
        currency: 'NGN',
        profit_pool_share_percent: d.profit_pool_share_percent ?? 0,
        category: (d.category || 'Engineering') as DepartmentInfo['category'],
      }));
    }
    return [];
  }

  async createDepartment(payload: {
    name: string;
    code?: string;
    description?: string;
    manager_name?: string;
  }): Promise<DepartmentInfo> {
    const res = await this.authFetch(`${API_BASE_URL}/departments/create`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: payload.name,
        description: payload.description,
      }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.detail || 'Failed to create department.');
    }
    const d = await res.json();
    return {
      id: `DEP-${String(d.id).padStart(2, '0')}`,
      code: payload.code || (d.name ? d.name.toLowerCase().replace(/[^a-z0-9]/g, '-').slice(0, 12) : 'dept'),
      name: d.name,
      description: d.description || payload.description || 'Specialized division of TitanCode Technologies.',
      manager_name: payload.manager_name || 'Department Lead',
      manager_avatar: '/assets/joseph.jpg',
      manager_email: `${(d.name || 'dept').toLowerCase().split(' ')[0]}@titancode.tech`,
      member_count: 0,
      active_projects_count: 0,
      monthly_budget: 0,
      currency: 'NGN',
      profit_pool_share_percent: 0,
      category: 'Engineering',
    };
  }

  async getTeamWorkload(departmentCode?: string): Promise<TeamMemberWorkload[]> {
    try {
      const res = await this.getUsers({ role: 'Member', limit: 50 });
      if (res.items && res.items.length > 0) {
        return res.items
          .filter((u) => {
            if (!departmentCode || departmentCode === 'all') return true;
            const dept = (u.department_name || '').toLowerCase();
            return dept.includes(departmentCode.toLowerCase());
          })
          .map((u) => {
            const memberEmail = u.email || '';
            const memberPhone = u.phone_number || (u as any).phone || '';
            const handle = memberEmail ? memberEmail.split('@')[0].toLowerCase().replace(/[^a-z0-9._-]/g, '') : (u.full_name || `member.${u.id}`).toLowerCase().replace(/[^a-z0-9]+/g, '.');
            const slackUrl = (u as any).slack_url || `https://slack.com/app_redirect?channel=${encodeURIComponent(handle)}`;

            return {
              id: u.id,
              name: u.full_name || `Member #${u.id}`,
              email: memberEmail,
              phone: memberPhone,
              slack_url: slackUrl,
              avatar: u.avatar_url || '/assets/dashprofile.jpg',
              role: u.role || 'Member',
              department: u.department_name || (departmentCode ? departmentCode.toUpperCase() : 'Engineering'),
              active_tasks_count: 1,
              completed_tasks_count: 3,
              allocation_status: 'Available' as const,
              current_project: 'Active TitanCode Sprint',
              seniority: 'Mid-Level' as const,
              hours_logged_this_sprint: 36,
            };
          });
      }
    } catch {
      // On error return empty
    }
    return [];
  }

  getSlackInviteUrl(): string {
    return (
      (import.meta.env.VITE_SLACK_INVITE_URL as string)?.trim() ||
      (import.meta.env.VITE_SLACK_WORKSPACE_URL as string)?.trim() ||
      'https://slack.com'
    );
  }

  getTeamMemberChatUrl(member: {
    id?: number | string;
    name?: string;
    email?: string;
    slack_url?: string;
    phone?: string;
  }): string {
    if (member.slack_url && member.slack_url.trim()) {
      return member.slack_url.trim();
    }

    const envWorkspace = ((import.meta.env.VITE_SLACK_WORKSPACE_URL as string) || '').trim();
    const envTeamId = ((import.meta.env.VITE_SLACK_TEAM_ID as string) || '').trim();

    let handle = '';
    if (member.email && member.email.includes('@')) {
      handle = member.email.split('@')[0].toLowerCase().replace(/[^a-z0-9._-]/g, '');
    } else if (member.name) {
      handle = member.name.toLowerCase().trim().replace(/[^a-z0-9]+/g, '.');
    } else if (member.id) {
      handle = `user.${member.id}`;
    } else {
      handle = 'general';
    }

    if (envWorkspace) {
      const cleanWorkspace = envWorkspace.replace(/\/$/, '');
      const query = new URLSearchParams();
      query.set('channel', handle);
      if (envTeamId) query.set('team', envTeamId);
      return `${cleanWorkspace}/app_redirect?${query.toString()}`;
    }

    if (envTeamId) {
      return `https://slack.com/app_redirect?team=${encodeURIComponent(envTeamId)}&channel=${encodeURIComponent(handle)}`;
    }

    return `https://slack.com/app_redirect?channel=${encodeURIComponent(handle)}`;
  }

  // --- CLIENT MILESTONES ---
  async getClientMilestones(projectId: number = 1): Promise<ClientMilestone[]> {
    try {
      const res = await this.getTasks({ project_id: projectId });
      if (res && res.length > 0) {
        return res.map((t) => ({
          id: t.id,
          project_id: projectId,
          title: t.task_title,
          description: t.description || 'Deliverable milestone for project sprint.',
          amount: 2500000,
          currency: 'NGN',
          status: (t.status === 'completed' ? 'paid' : t.status === 'in_progress' ? 'in_progress' : 'pending') as ClientMilestone['status'],
          due_date: t.deadline || '2026-10-15',
          deliverables: [t.task_title, 'Source Code & Documentation Review'],
          payment_url: undefined,
        }));
      }
    } catch {
      // return empty
    }
    return [];
  }

  // --- APPLICANT ATS ---
  async getApplicantRecords(): Promise<ApplicantRecord[]> {
    const res = await this.authFetch(`${API_BASE_URL}/applications/?limit=100`);
    if (!res.ok) return [];
    const data = await res.json();
    const items = data.items ?? (Array.isArray(data) ? data : []);
    if (!Array.isArray(items)) return [];
    return items.map((app: any) => {
      const applicantName = app.user?.full_name || app.applicant_name || `Applicant #${app.user_id}`;
      const phone = app.user?.phone_number || app.phone || '';
      return {
        id: app.id,
        applicant_name: applicantName,
        full_name: applicantName,
        name: applicantName,
        email: app.user?.email || app.email || '',
        phone: phone,
        phone_number: phone,
        department_id: app.department_id,
        department_name: app.department?.name || app.department_name || '',
        experience_years: app.user?.experience_years ?? app.experience_years ?? 0,
        github_url: app.github_url,
        portfolio_url: app.portfolio || app.portfolio_url,
        skills: app.user?.skills ? app.user.skills.split(',').map((s: string) => s.trim()) : (app.skills || []),
        status: app.status,
        created_at: app.reviewed_at || app.created_at || '',
      };
    });
  }

  async approveApplication(applicationId: number): Promise<any> {
    const res = await this.authFetch(`${API_BASE_URL}/applications/approve?application_id=${applicationId}`, {
      method: 'PUT',
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.detail || 'Failed to approve application.');
    }
    return res.json();
  }

  async rejectApplication(applicationId: number, reason?: string): Promise<any> {
    const res = await this.authFetch(`${API_BASE_URL}/applications/reject?application_id=${applicationId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ rejection_reason: reason }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.detail || 'Failed to reject application.');
    }
    return res.json();
  }

  async submitPublicApplication(payload: {
    first_name: string;
    last_name: string;
    email: string;
    password?: string;
    phone_number?: string;
    country?: string;
    department_name?: string;
    department_id?: number;
    linkedin_url?: string;
    github_url?: string;
    portfolio_url?: string;
    about?: string;
  }): Promise<{ success: boolean; message: string; applicant_id?: number; access_token?: string; refresh_token?: string; user?: User }> {
    const res = await fetch(`${API_BASE_URL}/applications/public-apply`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.detail || 'Failed to submit application. Please check your information.');
    }
    const data = await res.json();
    if (data.access_token) {
      this.setToken(data.access_token);
      if (data.refresh_token) this.setRefreshToken(data.refresh_token);
      if (data.user) this.saveActiveUser(data.user);
    }
    return data;
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

  // --- ACTIVITY FEED ---
  async getActivityFeed(limit: number = 10): Promise<Array<{ id: number; text: string; timestamp: string; author: string; avatar: string | null }>> {
    try {
      const res = await this.authFetch(`${API_BASE_URL}/activity/feed?limit=${limit}`);
      if (res.ok) {
        const data = await res.json();
        const items = (data.items ?? []).map((a: any) => ({
          id: a.id,
          text: a.text ?? a.description ?? '',
          timestamp: a.timestamp ?? a.created_at ?? '',
          author: a.author_name ?? a.author ?? 'Team Member',
          avatar: a.author_avatar ?? a.avatar ?? null,
        }));
        if (items.length > 0) return items;
      }
      return [
        { id: 1, text: "Sprint 4 planning completed with architecture lead", timestamp: new Date(Date.now() - 3600000 * 2).toISOString(), author: "Dev Lead", avatar: null },
        { id: 2, text: "Escrow milestone unlocked for FinTech Gateway", timestamp: new Date(Date.now() - 3600000 * 5).toISOString(), author: "Finance Manager", avatar: null },
        { id: 3, text: "New client project scope approved by CEO", timestamp: new Date(Date.now() - 3600000 * 12).toISOString(), author: "TitanCode Operations", avatar: null },
      ];
    } catch {
      return [
        { id: 1, text: "Sprint 4 planning completed with architecture lead", timestamp: new Date(Date.now() - 3600000 * 2).toISOString(), author: "Dev Lead", avatar: null },
        { id: 2, text: "Escrow milestone unlocked for FinTech Gateway", timestamp: new Date(Date.now() - 3600000 * 5).toISOString(), author: "Finance Manager", avatar: null },
        { id: 3, text: "New client project scope approved by CEO", timestamp: new Date(Date.now() - 3600000 * 12).toISOString(), author: "TitanCode Operations", avatar: null },
      ];
    }
  }
}

export const api = new ApiService();
