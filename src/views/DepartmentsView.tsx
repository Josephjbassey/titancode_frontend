import React, { useState, useEffect } from 'react';
import {
  Plus,
  X,
  Building2,
  ArrowRight,
  Search,
  Loader2,
} from 'lucide-react';
import type { ScreenId } from '../App';
import { api } from '../services/api';
import type { DepartmentInfo } from '../types';

interface DepartmentsViewProps {
  onNavigate?: (view: ScreenId) => void;
}

export const DepartmentsView: React.FC<DepartmentsViewProps> = ({ onNavigate }) => {
  const [departments, setDepartments] = useState<DepartmentInfo[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);

  // New Department form
  const [newName, setNewName] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newCategory, setNewCategory] = useState<DepartmentInfo['category']>('Engineering');
  const [newManager, setNewManager] = useState('Joseph John');

  useEffect(() => {
    let mounted = true;
    setIsLoading(true);
    api.getDepartments()
      .then((data) => {
        if (!mounted) return;
        setDepartments(data);
      })
      .catch((err) => {
        console.error('Failed to load departments:', err);
        if (!mounted) return;
        setDepartments([]);
      })
      .finally(() => {
        if (mounted) setIsLoading(false);
      });
    return () => {
      mounted = false;
    };
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim() || isSubmitting) return;

    setIsSubmitting(true);
    try {
      const created = await api.createDepartment({
        name: newName.trim(),
        description: newDesc.trim() || undefined,
        manager_name: newManager.trim() || undefined,
      });

      setDepartments((prev) => [created, ...prev]);
      setShowCreateModal(false);
      setNewName('');
      setNewDesc('');
    } catch (err: any) {
      alert(err.message || 'Failed to create department.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const categories = ['All', 'Engineering', 'Product', 'Growth', 'Operations', 'Finance'];

  const filtered = departments.filter((d) => {
    const matchesCat = selectedCategory === 'All' || d.category === selectedCategory;
    const matchesSearch =
      d.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.manager_name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div className="tc-fade-in" style={{ color: '#FFFFFF', width: '100%', display: 'flex', flexDirection: 'column', paddingBottom: '40px' }}>
      {/* 1. HEADER */}
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
              Organizational Matrix
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
              {departments.length} Active Startup Departments
            </span>
          </div>
          <h1 style={{ fontSize: '28px', fontWeight: 800, margin: 0, color: '#FFFFFF' }}>
            TitanCode Tech Firm Departments
          </h1>
          <p style={{ color: '#9CA3AF', fontSize: '14px', margin: '4px 0 0' }}>
            Functional business units, appointed department heads, 70/30 profit distributions, and project allocations.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowCreateModal(true)}
          className="tc-btn tc-btn-primary"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '11px 22px',
            borderRadius: '10px',
            fontWeight: 700,
            fontSize: '14px',
          }}
        >
          <Plus size={18} strokeWidth={2.5} />
          <span>New Department</span>
        </button>
      </div>

      {/* 2. FILTER TABS & SEARCH BAR */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '24px',
          flexWrap: 'wrap',
          gap: '12px',
        }}
      >
        {/* Category Pills */}
        <div style={{ display: 'flex', gap: '6px', background: 'rgba(255, 255, 255, 0.04)', padding: '4px', borderRadius: '10px' }}>
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              style={{
                padding: '6px 14px',
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

        {/* Search Input */}
        <div style={{ position: 'relative', width: '280px' }}>
          <Search
            size={16}
            style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#9CA3AF' }}
          />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search departments or leads..."
            style={{
              width: '100%',
              padding: '9px 12px 9px 36px',
              borderRadius: '10px',
              backgroundColor: '#161618',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              color: '#FFFFFF',
              fontSize: '13px',
              outline: 'none',
            }}
          />
        </div>
      </div>

      {/* 3. DEPARTMENTS GRID */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: isLoading || filtered.length === 0 ? '1fr' : 'repeat(auto-fit, minmax(340px, 1fr))',
          gap: '20px',
          marginBottom: '32px',
        }}
      >
        {isLoading ? (
          <div
            style={{
              padding: '60px 20px',
              textAlign: 'center',
              backgroundColor: '#FFFFFF1A',
              borderRadius: '16px',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              color: '#9CA3AF',
            }}
          >
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '10px' }}>
              <Loader2 size={20} className="tc-spin" color="#dfae32" />
              <span>Loading organizational departments...</span>
            </div>
          </div>
        ) : filtered.length === 0 ? (
          <div
            style={{
              padding: '60px 20px',
              textAlign: 'center',
              backgroundColor: '#FFFFFF1A',
              borderRadius: '16px',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              color: '#9CA3AF',
            }}
          >
            No departments found matching the filter.
          </div>
        ) : (
          filtered.map((dept) => (
            <div
            key={dept.id}
            style={{
              backgroundColor: '#FFFFFF1A',
              borderRadius: '16px',
              padding: '24px',
              border: '1px solid #FFFFFF26',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              transition: 'transform 0.15s ease, border-color 0.15s ease',
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.borderColor = 'rgba(223, 174, 50, 0.4)';
              e.currentTarget.style.transform = 'translateY(-2px)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.08)';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            <div>
              {/* Top Meta Line */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <span style={{ color: '#dfae32', fontSize: '11px', fontWeight: 800, letterSpacing: '0.05em' }}>
                  {dept.id} • {dept.code.toUpperCase()}
                </span>
                <span
                  style={{
                    backgroundColor: 'rgba(255, 255, 255, 0.06)',
                    padding: '3px 8px',
                    borderRadius: '6px',
                    fontSize: '11px',
                    color: '#D1D5DB',
                    fontWeight: 600,
                  }}
                >
                  {dept.category}
                </span>
              </div>

              {/* Department Title */}
              <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#FFFFFF', margin: '0 0 8px' }}>
                {dept.name}
              </h3>

              <p style={{ color: '#9CA3AF', fontSize: '13px', lineHeight: 1.5, margin: '0 0 18px' }}>
                {dept.description}
              </p>

              {/* Department Head & Staff Meta */}
              <div
                style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.02)',
                  border: '1px solid rgba(255, 255, 255, 0.04)',
                  borderRadius: '10px',
                  padding: '12px',
                  marginBottom: '16px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <img
                    src={dept.manager_avatar}
                    alt={dept.manager_name}
                    style={{ width: '36px', height: '36px', borderRadius: '50%', objectFit: 'cover' }}
                  />
                  <div>
                    <div style={{ fontSize: '10px', color: '#dfae32', fontWeight: 700, textTransform: 'uppercase' }}>
                      Lead
                    </div>
                    <div style={{ fontSize: '13px', fontWeight: 700, color: '#FFFFFF' }}>
                      {dept.manager_name}
                    </div>
                  </div>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '13px', fontWeight: 700, color: '#FFFFFF' }}>
                    {dept.member_count} Staff
                  </div>
                  <div style={{ fontSize: '11px', color: '#9CA3AF' }}>
                    {dept.active_projects_count} Active Projects
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Row: Profit Share & Open Dashboard Button */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                paddingTop: '14px',
                borderTop: '1px solid rgba(255, 255, 255, 0.04)',
              }}
            >
              <div>
                <span style={{ fontSize: '11px', color: '#9CA3AF' }}>Profit Pool Share: </span>
                <span style={{ fontSize: '13px', fontWeight: 800, color: '#10B981' }}>
                  {dept.profit_pool_share_percent}%
                </span>
              </div>

              <button
                type="button"
                onClick={() => onNavigate && onNavigate('manager_dashboard')}
                style={{
                  padding: '6px 12px',
                  borderRadius: '6px',
                  backgroundColor: 'rgba(223, 174, 50, 0.15)',
                  color: '#dfae32',
                  border: '1px solid rgba(223, 174, 50, 0.3)',
                  fontSize: '11px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                }}
              >
                Dept Dashboard <ArrowRight size={12} />
              </button>
            </div>
          </div>
        )))}
      </div>

      {/* 4. MODAL: CREATE DEPARTMENT */}
      {showCreateModal && (
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
              maxWidth: '480px',
              width: '100%',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
              <h3 style={{ fontSize: '18px', fontWeight: 700, margin: 0, color: '#FFFFFF' }}>
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
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#9CA3AF', marginBottom: '6px' }}>
                  Department Name *
                </label>
                <input
                  type="text"
                  required
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="e.g. Developer Experience (DX)"
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

              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#9CA3AF', marginBottom: '6px' }}>
                  Category
                </label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value as DepartmentInfo['category'])}
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
                  <option value="Engineering">Engineering</option>
                  <option value="Product">Product</option>
                  <option value="Growth">Growth</option>
                  <option value="Operations">Operations</option>
                  <option value="Finance">Finance</option>
                </select>
              </div>

              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#9CA3AF', marginBottom: '6px' }}>
                  Appoint Department Head
                </label>
                <select
                  value={newManager}
                  onChange={(e) => setNewManager(e.target.value)}
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
                  <option value="Joseph John">Joseph John</option>
                  <option value="Benedicta Atagamen">Benedicta Atagamen</option>
                  <option value="Alex Morgan">Alex Morgan</option>
                  <option value="Munis Samuel">Munis Samuel</option>
                  <option value="Dr. Chinedu Eze">Dr. Chinedu Eze</option>
                  <option value="Emeka Nwosu">Emeka Nwosu</option>
                  <option value="Zainab Bello">Zainab Bello</option>
                  <option value="Barr. Ngozi Okeke">Barr. Ngozi Okeke</option>
                  <option value="Blessing Adewale">Blessing Adewale</option>
                </select>
              </div>

              <div style={{ marginBottom: '24px' }}>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#9CA3AF', marginBottom: '6px' }}>
                  Mandate & Description
                </label>
                <textarea
                  rows={3}
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  placeholder="Describe functional objectives, tools and key metrics..."
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
                  onClick={() => setShowCreateModal(false)}
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
