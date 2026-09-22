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
} from 'lucide-react';
import {
  api,
  MOCK_DEPARTMENTS,
  MOCK_TEAM_WORKLOAD,
} from '../services/api';
import type { DepartmentInfo, TeamMemberWorkload, TaskPriority } from '../types';
import type { ScreenId } from '../App';

interface ManagerDashboardViewProps {
  onNavigate?: (view: ScreenId) => void;
  initialDepartmentCode?: string;
}

export const ManagerDashboardView: React.FC<ManagerDashboardViewProps> = ({
  onNavigate,
  initialDepartmentCode = 'frontend',
}) => {
  const [departments, setDepartments] = useState<DepartmentInfo[]>(MOCK_DEPARTMENTS);
  const [selectedDeptCode, setSelectedDeptCode] = useState<string>(initialDepartmentCode);
  const [roster, setRoster] = useState<TeamMemberWorkload[]>(MOCK_TEAM_WORKLOAD);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  // Task Dispatcher Modal
  const [showDispatchModal, setShowDispatchModal] = useState(false);
  const [taskTitle, setTaskTitle] = useState('');
  const [taskPriority, setTaskPriority] = useState<TaskPriority>('Medium');
  const [taskAssignee, setTaskAssignee] = useState('');
  const [taskDeadline, setTaskDeadline] = useState('2026-10-01');
  const [taskDescription, setTaskDescription] = useState('');
  const [dispatchSuccess, setDispatchSuccess] = useState(false);

  // Deliverables sign-off state
  const [signedDeliverables, setSignedDeliverables] = useState<Record<string, boolean>>({
    'DEL-01': true,
    'DEL-02': false,
    'DEL-03': false,
  });

  useEffect(() => {
    async function loadData() {
      const depts = await api.getDepartments();
      setDepartments(depts);
      const members = await api.getTeamWorkload(selectedDeptCode);
      setRoster(members);
    }
    loadData();
  }, [selectedDeptCode]);

  const currentDept =
    departments.find((d) => d.code === selectedDeptCode) || departments[0];

  // Filter roster for this department (or fallback to full team if demo)
  const currentRoster = roster.filter(
    (m) =>
      m.department.toLowerCase().includes(currentDept.name.toLowerCase().split(' ')[0]) ||
      m.department.toLowerCase().includes(currentDept.code.toLowerCase()) ||
      roster.length <= 3
  );
  const displayRoster = currentRoster.length > 0 ? currentRoster : roster.slice(0, 4);

  const handleDispatchTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!taskTitle.trim() || !taskAssignee) return;

    setDispatchSuccess(true);
    setTimeout(() => {
      setDispatchSuccess(false);
      setShowDispatchModal(false);
      setTaskTitle('');
      setTaskDescription('');
    }, 1200);
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
    <div style={{ color: '#FFFFFF', maxWidth: '1440px', margin: '0 auto' }}>
      {/* 1. TOP HEADER & DEPARTMENT SELECTOR */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '28px',
          flexWrap: 'wrap',
          gap: '16px',
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '4px 10px',
                borderRadius: '9999px',
                backgroundColor: 'rgba(223, 174, 50, 0.15)',
                color: '#dfae32',
                fontSize: '12px',
                fontWeight: 700,
                letterSpacing: '0.05em',
                textTransform: 'uppercase',
              }}
            >
              <Building2 size={13} />
              Department Head Hub
            </span>
            <span
              style={{
                padding: '4px 10px',
                borderRadius: '9999px',
                backgroundColor: 'rgba(255, 255, 255, 0.08)',
                color: '#9CA3AF',
                fontSize: '12px',
                fontWeight: 600,
              }}
            >
              {currentDept.category}
            </span>
          </div>
          <h1 style={{ fontSize: '28px', fontWeight: 800, margin: 0, color: '#FFFFFF' }}>
            {currentDept.name} Dashboard
          </h1>
          <p style={{ color: '#9CA3AF', fontSize: '14px', margin: '4px 0 0' }}>
            {currentDept.description}
          </p>
        </div>

        {/* Action Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
          {/* Category Filter */}
          <div style={{ display: 'flex', gap: '4px', background: 'rgba(255, 255, 255, 0.04)', padding: '4px', borderRadius: '10px' }}>
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                style={{
                  padding: '6px 12px',
                  borderRadius: '8px',
                  border: 'none',
                  backgroundColor: selectedCategory === cat ? '#dfae32' : 'transparent',
                  color: selectedCategory === cat ? '#000000' : '#9CA3AF',
                  fontSize: '12px',
                  fontWeight: selectedCategory === cat ? 700 : 500,
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                }}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Department Switcher Dropdown */}
          <div style={{ position: 'relative' }}>
            <select
              value={selectedDeptCode}
              onChange={(e) => setSelectedDeptCode(e.target.value)}
              style={{
                appearance: 'none',
                backgroundColor: '#1C1C1E',
                border: '1px solid rgba(223, 174, 50, 0.4)',
                borderRadius: '10px',
                padding: '10px 38px 10px 14px',
                color: '#FFFFFF',
                fontSize: '13px',
                fontWeight: 600,
                cursor: 'pointer',
                outline: 'none',
              }}
            >
              {filteredDepartments.map((d) => (
                <option key={d.code} value={d.code}>
                  {d.name} ({d.code.toUpperCase()})
                </option>
              ))}
            </select>
            <ChevronDown
              size={15}
              style={{
                position: 'absolute',
                right: '12px',
                top: '50%',
                transform: 'translateY(-50%)',
                pointerEvents: 'none',
                color: '#dfae32',
              }}
            />
          </div>

          {/* Dispatch Sprint Task CTA */}
          <button
            type="button"
            className="tc-btn tc-btn-primary"
            onClick={() => setShowDispatchModal(true)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '10px 16px',
              borderRadius: '10px',
              fontWeight: 700,
              fontSize: '13px',
            }}
          >
            <Plus size={16} />
            Dispatch Sprint Task
          </button>
        </div>
      </div>

      {/* 2. DEPARTMENT LEADERSHIP & METRIC CARDS BANNER */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '16px',
          marginBottom: '28px',
        }}
      >
        {/* Leadership Card */}
        <div
          style={{
            backgroundColor: '#161618',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: '16px',
            padding: '20px',
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
          }}
        >
          <img
            src={currentDept.manager_avatar}
            alt={currentDept.manager_name}
            style={{
              width: '56px',
              height: '56px',
              borderRadius: '50%',
              objectFit: 'cover',
              border: '2px solid #dfae32',
            }}
          />
          <div>
            <div style={{ fontSize: '11px', color: '#dfae32', fontWeight: 700, textTransform: 'uppercase' }}>
              Department Head
            </div>
            <div style={{ fontSize: '16px', fontWeight: 700, color: '#FFFFFF', marginTop: '2px' }}>
              {currentDept.manager_name}
            </div>
            <div style={{ fontSize: '12px', color: '#9CA3AF', marginTop: '2px' }}>
              {currentDept.manager_email}
            </div>
            {currentDept.assistant_name && (
              <div style={{ fontSize: '11px', color: '#6B7280', marginTop: '4px' }}>
                Asst: {currentDept.assistant_name}
              </div>
            )}
          </div>
        </div>

        {/* Metric 1: Active Sprint Tasks */}
        <div
          style={{
            backgroundColor: '#161618',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: '16px',
            padding: '20px',
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
          }}
        >
          <div
            style={{
              width: '46px',
              height: '46px',
              borderRadius: '12px',
              backgroundColor: 'rgba(223, 174, 50, 0.12)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#dfae32',
            }}
          >
            <CheckSquare size={22} />
          </div>
          <div>
            <div style={{ fontSize: '12px', color: '#9CA3AF', fontWeight: 600 }}>Active Sprint Tasks</div>
            <div style={{ fontSize: '24px', fontWeight: 800, color: '#FFFFFF', marginTop: '2px' }}>
              {currentDept.active_projects_count * 4 + 7}
            </div>
            <div style={{ fontSize: '11px', color: '#10B981', fontWeight: 600, marginTop: '2px' }}>
              ↑ 85% on schedule
            </div>
          </div>
        </div>

        {/* Metric 2: Department Roster & Capacity */}
        <div
          style={{
            backgroundColor: '#161618',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: '16px',
            padding: '20px',
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
          }}
        >
          <div
            style={{
              width: '46px',
              height: '46px',
              borderRadius: '12px',
              backgroundColor: 'rgba(59, 130, 246, 0.12)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#3B82F6',
            }}
          >
            <Users size={22} />
          </div>
          <div>
            <div style={{ fontSize: '12px', color: '#9CA3AF', fontWeight: 600 }}>Staff Roster & Capacity</div>
            <div style={{ fontSize: '24px', fontWeight: 800, color: '#FFFFFF', marginTop: '2px' }}>
              {currentDept.member_count} Members
            </div>
            <div style={{ fontSize: '11px', color: '#9CA3AF', fontWeight: 500, marginTop: '2px' }}>
              88% allocated • 2 available
            </div>
          </div>
        </div>

        {/* Metric 3: Profit Share & Monthly Budget */}
        <div
          style={{
            backgroundColor: '#161618',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: '16px',
            padding: '20px',
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
          }}
        >
          <div
            style={{
              width: '46px',
              height: '46px',
              borderRadius: '12px',
              backgroundColor: 'rgba(16, 185, 129, 0.12)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#10B981',
            }}
          >
            <Award size={22} />
          </div>
          <div>
            <div style={{ fontSize: '12px', color: '#9CA3AF', fontWeight: 600 }}>70/30 Profit Pool Allocation</div>
            <div style={{ fontSize: '24px', fontWeight: 800, color: '#FFFFFF', marginTop: '2px' }}>
              {currentDept.profit_pool_share_percent}% Share
            </div>
            <div style={{ fontSize: '11px', color: '#dfae32', fontWeight: 600, marginTop: '2px' }}>
              ₦{(currentDept.monthly_budget / 1000000).toFixed(1)}M Monthly Budget
            </div>
          </div>
        </div>
      </div>

      {/* 3. MAIN SECTION: SPRINT ROSTER & WORKLOAD TABLE */}
      <div
        style={{
          backgroundColor: '#161618',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          borderRadius: '16px',
          padding: '24px',
          marginBottom: '28px',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '20px',
            flexWrap: 'wrap',
            gap: '12px',
          }}
        >
          <div>
            <h2 style={{ fontSize: '18px', fontWeight: 700, margin: 0, color: '#FFFFFF' }}>
              Team Roster & Workload Allocation
            </h2>
            <p style={{ fontSize: '13px', color: '#9CA3AF', margin: '2px 0 0' }}>
              Real-time sprint capacity, logged hours, and task distribution for {currentDept.name}.
            </p>
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <span style={{ fontSize: '12px', color: '#9CA3AF', alignSelf: 'center' }}>
              Showing {displayRoster.length} department members
            </span>
          </div>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.08)' }}>
                <th style={{ padding: '12px 16px', fontSize: '12px', fontWeight: 600, color: '#9CA3AF', textTransform: 'uppercase' }}>
                  Member
                </th>
                <th style={{ padding: '12px 16px', fontSize: '12px', fontWeight: 600, color: '#9CA3AF', textTransform: 'uppercase' }}>
                  Role & Seniority
                </th>
                <th style={{ padding: '12px 16px', fontSize: '12px', fontWeight: 600, color: '#9CA3AF', textTransform: 'uppercase' }}>
                  Current Project
                </th>
                <th style={{ padding: '12px 16px', fontSize: '12px', fontWeight: 600, color: '#9CA3AF', textTransform: 'uppercase' }}>
                  Active Tasks
                </th>
                <th style={{ padding: '12px 16px', fontSize: '12px', fontWeight: 600, color: '#9CA3AF', textTransform: 'uppercase' }}>
                  Sprint Hours
                </th>
                <th style={{ padding: '12px 16px', fontSize: '12px', fontWeight: 600, color: '#9CA3AF', textTransform: 'uppercase' }}>
                  Capacity Status
                </th>
                <th style={{ padding: '12px 16px', fontSize: '12px', fontWeight: 600, color: '#9CA3AF', textTransform: 'uppercase', textAlign: 'right' }}>
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {displayRoster.map((member) => {
                const statusColors = {
                  Optimal: { bg: 'rgba(16, 185, 129, 0.12)', text: '#10B981', border: 'rgba(16, 185, 129, 0.3)' },
                  High: { bg: 'rgba(245, 158, 11, 0.12)', text: '#F59E0B', border: 'rgba(245, 158, 11, 0.3)' },
                  Overloaded: { bg: 'rgba(239, 68, 68, 0.12)', text: '#EF4444', border: 'rgba(239, 68, 68, 0.3)' },
                  Available: { bg: 'rgba(59, 130, 246, 0.12)', text: '#3B82F6', border: 'rgba(59, 130, 246, 0.3)' },
                };
                const sc = statusColors[member.allocation_status] || statusColors.Optimal;

                return (
                  <tr
                    key={member.id}
                    style={{
                      borderBottom: '1px solid rgba(255, 255, 255, 0.04)',
                      transition: 'background-color 0.15s ease',
                    }}
                  >
                    {/* Member Profile */}
                    <td style={{ padding: '14px 16px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <img
                          src={member.avatar}
                          alt={member.name}
                          style={{
                            width: '38px',
                            height: '38px',
                            borderRadius: '50%',
                            objectFit: 'cover',
                            border: '1px solid rgba(255, 255, 255, 0.15)',
                          }}
                        />
                        <div>
                          <div style={{ fontSize: '14px', fontWeight: 700, color: '#FFFFFF' }}>
                            {member.name}
                          </div>
                          <div style={{ fontSize: '11px', color: '#9CA3AF' }}>{member.department}</div>
                        </div>
                      </div>
                    </td>

                    {/* Role & Seniority */}
                    <td style={{ padding: '14px 16px' }}>
                      <div style={{ fontSize: '13px', fontWeight: 600, color: '#E5E7EB' }}>{member.role}</div>
                      <span
                        style={{
                          display: 'inline-block',
                          fontSize: '10px',
                          fontWeight: 700,
                          textTransform: 'uppercase',
                          color: '#dfae32',
                          marginTop: '2px',
                        }}
                      >
                        {member.seniority}
                      </span>
                    </td>

                    {/* Current Project */}
                    <td style={{ padding: '14px 16px' }}>
                      <span style={{ fontSize: '13px', color: '#D1D5DB' }}>{member.current_project}</span>
                    </td>

                    {/* Active Tasks */}
                    <td style={{ padding: '14px 16px' }}>
                      <span
                        style={{
                          fontSize: '13px',
                          fontWeight: 700,
                          color: member.active_tasks_count > 3 ? '#EF4444' : '#FFFFFF',
                        }}
                      >
                        {member.active_tasks_count} active
                      </span>
                      <span style={{ fontSize: '11px', color: '#6B7280', marginLeft: '4px' }}>
                        ({member.completed_tasks_count} done)
                      </span>
                    </td>

                    {/* Hours Logged */}
                    <td style={{ padding: '14px 16px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <Clock size={13} style={{ color: '#9CA3AF' }} />
                        <span style={{ fontSize: '13px', fontWeight: 600, color: '#FFFFFF' }}>
                          {member.hours_logged_this_sprint}h
                        </span>
                      </div>
                    </td>

                    {/* Allocation Status Badge */}
                    <td style={{ padding: '14px 16px' }}>
                      <span
                        style={{
                          display: 'inline-block',
                          padding: '4px 10px',
                          borderRadius: '9999px',
                          fontSize: '11px',
                          fontWeight: 700,
                          backgroundColor: sc.bg,
                          color: sc.text,
                          border: `1px solid ${sc.border}`,
                        }}
                      >
                        {member.allocation_status}
                      </span>
                    </td>

                    {/* Action Buttons */}
                    <td style={{ padding: '14px 16px', textAlign: 'right' }}>
                      <div style={{ display: 'inline-flex', gap: '6px' }}>
                        <button
                          type="button"
                          onClick={() => {
                            setTaskAssignee(member.name);
                            setShowDispatchModal(true);
                          }}
                          style={{
                            padding: '6px 10px',
                            borderRadius: '8px',
                            backgroundColor: 'rgba(223, 174, 50, 0.15)',
                            color: '#dfae32',
                            border: '1px solid rgba(223, 174, 50, 0.3)',
                            fontSize: '11px',
                            fontWeight: 600,
                            cursor: 'pointer',
                          }}
                        >
                          + Task
                        </button>
                        <a
                          href={`https://slack.com/app_redirect?channel=${member.name.toLowerCase().replace(' ', '.')}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            padding: '6px',
                            borderRadius: '8px',
                            backgroundColor: 'rgba(255, 255, 255, 0.06)',
                            color: '#9CA3AF',
                            border: '1px solid rgba(255, 255, 255, 0.1)',
                            cursor: 'pointer',
                            textDecoration: 'none',
                          }}
                          title={`Message ${member.name} on Slack`}
                        >
                          <MessageSquare size={13} />
                        </a>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* 4. LOWER 2-COLUMN GRID: DELIVERABLES SIGN-OFF & ATS APPLICANTS */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(480px, 1fr))',
          gap: '20px',
          marginBottom: '28px',
        }}
      >
        {/* Left Card: Department Technical Deliverables & QA Sign-Off */}
        <div
          style={{
            backgroundColor: '#161618',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: '16px',
            padding: '24px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
            <div>
              <h3 style={{ fontSize: '16px', fontWeight: 700, margin: 0, color: '#FFFFFF' }}>
                Technical Deliverables & QA Gate
              </h3>
              <p style={{ fontSize: '12px', color: '#9CA3AF', margin: '2px 0 0' }}>
                Sign off verified code and architectural milestones for client release.
              </p>
            </div>
            <FileCheck size={18} style={{ color: '#dfae32' }} />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {[
              {
                id: 'DEL-01',
                title: 'High-Throughput WebSocket ConnectionManager',
                repo: 'titanCode_backend / app/core/websockets.py',
                tested: 'Passed 10,000 concurrent connection load tests (k6)',
              },
              {
                id: 'DEL-02',
                title: 'Sumsub WebSDK KYC Webhook Listener & Escrow Split',
                repo: 'titanCode_backend / app/api/v1/kyc.py',
                tested: 'Unit & integration tests passing with 98.4% coverage',
              },
              {
                id: 'DEL-03',
                title: '14 Startup Business Departments Dashboard Architecture',
                repo: 'titanCode_frontend / src/views/ManagerDashboardView.tsx',
                tested: 'Dual-mode API verified, zero build or typing errors',
              },
            ].map((deliv) => {
              const isSigned = signedDeliverables[deliv.id];
              return (
                <div
                  key={deliv.id}
                  style={{
                    backgroundColor: 'rgba(255, 255, 255, 0.02)',
                    border: `1px solid ${isSigned ? 'rgba(16, 185, 129, 0.3)' : 'rgba(255, 255, 255, 0.06)'}`,
                    borderRadius: '12px',
                    padding: '14px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '12px',
                  }}
                >
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontSize: '13px', fontWeight: 700, color: '#FFFFFF' }}>
                        {deliv.title}
                      </span>
                      {isSigned && (
                        <span
                          style={{
                            fontSize: '10px',
                            fontWeight: 700,
                            padding: '2px 6px',
                            borderRadius: '4px',
                            backgroundColor: 'rgba(16, 185, 129, 0.2)',
                            color: '#10B981',
                          }}
                        >
                          APPROVED BY LEAD
                        </span>
                      )}
                    </div>
                    <div style={{ fontSize: '11px', color: '#9CA3AF', fontFamily: 'monospace', marginTop: '2px' }}>
                      {deliv.repo}
                    </div>
                    <div style={{ fontSize: '11px', color: '#6B7280', marginTop: '2px' }}>
                      ✓ {deliv.tested}
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => toggleDeliverableSignOff(deliv.id)}
                    style={{
                      padding: '8px 14px',
                      borderRadius: '8px',
                      border: 'none',
                      backgroundColor: isSigned ? 'rgba(16, 185, 129, 0.15)' : '#dfae32',
                      color: isSigned ? '#10B981' : '#000000',
                      fontSize: '12px',
                      fontWeight: 700,
                      cursor: 'pointer',
                      transition: 'all 0.15s ease',
                      flexShrink: 0,
                    }}
                  >
                    {isSigned ? 'Signed Off ✓' : 'Sign Off'}
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Card: Technical Candidate Screening Pipeline for this Department */}
        <div
          style={{
            backgroundColor: '#161618',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: '16px',
            padding: '24px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
            <div>
              <h3 style={{ fontSize: '16px', fontWeight: 700, margin: 0, color: '#FFFFFF' }}>
                Technical Screening ATS Queue
              </h3>
              <p style={{ fontSize: '12px', color: '#9CA3AF', margin: '2px 0 0' }}>
                Review technical applicant code samples for {currentDept.name}.
              </p>
            </div>
            <Sparkles size={18} style={{ color: '#dfae32' }} />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {[
              {
                id: 1,
                name: 'Korede Babalola',
                experience: '6 years',
                skills: ['React 19', 'TypeScript', 'Tailwind', 'Next.js'],
                github: 'https://github.com/korede-dev',
                status: 'Portfolio Review',
              },
              {
                id: 2,
                name: 'Amaka Eze',
                experience: '4 years',
                skills: ['FastAPI', 'PostgreSQL', 'Docker', 'Redis'],
                github: 'https://github.com/amaka-code',
                status: 'Technical Interview',
              },
            ].map((cand) => (
              <div
                key={cand.id}
                style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.02)',
                  border: '1px solid rgba(255, 255, 255, 0.06)',
                  borderRadius: '12px',
                  padding: '14px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '12px',
                }}
              >
                <div>
                  <div style={{ fontSize: '14px', fontWeight: 700, color: '#FFFFFF' }}>
                    {cand.name}
                  </div>
                  <div style={{ fontSize: '11px', color: '#9CA3AF', marginTop: '2px' }}>
                    {cand.experience} experience • {cand.status}
                  </div>
                  <div style={{ display: 'flex', gap: '4px', marginTop: '6px', flexWrap: 'wrap' }}>
                    {cand.skills.map((s) => (
                      <span
                        key={s}
                        style={{
                          fontSize: '10px',
                          padding: '2px 6px',
                          borderRadius: '4px',
                          backgroundColor: 'rgba(255, 255, 255, 0.06)',
                          color: '#dfae32',
                        }}
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', alignItems: 'flex-end' }}>
                  <a
                    href={cand.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px',
                      fontSize: '11px',
                      color: '#3B82F6',
                      textDecoration: 'none',
                    }}
                  >
                    GitHub Code <ExternalLink size={11} />
                  </a>
                  <button
                    type="button"
                    onClick={() => alert(`Scheduled technical assessment with ${cand.name}`)}
                    style={{
                      padding: '6px 12px',
                      borderRadius: '6px',
                      border: 'none',
                      backgroundColor: 'rgba(223, 174, 50, 0.2)',
                      color: '#dfae32',
                      fontSize: '11px',
                      fontWeight: 700,
                      cursor: 'pointer',
                    }}
                  >
                    Schedule Interview
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div style={{ marginTop: '16px', textAlign: 'right' }}>
            <button
              type="button"
              onClick={() => onNavigate && onNavigate('applications_management')}
              style={{
                background: 'none',
                border: 'none',
                color: '#dfae32',
                fontSize: '12px',
                fontWeight: 600,
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
              }}
            >
              Open Full ATS Screening Hub →
            </button>
          </div>
        </div>
      </div>

      {/* 5. MODAL: SPRINT TASK DISPATCHER */}
      {showDispatchModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            backdropFilter: 'blur(6px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 100,
            padding: '20px',
          }}
        >
          <div
            style={{
              backgroundColor: '#1C1C1E',
              border: '1px solid rgba(223, 174, 50, 0.3)',
              borderRadius: '16px',
              padding: '28px',
              maxWidth: '520px',
              width: '100%',
              boxShadow: '0 20px 40px rgba(0, 0, 0, 0.6)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <CheckSquare size={20} style={{ color: '#dfae32' }} />
                <h3 style={{ fontSize: '18px', fontWeight: 700, margin: 0, color: '#FFFFFF' }}>
                  Dispatch Sprint Task
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowDispatchModal(false)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#9CA3AF',
                  cursor: 'pointer',
                }}
              >
                <X size={20} />
              </button>
            </div>

            {dispatchSuccess ? (
              <div
                style={{
                  padding: '24px',
                  backgroundColor: 'rgba(16, 185, 129, 0.15)',
                  border: '1px solid rgba(16, 185, 129, 0.3)',
                  borderRadius: '12px',
                  textAlign: 'center',
                  color: '#10B981',
                }}
              >
                <div style={{ fontSize: '20px', fontWeight: 700, marginBottom: '4px' }}>
                  Task Dispatched!
                </div>
                <div style={{ fontSize: '13px' }}>
                  Assigned to {taskAssignee} and notified on Slack & TitanCode.
                </div>
              </div>
            ) : (
              <form onSubmit={handleDispatchTask}>
                <div style={{ marginBottom: '16px' }}>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#9CA3AF', marginBottom: '6px' }}>
                    Task Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={taskTitle}
                    onChange={(e) => setTaskTitle(e.target.value)}
                    placeholder="e.g. Implement WebSocket heartbeat & ping-pong"
                    style={{
                      width: '100%',
                      padding: '12px 14px',
                      borderRadius: '8px',
                      backgroundColor: '#121214',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      color: '#FFFFFF',
                      fontSize: '14px',
                      outline: 'none',
                    }}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#9CA3AF', marginBottom: '6px' }}>
                      Assignee *
                    </label>
                    <select
                      required
                      value={taskAssignee}
                      onChange={(e) => setTaskAssignee(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '12px 14px',
                        borderRadius: '8px',
                        backgroundColor: '#121214',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        color: '#FFFFFF',
                        fontSize: '13px',
                        outline: 'none',
                      }}
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
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#9CA3AF', marginBottom: '6px' }}>
                      Priority
                    </label>
                    <select
                      value={taskPriority}
                      onChange={(e) => setTaskPriority(e.target.value as TaskPriority)}
                      style={{
                        width: '100%',
                        padding: '12px 14px',
                        borderRadius: '8px',
                        backgroundColor: '#121214',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        color: '#FFFFFF',
                        fontSize: '13px',
                        outline: 'none',
                      }}
                    >
                      <option value="Low">Low</option>
                      <option value="Medium">Medium</option>
                      <option value="High">High</option>
                      <option value="Urgent">Urgent</option>
                    </select>
                  </div>
                </div>

                <div style={{ marginBottom: '16px' }}>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#9CA3AF', marginBottom: '6px' }}>
                    Sprint Target Deadline
                  </label>
                  <input
                    type="date"
                    value={taskDeadline}
                    onChange={(e) => setTaskDeadline(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '12px 14px',
                      borderRadius: '8px',
                      backgroundColor: '#121214',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      color: '#FFFFFF',
                      fontSize: '14px',
                      outline: 'none',
                    }}
                  />
                </div>

                <div style={{ marginBottom: '24px' }}>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#9CA3AF', marginBottom: '6px' }}>
                    Technical Requirements / Description
                  </label>
                  <textarea
                    rows={3}
                    value={taskDescription}
                    onChange={(e) => setTaskDescription(e.target.value)}
                    placeholder="Provide acceptance criteria and reference links..."
                    style={{
                      width: '100%',
                      padding: '12px 14px',
                      borderRadius: '8px',
                      backgroundColor: '#121214',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      color: '#FFFFFF',
                      fontSize: '13px',
                      outline: 'none',
                      resize: 'none',
                    }}
                  />
                </div>

                <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                  <button
                    type="button"
                    onClick={() => setShowDispatchModal(false)}
                    style={{
                      padding: '10px 18px',
                      borderRadius: '8px',
                      backgroundColor: 'rgba(255, 255, 255, 0.08)',
                      color: '#FFFFFF',
                      border: 'none',
                      fontSize: '13px',
                      fontWeight: 600,
                      cursor: 'pointer',
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="tc-btn tc-btn-primary"
                    style={{
                      padding: '10px 22px',
                      borderRadius: '8px',
                      fontSize: '13px',
                      fontWeight: 700,
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                    }}
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
