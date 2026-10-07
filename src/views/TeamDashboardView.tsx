import React, { useState, useEffect } from 'react';
import {
  FolderGit2,
  CheckSquare,
  Video,
  Wallet,
  TrendingUp,
  ChevronDown,
  Calendar,
  Clock,
  ExternalLink,
  Loader2,
} from 'lucide-react';
import { DonutChart } from '../components/DonutChart';
import type { ScreenId } from '../App';
import { api } from '../services/api';
import type { User, Project, Meeting } from '../types';

interface TeamDashboardViewProps {
  onNavigate?: (view: ScreenId) => void;
}

interface ActivityItem {
  id: number;
  text: string;
  timestamp: string;
  author: string;
  avatar: string | null;
}

export const TeamDashboardView: React.FC<TeamDashboardViewProps> = ({ onNavigate }) => {
  const [user, setUser] = useState<User | null>(api.getActiveUser());
  const [taskRows, setTaskRows] = useState<any[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [walletBalance, setWalletBalance] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [activeDropdownId, setActiveDropdownId] = useState<number | null>(null);
  const [recentActivities, setRecentActivities] = useState<ActivityItem[]>([]);

  useEffect(() => {
    let mounted = true;
    setIsLoading(true);

    Promise.all([
      api.getCurrentUser().catch(() => api.getActiveUser()),
      api.getTasks().catch(() => []),
      api.getProjects().catch(() => []),
      api.getMeetings().catch(() => []),
      api.getWallet().catch(() => ({ balance: 0 })),
      api.getActivityFeed(10).catch(() => []),
    ]).then(([currentUser, fetchedTasks, fetchedProjects, fetchedMeetings, fetchedWallet, fetchedActivities]) => {
      if (!mounted) return;
      if (currentUser) setUser(currentUser);
      setTaskRows(
        (fetchedTasks || []).map((t: any) => ({
          id: t.id,
          name: t.task_title,
          project: t.project_name || 'Active Sprint Deliverable',
          due: t.deadline ? new Date(t.deadline).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'Flexible',
          priority: t.priority ? (t.priority.charAt(0).toUpperCase() + t.priority.slice(1)) : 'Medium',
          status: t.status === 'completed' ? 'Completed' : t.status === 'in_progress' ? 'In Progress' : 'Pending',
        }))
      );
      setProjects(fetchedProjects || []);
      setMeetings(fetchedMeetings || []);
      setWalletBalance(fetchedWallet?.balance || 0);
      setRecentActivities(fetchedActivities || []);
      setIsLoading(false);
    });

    return () => {
      mounted = false;
    };
  }, []);

  const handleStatusChange = async (id: number, newStatus: string) => {
    setTaskRows((prev) =>
      prev.map((t) => (t.id === id ? { ...t, status: newStatus } : t))
    );
    setActiveDropdownId(null);
    try {
      const backendStatus = (newStatus === 'Completed' ? 'completed' : newStatus === 'In Progress' ? 'in_progress' : 'open') as 'open' | 'in_progress' | 'completed';
      await api.updateTask(id, { status: backendStatus });
    } catch {
      // ignore
    }
  };

  const completedCount = taskRows.filter((t) => t.status === 'Completed').length;
  const inProgressCount = taskRows.filter((t) => t.status === 'In Progress').length;
  const pendingCount = taskRows.filter((t) => t.status !== 'Completed' && t.status !== 'In Progress').length;

  const donutSlices = [
    { label: 'Completed', value: completedCount, color: '#10B981' },
    { label: 'In Progress', value: inProgressCount, color: '#3B82F6' },
    { label: 'Pending', value: pendingCount, color: '#dfae32' },
  ];

  return (
    <div className="tc-view-wrapper tc-fade-in">
      {/* Top Greeting Header (Figma Frame 609:107) */}
      <div className="tc-page-header">
        <div>
          <h1 className="tc-page-title">
            Welcome back, {user?.first_name || (user?.full_name ? user.full_name.split(' ')[0] : 'Member')}! 👋
          </h1>
          <p className="tc-page-subtitle">
            Here's what's happening with your work today.
          </p>
        </div>
      </div>

      {/* 4 Metric Cards in a row (Figma Frame 613:253 - 613:291) */}
      <div className="tc-metrics-grid-4">
        {/* Card 1: My Projects */}
        <div className="tc-workspace-card tc-metric-card">
          <div className="tc-metric-header">
            <span className="tc-metric-label">My Projects</span>
            <div className="tc-metric-icon-box tc-metric-icon-box--gold">
              <FolderGit2 size={18} />
            </div>
          </div>
          <div className="tc-metric-value">
            {String(projects.length).padStart(2, '0')}
          </div>
          <div className="tc-metric-subtext">
            <TrendingUp size={14} />
            <span>Active team projects</span>
          </div>
        </div>

        {/* Card 2: My Tasks */}
        <div className="tc-workspace-card tc-metric-card">
          <div className="tc-metric-header">
            <span className="tc-metric-label">My Tasks</span>
            <div className="tc-metric-icon-box tc-metric-icon-box--gold">
              <CheckSquare size={18} />
            </div>
          </div>
          <div className="tc-metric-value">
            {String(taskRows.length).padStart(2, '0')}
          </div>
          <button
            type="button"
            onClick={() => onNavigate?.('tasks')}
            className="tc-card-link-btn"
          >
            View all tasks →
          </button>
        </div>

        {/* Card 3: Upcoming Meetings */}
        <div className="tc-workspace-card tc-metric-card">
          <div className="tc-metric-header">
            <span className="tc-metric-label">Upcoming Meetings</span>
            <div className="tc-metric-icon-box tc-metric-icon-box--gold">
              <Video size={18} />
            </div>
          </div>
          <div className="tc-metric-value">
            {String(meetings.length).padStart(2, '0')}
          </div>
          <button
            type="button"
            onClick={() => onNavigate?.('meetings')}
            className="tc-card-link-btn"
          >
            View all meetings →
          </button>
        </div>

        {/* Card 4: Wallet Balance */}
        <div className="tc-workspace-card tc-metric-card">
          <div className="tc-metric-header">
            <span className="tc-metric-label">Wallet Balance</span>
            <div className="tc-metric-icon-box tc-metric-icon-box--gold">
              <Wallet size={18} />
            </div>
          </div>
          <div className="tc-metric-value">
            ${walletBalance.toLocaleString()}
          </div>
          <button
            type="button"
            onClick={() => onNavigate?.('financials')}
            className="tc-card-link-btn"
          >
            View all payments →
          </button>
        </div>
      </div>

      {/* FULL-WIDTH CARD: My Tasks Table (Figma Rectangle 284 - 1100px wide) */}
      <div className="tc-workspace-card tc-card-section">
        <div className="tc-card-header-row">
          <div className="tc-metric-header">
            <span className="tc-live-dot" />
            <h2 className="tc-card-title">
              My Tasks
            </h2>
          </div>
          <button
            type="button"
            onClick={() => onNavigate?.('tasks')}
            className="tc-card-link-btn"
          >
            View All
          </button>
        </div>

        {/* Table */}
        <div className="tc-table-container">
          <table className="tc-data-table">
            <thead>
              <tr className="tc-table-head-row">
                <th className="tc-table-th">Task Name</th>
                <th className="tc-table-th">Project</th>
                <th className="tc-table-th">Due Date</th>
                <th className="tc-table-th">Priority</th>
                <th className="tc-table-th">Status</th>
                <th className="tc-table-th tc-table-th--right">Action</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="tc-table-empty">
                    <div className="tc-table-loading">
                      <Loader2 size={16} className="tc-spin" color="#dfae32" />
                      <span>Loading your assigned sprint tasks...</span>
                    </div>
                  </td>
                </tr>
              ) : taskRows.length === 0 ? (
                <tr>
                  <td colSpan={6} className="tc-table-empty">
                    No assigned tasks found. Your workload is currently clear.
                  </td>
                </tr>
              ) : (
                taskRows.map((row) => {
                  const priorityClass =
                    row.priority === 'Urgent'
                      ? 'tc-priority-badge--high'
                      : row.priority === 'High'
                      ? 'tc-priority-badge--high'
                      : row.priority === 'Medium'
                      ? 'tc-priority-badge--medium'
                      : 'tc-priority-badge--low';

                  const statusClass =
                    row.status === 'Completed'
                      ? 'tc-status-badge--completed'
                      : row.status === 'In Progress'
                      ? 'tc-status-badge--in-progress'
                      : 'tc-status-badge--pending';

                  return (
                    <tr key={row.id} className="tc-table-row">
                      <td className="tc-table-td tc-table-td--title">
                        <div className="tc-table-user-cell">
                          <span
                            className={`tc-live-dot ${
                              row.status === 'Completed' ? 'tc-live-dot--green' : 'tc-live-dot--gold'
                            }`}
                          />
                          {row.name}
                        </div>
                      </td>
                      <td className="tc-table-td">
                        {row.project}
                      </td>
                      <td className="tc-table-td">
                        {row.due}
                      </td>
                      <td className="tc-table-td">
                        <span className={`tc-priority-badge ${priorityClass}`}>
                          {row.priority}
                        </span>
                      </td>
                      <td className="tc-table-td">
                        <span className={`tc-status-badge ${statusClass}`}>
                          {row.status}
                        </span>
                      </td>
                      <td className="tc-table-td tc-table-td--right">
                        <button
                          type="button"
                          onClick={() =>
                            setActiveDropdownId(activeDropdownId === row.id ? null : row.id)
                          }
                          className="tc-action-btn-pill"
                        >
                          Update <ChevronDown size={12} />
                        </button>

                        {/* Status Dropdown Modal */}
                        {activeDropdownId === row.id && (
                          <div className="tc-status-dropdown-menu">
                            {['Open', 'In Progress', 'Completed'].map((s) => (
                              <button
                                key={s}
                                type="button"
                                onClick={() => handleStatusChange(row.id, s)}
                                className={`tc-status-dropdown-item ${row.status === s ? 'tc-status-dropdown-item--active' : ''}`}
                              >
                                {s}
                              </button>
                            ))}
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* BALANCED 2x2 GRID BELOW "MY TASKS" (Figma 538px / 538px) */}
      <div className="tc-dashboard-grid-2x2">
        {/* ROW 1 LEFT: My Project Progress Card (Figma 613:368) */}
        <div className="tc-grid-card">
          <div className="tc-card-header-row">
            <h3 className="tc-card-title">
              My Project Progress
            </h3>
            <button
              type="button"
              onClick={() => onNavigate?.('projects')}
              className="tc-card-link-btn"
            >
              View All
            </button>
          </div>

          {projects.length === 0 ? (
            <div className="tc-table-empty">
              No assigned projects yet. When you are assigned to a project sprint, it will appear here.
            </div>
          ) : (
            <div className="tc-progress-list">
              {projects.slice(0, 3).map((proj, idx) => {
                const pct =
                  proj.progress_percentage ??
                  (proj.status === 'completed'
                    ? 100
                    : proj.status === 'in_progress'
                    ? 65
                    : 25);
                const badgeStyle = pct >= 80 ? 'gold' : pct >= 50 ? 'blue' : 'gold';
                const deadlineStr = proj.deadline
                  ? new Date(proj.deadline).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })
                  : 'Flexible';

                return (
                  <div key={proj.id} className="tc-progress-item">
                    <div className="tc-progress-header">
                      <div>
                        <div className="tc-progress-title">{proj.project_name || proj.name || 'Project'}</div>
                        <div className="tc-progress-subtitle">
                          {proj.description ? proj.description.slice(0, 48) + '...' : 'Sprint Deliverable'}
                        </div>
                      </div>
                      <span className={`tc-progress-badge tc-progress-badge--${badgeStyle}`}>
                        {pct}%
                      </span>
                    </div>
                    <div className="tc-progress-bar-bg">
                      <div
                        className={`tc-progress-bar-fill tc-progress-bar-fill--${badgeStyle}`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                    <div className="tc-progress-date">
                      Deadline: {deadlineStr}
                    </div>
                    {idx < Math.min(projects.length, 3) - 1 && <div className="tc-progress-divider" />}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* ROW 1 RIGHT: Upcoming Meetings (Figma Rectangle 286) */}
        <div className="tc-grid-card">
          <div className="tc-card-header-row">
            <h3 className="tc-card-title">
              Upcoming Meetings
            </h3>
            <button
              type="button"
              onClick={() => onNavigate?.('meetings')}
              className="tc-card-link-btn"
            >
              View All
            </button>
          </div>

          {meetings.length === 0 ? (
            <div className="tc-meeting-inner-box tc-meeting-inner-box--empty">
              <div className="tc-meeting-empty-title">
                No upcoming meetings scheduled
              </div>
              <p className="tc-meeting-empty-desc">
                You have no calendar sessions booked for today.
              </p>
              <button
                type="button"
                onClick={() => onNavigate?.('meetings')}
                className="tc-gold-btn tc-gold-btn--full"
              >
                <Calendar size={16} />
                <span>Open Calendar</span>
              </button>
            </div>
          ) : (
            (() => {
              const nextMeeting = meetings[0];
              const meetingDate =
                nextMeeting.date || (nextMeeting as any).scheduled_at
                  ? new Date((nextMeeting as any).scheduled_at || nextMeeting.date).toLocaleDateString('en-US', {
                      weekday: 'short',
                      month: 'short',
                      day: 'numeric',
                    })
                  : 'Today';
              const meetingTime = nextMeeting.time || 'Upcoming';
              const meetUrl =
                (nextMeeting as any).meeting_url ||
                (nextMeeting as any).link ||
                'https://meet.google.com/titancode-sync';

              return (
                <div className="tc-meeting-inner-box">
                  <div className="tc-meeting-title">{nextMeeting.title}</div>

                  <div className="tc-meeting-meta">
                    <div className="tc-meeting-meta-item">
                      <Calendar size={14} color="#dfae32" />
                      <span>{meetingDate}</span>
                    </div>
                    <div className="tc-meeting-meta-item">
                      <Clock size={14} color="#dfae32" />
                      <span>{meetingTime}</span>
                    </div>
                  </div>

                  {/* Attendees */}
                  <div className="tc-attendee-group">
                    <div className="tc-attendee-list">
                      {(((nextMeeting as any).attendee_names && (nextMeeting as any).attendee_names.length > 0)
                        ? (nextMeeting as any).attendee_names
                        : Array.isArray((nextMeeting as any).attendees) && (nextMeeting as any).attendees.length > 0
                        ? (nextMeeting as any).attendees.map((a: any) => a.name || a.full_name)
                        : ['Team Sync']
                      ).map(
                        (name: string, idx: number) => (
                          <div
                            key={idx}
                            className={`tc-attendee-placeholder ${idx > 0 ? 'tc-attendee-overlap' : ''}`}
                            title={name}
                          >
                            {name
                              .split(' ')
                              .map((n: string) => n[0])
                              .join('')
                              .slice(0, 2)}
                          </div>
                        )
                      )}
                    </div>
                    <span className="tc-meeting-platform-label">Secure Video Meeting</span>
                  </div>

                  {/* Full width button */}
                  <a
                    href={meetUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="tc-gold-btn tc-gold-btn--full"
                  >
                    <Video size={17} />
                    <span>Join Meeting</span>
                    <ExternalLink size={14} />
                  </a>
                </div>
              );
            })()
          )}
        </div>

        {/* ROW 2 LEFT: Task Overview Donut (Figma Rectangle 288) */}
        <div className="tc-grid-card">
          <div className="tc-card-header-row">
            <h3 className="tc-card-title">
              Task Overview
            </h3>
            <span className="tc-donut-legend-label">Total: {taskRows.length} Tasks</span>
          </div>

          <div className="tc-donut-wrapper">
            <DonutChart slices={donutSlices} size={150} thickness={24} />
          </div>

          <div className="tc-donut-legend">
            {donutSlices.map((slice) => (
              <div key={slice.label} className="tc-donut-legend-item">
                <span className={`tc-donut-legend-dot tc-donut-legend-dot--${slice.label.toLowerCase().replace(' ', '-')}`} />
                <span className="tc-donut-legend-label">{slice.label}:</span>
                <span className="tc-donut-legend-value">{slice.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* ROW 2 RIGHT: Recent Activity Event Feed (Figma Rectangle 287) */}
        <div className="tc-grid-card">
          <div className="tc-card-header-row">
            <h3 className="tc-card-title">
              Recent Activity
            </h3>
            <button
              type="button"
              onClick={() => onNavigate?.('tasks')}
              className="tc-card-link-btn"
            >
              View All
            </button>
          </div>

          <div className="tc-list-stack">
            {recentActivities.length === 0 ? (
              <div className="tc-table-empty">
                No recent workspace activities recorded yet.
              </div>
            ) : (
              recentActivities.map((act) => (
                <div key={act.id} className="tc-approval-item">
                  <div className="tc-activity-avatar">
                    {act.avatar ? (
                      <img src={act.avatar} alt={act.author} />
                    ) : (
                      <div className="tc-activity-fallback">
                        {act.author
                          ?.split(' ')
                          .map((n) => n[0])
                          .join('')
                          .slice(0, 2)}
                      </div>
                    )}
                  </div>
                  <div className="tc-activity-content">
                    <div className="tc-activity-title">
                      {act.text}
                    </div>
                    <div className="tc-activity-meta">
                      {act.author} • {act.timestamp}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
