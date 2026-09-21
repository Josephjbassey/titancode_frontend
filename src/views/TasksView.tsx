import React, { useState } from 'react';
import {
  Plus,
  Search,
  Clock,
  X,
  LayoutGrid,
  List as ListIcon,
} from 'lucide-react';
import type { ScreenId } from '../App';

interface Task {
  id: string;
  title: string;
  project: string;
  assignee: { name: string; avatar: string };
  priority: 'Urgent' | 'High' | 'Medium';
  status: 'Open' | 'In Progress' | 'Completed';
  deadline: string;
  description: string;
}

const INITIAL_TASKS: Task[] = [
  {
    id: 'TSK-201',
    title: 'Implement WebRTC audio and video mesh signaling',
    project: 'Aurelia FinTech Mobile App',
    assignee: { name: 'Joseph John', avatar: '/assets/team_joseph.png' },
    priority: 'Urgent',
    status: 'In Progress',
    deadline: '2026-09-24',
    description: 'Hook into the WebRTC signaling gateway with bidirectional WebSocket events and fallback ICE candidate handling.',
  },
  {
    id: 'TSK-202',
    title: 'Design high-fidelity wallet transaction receipt cards',
    project: 'Aurelia FinTech Mobile App',
    assignee: { name: 'Benedicta Atagamen', avatar: '/assets/team_benedicta.png' },
    priority: 'High',
    status: 'Completed',
    deadline: '2026-09-19',
    description: 'Create dark-mode receipt components with downloadable PDF invoice export and transaction hash copy triggers.',
  },
  {
    id: 'TSK-203',
    title: 'Configure PostgreSQL pg_stat_statements & indexes',
    project: 'TitanCore SaaS Cloud Engine',
    assignee: { name: 'Munis Samuel', avatar: '/assets/team_munis.png' },
    priority: 'Medium',
    status: 'Open',
    deadline: '2026-10-02',
    description: 'Optimize high-traffic query bottlenecks on the project payout transactions audit table.',
  },
  {
    id: 'TSK-204',
    title: 'Product requirements spec for client onboarding portal',
    project: 'PulseHealth Telemedicine Portal',
    assignee: { name: 'Olukayode Tioluwanimi', avatar: '/assets/team_olukayode.png' },
    priority: 'High',
    status: 'In Progress',
    deadline: '2026-09-28',
    description: 'Draft the user story breakdown, role permission matrices, and acceptance criteria for patient verification.',
  },
  {
    id: 'TSK-205',
    title: 'Execute DEX liquidity flash-loan slippage benchmark',
    project: 'OmniTrade Crypto Arbitrage Bot',
    assignee: { name: 'Joseph John', avatar: '/assets/team_joseph.png' },
    priority: 'Urgent',
    status: 'Completed',
    deadline: '2026-09-18',
    description: 'Stress-test mempool trade executions against simulated 5% flash price swings across Uniswap & Curve.',
  },
];

interface TasksViewProps {
  onNavigate?: (view: ScreenId) => void;
}

