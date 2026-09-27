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

const mapApiProject = (p: any): Project => ({
  id: `PRJ-${p.id}`,
  name: p.project_name || p.name,
  client: p.client_name || (p.client_id ? `Client #${p.client_id}` : 'Enterprise Client'),
  department: 'Web Engineering',
  budget: Number(p.budget) || 0,
  deadline: p.deadline ? p.deadline.split('T')[0] : '2026-12-31',
  status: (p.status === 'in_progress' || p.status === 'active') ? 'Active' : (p.status === 'completed' ? 'Completed' : 'Pending'),
  progress: p.progress_percentage ?? (p.status === 'completed' ? 100 : p.status === 'active' ? 50 : 15),
  description: p.description || 'Custom software engineering deliverable.',
  members: [
    { name: 'Joseph John', role: 'Lead Developer', avatar: '/assets/joseph.jpg' },
    { name: 'Benedicta Atagamen', role: 'UI/UX Designer', avatar: '/assets/benedicta.png' },
  ],
  tasks: [
    { id: `T-${p.id}-1`, title: 'Core architecture and sprint planning', completed: p.status === 'completed' },
    { id: `T-${p.id}-2`, title: 'Production deployment and QA audit', completed: p.status === 'completed' },
  ],
});

interface ProjectsViewProps {
  onNavigate?: (view: ScreenId) => void;
}

