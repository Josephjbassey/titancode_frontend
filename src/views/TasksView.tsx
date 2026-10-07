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
import type { Project } from '../types';

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
    title: t.task_title || t.title || 'Untitled Task',
    project: t.project_name || (t.project_id ? `Project #${t.project_id}` : 'General Engineering'),
    assignee: {
      name: t.assigned_user_name || (t.assigned_user ? `Staff #${t.assigned_user}` : 'Assigned Member'),
      avatar: t.assigned_user_avatar || '',
    },
    priority: priorityMap[t.priority] || 'Medium',
    status: statusMap[t.status] || 'Open',
    deadline: t.deadline ? t.deadline.split('T')[0] : 'Flexible',
    description: t.description || 'Sprint deliverable work package.',
  };
};

interface TasksViewProps {
  onNavigate?: (view: ScreenId) => void;
}

export const TasksView: React.FC<TasksViewProps> = ({ onNavigate: _onNavigate }) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [availableUsers, setAvailableUsers] = useState<{ id: number; name: string }[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'kanban' | 'list'>('kanban');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterPriority, setFilterPriority] = useState<string>('All');
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);

  // New task form state
  const [newTitle, setNewTitle] = useState('');
  const [newProjectId, setNewProjectId] = useState<number | string>(1);
  const [newAssignedUser, setNewAssignedUser] = useState<number | string>(1);
  const [newPriority, setNewPriority] = useState<'Urgent' | 'High' | 'Medium'>('High');
  const [newDeadline, setNewDeadline] = useState('');
  const [newDescription, setNewDescription] = useState('');

  useEffect(() => {
    let mounted = true;
    setIsLoading(true);

    Promise.all([
      api.getTasks(),
      api.getProjects(),
      api.getUsers({ limit: 50 }),
    ])
      .then(([items, projs, usersData]) => {
        if (!mounted) return;
        setTasks((items || []).map(mapApiTask));
        setProjects(projs || []);
        if (projs && projs.length > 0) {
          setNewProjectId(projs[0].id);
        }

        if (usersData?.items && usersData.items.length > 0) {
          const uList = usersData.items.map((u: any) => ({
            id: u.id,
            name: u.full_name || u.name || `User #${u.id}`,
          }));
          setAvailableUsers(uList);
          if (uList.length > 0) {
            setNewAssignedUser(uList[0].id);
          }
        }
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

    const selectedProj = projects.find((p) => String(p.id) === String(newProjectId));
    const selectedUsr = availableUsers.find((u) => String(u.id) === String(newAssignedUser));

    try {
      const created = await api.createTask({
        project_id: typeof newProjectId === 'number' ? newProjectId : parseInt(String(newProjectId), 10) || 1,
        assigned_user: typeof newAssignedUser === 'number' ? newAssignedUser : parseInt(String(newAssignedUser), 10) || 1,
        task_title: newTitle,
        description: newDescription,
        priority: newPriority,
        deadline: newDeadline ? new Date(newDeadline).toISOString() : undefined,
      });
      setTasks([mapApiTask(created), ...tasks]);
    } catch {
      const activeUser = api.getActiveUser();
      const newTask: Task = {
        id: `TSK-${Math.floor(200 + Math.random() * 800)}`,
        title: newTitle,
        project: selectedProj?.name || 'Active Sprint Project',
        assignee: {
          name: selectedUsr?.name || activeUser?.full_name || 'Assigned Member',
          avatar: activeUser?.avatar_url || '',
        },
        priority: newPriority,
        status: 'Open',
        deadline: newDeadline || 'Flexible',
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
    <div className="tc-fade-in tc-dept-view-container">
      {/* Top Header */}
      <div className="tc-page-header-row">
        <div>
          <h1 className="tc-page-title">
            Task Management
          </h1>
          <p className="tc-page-subtitle">
            Coordinate project sprints, manage member workloads, and update sprint deliverables.
          </p>
        </div>

        <div className="tc-flex-center-gap">
          {/* View Mode Toggle */}
          <div className="tc-view-mode-toggle">
            <button
              type="button"
              onClick={() => setViewMode('kanban')}
              className={`tc-view-mode-btn ${viewMode === 'kanban' ? 'tc-view-mode-btn--active' : ''}`}
            >
              <LayoutGrid size={15} />
              <span>Board</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode('list')}
              className={`tc-view-mode-btn ${viewMode === 'list' ? 'tc-view-mode-btn--active' : ''}`}
            >
              <ListIcon size={15} />
              <span>List</span>
            </button>
          </div>

          <button
            type="button"
            onClick={() => setShowCreateModal(true)}
            className="tc-gold-btn"
          >
            <Plus size={18} strokeWidth={2.5} />
            <span>Create Task</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="tc-filter-bar">
        <div className="tc-flex-center-gap">
          <span className="tc-text-muted-xs">Priority Filter:</span>
          {(['All', 'Urgent', 'High', 'Medium'] as const).map((priority) => (
            <button
              key={priority}
              type="button"
              onClick={() => setFilterPriority(priority)}
              className={`tc-filter-pill-btn ${filterPriority === priority ? 'tc-filter-pill-btn--active' : ''}`}
            >
              {priority}
            </button>
          ))}
        </div>

        <div className="tc-search-wrapper">
          <Search size={16} className="tc-search-icon-pos" />
          <input
            type="text"
            placeholder="Search tasks..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="tc-search-input-field"
          />
        </div>
      </div>

      {isLoading ? (
        <div className="tc-dept-empty-box">
          <Loader2 size={36} className="tc-spin tc-text-gold tc-mx-auto tc-mb-2" />
          <p>Loading sprint tasks...</p>
        </div>
      ) : viewMode === 'kanban' ? (
        <div className="tc-kanban-board">
          {(['Open', 'In Progress', 'Completed'] as const).map((colStatus) => {
            const colTasks = filteredTasks.filter((t) => t.status === colStatus);
            const headerClass = {
              Open: 'tc-kanban-header tc-kanban-header--open',
              'In Progress': 'tc-kanban-header tc-kanban-header--in_progress',
              Completed: 'tc-kanban-header tc-kanban-header--completed',
            }[colStatus];

            const colTitle = {
              Open: 'To Do / Backlog',
              'In Progress': 'In Active Sprint',
              Completed: 'QA Approved & Done',
            }[colStatus];

            return (
              <div key={colStatus} className="tc-kanban-column">
                {/* Column Header */}
                <div className={headerClass}>
                  <div className="tc-flex-center-gap">
                    <span className="tc-kanban-title">
                      {colTitle}
                    </span>
                    <span className="tc-kanban-counter">
                      {colTasks.length}
                    </span>
                  </div>
                </div>

                {/* Tasks List */}
                <div className="tc-kanban-cards-stack">
                  {colTasks.map((task) => {
                    const badgeClass = {
                      Urgent: 'tc-badge-priority-urgent',
                      High: 'tc-badge-priority-high',
                      Medium: 'tc-badge-priority-medium',
                    }[task.priority];

                    return (
                      <div
                        key={task.id}
                        onClick={() => setSelectedTask(task)}
                        className="tc-kanban-card"
                      >
                        {/* Tags */}
                        <div className="tc-dept-meta-row">
                          <span className="tc-text-muted-xs">{task.id}</span>
                          <span className={badgeClass}>
                            {task.priority}
                          </span>
                        </div>

                        {/* Title */}
                        <h4 className="tc-kanban-card-title">
                          {task.title}
                        </h4>

                        <div className="tc-kanban-card-project">
                          {task.project}
                        </div>

                        {/* Footer info */}
                        <div className="tc-kanban-card-footer">
                          <div className="tc-flex-center-gap">
                            {task.assignee.avatar ? (
                              <img
                                src={task.assignee.avatar}
                                alt={task.assignee.name}
                                className="tc-avatar-xs"
                              />
                            ) : (
                              <div className="tc-avatar-xs tc-flex-center-all tc-text-gold tc-font-bold tc-bg-dark">
                                {task.assignee.name.slice(0, 2).toUpperCase()}
                              </div>
                            )}
                            <span>{task.assignee.name.split(' ')[0]}</span>
                          </div>
                          <div className="tc-flex-center-gap">
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
        <div className="tc-table-container-card">
          <table className="tc-table">
            <thead>
              <tr className="tc-table-header-dark">
                <th>Task ID & Title</th>
                <th>Project</th>
                <th>Assignee</th>
                <th>Priority</th>
                <th>Status</th>
                <th>Due Date</th>
              </tr>
            </thead>
            <tbody>
              {filteredTasks.map((t) => {
                const badgeClass = t.priority === 'Urgent' ? 'tc-badge-priority-urgent' : 'tc-badge-priority-high';
                const statusBadgeClass =
                  t.status === 'Completed'
                    ? 'tc-badge-status tc-badge-status--approved'
                    : t.status === 'In Progress'
                    ? 'tc-badge-gold-pill'
                    : 'tc-badge-muted-pill';

                return (
                  <tr
                    key={t.id}
                    onClick={() => setSelectedTask(t)}
                    className="tc-table-row-hover"
                  >
                    <td>
                      <div className="tc-font-semibold">{t.title}</div>
                      <div className="tc-text-muted-xs">{t.id}</div>
                    </td>
                    <td className="tc-text-gold">{t.project}</td>
                    <td>
                      <div className="tc-flex-center-gap">
                        {t.assignee.avatar ? (
                          <img
                            src={t.assignee.avatar}
                            alt={t.assignee.name}
                            className="tc-avatar-xs"
                          />
                        ) : (
                          <div className="tc-avatar-xs tc-flex-center-all tc-text-gold tc-font-bold tc-bg-dark">
                            {t.assignee.name.slice(0, 2).toUpperCase()}
                          </div>
                        )}
                        <span>{t.assignee.name}</span>
                      </div>
                    </td>
                    <td>
                      <span className={badgeClass}>
                        {t.priority}
                      </span>
                    </td>
                    <td>
                      <span className={statusBadgeClass}>
                        {t.status}
                      </span>
                    </td>
                    <td className="tc-text-muted">{t.deadline}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* TASK DETAIL MODAL */}
      {selectedTask && (
        <div
          className="tc-modal-backdrop"
          onClick={() => setSelectedTask(null)}
        >
          <div
            className="tc-task-modal-box"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="tc-card-header-row tc-mb-4">
              <div>
                <span className="tc-dept-code-tag">
                  {selectedTask.id} ● {selectedTask.project}
                </span>
                <h3 className="tc-page-title tc-mt-1">
                  {selectedTask.title}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedTask(null)}
                className="tc-modal-close-btn"
              >
                <X size={20} />
              </button>
            </div>

            <div className="tc-mb-4">
              <div className="tc-form-label">Task Instructions</div>
              <p className="tc-task-desc-box">
                {selectedTask.description}
              </p>
            </div>

            <div className="tc-grid-2col tc-mb-4">
              <div className="tc-task-meta-cell">
                <div className="tc-text-muted-xs">Assignee</div>
                <div className="tc-flex-center-gap tc-mt-1">
                  {selectedTask.assignee.avatar ? (
                    <img
                      src={selectedTask.assignee.avatar}
                      alt={selectedTask.assignee.name}
                      className="tc-avatar-sm"
                    />
                  ) : (
                    <div className="tc-avatar-sm tc-flex-center-all tc-text-gold tc-font-bold tc-bg-dark">
                      {selectedTask.assignee.name.slice(0, 2).toUpperCase()}
                    </div>
                  )}
                  <span className="tc-font-semibold tc-text-sm">{selectedTask.assignee.name}</span>
                </div>
              </div>
              <div className="tc-task-meta-cell">
                <div className="tc-text-muted-xs">Sprint Deadline</div>
                <div className="tc-font-bold tc-text-gold tc-mt-1">
                  {selectedTask.deadline}
                </div>
              </div>
            </div>

            {/* Quick Status Updater */}
            <div className="tc-mb-4">
              <div className="tc-form-label">Update Task Lifecycle:</div>
              <div className="tc-flex-center-gap">
                {(['Open', 'In Progress', 'Completed'] as const).map((st) => (
                  <button
                    key={st}
                    type="button"
                    onClick={() => updateTaskStatus(selectedTask.id, st)}
                    className={`tc-task-status-btn ${selectedTask.status === st ? 'tc-task-status-btn--active' : ''}`}
                  >
                    {st}
                  </button>
                ))}
              </div>
            </div>

            <div className="tc-actions-end">
              <button
                type="button"
                onClick={() => setSelectedTask(null)}
                className="tc-gold-btn"
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
          className="tc-modal-backdrop"
          onClick={() => setShowCreateModal(false)}
        >
          <div
            className="tc-task-modal-box"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="tc-card-header-row tc-mb-4">
              <h3 className="tc-card-title">
                Create Sprint Task
              </h3>
              <button
                type="button"
                onClick={() => setShowCreateModal(false)}
                className="tc-modal-close-btn"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleCreateTask}>
              <div className="tc-form-group">
                <label className="tc-form-label">
                  Task Title
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Implement real-time signaling protocol"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="tc-form-input"
                />
              </div>

              <div className="tc-grid-2col tc-mb-3">
                <div>
                  <label className="tc-form-label">
                    Project
                  </label>
                  <select
                    value={newProjectId}
                    onChange={(e) => setNewProjectId(e.target.value)}
                    className="tc-form-select"
                  >
                    {projects.length > 0 ? (
                      projects.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.name || p.project_name || `Project #${p.id}`}
                        </option>
                      ))
                    ) : (
                      <>
                        <option value="1">Aurelia FinTech Mobile App</option>
                        <option value="2">TitanCore SaaS Cloud Engine</option>
                        <option value="3">OmniTrade Crypto Arbitrage Bot</option>
                        <option value="4">PulseHealth Telemedicine Portal</option>
                      </>
                    )}
                  </select>
                </div>

                <div>
                  <label className="tc-form-label">
                    Assignee
                  </label>
                  <select
                    value={newAssignedUser}
                    onChange={(e) => setNewAssignedUser(e.target.value)}
                    className="tc-form-select"
                  >
                    {availableUsers.length > 0 ? (
                      availableUsers.map((u) => (
                        <option key={u.id} value={u.id}>
                          {u.name}
                        </option>
                      ))
                    ) : (
                      <option value="1">Assigned Member</option>
                    )}
                  </select>
                </div>
              </div>

              <div className="tc-grid-2col tc-mb-3">
                <div>
                  <label className="tc-form-label">
                    Priority
                  </label>
                  <select
                    value={newPriority}
                    onChange={(e) => setNewPriority(e.target.value as any)}
                    className="tc-form-select"
                  >
                    <option value="Urgent">Urgent</option>
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                  </select>
                </div>

                <div>
                  <label className="tc-form-label">
                    Deadline
                  </label>
                  <input
                    type="date"
                    value={newDeadline}
                    onChange={(e) => setNewDeadline(e.target.value)}
                    className="tc-form-input"
                  />
                </div>
              </div>

              <div className="tc-form-group">
                <label className="tc-form-label">
                  Task Scope / Acceptance Criteria
                </label>
                <textarea
                  rows={3}
                  placeholder="Outline expected deliverables and edge cases..."
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  className="tc-form-textarea"
                />
              </div>

              <div className="tc-actions-end">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="tc-modal-cancel-btn"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="tc-gold-btn"
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
