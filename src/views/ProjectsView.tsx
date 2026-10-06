import React, { useState, useEffect } from 'react';
import {
  Plus,
  Search,
  CheckCircle2,
  X,
  Loader2,
} from 'lucide-react';
import type { ScreenId } from '../App';
import { api } from '../services/api';
import type { ClientRecord } from '../types';

interface Project {
  id: string;
  name: string;
  client: string;
  department: string;
  budget: number;
  deadline: string;
  status: 'Pending' | 'Active' | 'Completed' | 'Cancelled';
  progress: number;
  description: string;
  members: { name: string; role: string; avatar: string }[];
  tasks: { id: string; title: string; completed: boolean }[];
}

const mapApiProject = (p: any, allTasks: any[] = []): Project => {
  const projectTasks = allTasks.filter((t) => t.project_id === p.id);
  const tasksList = Array.isArray(p.tasks) && p.tasks.length > 0
    ? p.tasks.map((t: any) => ({
        id: String(t.id),
        title: t.task_title || t.title || 'Project Milestone',
        completed: t.status === 'completed' || t.completed === true,
      }))
    : projectTasks.length > 0
    ? projectTasks.map((t: any) => ({
        id: String(t.id),
        title: t.task_title || t.title || 'Project Milestone',
        completed: t.status === 'completed' || t.completed === true,
      }))
    : [];

  return {
    id: `PRJ-${p.id}`,
    name: p.project_name || p.name || `Project #${p.id}`,
    client: p.client_name || (p.client_id ? `Client #${p.client_id}` : 'Enterprise Client'),
    department: p.department_name || p.department || 'Web Engineering',
    budget: Number(p.budget) || 0,
    deadline: p.deadline ? p.deadline.split('T')[0] : 'Flexible',
    status: (p.status === 'in_progress' || p.status === 'active') ? 'Active' : (p.status === 'completed' ? 'Completed' : 'Pending'),
    progress: p.progress_percentage ?? (p.status === 'completed' ? 100 : p.status === 'active' ? 50 : 0),
    description: p.description || 'Custom software engineering deliverable.',
    members: Array.isArray(p.members) && p.members.length > 0
      ? p.members.map((m: any) => typeof m === 'string' ? { name: m, role: 'Contributor', avatar: '' } : { name: m.name || m.full_name || 'Member', role: m.role || 'Contributor', avatar: m.avatar || m.avatar_url || '' })
      : [],
    tasks: tasksList,
  };
};

interface ProjectsViewProps {
  onNavigate?: (view: ScreenId) => void;
}

