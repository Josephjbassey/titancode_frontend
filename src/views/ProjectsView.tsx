import React, { useState } from 'react';
import {
  Plus,
  Search,
  CheckCircle2,
  X,
} from 'lucide-react';
import type { ScreenId } from '../App';

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

const INITIAL_PROJECTS: Project[] = [
  {
    id: 'PRJ-101',
    name: 'Aurelia FinTech Mobile App',
    client: 'Apex Global Financials',
    department: 'Mobile Development',
    budget: 24500,
    deadline: '2026-10-15',
    status: 'Active',
    progress: 68,
    description: 'Next-gen cross-platform mobile wallet with biometric security, real-time FX currency conversions, and multi-signature authorization.',
    members: [
      { name: 'Joseph John', role: 'Lead Fullstack', avatar: '/assets/joseph.jpg' },
      { name: 'Benedicta Atagamen', role: 'UI/UX Designer', avatar: '/assets/benedicta.png' },
      { name: 'Munis Samuel', role: 'Product Architect', avatar: '/assets/munis.jpg' },
    ],
    tasks: [
      { id: 'T-1', title: 'Setup WebRTC streaming & auth endpoints', completed: true },
      { id: 'T-2', title: 'Implement biometric biometric verification', completed: true },
      { id: 'T-3', title: 'Build FX swap and liquidity router', completed: false },
      { id: 'T-4', title: 'QA penetration and stress testing', completed: false },
    ],
  },
  {
    id: 'PRJ-102',
    name: 'TitanCore SaaS Cloud Engine',
    client: 'Helios Enterprise LLC',
    department: 'Web Engineering',
    budget: 38000,
    deadline: '2026-11-01',
    status: 'Active',
    progress: 42,
    description: 'High-throughput event ingestion cloud platform capable of processing 10,000 metrics/sec with automated anomaly detection.',
    members: [
      { name: 'Olukayode Tioluwanimi', role: 'Product Manager', avatar: '/assets/blessing.jpg' },
      { name: 'Joseph John', role: 'Backend Lead', avatar: '/assets/joseph.jpg' },
    ],
    tasks: [
      { id: 'T-5', title: 'Kafka message broker partitioning', completed: true },
      { id: 'T-6', title: 'PostgreSQL read-replica pool setup', completed: true },
      { id: 'T-7', title: 'Redis cluster cache tiering', completed: false },
    ],
  },
  {
    id: 'PRJ-103',
    name: 'OmniTrade Crypto Arbitrage Bot',
    client: 'Vanguard Capital',
    department: 'Digital Products',
    budget: 18500,
    deadline: '2026-09-12',
    status: 'Completed',
    progress: 100,
    description: 'Algorithmic trading engine monitoring DEX liquidity pools and executing flash loan swaps under 80 milliseconds.',
    members: [
      { name: 'Munis Samuel', role: 'Algorithm Lead', avatar: '/assets/munis.jpg' },
      { name: 'Joseph John', role: 'Systems Engineer', avatar: '/assets/joseph.jpg' },
    ],
    tasks: [
      { id: 'T-8', title: 'Mempool listener & smart contract execution', completed: true },
      { id: 'T-9', title: 'Slippage simulation and gas optimizer', completed: true },
    ],
  },
  {
    id: 'PRJ-104',
    name: 'PulseHealth Telemedicine Portal',
    client: 'MedSphere Health Systems',
    department: 'Web Engineering',
    budget: 29000,
    deadline: '2026-12-05',
    status: 'Pending',
    progress: 10,
    description: 'HIPAA-compliant doctor-patient teleconsultation portal with encrypted medical document storage and digital prescriptions.',
    members: [
      { name: 'Benedicta Atagamen', role: 'UI/UX Designer', avatar: '/assets/benedicta.png' },
      { name: 'Olukayode Tioluwanimi', role: 'Product Manager', avatar: '/assets/blessing.jpg' },
    ],
    tasks: [
      { id: 'T-10', title: 'HIPAA compliance audit & wireframes', completed: true },
      { id: 'T-11', title: 'Encrypted document vault schema', completed: false },
    ],
  },
];

interface ProjectsViewProps {
  onNavigate?: (view: ScreenId) => void;
}

export const ProjectsView: React.FC<ProjectsViewProps> = ({ onNavigate: _onNavigate }) => {
  const [projects, setProjects] = useState<Project[]>(INITIAL_PROJECTS);
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

  const filteredProjects = projects.filter((p) => {
    const matchesStatus = statusFilter === 'All' || p.status === statusFilter;
    const matchesSearch =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.client.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.id.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const handleCreateProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProjectName.trim()) return;

    const created: Project = {
      id: `PRJ-${Math.floor(100 + Math.random() * 900)}`,
      name: newProjectName,
      client: newProjectClient || 'Internal Project',
      department: 'Web Engineering',
      budget: Number(newProjectBudget) || 20000,
      deadline: newProjectDeadline || '2026-12-31',
      status: 'Active',
      progress: 0,
      description: newProjectDesc || 'Custom enterprise software development.',
      members: [{ name: 'Joseph John', role: 'Lead Developer', avatar: '/assets/joseph.jpg' }],
      tasks: [{ id: `T-${Date.now()}`, title: 'Project kick-off & requirements spec', completed: false }],
    };

    setProjects([created, ...projects]);
    setShowCreateModal(false);
    setNewProjectName('');
    setNewProjectClient('');
    setNewProjectBudget('');
    setNewProjectDeadline('');
    setNewProjectDesc('');
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
    <div style={{ color: '#FFFFFF' }}>
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
          style={{
            backgroundColor: '#dfae32',
            color: '#0A0D14',
            fontWeight: 700,
            fontSize: '14px',
            padding: '11px 22px',
            borderRadius: '8px',
            border: 'none',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            boxShadow: '0 4px 14px rgba(223, 174, 50, 0.25)',
          }}
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
            backgroundColor: '#11151F',
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
            backgroundColor: '#11151F',
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
            backgroundColor: '#11151F',
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
            backgroundColor: '#11151F',
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
            backgroundColor: '#11151F',
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
              backgroundColor: '#11151F',
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
        {filteredProjects.map((project) => {
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
                backgroundColor: '#11151F',
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
        })}
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
              backgroundColor: '#11151F',
              border: '1px solid rgba(223, 174, 50, 0.3)',
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
              backgroundColor: '#11151F',
              border: '1px solid rgba(223, 174, 50, 0.3)',
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
                  Create Project
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