export const ProjectsView: React.FC<ProjectsViewProps> = ({ onNavigate: _onNavigate }) => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [statusFilter, setStatusFilter] = useState<'All' | 'Active' | 'Pending' | 'Completed' | 'Cancelled'>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);

  // New project form state
  const [newProjectName, setNewProjectName] = useState('');
  const [newProjectClient, setNewProjectClient] = useState('');
  const [newProjectBudget, setNewProjectBudget] = useState('');
  const [newProjectDeadline, setNewProjectDeadline] = useState('');
  const [newProjectDesc, setNewProjectDesc] = useState('');

  useEffect(() => {
    let mounted = true;
    setIsLoading(true);
    api.getProjects()
      .then((items) => {
        if (!mounted) return;
        setProjects(items.map(mapApiProject));
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
    try {
      const created = await api.createProject({
        name: newProjectName,
        description: newProjectDesc,
        client_id: 1,
        budget: Number(newProjectBudget) || 10000,
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
      alert(err.message || 'Failed to create project on server');
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
        const progress = Math.round((completedCount / updatedTasks.length) * 100);
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
        const progress = Math.round((completedCount / updatedTasks.length) * 100);
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
    <div className="tc-fade-in" style={{ color: '#FFFFFF', width: '100%', display: 'flex', flexDirection: 'column', paddingBottom: '40px' }}>
      {/* Top Header & Actions */}
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
            Projects Management
          </h1>
          <p style={{ color: '#9CA3AF', fontSize: '14px', margin: '4px 0 0' }}>
            Track client scopes, milestones, member allocations, and deliverable budgets.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowCreateModal(true)}
          className="tc-action-btn-gold"
          style={{ fontSize: '14px', padding: '11px 22px', height: 'auto' }}
        >
          <Plus size={18} strokeWidth={2.5} />
          <span>New Project</span>
        </button>
      </div>

      {/* KPI Stats Row */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '18px',
          marginBottom: '28px',
        }}
      >
        <div
          style={{
            backgroundColor: '#FFFFFF1A',
            borderRadius: '12px',
            padding: '20px',
            border: '1px solid rgba(255, 255, 255, 0.06)',
          }}
        >
          <div style={{ color: '#9CA3AF', fontSize: '13px', marginBottom: '8px' }}>Total Projects</div>
          <div style={{ fontSize: '28px', fontWeight: 800, color: '#FFFFFF' }}>{projects.length}</div>
          <div style={{ color: '#10B981', fontSize: '12px', marginTop: '4px' }}>Across 3 departments</div>
        </div>

        <div
          style={{
            backgroundColor: '#FFFFFF1A',
            borderRadius: '12px',
            padding: '20px',
            border: '1px solid rgba(255, 255, 255, 0.06)',
          }}
        >
          <div style={{ color: '#9CA3AF', fontSize: '13px', marginBottom: '8px' }}>Active Sprints</div>
          <div style={{ fontSize: '28px', fontWeight: 800, color: '#dfae32' }}>
            {projects.filter((p) => p.status === 'Active').length}
          </div>
          <div style={{ color: '#9CA3AF', fontSize: '12px', marginTop: '4px' }}>On-schedule delivery</div>
        </div>

        <div
          style={{
            backgroundColor: '#FFFFFF1A',
            borderRadius: '12px',
            padding: '20px',
            border: '1px solid rgba(255, 255, 255, 0.06)',
          }}
        >
          <div style={{ color: '#9CA3AF', fontSize: '13px', marginBottom: '8px' }}>Total Pipeline Value</div>
          <div style={{ fontSize: '28px', fontWeight: 800, color: '#FFFFFF' }}>
            ${projects.reduce((acc, curr) => acc + curr.budget, 0).toLocaleString()}
          </div>
          <div style={{ color: '#10B981', fontSize: '12px', marginTop: '4px' }}>100% escrow secured</div>
        </div>

        <div
          style={{
            backgroundColor: '#FFFFFF1A',
            borderRadius: '12px',
            padding: '20px',
            border: '1px solid rgba(255, 255, 255, 0.06)',
          }}
        >
          <div style={{ color: '#9CA3AF', fontSize: '13px', marginBottom: '8px' }}>Delivered Projects</div>
          <div style={{ fontSize: '28px', fontWeight: 800, color: '#10B981' }}>
            {projects.filter((p) => p.status === 'Completed').length}
          </div>
          <div style={{ color: '#9CA3AF', fontSize: '12px', marginTop: '4px' }}>Payouts distributed</div>
        </div>
      </div>

      {/* Filter Tabs & Search Bar */}
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
        {/* Status Tabs */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            backgroundColor: '#FFFFFF1A',
            padding: '4px',
            borderRadius: '8px',
            border: '1px solid rgba(255, 255, 255, 0.06)',
          }}
        >
          {(['All', 'Active', 'Pending', 'Completed', 'Cancelled'] as const).map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setStatusFilter(tab)}
              style={{
                padding: '8px 16px',
                borderRadius: '6px',
                border: 'none',
                backgroundColor: statusFilter === tab ? '#dfae32' : 'transparent',
                color: statusFilter === tab ? '#0A0D14' : '#9CA3AF',
                fontWeight: statusFilter === tab ? 700 : 500,
                fontSize: '13px',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
              }}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Search */}
        <div
          style={{
            position: 'relative',
            width: '320px',
          }}
        >
          <Search
            size={16}
            color="#9CA3AF"
            style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }}
          />
          <input
            type="text"
            placeholder="Search projects by name, client..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: '100%',
              backgroundColor: '#FFFFFF1A',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: '8px',
              padding: '9px 14px 9px 36px',
              color: '#FFFFFF',
              fontSize: '13px',
              outline: 'none',
            }}
          />
        </div>
      </div>

      {/* Projects Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))',
          gap: '20px',
        }}
      >
        {isLoading ? (
          <div style={{ gridColumn: '1 / -1', padding: '64px', textAlign: 'center', color: '#9CA3AF' }}>
            <Loader2 size={36} className="tc-spin" style={{ margin: '0 auto 12px auto', color: '#dfae32', animation: 'spin 1s linear infinite' }} />
            <p>Loading projects...</p>
          </div>
        ) : filteredProjects.length === 0 ? (
          <div style={{ gridColumn: '1 / -1', padding: '64px', textAlign: 'center', color: '#9CA3AF' }}>
            <p style={{ fontSize: '16px', color: '#E5E7EB', marginBottom: '8px', fontWeight: 600 }}>No projects found</p>
            <p style={{ fontSize: '13px' }}>Create a new project above to start tracking client deliverables and payouts.</p>
          </div>
        ) : (
          filteredProjects.map((project) => {
          const statusColors = {
            Active: { bg: 'rgba(223, 174, 50, 0.15)', text: '#dfae32', border: 'rgba(223, 174, 50, 0.3)' },
            Pending: { bg: 'rgba(156, 163, 175, 0.15)', text: '#9CA3AF', border: 'rgba(156, 163, 175, 0.3)' },
            Completed: { bg: 'rgba(16, 185, 129, 0.15)', text: '#10B981', border: 'rgba(16, 185, 129, 0.3)' },
            Cancelled: { bg: 'rgba(239, 68, 68, 0.15)', text: '#EF4444', border: 'rgba(239, 68, 68, 0.3)' },
          }[project.status];

          return (
            <div
              key={project.id}
              onClick={() => setSelectedProject(project)}
              style={{
                backgroundColor: '#FFFFFF1A',
                borderRadius: '14px',
                padding: '24px',
                border: '1px solid rgba(255, 255, 255, 0.06)',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.borderColor = 'rgba(223, 174, 50, 0.35)';
                e.currentTarget.style.transform = 'translateY(-3px)';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.06)';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              <div>
                {/* Header: ID + Status */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
                  <span style={{ color: '#dfae32', fontSize: '12px', fontWeight: 700, letterSpacing: '0.04em' }}>
                    {project.id}
                  </span>
                  <span
                    style={{
                      fontSize: '11px',
                      fontWeight: 700,
                      padding: '4px 10px',
                      borderRadius: '999px',
                      backgroundColor: statusColors.bg,
                      color: statusColors.text,
                      border: `1px solid ${statusColors.border}`,
                    }}
                  >
                    {project.status}
                  </span>
                </div>

                {/* Title */}
                <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#FFFFFF', marginBottom: '8px' }}>
                  {project.name}
                </h3>
                <p style={{ color: '#9CA3AF', fontSize: '13px', lineHeight: 1.5, marginBottom: '18px' }}>
                  {project.description.slice(0, 105)}...
                </p>

                {/* Progress bar */}
                <div style={{ marginBottom: '18px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '6px' }}>
                    <span style={{ color: '#9CA3AF' }}>Progress</span>
                    <span style={{ color: '#FFFFFF', fontWeight: 700 }}>{project.progress}%</span>
                  </div>
                  <div style={{ width: '100%', height: '6px', backgroundColor: 'rgba(255, 255, 255, 0.08)', borderRadius: '999px', overflow: 'hidden' }}>
                    <div
                      style={{
                        width: `${project.progress}%`,
                        height: '100%',
                        backgroundColor: project.status === 'Completed' ? '#10B981' : '#dfae32',
                        borderRadius: '999px',
                        transition: 'width 0.4s ease',
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* Bottom Meta */}
              <div
                style={{
                  borderTop: '1px solid rgba(255, 255, 255, 0.06)',
                  paddingTop: '14px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  fontSize: '13px',
                }}
              >
                {/* Team Avatars */}
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  {project.members.map((m, i) => (
                    <img
                      key={i}
                      src={m.avatar}
                      alt={m.name}
                      title={`${m.name} (${m.role})`}
                      style={{
                        width: '28px',
                        height: '28px',
                        borderRadius: '50%',
                        border: '2px solid #11151F',
                        marginLeft: i > 0 ? '-8px' : '0',
                        objectFit: 'cover',
                      }}
                    />
                  ))}
                </div>

                {/* Budget & Due */}
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontWeight: 700, color: '#FFFFFF' }}>${project.budget.toLocaleString()}</div>
                  <div style={{ color: '#9CA3AF', fontSize: '11px' }}>Due {project.deadline}</div>
                </div>
              </div>
            </div>
          );
        }))}
      </div>

      {/* PROJECT DETAIL MODAL */}
      {selectedProject && (
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
          onClick={() => setSelectedProject(null)}
        >
          <div
            style={{
              backgroundColor: '#1C1C1E',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              borderRadius: '16px',
              maxWidth: '680px',
              width: '100%',
              maxHeight: '90vh',
              overflowY: 'auto',
              padding: '32px',
              boxShadow: '0 24px 48px rgba(0, 0, 0, 0.8)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
              <div>
                <span style={{ color: '#dfae32', fontSize: '12px', fontWeight: 700 }}>
                  {selectedProject.id} ● {selectedProject.department}
                </span>
                <h2 style={{ fontSize: '24px', fontWeight: 800, margin: '6px 0 0', color: '#FFFFFF' }}>
                  {selectedProject.name}
                </h2>
                <div style={{ color: '#9CA3AF', fontSize: '14px', marginTop: '4px' }}>
                  Client: <span style={{ color: '#FFFFFF', fontWeight: 600 }}>{selectedProject.client}</span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelectedProject(null)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#9CA3AF',
                  cursor: 'pointer',
                  padding: '6px',
                }}
              >
                <X size={20} />
              </button>
            </div>

            {/* Overview / Scope */}
            <div style={{ marginBottom: '24px' }}>
              <h4 style={{ fontSize: '14px', fontWeight: 700, color: '#FFFFFF', marginBottom: '8px' }}>
                Scope & Specifications
              </h4>
              <p style={{ color: '#9CA3AF', fontSize: '14px', lineHeight: 1.6, backgroundColor: '#161617', padding: '14px', borderRadius: '8px' }}>
                {selectedProject.description}
              </p>
            </div>

            {/* Budget & Timeline cards */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px' }}>
              <div style={{ backgroundColor: '#161617', padding: '16px', borderRadius: '10px' }}>
                <div style={{ color: '#9CA3AF', fontSize: '12px' }}>Total Escrow Budget</div>
                <div style={{ fontSize: '20px', fontWeight: 800, color: '#dfae32', marginTop: '4px' }}>
                  ${selectedProject.budget.toLocaleString()} USD
                </div>
              </div>
              <div style={{ backgroundColor: '#161617', padding: '16px', borderRadius: '10px' }}>
                <div style={{ color: '#9CA3AF', fontSize: '12px' }}>Milestone Deadline</div>
                <div style={{ fontSize: '20px', fontWeight: 800, color: '#FFFFFF', marginTop: '4px' }}>
                  {selectedProject.deadline}
                </div>
              </div>
            </div>

            {/* Assigned Team */}
            <div style={{ marginBottom: '24px' }}>
              <h4 style={{ fontSize: '14px', fontWeight: 700, color: '#FFFFFF', marginBottom: '12px' }}>
                Allocated Engineering Squad
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {selectedProject.members.map((member, i) => (
                  <div
                    key={i}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      backgroundColor: '#161617',
                      padding: '10px 14px',
                      borderRadius: '8px',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <img
                        src={member.avatar}
                        alt={member.name}
                        style={{ width: '32px', height: '32px', borderRadius: '50%', objectFit: 'cover' }}
                      />
                      <div>
                        <div style={{ fontSize: '13px', fontWeight: 700, color: '#FFFFFF' }}>{member.name}</div>
                        <div style={{ fontSize: '11px', color: '#9CA3AF' }}>{member.role}</div>
                      </div>
                    </div>
                    <span style={{ fontSize: '11px', color: '#10B981', fontWeight: 600 }}>Active Contributor</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Task Deliverables checklist */}
            <div style={{ marginBottom: '28px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <h4 style={{ fontSize: '14px', fontWeight: 700, color: '#FFFFFF', margin: 0 }}>
                  Milestone Tasks ({selectedProject.tasks.filter((t) => t.completed).length} / {selectedProject.tasks.length})
                </h4>
                <span style={{ fontSize: '13px', color: '#dfae32', fontWeight: 700 }}>
                  {selectedProject.progress}% Done
                </span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {selectedProject.tasks.map((task) => (
                  <div
                    key={task.id}
                    onClick={() => toggleTask(selectedProject.id, task.id)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      backgroundColor: '#161617',
                      padding: '12px 14px',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      border: task.completed ? '1px solid rgba(16, 185, 129, 0.25)' : '1px solid rgba(255, 255, 255, 0.05)',
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={task.completed}
                      onChange={() => {}}
                      style={{ cursor: 'pointer', accentColor: '#dfae32' }}
                    />
                    <span
                      style={{
                        fontSize: '13px',
                        color: task.completed ? '#9CA3AF' : '#FFFFFF',
                        textDecoration: task.completed ? 'line-through' : 'none',
                        flex: 1,
                      }}
                    >
                      {task.title}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
              {selectedProject.status !== 'Completed' && (
                <button
                  type="button"
                  onClick={() => markProjectComplete(selectedProject.id)}
                  style={{
                    backgroundColor: '#10B981',
                    color: '#FFFFFF',
                    fontWeight: 700,
                    fontSize: '14px',
                    padding: '10px 20px',
                    borderRadius: '8px',
                    border: 'none',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                  }}
                >
                  <CheckCircle2 size={16} />
                  <span>Mark as Completed & Trigger Payout</span>
                </button>
              )}
              <button
                type="button"
                onClick={() => setSelectedProject(null)}
                style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  color: '#FFFFFF',
                  fontWeight: 600,
                  fontSize: '14px',
                  padding: '10px 18px',
                  borderRadius: '8px',
                  border: 'none',
                  cursor: 'pointer',
                }}
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
              maxWidth: '540px',
              width: '100%',
              padding: '28px',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ fontSize: '20px', fontWeight: 800, margin: 0, color: '#FFFFFF' }}>
                Create New Project
              </h3>
              <button
                type="button"
                onClick={() => setShowCreateModal(false)}
                style={{ background: 'none', border: 'none', color: '#9CA3AF', cursor: 'pointer' }}
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleCreateProject}>
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '13px', color: '#9CA3AF', marginBottom: '6px' }}>
                  Project Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Nexus AI Trading Mobile App"
                  value={newProjectName}
                  onChange={(e) => setNewProjectName(e.target.value)}
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
                    Client Name
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Vanguard Corp"
                    value={newProjectClient}
                    onChange={(e) => setNewProjectClient(e.target.value)}
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
                <div>
                  <label style={{ display: 'block', fontSize: '13px', color: '#9CA3AF', marginBottom: '6px' }}>
                    Budget (USD)
                  </label>
                  <input
                    type="number"
                    placeholder="e.g. 25000"
                    value={newProjectBudget}
                    onChange={(e) => setNewProjectBudget(e.target.value)}
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
              </div>

              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '13px', color: '#9CA3AF', marginBottom: '6px' }}>
                  Target Delivery Date
                </label>
                <input
                  type="date"
                  value={newProjectDeadline}
                  onChange={(e) => setNewProjectDeadline(e.target.value)}
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
                  Scope Description
                </label>
                <textarea
                  rows={3}
                  placeholder="Outline client requirements, tech stack, and deliverable expectations..."
                  value={newProjectDesc}
                  onChange={(e) => setNewProjectDesc(e.target.value)}
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
                  disabled={isCreating}
                  style={{
                    backgroundColor: '#dfae32',
                    color: '#0A0D14',
                    fontWeight: 700,
                    padding: '10px 22px',
                    borderRadius: '8px',
                    border: 'none',
                    cursor: isCreating ? 'not-allowed' : 'pointer',
                    opacity: isCreating ? 0.7 : 1,
                  }}
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
