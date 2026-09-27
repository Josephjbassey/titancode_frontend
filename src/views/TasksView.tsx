import React, { useState, useEffect } from 'react';
import {
  Plus,
  Search,
  Clock,
  X,
  LayoutGrid,
  List as ListIcon,
  Loader2,
} from 'lucide-react';
import type { ScreenId } from '../App';
import { api } from '../services/api';

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

const mapApiTask = (t: any): Task => {
  const statusMap: Record<string, 'Open' | 'In Progress' | 'Completed'> = {
    open: 'Open',
    in_progress: 'In Progress',
    completed: 'Completed',
  };
  const priorityMap: Record<string, 'Urgent' | 'High' | 'Medium'> = {
    Urgent: 'Urgent',
    High: 'High',
    Medium: 'Medium',
    Low: 'Medium',
  };
  return {
    id: `TSK-${t.id}`,
    title: t.task_title || t.title,
    project: t.project_name || (t.project_id ? `Project #${t.project_id}` : 'General Engineering'),
    assignee: {
      name: t.assigned_user_name || (t.assigned_user ? `Staff #${t.assigned_user}` : 'Assigned Member'),
      avatar: t.assigned_user_avatar || '/assets/joseph.jpg',
    },
    priority: priorityMap[t.priority] || 'Medium',
    status: statusMap[t.status] || 'Open',
    deadline: t.deadline ? t.deadline.split('T')[0] : '2026-10-15',
    description: t.description || 'Sprint deliverable work package.',
  };
};

interface TasksViewProps {
  onNavigate?: (view: ScreenId) => void;
}