export const TasksView: React.FC<TasksViewProps> = ({ onNavigate: _onNavigate }) => {
  const [tasks, setTasks] = useState<Task[]>(INITIAL_TASKS);
  const [viewMode, setViewMode] = useState<'kanban' | 'list'>('kanban');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterPriority, setFilterPriority] = useState<string>('All');
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);

  // New task form state
  const [newTitle, setNewTitle] = useState('');
  const [newProject, setNewProject] = useState('Aurelia FinTech Mobile App');
  const [newPriority, setNewPriority] = useState<'Urgent' | 'High' | 'Medium'>('High');
  const [newDeadline, setNewDeadline] = useState('');
  const [newDescription, setNewDescription] = useState('');

  const filteredTasks = tasks.filter((task) => {
    const matchesPriority = filterPriority === 'All' || task.priority === filterPriority;
    const matchesSearch =
      task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.project.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.id.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesPriority && matchesSearch;
  });

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const newTask: Task = {
      id: `TSK-${Math.floor(200 + Math.random() * 800)}`,
      title: newTitle,
      project: newProject,
      assignee: { name: 'Joseph John', avatar: '/assets/team_joseph.png' },
      priority: newPriority,
      status: 'Open',
      deadline: newDeadline || '2026-10-10',
      description: newDescription || 'Standard engineering task delivery.',
    };

    setTasks([newTask, ...tasks]);
    setShowCreateModal(false);
    setNewTitle('');
    setNewDescription('');
    setNewDeadline('');
  };

  const updateTaskStatus = (taskId: string, newStatus: 'Open' | 'In Progress' | 'Completed') => {
    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, status: newStatus } : t))
    );
    if (selectedTask && selectedTask.id === taskId) {
      setSelectedTask((prev) => (prev ? { ...prev, status: newStatus } : null));
    }
  };

  return (
    <div style={{ color: '#FFFFFF' }}>
      {/* Top Header */}
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
          <h1 style={{ fontSize: '26px', fontWeight: 800, margin: 0, color: '#FFFFFF' }}>
            Task Management
          </h1>
          <p style={{ color: '#9CA3AF', fontSize: '14px', margin: '4px 0 0' }}>
            Coordinate project sprints, manage member workloads, and update sprint deliverables.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {/* View Mode Toggle */}
          <div
            style={{
              display: 'flex',
              backgroundColor: '#11151F',
              borderRadius: '8px',
              padding: '3px',
              border: '1px solid rgba(255, 255, 255, 0.08)',
            }}
          >
            <button
              type="button"
              onClick={() => setViewMode('kanban')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '6px 12px',
                borderRadius: '6px',
                border: 'none',
                backgroundColor: viewMode === 'kanban' ? '#E5A83B' : 'transparent',
                color: viewMode === 'kanban' ? '#0A0D14' : '#9CA3AF',
                fontWeight: 600,
                fontSize: '13px',
                cursor: 'pointer',
              }}
            >
              <LayoutGrid size={15} />
              <span>Board</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode('list')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '6px 12px',
                borderRadius: '6px',
                border: 'none',
                backgroundColor: viewMode === 'list' ? '#E5A83B' : 'transparent',
                color: viewMode === 'list' ? '#0A0D14' : '#9CA3AF',
                fontWeight: 600,
                fontSize: '13px',
                cursor: 'pointer',
              }}
            >
              <ListIcon size={15} />
              <span>List</span>
            </button>
          </div>

          <button
            type="button"
            onClick={() => setShowCreateModal(true)}
            style={{
              backgroundColor: '#E5A83B',
              color: '#0A0D14',
              fontWeight: 700,
              fontSize: '14px',
              padding: '10px 20px',
              borderRadius: '8px',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              boxShadow: '0 4px 14px rgba(229, 168, 59, 0.25)',
            }}
          >
            <Plus size={18} strokeWidth={2.5} />
            <span>Create Task</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '16px',
          marginBottom: '24px',
          flexWrap: 'wrap',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ fontSize: '13px', color: '#9CA3AF' }}>Priority Filter:</span>
          {(['All', 'Urgent', 'High', 'Medium'] as const).map((priority) => (
            <button
              key={priority}
              type="button"
              onClick={() => setFilterPriority(priority)}
              style={{
                padding: '6px 14px',
                borderRadius: '6px',
                border: '1px solid',
                borderColor: filterPriority === priority ? '#E5A83B' : 'rgba(255, 255, 255, 0.08)',
                backgroundColor: filterPriority === priority ? 'rgba(229, 168, 59, 0.15)' : '#11151F',
                color: filterPriority === priority ? '#E5A83B' : '#9CA3AF',
                fontSize: '12px',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              {priority}
            </button>
          ))}
        </div>

        <div style={{ position: 'relative', width: '300px' }}>
          <Search
            size={16}
            color="#9CA3AF"
            style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }}
          />
          <input
            type="text"
            placeholder="Search tasks..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: '100%',
              backgroundColor: '#11151F',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: '8px',
              padding: '8px 12px 8px 36px',
              color: '#FFFFFF',
              fontSize: '13px',
              outline: 'none',
            }}
          />
        </div>
      </div>

      {/* KANBAN BOARD VIEW */}
      {viewMode === 'kanban' ? (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '20px',
            alignItems: 'start',
          }}
        >
          {(['Open', 'In Progress', 'Completed'] as const).map((colStatus) => {
            const colTasks = filteredTasks.filter((t) => t.status === colStatus);
            const statusTheme = {
              Open: { border: '#9CA3AF', title: 'To Do / Backlog' },
              'In Progress': { border: '#E5A83B', title: 'In Active Sprint' },
              Completed: { border: '#10B981', title: 'QA Approved & Done' },
            }[colStatus];

            return (
              <div
                key={colStatus}
                style={{
                  backgroundColor: '#0E121B',
                  borderRadius: '14px',
                  padding: '18px',
                  border: '1px solid rgba(255, 255, 255, 0.06)',
                  minHeight: '520px',
                }}
              >
                {/* Column Header */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: '16px',
                    paddingBottom: '12px',
                    borderBottom: `2px solid ${statusTheme.border}`,
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontWeight: 700, fontSize: '15px', color: '#FFFFFF' }}>
                      {statusTheme.title}
                    </span>
                    <span
                      style={{
                        backgroundColor: 'rgba(255, 255, 255, 0.08)',
                        padding: '2px 8px',
                        borderRadius: '999px',
                        fontSize: '11px',
                        fontWeight: 700,
                        color: '#9CA3AF',
                      }}
                    >
                      {colTasks.length}
                    </span>
                  </div>
                </div>

                {/* Tasks List */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {colTasks.map((task) => {
                    const priorityColor = {
                      Urgent: { bg: 'rgba(239, 68, 68, 0.15)', text: '#EF4444' },
                      High: { bg: 'rgba(229, 168, 59, 0.15)', text: '#E5A83B' },
                      Medium: { bg: 'rgba(59, 130, 246, 0.15)', text: '#3B82F6' },
                    }[task.priority];

                    return (
                      <div
                        key={task.id}
                        onClick={() => setSelectedTask(task)}
                        style={{
                          backgroundColor: '#11151F',
                          borderRadius: '10px',
                          padding: '16px',
                          border: '1px solid rgba(255, 255, 255, 0.06)',
                          cursor: 'pointer',
                          transition: 'all 0.15s ease',
                        }}
                        onMouseOver={(e) => {
                          e.currentTarget.style.borderColor = 'rgba(229, 168, 59, 0.4)';
                          e.currentTarget.style.transform = 'translateY(-2px)';
                        }}
                        onMouseOut={(e) => {
                          e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.06)';
                          e.currentTarget.style.transform = 'translateY(0)';
                        }}
                      >
                        {/* Tags */}
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                          <span style={{ fontSize: '11px', color: '#9CA3AF' }}>{task.id}</span>
                          <span
                            style={{
                              fontSize: '11px',
                              fontWeight: 700,
                              padding: '2px 8px',
                              borderRadius: '4px',
                              backgroundColor: priorityColor.bg,
                              color: priorityColor.text,
                            }}
                          >
                            {task.priority}
                          </span>
                        </div>

                        {/* Title */}
                        <h4 style={{ fontSize: '14px', fontWeight: 600, color: '#FFFFFF', margin: '0 0 8px', lineHeight: 1.4 }}>
                          {task.title}
                        </h4>

                        <div style={{ fontSize: '12px', color: '#E5A83B', marginBottom: '14px' }}>
                          {task.project}
                        </div>

                        {/* Footer info */}
                        <div
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            borderTop: '1px solid rgba(255, 255, 255, 0.05)',
                            paddingTop: '10px',
                            fontSize: '11px',
                            color: '#9CA3AF',
                          }}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <img
                              src={task.assignee.avatar}
                              alt={task.assignee.name}
                              style={{ width: '22px', height: '22px', borderRadius: '50%', objectFit: 'cover' }}
                            />
                            <span>{task.assignee.name.split(' ')[0]}</span>
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <Clock size={12} />
                            <span>{task.deadline}</span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* TABLE LIST VIEW */
        <div
          style={{
            backgroundColor: '#11151F',
            borderRadius: '12px',
            border: '1px solid rgba(255, 255, 255, 0.06)',
            overflow: 'hidden',
          }}
        >
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
            <thead>
              <tr style={{ backgroundColor: '#0E121B', color: '#9CA3AF', borderBottom: '1px solid rgba(255, 255, 255, 0.08)' }}>
                <th style={{ padding: '14px 18px' }}>Task ID & Title</th>
                <th style={{ padding: '14px 18px' }}>Project</th>
                <th style={{ padding: '14px 18px' }}>Assignee</th>
                <th style={{ padding: '14px 18px' }}>Priority</th>
                <th style={{ padding: '14px 18px' }}>Status</th>
                <th style={{ padding: '14px 18px' }}>Due Date</th>
              </tr>
            </thead>
            <tbody>
              {filteredTasks.map((t) => (
                <tr
                  key={t.id}
                  onClick={() => setSelectedTask(t)}
                  style={{
                    borderBottom: '1px solid rgba(255, 255, 255, 0.04)',
                    cursor: 'pointer',
                    transition: 'background-color 0.15s',
                  }}
                  onMouseOver={(e) => (e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.03)')}
                  onMouseOut={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                >
                  <td style={{ padding: '14px 18px' }}>
                    <div style={{ fontWeight: 600, color: '#FFFFFF' }}>{t.title}</div>
                    <div style={{ color: '#9CA3AF', fontSize: '11px' }}>{t.id}</div>
                  </td>
                  <td style={{ padding: '14px 18px', color: '#E5A83B' }}>{t.project}</td>
                  <td style={{ padding: '14px 18px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <img
                        src={t.assignee.avatar}
                        alt={t.assignee.name}
                        style={{ width: '24px', height: '24px', borderRadius: '50%', objectFit: 'cover' }}
                      />
                      <span>{t.assignee.name}</span>
                    </div>
                  </td>
                  <td style={{ padding: '14px 18px' }}>
                    <span
                      style={{
                        padding: '3px 8px',
                        borderRadius: '4px',
                        fontSize: '11px',
                        fontWeight: 700,
                        backgroundColor: t.priority === 'Urgent' ? 'rgba(239, 68, 68, 0.15)' : 'rgba(229, 168, 59, 0.15)',
                        color: t.priority === 'Urgent' ? '#EF4444' : '#E5A83B',
                      }}
                    >
                      {t.priority}
                    </span>
                  </td>
                  <td style={{ padding: '14px 18px' }}>
                    <span
                      style={{
                        padding: '4px 10px',
                        borderRadius: '999px',
                        fontSize: '11px',
                        fontWeight: 600,
                        backgroundColor:
                          t.status === 'Completed'
                            ? 'rgba(16, 185, 129, 0.15)'
                            : t.status === 'In Progress'
                            ? 'rgba(229, 168, 59, 0.15)'
                            : 'rgba(156, 163, 175, 0.15)',
                        color:
                          t.status === 'Completed'
                            ? '#10B981'
                            : t.status === 'In Progress'
                            ? '#E5A83B'
                            : '#9CA3AF',
                      }}
                    >
                      {t.status}
                    </span>
                  </td>
                  <td style={{ padding: '14px 18px', color: '#9CA3AF' }}>{t.deadline}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* TASK DETAIL MODAL */}
      {selectedTask && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.75)',
            backdropFilter: 'blur(5px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '20px',
          }}
          onClick={() => setSelectedTask(null)}
        >
          <div
            style={{
              backgroundColor: '#11151F',
              border: '1px solid rgba(229, 168, 59, 0.3)',
              borderRadius: '16px',
              maxWidth: '560px',
              width: '100%',
              padding: '28px',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '18px' }}>
              <div>
                <span style={{ color: '#E5A83B', fontSize: '12px', fontWeight: 700 }}>
                  {selectedTask.id} ● {selectedTask.project}
                </span>
                <h3 style={{ fontSize: '20px', fontWeight: 800, margin: '6px 0 0', color: '#FFFFFF' }}>
                  {selectedTask.title}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedTask(null)}
                style={{ background: 'none', border: 'none', color: '#9CA3AF', cursor: 'pointer' }}
              >
                <X size={20} />
              </button>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <div style={{ fontSize: '13px', color: '#9CA3AF', marginBottom: '6px' }}>Task Instructions</div>
              <p style={{ backgroundColor: '#0B0E14', padding: '14px', borderRadius: '8px', color: '#D1D5DB', fontSize: '14px', lineHeight: 1.6 }}>
                {selectedTask.description}
              </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '24px' }}>
              <div style={{ backgroundColor: '#0B0E14', padding: '12px 14px', borderRadius: '8px' }}>
                <div style={{ fontSize: '11px', color: '#9CA3AF' }}>Assignee</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '4px' }}>
                  <img
                    src={selectedTask.assignee.avatar}
                    alt={selectedTask.assignee.name}
                    style={{ width: '26px', height: '26px', borderRadius: '50%', objectFit: 'cover' }}
                  />
                  <span style={{ fontSize: '13px', fontWeight: 600 }}>{selectedTask.assignee.name}</span>
                </div>
              </div>
              <div style={{ backgroundColor: '#0B0E14', padding: '12px 14px', borderRadius: '8px' }}>
                <div style={{ fontSize: '11px', color: '#9CA3AF' }}>Sprint Deadline</div>
                <div style={{ fontSize: '14px', fontWeight: 700, color: '#E5A83B', marginTop: '6px' }}>
                  {selectedTask.deadline}
                </div>
              </div>
            </div>

            {/* Quick Status Updater */}
            <div style={{ marginBottom: '24px' }}>
              <div style={{ fontSize: '13px', color: '#9CA3AF', marginBottom: '8px' }}>Update Task Lifecycle:</div>
              <div style={{ display: 'flex', gap: '10px' }}>
                {(['Open', 'In Progress', 'Completed'] as const).map((st) => (
                  <button
                    key={st}
                    type="button"
                    onClick={() => updateTaskStatus(selectedTask.id, st)}
                    style={{
                      flex: 1,
                      padding: '10px',
                      borderRadius: '8px',
                      border: selectedTask.status === st ? '1px solid #E5A83B' : '1px solid rgba(255, 255, 255, 0.08)',
                      backgroundColor: selectedTask.status === st ? 'rgba(229, 168, 59, 0.15)' : '#0B0E14',
                      color: selectedTask.status === st ? '#E5A83B' : '#9CA3AF',
                      fontWeight: 600,
                      fontSize: '12px',
                      cursor: 'pointer',
                    }}
                  >
                    {st}
                  </button>
                ))}
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <button
                type="button"
                onClick={() => setSelectedTask(null)}
                style={{
                  backgroundColor: '#E5A83B',
                  color: '#0A0D14',
                  fontWeight: 700,
                  fontSize: '14px',
                  padding: '10px 22px',
                  borderRadius: '8px',
                  border: 'none',
                  cursor: 'pointer',
                }}
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CREATE TASK MODAL */}
      {showCreateModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.75)',
            backdropFilter: 'blur(5px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '20px',
          }}
          onClick={() => setShowCreateModal(false)}
        >
          <div
            style={{
              backgroundColor: '#11151F',
              border: '1px solid rgba(229, 168, 59, 0.3)',
              borderRadius: '16px',
              maxWidth: '520px',
              width: '100%',
              padding: '28px',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ fontSize: '20px', fontWeight: 800, margin: 0, color: '#FFFFFF' }}>
                Create Sprint Task
              </h3>
              <button
                type="button"
                onClick={() => setShowCreateModal(false)}
                style={{ background: 'none', border: 'none', color: '#9CA3AF', cursor: 'pointer' }}
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleCreateTask}>
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '13px', color: '#9CA3AF', marginBottom: '6px' }}>
                  Task Title
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Implement WebRTC signaling protocol"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  style={{
                    width: '100%',
                    backgroundColor: '#0B0E14',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '8px',
                    padding: '10px 14px',
                    color: '#FFFFFF',
                    fontSize: '14px',
                    outline: 'none',
                  }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', color: '#9CA3AF', marginBottom: '6px' }}>
                    Project
                  </label>
                  <select
                    value={newProject}
                    onChange={(e) => setNewProject(e.target.value)}
                    style={{
                      width: '100%',
                      backgroundColor: '#0B0E14',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      borderRadius: '8px',
                      padding: '10px 14px',
                      color: '#FFFFFF',
                      fontSize: '13px',
                      outline: 'none',
                    }}
                  >
                    <option value="Aurelia FinTech Mobile App">Aurelia FinTech Mobile App</option>
                    <option value="TitanCore SaaS Cloud Engine">TitanCore SaaS Cloud Engine</option>
                    <option value="OmniTrade Crypto Arbitrage Bot">OmniTrade Crypto Arbitrage Bot</option>
                    <option value="PulseHealth Telemedicine Portal">PulseHealth Telemedicine Portal</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '13px', color: '#9CA3AF', marginBottom: '6px' }}>
                    Priority
                  </label>
                  <select
                    value={newPriority}
                    onChange={(e) => setNewPriority(e.target.value as any)}
                    style={{
                      width: '100%',
                      backgroundColor: '#0B0E14',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      borderRadius: '8px',
                      padding: '10px 14px',
                      color: '#FFFFFF',
                      fontSize: '13px',
                      outline: 'none',
                    }}
                  >
                    <option value="Urgent">Urgent</option>
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                  </select>
                </div>
              </div>

              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '13px', color: '#9CA3AF', marginBottom: '6px' }}>
                  Deadline
                </label>
                <input
                  type="date"
                  value={newDeadline}
                  onChange={(e) => setNewDeadline(e.target.value)}
                  style={{
                    width: '100%',
                    backgroundColor: '#0B0E14',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '8px',
                    padding: '10px 14px',
                    color: '#FFFFFF',
                    fontSize: '14px',
                    outline: 'none',
                  }}
                />
              </div>

              <div style={{ marginBottom: '24px' }}>
                <label style={{ display: 'block', fontSize: '13px', color: '#9CA3AF', marginBottom: '6px' }}>
                  Task Scope / Acceptance Criteria
                </label>
                <textarea
                  rows={3}
                  placeholder="Outline expected deliverables and edge cases..."
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  style={{
                    width: '100%',
                    backgroundColor: '#0B0E14',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '8px',
                    padding: '10px 14px',
                    color: '#FFFFFF',
                    fontSize: '14px',
                    outline: 'none',
                    resize: 'none',
                  }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  style={{
                    backgroundColor: 'transparent',
                    color: '#9CA3AF',
                    padding: '10px 16px',
                    borderRadius: '8px',
                    border: 'none',
                    cursor: 'pointer',
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{
                    backgroundColor: '#E5A83B',
                    color: '#0A0D14',
                    fontWeight: 700,
                    padding: '10px 22px',
                    borderRadius: '8px',
                    border: 'none',
                    cursor: 'pointer',
                  }}
                >
                  Create Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
