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

export const TeamDashboardView: React.FC<TeamDashboardViewProps> = ({ onNavigate }) => {
  const [user, setUser] = useState<User | null>(api.getActiveUser());
  const [taskRows, setTaskRows] = useState<any[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [walletBalance, setWalletBalance] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [activeDropdownId, setActiveDropdownId] = useState<number | null>(null);

  useEffect(() => {
    let mounted = true;
    setIsLoading(true);

    Promise.all([
      api.getCurrentUser().catch(() => api.getActiveUser()),
      api.getTasks().catch(() => []),
      api.getProjects().catch(() => []),
      api.getMeetings().catch(() => []),
      api.getWallet().catch(() => ({ balance: 0 })),
    ]).then(([currentUser, fetchedTasks, fetchedProjects, fetchedMeetings, fetchedWallet]) => {
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

  const recentActivities = [
    {
      id: 1,
      text: 'Pushed commit: auth split-card responsive overhaul',
      timestamp: '15 mins ago',
      author: 'Alex Morgan',
      avatar: '/assets/dashprofile.jpg',
    },
    {
      id: 2,
      text: 'Pull Request #42 merged: Escrow payout calculation hook',
      timestamp: '1 hour ago',
      author: 'Joseph John',
      avatar: '/assets/joseph.jpg',
    },
    {
      id: 3,
      text: 'Uploaded design specifications for Client Request Form',
      timestamp: '3 hours ago',
      author: 'Benedicta Atagamen',
      avatar: '/assets/benedicta.png',
    },
    {
      id: 4,
      text: 'Sumsub KYC employee status verified automatically',
      timestamp: 'Yesterday',
      author: 'Security Bot',
      avatar: '/assets/blessing.jpg',
    },
  ];

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '28px',
        paddingBottom: '40px',
        width: '100%',
      }}
      className="tc-fade-in"
    >
      {/* Top Greeting Header (Figma Frame 609:107) */}
      <div>
        <h1
          style={{
            fontSize: '26px',
            fontWeight: '700',
            color: '#FFFFFF',
            letterSpacing: '-0.4px',
            marginBottom: '4px',
          }}
        >
          Welcome back, {user?.first_name || (user?.full_name ? user.full_name.split(' ')[0] : 'Member')}! 👋
        </h1>
        <p
          style={{
            fontSize: '14px',
            color: '#9CA3AF',
            margin: 0,
          }}
        >
          Here's what's happening with your work today.
        </p>
      </div>

      {/* 4 Metric Cards in a row (Figma Frame 613:253 - 613:291) */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '20px',
        }}
      >
        {/* Card 1: My Projects */}
        <div
          className="figma-card"
          style={{
            borderRadius: '16px',
            padding: '22px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            minHeight: '160px',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '14px', color: '#9CA3AF', fontWeight: '500' }}>My Projects</span>
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '10px',
                backgroundColor: '#DFAE324D',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#DFAE32',
              }}
            >
              <FolderGit2 size={18} />
            </div>
          </div>
          <div style={{ fontSize: '32px', fontWeight: '700', color: '#FFFFFF', lineHeight: 1 }}>
            {String(projects.length).padStart(2, '0')}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: '#10B981' }}>
            <TrendingUp size={14} />
            <span>+ 1 since last month</span>
          </div>
        </div>

        {/* Card 2: My Tasks */}
        <div
          className="figma-card"
          style={{
            borderRadius: '16px',
            padding: '22px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            minHeight: '160px',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '14px', color: '#9CA3AF', fontWeight: '500' }}>My Tasks</span>
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '10px',
                backgroundColor: '#DFAE324D',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#DFAE32',
              }}
            >
              <CheckSquare size={18} />
            </div>
          </div>
          <div style={{ fontSize: '32px', fontWeight: '700', color: '#FFFFFF', lineHeight: 1 }}>
            {String(taskRows.length).padStart(2, '0')}
          </div>
          <button
            type="button"
            onClick={() => onNavigate?.('tasks')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              fontSize: '12px',
              color: '#DFAE32',
              fontWeight: '600',
              background: 'none',
              border: 'none',
              padding: 0,
              cursor: 'pointer',
              textAlign: 'left',
            }}
          >
            View all tasks →
          </button>
        </div>

        {/* Card 3: Upcoming Meetings */}
        <div
          className="figma-card"
          style={{
            borderRadius: '16px',
            padding: '22px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            minHeight: '160px',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '14px', color: '#9CA3AF', fontWeight: '500' }}>Upcoming Meetings</span>
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '10px',
                backgroundColor: '#DFAE324D',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#DFAE32',
              }}
            >
              <Video size={18} />
            </div>
          </div>
          <div style={{ fontSize: '32px', fontWeight: '700', color: '#FFFFFF', lineHeight: 1 }}>
            {String(meetings.length).padStart(2, '0')}
          </div>
          <button
            type="button"
            onClick={() => onNavigate?.('meetings')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              fontSize: '12px',
              color: '#DFAE32',
              fontWeight: '600',
              background: 'none',
              border: 'none',
              padding: 0,
              cursor: 'pointer',
              textAlign: 'left',
            }}
          >
            View all meetings →
          </button>
        </div>

        {/* Card 4: Wallet Balance */}
        <div
          className="figma-card"
          style={{
            borderRadius: '16px',
            padding: '22px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            minHeight: '160px',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '14px', color: '#9CA3AF', fontWeight: '500' }}>Wallet Balance</span>
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '10px',
                backgroundColor: '#DFAE324D',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#DFAE32',
              }}
            >
              <Wallet size={18} />
            </div>
          </div>
          <div style={{ fontSize: '30px', fontWeight: '700', color: '#FFFFFF', lineHeight: 1 }}>
            ₦{walletBalance.toLocaleString()}
          </div>
          <button
            type="button"
            onClick={() => onNavigate?.('financials')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              fontSize: '12px',
              color: '#DFAE32',
              fontWeight: '600',
              background: 'none',
              border: 'none',
              padding: 0,
              cursor: 'pointer',
              textAlign: 'left',
            }}
          >
            View all payments →
          </button>
        </div>
      </div>

      {/* FULL-WIDTH CARD: My Tasks Table (Figma Rectangle 284 - 1100px wide) */}
      <div
        style={{
          backgroundColor: '#232324',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          borderRadius: '16px',
          padding: '24px',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.25)',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '20px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#dfae32' }} />
            <h2 style={{ fontSize: '18px', fontWeight: '700', color: '#FFFFFF', margin: 0 }}>
              My Tasks
            </h2>
          </div>
          <button
            type="button"
            style={{
              background: 'none',
              border: 'none',
              color: '#9CA3AF',
              fontSize: '13px',
              fontWeight: 500,
              cursor: 'pointer',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = '#FFFFFF')}
            onMouseLeave={(e) => (e.currentTarget.style.color = '#9CA3AF')}
          >
            View All
          </button>
        </div>

        {/* Table */}
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.08)', color: '#9CA3AF' }}>
                <th style={{ padding: '12px 14px', fontWeight: '500' }}>Task Name</th>
                <th style={{ padding: '12px 14px', fontWeight: '500' }}>Project</th>
                <th style={{ padding: '12px 14px', fontWeight: '500' }}>Due Date</th>
                <th style={{ padding: '12px 14px', fontWeight: '500' }}>Priority</th>
                <th style={{ padding: '12px 14px', fontWeight: '500' }}>Status</th>
                <th style={{ padding: '12px 14px', fontWeight: '500', textAlign: 'right' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={6} style={{ padding: '36px', textAlign: 'center', color: '#9CA3AF' }}>
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                      <Loader2 size={16} className="tc-spin" color="#dfae32" />
                      <span>Loading your assigned sprint tasks...</span>
                    </div>
                  </td>
                </tr>
              ) : taskRows.length === 0 ? (
                <tr>
                  <td colSpan={6} style={{ padding: '36px', textAlign: 'center', color: '#9CA3AF', fontSize: '13px' }}>
                    No assigned tasks found. Your workload is currently clear.
                  </td>
                </tr>
              ) : (
                taskRows.map((row) => (
                <tr
                  key={row.id}
                  style={{
                    borderBottom: '1px solid rgba(255, 255, 255, 0.04)',
                    transition: 'background-color 0.15s ease',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.02)')}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                >
                  <td style={{ padding: '16px 14px', color: '#FFFFFF', fontWeight: '500' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span
                        style={{
                          width: '6px',
                          height: '6px',
                          borderRadius: '50%',
                          backgroundColor: row.status === 'Completed' ? '#10B981' : '#dfae32',
                        }}
                      />
                      {row.name}
                    </div>
                  </td>
                  <td style={{ padding: '16px 14px', color: '#D1D5DB' }}>
                    {row.project}
                  </td>
                  <td style={{ padding: '16px 14px', color: '#9CA3AF' }}>
                    {row.due}
                  </td>
                  <td style={{ padding: '16px 14px' }}>
                    <span
                      style={{
                        padding: '4px 10px',
                        borderRadius: '9999px',
                        backgroundColor:
                          row.priority === 'Urgent'
                            ? '#EF4444'
                            : row.priority === 'High'
                            ? 'rgba(239, 68, 68, 0.8)'
                            : '#6B7280',
                        color: '#FFFFFF',
                        fontSize: '11px',
                        fontWeight: '600',
                      }}
                    >
                      {row.priority}
                    </span>
                  </td>
                  <td style={{ padding: '16px 14px' }}>
                    <span
                      style={{
                        padding: '4px 10px',
                        borderRadius: '9999px',
                        backgroundColor:
                          row.status === 'Completed'
                            ? 'rgba(16, 185, 129, 0.15)'
                            : 'rgba(223, 174, 50, 0.15)',
                        color: row.status === 'Completed' ? '#10B981' : '#dfae32',
                        fontSize: '11px',
                        fontWeight: '600',
                      }}
                    >
                      {row.status}
                    </span>
                  </td>
                  <td style={{ padding: '16px 14px', textAlign: 'right', position: 'relative' }}>
                    <button
                      type="button"
                      onClick={() =>
                        setActiveDropdownId(activeDropdownId === row.id ? null : row.id)
                      }
                      style={{
                        padding: '4px 10px',
                        borderRadius: '9999px',
                        backgroundColor: 'rgba(255, 255, 255, 0.05)',
                        border: '1px solid rgba(255, 255, 255, 0.15)',
                        color: '#FFFFFF',
                        fontSize: '11px',
                        fontWeight: '500',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '4px',
                        cursor: 'pointer',
                      }}
                    >
                      Update <ChevronDown size={12} />
                    </button>

                    {/* Status Dropdown Modal */}
                    {activeDropdownId === row.id && (
                      <div
                        style={{
                          position: 'absolute',
                          right: '14px',
                          top: '48px',
                          backgroundColor: '#1E1E1F',
                          border: '1px solid rgba(255, 255, 255, 0.12)',
                          borderRadius: '8px',
                          boxShadow: '0 8px 24px rgba(0, 0, 0, 0.5)',
                          zIndex: 20,
                          minWidth: '130px',
                          padding: '4px 0',
                          textAlign: 'left',
                        }}
                      >
                        {['Open', 'In Progress', 'Completed'].map((s) => (
                          <button
                            key={s}
                            type="button"
                            onClick={() => handleStatusChange(row.id, s)}
                            style={{
                              display: 'block',
                              width: '100%',
                              padding: '8px 12px',
                              background: 'none',
                              border: 'none',
                              color: row.status === s ? '#dfae32' : '#FFFFFF',
                              fontSize: '12px',
                              cursor: 'pointer',
                              textAlign: 'left',
                            }}
                            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.05)')}
                            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                          >
                            {s}
                          </button>
                        ))}
                      </div>
                    )}
                  </td>
                </tr>
              )))}
            </tbody>
          </table>
        </div>
      </div>

      {/* BALANCED 2x2 GRID BELOW "MY TASKS" (Figma 538px / 538px) */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(480px, 1fr))',
          gap: '24px',
        }}
      >
        {/* ROW 1 LEFT: My Project Progress Card (Figma 613:368) */}
        <div
          style={{
            backgroundColor: '#232324',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: '16px',
            padding: '24px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#FFFFFF', margin: 0 }}>
              My Project Progress
            </h3>
            <button
              type="button"
              style={{ background: 'none', border: 'none', color: '#9CA3AF', fontSize: '13px', cursor: 'pointer' }}
            >
              View All
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {/* Project 1 */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <div>
                  <div style={{ fontSize: '14px', fontWeight: '600', color: '#FFFFFF' }}>
                    TitanCode Web Platform
                  </div>
                  <div style={{ fontSize: '12px', color: '#9CA3AF' }}>Frontend Architecture</div>
                </div>
                <span
                  style={{
                    padding: '3px 8px',
                    borderRadius: '9999px',
                    backgroundColor: '#DFAE324D',
                    color: '#dfae32',
                    fontSize: '11px',
                    fontWeight: '600',
                  }}
                >
                  85%
                </span>
              </div>
              <div style={{ height: '8px', borderRadius: '4px', backgroundColor: 'rgba(255, 255, 255, 0.08)', overflow: 'hidden' }}>
                <div style={{ width: '85%', height: '100%', backgroundColor: '#dfae32', borderRadius: '4px' }} />
              </div>
              <div style={{ fontSize: '11px', color: '#6B7280', marginTop: '6px' }}>
                Deadline: Aug 30, 2024
              </div>
            </div>

            <div style={{ height: '1px', backgroundColor: 'rgba(255, 255, 255, 0.06)' }} />

            {/* Project 2 */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <div>
                  <div style={{ fontSize: '14px', fontWeight: '600', color: '#FFFFFF' }}>
                    Aurelia FinTech Mobile App
                  </div>
                  <div style={{ fontSize: '12px', color: '#9CA3AF' }}>React Native & WebRTC</div>
                </div>
                <span
                  style={{
                    padding: '3px 8px',
                    borderRadius: '9999px',
                    backgroundColor: 'rgba(59, 130, 246, 0.15)',
                    color: '#3B82F6',
                    fontSize: '11px',
                    fontWeight: '600',
                  }}
                >
                  60%
                </span>
              </div>
              <div style={{ height: '8px', borderRadius: '4px', backgroundColor: 'rgba(255, 255, 255, 0.08)', overflow: 'hidden' }}>
                <div style={{ width: '60%', height: '100%', backgroundColor: '#3B82F6', borderRadius: '4px' }} />
              </div>
              <div style={{ fontSize: '11px', color: '#6B7280', marginTop: '6px' }}>
                Deadline: Sep 15, 2024
              </div>
            </div>
          </div>
        </div>

        {/* ROW 1 RIGHT: Upcoming Meetings (Figma Rectangle 286) */}
        <div
          style={{
            backgroundColor: '#232324',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: '16px',
            padding: '24px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#FFFFFF', margin: 0 }}>
              Upcoming Meetings
            </h3>
            <button
              type="button"
              style={{ background: 'none', border: 'none', color: '#9CA3AF', fontSize: '13px', cursor: 'pointer' }}
            >
              View All
            </button>
          </div>

          <div
            style={{
              padding: '18px',
              borderRadius: '12px',
              backgroundColor: 'rgba(255, 255, 255, 0.03)',
              border: '1px solid rgba(255, 255, 255, 0.06)',
            }}
          >
            <div style={{ fontSize: '16px', fontWeight: '700', color: '#FFFFFF', marginBottom: '8px' }}>
              TitanCode Weekly Sync & Sprint Review
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', fontSize: '13px', color: '#9CA3AF', marginBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Calendar size={14} color="#dfae32" />
                <span>Today</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Clock size={14} color="#dfae32" />
                <span>05:30 PM - 06:15 PM WAT</span>
              </div>
            </div>

            {/* Attendees Stack (Figma 613:494) */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px' }}>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                {['/assets/joseph.jpg', '/assets/benedicta.png', '/assets/munis.jpg', '/assets/blessing.jpg'].map(
                  (avatar, idx) => (
                    <div
                      key={idx}
                      style={{
                        width: '32px',
                        height: '32px',
                        borderRadius: '50%',
                        overflow: 'hidden',
                        border: '2px solid #232324',
                        marginLeft: idx === 0 ? 0 : '-8px',
                      }}
                    >
                      <img src={avatar} alt="Attendee" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </div>
                  )
                )}
                <div
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    backgroundColor: 'rgba(223, 174, 50, 0.2)',
                    border: '2px solid #232324',
                    marginLeft: '-8px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '11px',
                    fontWeight: '700',
                    color: '#dfae32',
                  }}
                >
                  +3
                </div>
              </div>
              <span style={{ fontSize: '12px', color: '#9CA3AF' }}>Google Meet</span>
            </div>

            {/* FULL-WIDTH "Join Meeting" Button (Figma Frame 613:506: 478px wide) */}
            <a
              href="https://meet.google.com/titancode-sync"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                width: '100%',
                height: '44px',
                borderRadius: '10px',
                backgroundColor: '#dfae32',
                color: '#0b0b0c',
                fontWeight: '700',
                fontSize: '14px',
                textDecoration: 'none',
                transition: 'background-color 0.15s ease',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#ECC046')}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#dfae32')}
            >
              <Video size={17} />
              <span>Join Meeting</span>
              <ExternalLink size={14} />
            </a>
          </div>
        </div>

        {/* ROW 2 LEFT: Task Overview Donut (Figma Rectangle 288) */}
        <div
          style={{
            backgroundColor: '#232324',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: '16px',
            padding: '24px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#FFFFFF', margin: 0 }}>
              Task Overview
            </h3>
            <span style={{ fontSize: '12px', color: '#9CA3AF' }}>Total: {taskRows.length} Tasks</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '10px 0' }}>
            <DonutChart slices={donutSlices} size={150} thickness={24} />
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-around', marginTop: '16px' }}>
            {donutSlices.map((slice) => (
              <div key={slice.label} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: slice.color }} />
                <span style={{ fontSize: '12px', color: '#9CA3AF' }}>{slice.label}:</span>
                <span style={{ fontSize: '13px', fontWeight: '700', color: '#FFFFFF' }}>{slice.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* ROW 2 RIGHT: Recent Activity Event Feed (Figma Rectangle 287) */}
        <div
          style={{
            backgroundColor: '#232324',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: '16px',
            padding: '24px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#FFFFFF', margin: 0 }}>
              Recent Activity
            </h3>
            <button
              type="button"
              style={{ background: 'none', border: 'none', color: '#9CA3AF', fontSize: '13px', cursor: 'pointer' }}
            >
              View All
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {recentActivities.map((act) => (
              <div
                key={act.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '10px 12px',
                  borderRadius: '10px',
                  backgroundColor: 'rgba(255, 255, 255, 0.02)',
                  border: '1px solid rgba(255, 255, 255, 0.04)',
                }}
              >
                <div
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    overflow: 'hidden',
                    flexShrink: 0,
                  }}
                >
                  <img src={act.avatar} alt={act.author} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div
                    style={{
                      fontSize: '13px',
                      color: '#FFFFFF',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    }}
                  >
                    {act.text}
                  </div>
                  <div style={{ fontSize: '11px', color: '#9CA3AF', marginTop: '2px' }}>
                    {act.author} • {act.timestamp}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