export const TasksView: React.FC<TasksViewProps> = ({ onNavigate: _onNavigate }) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
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

  useEffect(() => {
    let mounted = true;
    setIsLoading(true);
    api.getTasks()
      .then((items) => {
        if (!mounted) return;
        setTasks(items.map(mapApiTask));
      })
      .catch(() => {
        if (!mounted) return;
        setTasks([]);
      })
      .finally(() => {
        if (mounted) setIsLoading(false);
      });
    return () => { mounted = false; };
  }, []);

  const filteredTasks = tasks.filter((task) => {
    const matchesPriority = filterPriority === 'All' || task.priority === filterPriority;
    const matchesSearch =
      task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.project.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.id.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesPriority && matchesSearch;
  });

  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    try {
      const created = await api.createTask({
        project_id: 1,
        assigned_user: 1,
        task_title: newTitle,
        description: newDescription,
        priority: newPriority,
        deadline: newDeadline ? new Date(newDeadline).toISOString() : undefined,
      });
      setTasks([mapApiTask(created), ...tasks]);
    } catch {
      const newTask: Task = {
        id: `TSK-${Math.floor(200 + Math.random() * 800)}`,
        title: newTitle,
        project: newProject,
        assignee: { name: 'Joseph John', avatar: '/assets/joseph.jpg' },
        priority: newPriority,
        status: 'Open',
        deadline: newDeadline || '2026-10-10',
        description: newDescription || 'Standard engineering task delivery.',
      };
      setTasks([newTask, ...tasks]);
    } finally {
      setShowCreateModal(false);
      setNewTitle('');
      setNewDescription('');
      setNewDeadline('');
    }
  };

  const updateTaskStatus = async (taskId: string, newStatus: 'Open' | 'In Progress' | 'Completed') => {
    const backendStatus = newStatus === 'In Progress' ? 'in_progress' : newStatus.toLowerCase();
    const numericId = parseInt(taskId.replace('TSK-', ''), 10);

    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, status: newStatus } : t))
    );
    if (selectedTask && selectedTask.id === taskId) {
      setSelectedTask((prev) => (prev ? { ...prev, status: newStatus } : null));
    }

    if (!isNaN(numericId)) {
      try {
        await api.updateTask(numericId, { status: backendStatus });
      } catch {
        // Fallback gracefully
      }
    }
  };

  return (
    <div className="tc-fade-in" style={{ color: '#FFFFFF', width: '100%', display: 'flex', flexDirection: 'column', paddingBottom: '40px' }}>
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
              backgroundColor: 'rgba(255, 255, 255, 0.04)',
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
                backgroundColor: viewMode === 'kanban' ? '#dfae32' : 'transparent',
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
                backgroundColor: viewMode === 'list' ? '#dfae32' : 'transparent',
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
            className="tc-action-btn-gold"
            style={{ fontSize: '14px', padding: '10px 20px', height: 'auto' }}
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
                borderColor: filterPriority === priority ? '#dfae32' : 'rgba(255, 255, 255, 0.08)',
                backgroundColor: filterPriority === priority ? 'rgba(223, 174, 50, 0.15)' : '#11151F',
                color: filterPriority === priority ? '#dfae32' : '#9CA3AF',
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
              backgroundColor: '#FFFFFF1A',
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

      {isLoading ? (
        <div style={{ padding: '64px', textAlign: 'center', color: '#9CA3AF' }}>
          <Loader2 size={36} className="tc-spin" style={{ margin: '0 auto 12px auto', color: '#dfae32', animation: 'spin 1s linear infinite' }} />
          <p>Loading sprint tasks...</p>
        </div>
      ) : viewMode === 'kanban' ? (
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
              'In Progress': { border: '#dfae32', title: 'In Active Sprint' },
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
                      High: { bg: 'rgba(223, 174, 50, 0.15)', text: '#dfae32' },
                      Medium: { bg: 'rgba(59, 130, 246, 0.15)', text: '#3B82F6' },
                    }[task.priority];

                    return (
                      <div
                        key={task.id}
                        onClick={() => setSelectedTask(task)}
                        style={{
                          backgroundColor: '#FFFFFF1A',
                          borderRadius: '10px',
                          padding: '16px',
                          border: '1px solid rgba(255, 255, 255, 0.06)',
                          cursor: 'pointer',
                          transition: 'all 0.15s ease',
                        }}
                        onMouseOver={(e) => {
                          e.currentTarget.style.borderColor = 'rgba(223, 174, 50, 0.4)';
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

                        <div style={{ fontSize: '12px', color: '#dfae32', marginBottom: '14px' }}>
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
            backgroundColor: '#FFFFFF1A',
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
                  <td style={{ padding: '14px 18px', color: '#dfae32' }}>{t.project}</td>
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
                        backgroundColor: t.priority === 'Urgent' ? 'rgba(239, 68, 68, 0.15)' : 'rgba(223, 174, 50, 0.15)',
                        color: t.priority === 'Urgent' ? '#EF4444' : '#dfae32',
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
                            ? 'rgba(223, 174, 50, 0.15)'
                            : 'rgba(156, 163, 175, 0.15)',
                        color:
                          t.status === 'Completed'
                            ? '#10B981'
                            : t.status === 'In Progress'
                            ? '#dfae32'
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
              backgroundColor: '#1C1C1E',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              borderRadius: '16px',
              maxWidth: '560px',
              width: '100%',
              padding: '28px',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '18px' }}>
              <div>
                <span style={{ color: '#dfae32', fontSize: '12px', fontWeight: 700 }}>
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
              <p style={{ backgroundColor: '#161617', padding: '14px', borderRadius: '8px', color: '#D1D5DB', fontSize: '14px', lineHeight: 1.6 }}>
                {selectedTask.description}
              </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '24px' }}>
              <div style={{ backgroundColor: '#161617', padding: '12px 14px', borderRadius: '8px' }}>
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
              <div style={{ backgroundColor: '#161617', padding: '12px 14px', borderRadius: '8px' }}>
                <div style={{ fontSize: '11px', color: '#9CA3AF' }}>Sprint Deadline</div>
                <div style={{ fontSize: '14px', fontWeight: 700, color: '#dfae32', marginTop: '6px' }}>
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
                      border: selectedTask.status === st ? '1px solid #dfae32' : '1px solid rgba(255, 255, 255, 0.08)',
                      backgroundColor: selectedTask.status === st ? 'rgba(223, 174, 50, 0.15)' : '#161617',
                      color: selectedTask.status === st ? '#dfae32' : '#9CA3AF',
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
                  backgroundColor: '#dfae32',
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
              backgroundColor: '#1C1C1E',
              border: '1px solid rgba(255, 255, 255, 0.15)',
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
                    backgroundColor: '#161617',
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
                      backgroundColor: '#161617',
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
                      backgroundColor: '#161617',
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
                    backgroundColor: '#161617',
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
                    backgroundColor: '#161617',
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
                    backgroundColor: '#dfae32',
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
