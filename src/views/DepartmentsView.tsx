import React, { useState } from 'react';
import {
  Plus,
  X,
  ChevronRight,
  FolderGit2,
} from 'lucide-react';
import type { ScreenId } from '../App';

interface Department {
  id: string;
  name: string;
  description: string;
  manager: { name: string; avatar: string };
  assistant: { name: string; avatar: string };
  memberCount: number;
  activeProjects: string[];
}

const INITIAL_DEPARTMENTS: Department[] = [
  {
    id: 'DEP-01',
    name: 'Fullstack & Backend Engineering',
    description: 'High-availability server infrastructure, microservices, cloud deployments, and resilient database architectures.',
    manager: { name: 'Joseph John', avatar: '/assets/team_joseph.png' },
    assistant: { name: 'David Mensah', avatar: '/assets/admin_avatar.png' },
    memberCount: 12,
    activeProjects: ['TitanCore SaaS Cloud Engine', 'OmniTrade Crypto Arbitrage Bot'],
  },
  {
    id: 'DEP-02',
    name: 'UI/UX & Product Design',
    description: 'Enterprise design systems, interactive prototypes, user journey mapping, and conversion-optimized aesthetics.',
    manager: { name: 'Benedicta Atagamen', avatar: '/assets/team_benedicta.png' },
    assistant: { name: 'Sarah Al-Mansoor', avatar: '/assets/admin_avatar.png' },
    memberCount: 8,
    activeProjects: ['Aurelia FinTech Mobile App', 'PulseHealth Telemedicine Portal'],
  },
  {
    id: 'DEP-03',
    name: 'Product Management & QA',
    description: 'Sprint planning, user story grooming, client milestone alignment, and automated regression testing.',
    manager: { name: 'Olukayode Tioluwanimi', avatar: '/assets/team_olukayode.png' },
    assistant: { name: 'Munis Samuel', avatar: '/assets/team_munis.png' },
    memberCount: 6,
    activeProjects: ['Aurelia FinTech Mobile App', 'TitanCore SaaS Cloud Engine'],
  },
];

interface DepartmentsViewProps {
  onNavigate?: (view: ScreenId) => void;
}

