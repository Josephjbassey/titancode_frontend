import React, { useState, useEffect } from 'react';
import {
  Building2,
  Users,
  CheckSquare,
  Clock,
  Plus,
  X,
  Send,
  FileCheck,
  Award,
  ChevronDown,
  Sparkles,
  ExternalLink,
  MessageSquare,
  Loader2,
} from 'lucide-react';
import { api } from '../services/api';
import type { DepartmentInfo, TeamMemberWorkload, TaskPriority, Project, ApplicantRecord } from '../types';
import type { ScreenId } from '../App';

interface ManagerDashboardViewProps {
  onNavigate?: (view: ScreenId) => void;
  initialDepartmentCode?: string;
}

export const ManagerDashboardView: React.FC<ManagerDashboardViewProps> = ({
  onNavigate,
  initialDepartmentCode = 'frontend',
}) => {
  const [departments, setDepartments] = useState<DepartmentInfo[]>([]);
  const [selectedDeptCode, setSelectedDeptCode] = useState<string>(initialDepartmentCode);
  const [roster, setRoster] = useState<TeamMemberWorkload[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [applicants, setApplicants] = useState<ApplicantRecord[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Task Dispatcher Modal
  const [showDispatchModal, setShowDispatchModal] = useState(false);
  const [taskTitle, setTaskTitle] = useState('');
  const [taskPriority, setTaskPriority] = useState<TaskPriority>('Medium');
  const [taskAssignee, setTaskAssignee] = useState('');
  const [taskDeadline, setTaskDeadline] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 14);
    return d.toISOString().split('T')[0];
  });
  const [taskDescription, setTaskDescription] = useState('');
  const [isDispatching, setIsDispatching] = useState(false);
  const [dispatchSuccess, setDispatchSuccess] = useState(false);

  // Deliverables sign-off state
  const [signedDeliverables, setSignedDeliverables] = useState<Record<string, boolean>>({});

  useEffect(() => {
    let mounted = true;
    setIsLoading(true);

    async function loadData() {
      try {
        const [depts, members, projs, appRecords] = await Promise.all([
          api.getDepartments().catch(() => []),
          api.getTeamWorkload(selectedDeptCode).catch(() => []),
          api.getProjects().catch(() => []),
          api.getApplicantRecords().catch(() => []),
        ]);
        if (!mounted) return;
        setDepartments(depts);
        setRoster(members);
        setProjects(projs);
        setApplicants(appRecords);
      } finally {
        if (mounted) setIsLoading(false);
      }
    }
    loadData();
    return () => {
      mounted = false;
    };
  }, [selectedDeptCode]);

  const currentDept: DepartmentInfo =
    departments.find((d) => d.code === selectedDeptCode) ||
    departments[0] || {
      id: 'DEP-01',
      code: selectedDeptCode,
      name: 'Engineering',
      description: 'Departmental management and agile execution overview.',
      manager_name: 'Lead Engineer',
      manager_avatar: null,
      manager_email: 'engineering@titancode.tech',
      member_count: 0,
      active_projects_count: 0,
      monthly_budget: 0,
      currency: 'USD',
      profit_pool_share_percent: 10,
      category: 'Engineering',
    };

  // Filter roster for this department
  const currentRoster = roster.filter(
    (m) =>
      m.department.toLowerCase().includes(currentDept.name.toLowerCase().split(' ')[0]) ||
      m.department.toLowerCase().includes(currentDept.code.toLowerCase())
  );
  const displayRoster = currentRoster.length > 0 ? currentRoster : roster;

  // Dynamic capacity & sprint metrics
  const activeSprintTasksCount =
    displayRoster.reduce((sum, m) => sum + (m.active_tasks_count || 0), 0) ||
    currentDept.active_projects_count * 4 + 7;
  const availableStaff = displayRoster.filter((m) => m.allocation_status === 'Available').length;
  const totalStaff = displayRoster.length || currentDept.member_count;
  const allocationPct = totalStaff > 0 ? Math.round(((totalStaff - availableStaff) / totalStaff) * 100) : 85;

  const formattedBudget =
    currentDept.monthly_budget >= 1000000
      ? `$${(currentDept.monthly_budget / 1000000).toFixed(1)}M`
      : `$${(currentDept.monthly_budget / 1000).toFixed(0)}k`;

  // Filter applicants for current department or top pending
  const deptApplicants = applicants.filter(
    (a) =>
      a.department_id === Number(currentDept.id) ||
      a.department_name?.toLowerCase().includes(currentDept.name.toLowerCase().split(' ')[0])
  );
  const displayApplicants = deptApplicants.length > 0 ? deptApplicants.slice(0, 3) : applicants.slice(0, 3);

  const handleDispatchTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!taskTitle.trim() || !taskAssignee || isDispatching) return;

    setIsDispatching(true);
    try {
      const selectedMember = roster.find((m) => m.name === taskAssignee || String(m.id) === taskAssignee);
      const assignedUserId = selectedMember ? Number(selectedMember.id) : 1;
      const projectId = projects[0]?.id || 1;

      await api.createTask({
        project_id: projectId,
        assigned_user: isNaN(assignedUserId) ? 1 : assignedUserId,
        task_title: taskTitle.trim(),
        description: taskDescription.trim() || undefined,
        priority: taskPriority,
        deadline: taskDeadline,
      });

      setDispatchSuccess(true);
      setTimeout(() => {
        setDispatchSuccess(false);
        setShowDispatchModal(false);
        setTaskTitle('');
        setTaskDescription('');
      }, 1000);
    } catch (err: any) {
      alert(err.message || 'Failed to dispatch task to server.');
    } finally {
      setIsDispatching(false);
    }
  };

  const toggleDeliverableSignOff = (delivId: string) => {
    setSignedDeliverables((prev) => ({
      ...prev,
      [delivId]: !prev[delivId],
    }));
  };

  const categories = ['All', 'Engineering', 'Product', 'Growth', 'Operations', 'Finance'];

  const filteredDepartments =
    selectedCategory === 'All'
      ? departments
      : departments.filter((d) => d.category === selectedCategory);

  return (
    <div className="tc-fade-in tc-view-wrapper">
      {/* 1. TOP HEADER & DEPARTMENT SELECTOR */}
      <div className="tc-page-header">
        <div>
          <div className="tc-flex-wrap-gap tc-mb-1">
            <span className="tc-dept-badge">
              <Building2 size={13} />
              Department Head Hub
            </span>
            <span className="tc-dept-category-pill">
              {currentDept.category}
            </span>
          </div>
          <h1 className="tc-page-title">
            {currentDept.name} Dashboard
          </h1>
          <p className="tc-page-subtitle">
            {currentDept.description}
          </p>
        </div>

        {/* Action Controls */}
        <div className="tc-header-actions">
          {/* Category Filter */}
          <div className="tc-category-bar">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`tc-category-btn ${selectedCategory === cat ? 'tc-category-btn--active' : ''}`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Department Switcher Dropdown */}
          <div className="tc-select-wrapper">
            <select
              value={selectedDeptCode}
              onChange={(e) => setSelectedDeptCode(e.target.value)}
              className="tc-dept-select"
            >
              {filteredDepartments.map((d) => (
                <option key={d.code} value={d.code}>
                  {d.name} ({d.code.toUpperCase()})
                </option>
              ))}
            </select>
            <ChevronDown size={15} className="tc-select-chevron" />
          </div>

          {/* Dispatch Sprint Task CTA */}
          <button
            type="button"
            className="tc-gold-btn"
            onClick={() => setShowDispatchModal(true)}
          >
            <Plus size={16} />
            Dispatch Sprint Task
          </button>
        </div>
      </div>

      {/* 2. DEPARTMENT LEADERSHIP & METRIC CARDS BANNER */}
      <div className="tc-metrics-grid-4">
        {/* Leadership Card */}
        <div className="tc-workspace-card tc-metric-card-inner">
          {currentDept.manager_avatar ? (
            <img
              src={currentDept.manager_avatar}
              alt={currentDept.manager_name}
              className="tc-avatar-lg"
            />
          ) : (
            <div className="tc-avatar-placeholder-lg">
              {currentDept.manager_name
                ?.split(' ')
                .map((n) => n[0])
                .join('')
                .slice(0, 2)}
            </div>
          )}
          <div>
            <div className="tc-dept-head-label">Department Head</div>
            <div className="tc-dept-head-name">{currentDept.manager_name}</div>
            <div className="tc-dept-head-email">{currentDept.manager_email}</div>
            {currentDept.assistant_name && (
              <div className="tc-dept-head-asst">Asst: {currentDept.assistant_name}</div>
            )}
          </div>
        </div>

        {/* Metric 1: Active Sprint Tasks */}
        <div className="tc-workspace-card tc-metric-card-inner">
          <div className="tc-metric-icon-box tc-metric-icon-box--gold">
            <CheckSquare size={22} />
          </div>
          <div>
            <div className="tc-metric-label">Active Sprint Tasks</div>
            <div className="tc-metric-value">{activeSprintTasksCount}</div>
            <div className="tc-metric-subtext tc-text-success">↑ 85% on schedule</div>
          </div>
        </div>

        {/* Metric 2: Department Roster & Capacity */}
        <div className="tc-workspace-card tc-metric-card-inner">
          <div className="tc-metric-icon-box tc-metric-icon-box--blue">
            <Users size={22} />
          </div>
          <div>
            <div className="tc-metric-label">Staff Roster & Capacity</div>
            <div className="tc-metric-value">{totalStaff} Members</div>
            <div className="tc-metric-subtext">
              {allocationPct}% allocated • {availableStaff} available
            </div>
          </div>
        </div>

        {/* Metric 3: Profit Share & Monthly Budget */}
        <div className="tc-workspace-card tc-metric-card-inner">
          <div className="tc-metric-icon-box tc-metric-icon-box--green">
            <Award size={22} />
          </div>
          <div>
            <div className="tc-metric-label">70/30 Profit Pool Allocation</div>
            <div className="tc-metric-value">{currentDept.profit_pool_share_percent}% Share</div>
            <div className="tc-metric-subtext tc-text-gold">{formattedBudget} Monthly Budget</div>
          </div>
        </div>
      </div>

      {/* 3. MAIN SECTION: SPRINT ROSTER & WORKLOAD TABLE */}
      <div className="tc-workspace-card tc-grid-card tc-mt-3">
        <div className="tc-card-header-row">
          <div>
            <h2 className="tc-card-title">Team Roster & Workload Allocation</h2>
            <p className="tc-dashboard-subtitle">
              Real-time sprint capacity, logged hours, and task distribution for {currentDept.name}.
            </p>
          </div>
          <div className="tc-flex-center-gap">
            <span className="tc-table-subtext">
              Showing {displayRoster.length} department members
            </span>
          </div>
        </div>

        <div className="tc-table-wrap">
          <table className="tc-data-table">
            <thead>
              <tr className="tc-table-head-row">
                <th className="tc-table-th">Member</th>
                <th className="tc-table-th">Role & Seniority</th>
                <th className="tc-table-th">Current Project</th>
                <th className="tc-table-th">Active Tasks</th>
                <th className="tc-table-th">Sprint Hours</th>
                <th className="tc-table-th">Capacity Status</th>
                <th className="tc-table-th tc-text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={7} className="tc-table-td tc-text-center">
                    <div className="tc-flex-center-gap tc-justify-center tc-py-6">
                      <Loader2 size={16} className="tc-spin tc-text-gold" />
                      <span className="tc-text-muted">Loading team capacity & workload roster...</span>
                    </div>
                  </td>
                </tr>
              ) : displayRoster.length === 0 ? (
                <tr>
                  <td colSpan={7} className="tc-table-td tc-text-center tc-text-muted">
                    No team members found for this department.
                  </td>
                </tr>
              ) : (
                displayRoster.map((member) => {
                  const statusClassMap: Record<string, string> = {
                    Optimal: 'tc-status-pill success',
                    High: 'tc-status-pill warning',
                    Overloaded: 'tc-status-pill danger',
                    Available: 'tc-status-pill info',
                  };
                  const statusClass = statusClassMap[member.allocation_status] || 'tc-status-pill success';

                  return (
                    <tr key={member.id} className="tc-table-row">
                      {/* Member Profile */}
                      <td className="tc-table-td">
                        <div className="tc-flex-center-gap">
                          {member.avatar ? (
                            <img
                              src={member.avatar}
                              alt={member.name}
                              className="tc-avatar-sm"
                            />
                          ) : (
                            <div className="tc-avatar-placeholder-sm">
                              {member.name
                                ?.split(' ')
                                .map((n) => n[0])
                                .join('')
                                .slice(0, 2)}
                            </div>
                          )}
                          <div>
                            <div className="tc-font-bold">{member.name}</div>
                            <div className="tc-text-muted-xs">{member.department}</div>
                          </div>
                        </div>
                      </td>

                      {/* Role & Seniority */}
                      <td className="tc-table-td">
                        <div className="tc-font-semibold">{member.role}</div>
                        <span className="tc-seniority-tag">{member.seniority}</span>
                      </td>

                      {/* Current Project */}
                      <td className="tc-table-td">
                        <span className="tc-font-semibold">{member.current_project}</span>
                      </td>

                      {/* Active Tasks */}
                      <td className="tc-table-td">
                        <span
                          className={member.active_tasks_count > 3 ? 'tc-text-danger tc-font-bold' : 'tc-font-bold'}
                        >
                          {member.active_tasks_count} active
                        </span>
                        <span className="tc-text-muted-xs tc-ml-2">
                          ({member.completed_tasks_count} done)
                        </span>
                      </td>

                      {/* Hours Logged */}
                      <td className="tc-table-td">
                        <div className="tc-flex-center-gap">
                          <Clock size={13} className="tc-text-muted" />
                          <span className="tc-font-semibold">
                            {member.hours_logged_this_sprint}h
                          </span>
                        </div>
                      </td>

                      {/* Allocation Status Badge */}
                      <td className="tc-table-td">
                        <span className={statusClass}>
                          {member.allocation_status}
                        </span>
                      </td>

                      {/* Action Buttons */}
                      <td className="tc-table-td tc-text-right">
                        <div className="tc-flex-end-gap">
                          <button
                            type="button"
                            onClick={() => {
                              setTaskAssignee(member.name);
                              setShowDispatchModal(true);
                            }}
                            className="tc-btn-gold-sm"
                          >
                            + Task
                          </button>
                          <a
                            href={api.getTeamMemberChatUrl(member)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="tc-btn-icon-sm"
                            title={
                              member.slack_url
                                ? `Open Slack direct chat with ${member.name}`
                                : member.email
                                ? `Message ${member.name} (${member.email}) on Workspace`
                                : `Message ${member.name} on Slack / Workspace`
                            }
                          >
                            <MessageSquare size={13} />
                          </a>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* 4. LOWER 2-COLUMN GRID: DELIVERABLES SIGN-OFF & ATS APPLICANTS */}
      <div className="tc-dashboard-grid-2x2 tc-mt-3">
        {/* Left Card: Department Technical Deliverables & QA Sign-Off */}
        <div className="tc-grid-card">
          <div className="tc-card-header-row">
            <div>
              <h3 className="tc-card-title">Technical Deliverables & QA Gate</h3>
              <p className="tc-dashboard-subtitle">
                Sign off verified code and architectural milestones for client release.
              </p>
            </div>
            <FileCheck size={18} className="tc-text-gold" />
          </div>

          <div className="tc-flex-col-gap">
            {projects.length === 0 ? (
              <div className="tc-text-center tc-text-muted tc-py-6">
                No active project deliverables or milestones pending QA sign-off.
              </div>
            ) : (
              projects.slice(0, 4).map((p, idx) => {
                const delivId = `DEL-${p.id || idx + 1}`;
                const isSigned = Boolean(signedDeliverables[delivId]) || p.status === 'completed';
                const pName = p.project_name || p.name || `Sprint Milestone #${idx + 1}`;
                const safeName = pName.toLowerCase().replace(/[^a-z0-9]/g, '_');
                const repoPath = `titanCode_backend / app/services/${safeName}.py`;
                const statusLabel = p.status ? p.status.toUpperCase() : 'IN PROGRESS';
                const testedInfo = `Status: ${statusLabel} • Budget: $${Number(p.budget || 0).toLocaleString()}${p.deadline ? ` • Target: ${p.deadline}` : ''}`;

                return (
                  <div
                    key={delivId}
                    className={`tc-deliverable-box ${isSigned ? 'tc-deliverable-box--signed' : ''}`}
                  >
                    <div className="tc-flex-1">
                      <div className="tc-flex-center-gap">
                        <span className="tc-deliverable-title">{pName}</span>
                        {isSigned && (
                          <span className="tc-deliverable-approved-badge">APPROVED BY LEAD</span>
                        )}
                      </div>
                      <div className="tc-deliverable-repo">{repoPath}</div>
                      <div className="tc-deliverable-tested">✓ {testedInfo}</div>
                    </div>

                    <button
                      type="button"
                      onClick={() => toggleDeliverableSignOff(delivId)}
                      className={`tc-btn-gold-sm ${isSigned ? 'tc-btn-gold-sm--signed' : 'tc-btn-gold-sm--solid'}`}
                    >
                      {isSigned ? 'Signed Off ✓' : 'Sign Off'}
                    </button>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right Card: Technical Candidate Screening Pipeline for this Department */}
        <div className="tc-grid-card">
          <div className="tc-card-header-row">
            <div>
              <h3 className="tc-card-title">Technical Screening ATS Queue</h3>
              <p className="tc-dashboard-subtitle">
                Review technical applicant code samples for {currentDept.name}.
              </p>
            </div>
            <Sparkles size={18} className="tc-text-gold" />
          </div>

          <div className="tc-flex-col-gap">
            {displayApplicants.length === 0 ? (
              <div className="tc-text-center tc-text-muted tc-py-6">
                No applicants currently pending review in this department.
              </div>
            ) : (
              displayApplicants.map((cand) => (
                <div key={cand.id} className="tc-applicant-item">
                  <div>
                    <div className="tc-applicant-name">
                      {cand.full_name || cand.applicant_name || `Applicant #${cand.id}`}
                    </div>
                    <div className="tc-applicant-meta">
                      {cand.experience_years ? `${cand.experience_years} years experience` : 'Experienced'} •{' '}
                      {cand.status ? cand.status.replace(/_/g, ' ') : 'Under Review'}
                    </div>
                    <div className="tc-flex-wrap-gap tc-mt-3">
                      {(cand.skills || ['React', 'TypeScript', 'API']).slice(0, 4).map((s) => (
                        <span key={s} className="tc-skill-chip">
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="tc-flex-col-gap tc-items-end">
                    {cand.github_url && (
                      <a
                        href={cand.github_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="tc-link-blue"
                      >
                        GitHub Code <ExternalLink size={11} />
                      </a>
                    )}
                    <button
                      type="button"
                      onClick={() =>
                        alert(
                          `Scheduled technical assessment with ${cand.full_name || cand.applicant_name || 'candidate'}`
                        )
                      }
                      className="tc-btn-gold-sm"
                    >
                      Schedule Interview
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="tc-text-right tc-mt-3">
            <button
              type="button"
              onClick={() => onNavigate && onNavigate('applications_management')}
              className="tc-link-gold"
            >
              Open Full ATS Screening Hub →
            </button>
          </div>
        </div>
      </div>

      {/* 5. MODAL: SPRINT TASK DISPATCHER */}
      {showDispatchModal && (
        <div className="tc-modal-overlay">
          <div className="tc-modal-card tc-modal-sm">
            <div className="tc-modal-header">
              <div className="tc-flex-center-gap">
                <CheckSquare size={20} className="tc-text-gold" />
                <h3 className="tc-modal-title">Dispatch Sprint Task</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowDispatchModal(false)}
                className="tc-modal-close-btn"
              >
                <X size={20} />
              </button>
            </div>

            {dispatchSuccess ? (
              <div className="tc-modal-success-banner">
                <div className="tc-modal-success-title">
                  Task Dispatched!
                </div>
                <div className="tc-modal-success-sub">
                  Assigned to {taskAssignee} and notified on Slack & TitanCode.
                </div>
              </div>
            ) : (
              <form onSubmit={handleDispatchTask}>
                <div className="tc-form-group">
                  <label className="tc-form-label">
                    Task Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={taskTitle}
                    onChange={(e) => setTaskTitle(e.target.value)}
                    placeholder="e.g. Implement WebSocket heartbeat & ping-pong"
                    className="tc-form-input"
                  />
                </div>

                <div className="tc-grid-2col">
                  <div>
                    <label className="tc-form-label">
                      Assignee *
                    </label>
                    <select
                      required
                      value={taskAssignee}
                      onChange={(e) => setTaskAssignee(e.target.value)}
                      className="tc-form-select"
                    >
                      <option value="">Select Member</option>
                      {displayRoster.map((m) => (
                        <option key={m.id} value={m.name}>
                          {m.name} ({m.seniority})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="tc-form-label">
                      Priority
                    </label>
                    <select
                      value={taskPriority}
                      onChange={(e) => setTaskPriority(e.target.value as TaskPriority)}
                      className="tc-form-select"
                    >
                      <option value="Low">Low</option>
                      <option value="Medium">Medium</option>
                      <option value="High">High</option>
                      <option value="Urgent">Urgent</option>
                    </select>
                  </div>
                </div>

                <div className="tc-form-group">
                  <label className="tc-form-label">
                    Sprint Target Deadline
                  </label>
                  <input
                    type="date"
                    value={taskDeadline}
                    onChange={(e) => setTaskDeadline(e.target.value)}
                    className="tc-form-input"
                  />
                </div>

                <div className="tc-form-group">
                  <label className="tc-form-label">
                    Technical Requirements / Description
                  </label>
                  <textarea
                    rows={3}
                    value={taskDescription}
                    onChange={(e) => setTaskDescription(e.target.value)}
                    placeholder="Provide acceptance criteria and reference links..."
                    className="tc-form-textarea"
                  />
                </div>

                <div className="tc-actions-end">
                  <button
                    type="button"
                    onClick={() => setShowDispatchModal(false)}
                    className="tc-modal-cancel-btn"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="tc-gold-btn"
                  >
                    <Send size={15} />
                    Dispatch Task
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