export const ProjectsView: React.FC<ProjectsViewProps> = ({ onNavigate: _onNavigate }) => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [clients, setClients] = useState<ClientRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [statusFilter, setStatusFilter] = useState<'All' | 'Active' | 'Pending' | 'Completed' | 'Cancelled'>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);

  // New project form state
  const [newProjectName, setNewProjectName] = useState('');
  const [selectedClientId, setSelectedClientId] = useState<number | string>(1);
  const [newProjectClient, setNewProjectClient] = useState('');
  const [newProjectBudget, setNewProjectBudget] = useState('');
  const [newProjectDeadline, setNewProjectDeadline] = useState('');
  const [newProjectDesc, setNewProjectDesc] = useState('');

  useEffect(() => {
    let mounted = true;
    setIsLoading(true);

    Promise.all([
      api.getProjects(),
      api.getClients(),
      api.getTasks().catch(() => []),
    ])
      .then(([items, clientList, taskList]) => {
        if (!mounted) return;
        setProjects((items || []).map((p) => mapApiProject(p, taskList || [])));
        setClients(clientList || []);
        if (clientList && clientList.length > 0) {
          setSelectedClientId(clientList[0].id);
          setNewProjectClient(clientList[0].name || clientList[0].company || 'Enterprise Client');
        }
      })
      .catch(() => {
        if (!mounted) return;
        setProjects([]);
      })
      .finally(() => {
        if (mounted) setIsLoading(false);
      });
    return () => { mounted = false; };
  }, []);

  const filteredProjects = projects.filter((p) => {
    const matchesStatus = statusFilter === 'All' || p.status === statusFilter;
    const matchesSearch =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.client.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.id.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProjectName.trim()) return;

    setIsCreating(true);
    const chosenClient = clients.find((c) => String(c.id) === String(selectedClientId));
    const clientName = chosenClient?.name || newProjectClient.trim() || 'Enterprise Client';

    try {
      const created = await api.createProject({
        name: newProjectName,
        description: newProjectDesc,
        client_id: typeof selectedClientId === 'number' ? selectedClientId : parseInt(String(selectedClientId), 10) || 1,
        budget: Number(newProjectBudget) || 0,
        deadline: newProjectDeadline ? new Date(newProjectDeadline).toISOString() : undefined,
      });

      setProjects([mapApiProject(created), ...projects]);
      setShowCreateModal(false);
      setNewProjectName('');
      setNewProjectClient('');
      setNewProjectBudget('');
      setNewProjectDeadline('');
      setNewProjectDesc('');
    } catch (err: any) {
      // Offline / fallback
      const activeUser = api.getActiveUser();
      const fallbackProject: Project = {
        id: `PRJ-${Math.floor(200 + Math.random() * 800)}`,
        name: newProjectName,
        client: clientName,
        department: 'Web Engineering',
        budget: Number(newProjectBudget) || 0,
        deadline: newProjectDeadline || 'Flexible',
        status: 'Active',
        progress: 0,
        description: newProjectDesc || 'Enterprise project deliverable.',
        members: activeUser?.full_name
          ? [{ name: activeUser.full_name, role: activeUser.role || 'Contributor', avatar: activeUser.avatar_url || '' }]
          : [],
        tasks: [],
      };
      setProjects([fallbackProject, ...projects]);
      setShowCreateModal(false);
      setNewProjectName('');
      setNewProjectClient('');
      setNewProjectBudget('');
      setNewProjectDeadline('');
      setNewProjectDesc('');
    } finally {
      setIsCreating(false);
    }
  };

  const toggleTask = (projectId: string, taskId: string) => {
    setProjects((prev) =>
      prev.map((proj) => {
        if (proj.id !== projectId) return proj;
        const updatedTasks = proj.tasks.map((t) =>
          t.id === taskId ? { ...t, completed: !t.completed } : t
        );
        const completedCount = updatedTasks.filter((t) => t.completed).length;
        const progress = updatedTasks.length > 0 ? Math.round((completedCount / updatedTasks.length) * 100) : proj.progress;
        return { ...proj, tasks: updatedTasks, progress };
      })
    );
    if (selectedProject && selectedProject.id === projectId) {
      setSelectedProject((prev) => {
        if (!prev) return null;
        const updatedTasks = prev.tasks.map((t) =>
          t.id === taskId ? { ...t, completed: !t.completed } : t
        );
        const completedCount = updatedTasks.filter((t) => t.completed).length;
        const progress = updatedTasks.length > 0 ? Math.round((completedCount / updatedTasks.length) * 100) : prev.progress;
        return { ...prev, tasks: updatedTasks, progress };
      });
    }
  };

  const markProjectComplete = (projectId: string) => {
    setProjects((prev) =>
      prev.map((p) => (p.id === projectId ? { ...p, status: 'Completed', progress: 100 } : p))
    );
    if (selectedProject && selectedProject.id === projectId) {
      setSelectedProject((prev) => (prev ? { ...prev, status: 'Completed', progress: 100 } : null));
    }
  };

  return (
    <div className="tc-fade-in tc-dept-view-container">
      {/* Top Header & Actions */}
      <div className="tc-page-header-row">
        <div>
          <h1 className="tc-page-title">
            Projects Management
          </h1>
          <p className="tc-page-subtitle">
            Track client scopes, milestones, member allocations, and deliverable budgets.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowCreateModal(true)}
          className="tc-gold-btn"
        >
          <Plus size={18} strokeWidth={2.5} />
          <span>New Project</span>
        </button>
      </div>

      {/* KPI Stats Row */}
      <div className="tc-projects-stats-grid">
        <div className="tc-project-stat-card">
          <div className="tc-text-muted-xs tc-mb-2">Total Projects</div>
          <div className="tc-project-stat-val">{projects.length}</div>
          <div className="tc-text-success tc-text-xs tc-mt-1">Across active client accounts</div>
        </div>

        <div className="tc-project-stat-card">
          <div className="tc-text-muted-xs tc-mb-2">Active Sprints</div>
          <div className="tc-project-stat-val--gold">
            {projects.filter((p) => p.status === 'Active').length}
          </div>
          <div className="tc-text-muted-xs tc-mt-1">On-schedule delivery</div>
        </div>

        <div className="tc-project-stat-card">
          <div className="tc-text-muted-xs tc-mb-2">Total Pipeline Value</div>
          <div className="tc-project-stat-val">
            ${projects.reduce((acc, curr) => acc + curr.budget, 0).toLocaleString()}
          </div>
          <div className="tc-text-success tc-text-xs tc-mt-1">100% escrow secured</div>
        </div>

        <div className="tc-project-stat-card">
          <div className="tc-text-muted-xs tc-mb-2">Delivered Projects</div>
          <div className="tc-project-stat-val--green">
            {projects.filter((p) => p.status === 'Completed').length}
          </div>
          <div className="tc-text-muted-xs tc-mt-1">Payouts distributed</div>
        </div>
      </div>

      {/* Filter Tabs & Search Bar */}
      <div className="tc-filter-bar">
        {/* Status Tabs */}
        <div className="tc-tab-pill-group">
          {(['All', 'Active', 'Pending', 'Completed', 'Cancelled'] as const).map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setStatusFilter(tab)}
              className={`tc-tab-pill-btn ${statusFilter === tab ? 'tc-tab-pill-btn--active' : ''}`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="tc-search-wrapper">
          <Search size={16} className="tc-search-icon-pos" />
          <input
            type="text"
            placeholder="Search projects by name, client..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="tc-search-input-field"
          />
        </div>
      </div>

      {/* Projects Grid */}
      <div className="tc-projects-grid">
        {isLoading ? (
          <div className="tc-dept-empty-box tc-col-span-full">
            <Loader2 size={36} className="tc-spin tc-text-gold tc-mx-auto tc-mb-2" />
            <p>Loading projects...</p>
          </div>
        ) : filteredProjects.length === 0 ? (
          <div className="tc-dept-empty-box tc-col-span-full">
            <p className="tc-font-bold tc-mb-1 tc-text-white">No projects found</p>
            <p className="tc-text-muted-sm">Create a new project above to start tracking client deliverables and payouts.</p>
          </div>
        ) : (
          filteredProjects.map((project) => {
            const badgeClass = {
              Active: 'tc-badge-gold-pill',
              Pending: 'tc-badge-muted-pill',
              Completed: 'tc-badge-status tc-badge-status--approved',
              Cancelled: 'tc-badge-status tc-badge-status--declined',
            }[project.status];

            return (
              <div
                key={project.id}
                onClick={() => setSelectedProject(project)}
                className="tc-project-card"
              >
                <div>
                  {/* Header: ID + Status */}
                  <div className="tc-dept-meta-row">
                    <span className="tc-dept-code-tag">
                      {project.id}
                    </span>
                    <span className={badgeClass}>
                      {project.status}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="tc-dept-card-title">
                    {project.name}
                  </h3>
                  <p className="tc-dept-card-desc">
                    {project.description.slice(0, 105)}...
                  </p>

                  {/* Progress bar */}
                  <div className="tc-mb-3">
                    <div className="tc-card-header-row tc-text-xs tc-mb-1">
                      <span className="tc-text-muted">Progress</span>
                      <span className="tc-font-bold tc-text-white">{project.progress}%</span>
                    </div>
                    <div className="tc-progress-track">
                      <div
                        className={`tc-progress-fill ${project.status === 'Completed' ? 'tc-progress-fill--completed' : 'tc-progress-fill--active'}`}
                        style={{ width: `${project.progress}%` }}
                      />
                    </div>
                  </div>
                </div>

                {/* Bottom Meta */}
                <div className="tc-dept-footer-row">
                  {/* Team Avatars */}
                  <div className="tc-flex-center-gap">
                    {project.members.length > 0 ? (
                      project.members.map((m, i) => (
                        m.avatar ? (
                          <img
                            key={i}
                            src={m.avatar}
                            alt={m.name}
                            title={`${m.name} (${m.role})`}
                            className="tc-avatar-xs"
                          />
                        ) : (
                          <div
                            key={i}
                            className="tc-avatar-fallback tc-avatar-fallback--xs"
                            title={`${m.name} (${m.role})`}
                          >
                            {m.name.slice(0, 2).toUpperCase()}
                          </div>
                        )
                      ))
                    ) : (
                      <span className="tc-text-muted-xs">Open allocation</span>
                    )}
                  </div>

                  {/* Budget & Due */}
                  <div className="tc-text-right">
                    <div className="tc-font-bold tc-text-white">${project.budget.toLocaleString()}</div>
                    <div className="tc-text-muted-xs">Due {project.deadline}</div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* PROJECT DETAIL MODAL */}
      {selectedProject && (
        <div
          className="tc-modal-backdrop"
          onClick={() => setSelectedProject(null)}
        >
          <div
            className="tc-project-modal-box"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="tc-card-header-row tc-mb-4">
              <div>
                <span className="tc-dept-code-tag">
                  {selectedProject.id} ● {selectedProject.department}
                </span>
                <h2 className="tc-page-title tc-mt-1">
                  {selectedProject.name}
                </h2>
                <div className="tc-text-muted-sm tc-mt-1">
                  Client: <span className="tc-text-white tc-font-semibold">{selectedProject.client}</span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelectedProject(null)}
                className="tc-modal-close-btn"
              >
                <X size={20} />
              </button>
            </div>

            {/* Overview / Scope */}
            <div className="tc-mb-4">
              <h4 className="tc-form-label">
                Scope & Specifications
              </h4>
              <p className="tc-task-desc-box">
                {selectedProject.description}
              </p>
            </div>

            {/* Budget & Timeline cards */}
            <div className="tc-grid-2col tc-mb-4">
              <div className="tc-task-meta-cell">
                <div className="tc-text-muted-xs">Total Escrow Budget</div>
                <div className="tc-font-bold tc-text-gold tc-mt-1 tc-text-sm">
                  ${selectedProject.budget.toLocaleString()} USD
                </div>
              </div>
              <div className="tc-task-meta-cell">
                <div className="tc-text-muted-xs">Milestone Deadline</div>
                <div className="tc-font-bold tc-text-white tc-mt-1 tc-text-sm">
                  {selectedProject.deadline}
                </div>
              </div>
            </div>

            {/* Assigned Team */}
            <div className="tc-mb-4">
              <h4 className="tc-form-label">
                Allocated Engineering Squad
              </h4>
              <div className="tc-flex-col-gap">
                {selectedProject.members.length === 0 ? (
                  <div className="tc-text-muted-xs tc-p-3 tc-bg-card-hover tc-rounded-lg tc-text-center">
                    No individual contributors directly assigned yet. Engineering pool allocated.
                  </div>
                ) : (
                  selectedProject.members.map((member, i) => (
                    <div key={i} className="tc-scorecard-item">
                      <div className="tc-flex-center-gap">
                        {member.avatar ? (
                          <img
                            src={member.avatar}
                            alt={member.name}
                            className="tc-avatar-sm"
                          />
                        ) : (
                          <div className="tc-avatar-sm tc-flex-center-all tc-text-gold tc-font-bold tc-bg-dark">
                            {member.name.slice(0, 2).toUpperCase()}
                          </div>
                        )}
                        <div>
                          <div className="tc-font-bold tc-text-white">{member.name}</div>
                          <div className="tc-text-muted-xs">{member.role}</div>
                        </div>
                      </div>
                      <span className="tc-badge-status tc-badge-status--approved">Active Contributor</span>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Task Deliverables checklist */}
            <div className="tc-mb-4">
              <div className="tc-card-header-row tc-mb-2">
                <h4 className="tc-form-label tc-mb-0">
                  Milestone Tasks ({selectedProject.tasks.filter((t) => t.completed).length} / {selectedProject.tasks.length})
                </h4>
                <span className="tc-font-bold tc-text-gold">
                  {selectedProject.progress}% Done
                </span>
              </div>
              {selectedProject.tasks.length === 0 ? (
                <div className="tc-text-muted-xs tc-p-3 tc-bg-card-hover tc-rounded-lg tc-text-center">
                  No milestone tasks assigned to this project yet.
                </div>
              ) : (
                <div className="tc-flex-col-gap">
                  {selectedProject.tasks.map((task) => (
                    <div
                      key={task.id}
                      onClick={() => toggleTask(selectedProject.id, task.id)}
                      className={`tc-project-checklist-item ${task.completed ? 'tc-project-checklist-item--completed' : ''}`}
                    >
                      <input
                        type="checkbox"
                        checked={task.completed}
                        onChange={() => {}}
                        className="tc-cursor-pointer"
                      />
                      <span
                        className={`tc-flex-1 tc-text-sm ${task.completed ? 'tc-text-muted tc-line-through' : 'tc-text-white'}`}
                      >
                        {task.title}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="tc-actions-end">
              {selectedProject.status !== 'Completed' && (
                <button
                  type="button"
                  onClick={() => markProjectComplete(selectedProject.id)}
                  className="tc-btn-authorize tc-badge-status--approved tc-flex-center-gap"
                >
                  <CheckCircle2 size={16} />
                  <span>Mark as Completed & Trigger Payout</span>
                </button>
              )}
              <button
                type="button"
                onClick={() => setSelectedProject(null)}
                className="tc-modal-cancel-btn"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CREATE PROJECT MODAL */}
      {showCreateModal && (
        <div
          className="tc-modal-backdrop"
          onClick={() => setShowCreateModal(false)}
        >
          <div
            className="tc-project-modal-box"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="tc-card-header-row tc-mb-4">
              <h3 className="tc-card-title">
                Create New Project
              </h3>
              <button
                type="button"
                onClick={() => setShowCreateModal(false)}
                className="tc-modal-close-btn"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleCreateProject}>
              <div className="tc-form-group">
                <label className="tc-form-label">
                  Project Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Nexus AI Trading Mobile App"
                  value={newProjectName}
                  onChange={(e) => setNewProjectName(e.target.value)}
                  className="tc-form-input"
                />
              </div>

              <div className="tc-grid-2col tc-mb-3">
                <div>
                  <label className="tc-form-label">
                    Client Account
                  </label>
                  <select
                    value={selectedClientId}
                    onChange={(e) => {
                      setSelectedClientId(e.target.value);
                      const c = clients.find((x) => String(x.id) === e.target.value);
                      if (c) setNewProjectClient(c.name || c.company || 'Enterprise Client');
                    }}
                    className="tc-form-select"
                  >
                    {clients.length > 0 ? (
                      clients.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.name || c.company || `Client #${c.id}`}
                        </option>
                      ))
                    ) : (
                      <option value="1">Enterprise Client Partner</option>
                    )}
                  </select>
                </div>
                <div>
                  <label className="tc-form-label">
                    Budget (USD)
                  </label>
                  <input
                    type="number"
                    placeholder="e.g. 25000"
                    value={newProjectBudget}
                    onChange={(e) => setNewProjectBudget(e.target.value)}
                    className="tc-form-input"
                  />
                </div>
              </div>

              <div className="tc-form-group">
                <label className="tc-form-label">
                  Target Delivery Date
                </label>
                <input
                  type="date"
                  value={newProjectDeadline}
                  onChange={(e) => setNewProjectDeadline(e.target.value)}
                  className="tc-form-input"
                />
              </div>

              <div className="tc-form-group">
                <label className="tc-form-label">
                  Scope Description
                </label>
                <textarea
                  rows={3}
                  placeholder="Outline client requirements, tech stack, and deliverable expectations..."
                  value={newProjectDesc}
                  onChange={(e) => setNewProjectDesc(e.target.value)}
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
                  disabled={isCreating}
                  className="tc-gold-btn"
                >
                  {isCreating ? 'Creating...' : 'Create Project'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