export const DepartmentsView: React.FC<DepartmentsViewProps> = () => {
  const [departments, setDepartments] = useState<Department[]>(INITIAL_DEPARTMENTS);
  const [selectedDept, setSelectedDept] = useState<Department | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newName, setNewName] = useState('');
  const [newDesc, setNewDesc] = useState('');

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;

    const newDept: Department = {
      id: `DEP-0${departments.length + 1}`,
      name: newName,
      description: newDesc || 'Specialized division of TitanCode.',
      manager: { name: 'Joseph John', avatar: '/assets/team_joseph.png' },
      assistant: { name: 'Benedicta Atagamen', avatar: '/assets/team_benedicta.png' },
      memberCount: 1,
      activeProjects: [],
    };

    setDepartments([...departments, newDept]);
    setShowCreateModal(false);
    setNewName('');
    setNewDesc('');
  };

  return (
    <div style={{ color: '#FFFFFF' }}>
      {/* Header */}
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
            Departments
          </h1>
          <p style={{ color: '#9CA3AF', fontSize: '14px', margin: '4px 0 0' }}>
            Functional divisions, appointed managers, assistants, and squad allocations.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowCreateModal(true)}
          style={{
            backgroundColor: '#E5A83B',
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
            boxShadow: '0 4px 14px rgba(229, 168, 59, 0.25)',
          }}
        >
          <Plus size={18} strokeWidth={2.5} />
          <span>New Department</span>
        </button>
      </div>

      {/* Departments Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
          gap: '24px',
        }}
      >
        {departments.map((dept) => (
          <div
            key={dept.id}
            onClick={() => setSelectedDept(dept)}
            style={{
              backgroundColor: '#11151F',
              borderRadius: '16px',
              padding: '28px',
              border: '1px solid rgba(255, 255, 255, 0.06)',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.borderColor = 'rgba(229, 168, 59, 0.35)';
              e.currentTarget.style.transform = 'translateY(-3px)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.06)';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            <div>
              {/* Header Badge */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <span style={{ color: '#E5A83B', fontSize: '12px', fontWeight: 700 }}>{dept.id}</span>
                <span
                  style={{
                    backgroundColor: 'rgba(255, 255, 255, 0.08)',
                    padding: '4px 10px',
                    borderRadius: '999px',
                    fontSize: '12px',
                    color: '#9CA3AF',
                  }}
                >
                  {dept.memberCount} Staff Members
                </span>
              </div>

              <h3 style={{ fontSize: '20px', fontWeight: 800, color: '#FFFFFF', marginBottom: '10px' }}>
                {dept.name}
              </h3>
              <p style={{ color: '#9CA3AF', fontSize: '13px', lineHeight: 1.6, marginBottom: '22px' }}>
                {dept.description}
              </p>

              {/* Leadership Row */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '20px' }}>
                <div style={{ backgroundColor: '#0B0E14', padding: '12px', borderRadius: '8px' }}>
                  <div style={{ fontSize: '11px', color: '#9CA3AF' }}>Department Manager</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '6px' }}>
                    <img
                      src={dept.manager.avatar}
                      alt={dept.manager.name}
                      style={{ width: '24px', height: '24px', borderRadius: '50%', objectFit: 'cover' }}
                    />
                    <span style={{ fontSize: '12px', fontWeight: 700, color: '#FFFFFF' }}>{dept.manager.name}</span>
                  </div>
                </div>

                <div style={{ backgroundColor: '#0B0E14', padding: '12px', borderRadius: '8px' }}>
                  <div style={{ fontSize: '11px', color: '#9CA3AF' }}>Assistant Lead</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '6px' }}>
                    <img
                      src={dept.assistant.avatar}
                      alt={dept.assistant.name}
                      style={{ width: '24px', height: '24px', borderRadius: '50%', objectFit: 'cover' }}
                    />
                    <span style={{ fontSize: '12px', fontWeight: 700, color: '#FFFFFF' }}>{dept.assistant.name}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Active Projects Footer */}
            <div
              style={{
                borderTop: '1px solid rgba(255, 255, 255, 0.06)',
                paddingTop: '14px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                fontSize: '12px',
                color: '#9CA3AF',
              }}
            >
              <span>{dept.activeProjects.length} Active Client Projects</span>
              <span style={{ color: '#E5A83B', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '2px' }}>
                <span>Inspect</span>
                <ChevronRight size={14} />
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* DETAIL MODAL */}
      {selectedDept && (
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
          onClick={() => setSelectedDept(null)}
        >
          <div
            style={{
              backgroundColor: '#11151F',
              border: '1px solid rgba(229, 168, 59, 0.3)',
              borderRadius: '16px',
              maxWidth: '540px',
              width: '100%',
              padding: '28px',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
              <div>
                <span style={{ color: '#E5A83B', fontSize: '12px', fontWeight: 700 }}>{selectedDept.id}</span>
                <h3 style={{ fontSize: '20px', fontWeight: 800, margin: '4px 0 0', color: '#FFFFFF' }}>
                  {selectedDept.name}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedDept(null)}
                style={{ background: 'none', border: 'none', color: '#9CA3AF', cursor: 'pointer' }}
              >
                <X size={20} />
              </button>
            </div>

            <p style={{ color: '#9CA3AF', fontSize: '14px', lineHeight: 1.6, marginBottom: '20px' }}>
              {selectedDept.description}
            </p>

            <div style={{ backgroundColor: '#0B0E14', padding: '16px', borderRadius: '10px', marginBottom: '20px' }}>
              <div style={{ fontSize: '13px', fontWeight: 700, color: '#E5A83B', marginBottom: '10px' }}>
                Active Client Projects Assigned:
              </div>
              {selectedDept.activeProjects.length > 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {selectedDept.activeProjects.map((p, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: '#FFFFFF' }}>
                      <FolderGit2 size={14} color="#E5A83B" />
                      <span>{p}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <div style={{ color: '#9CA3AF', fontSize: '13px' }}>No active projects assigned yet.</div>
              )}
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <button
                type="button"
                onClick={() => setSelectedDept(null)}
                style={{
                  backgroundColor: '#E5A83B',
                  color: '#0A0D14',
                  fontWeight: 700,
                  padding: '10px 24px',
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

      {/* CREATE MODAL */}
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
              maxWidth: '500px',
              width: '100%',
              padding: '28px',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ fontSize: '20px', fontWeight: 800, margin: 0, color: '#FFFFFF' }}>
                Create New Department
              </h3>
              <button
                type="button"
                onClick={() => setShowCreateModal(false)}
                style={{ background: 'none', border: 'none', color: '#9CA3AF', cursor: 'pointer' }}
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleCreate}>
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '13px', color: '#9CA3AF', marginBottom: '6px' }}>
                  Department Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. AI Research & Machine Learning"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
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
                  Mission & Responsibilities
                </label>
                <textarea
                  rows={3}
                  placeholder="Summarize the core focus and engineering remit..."
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
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
                  Create Department
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
