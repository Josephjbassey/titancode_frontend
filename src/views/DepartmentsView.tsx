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
  const [availableManagers, setAvailableManagers] = useState<{ id: number | string; name: string }[]>([]);

  // New Department form
  const [newName, setNewName] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newCategory, setNewCategory] = useState<DepartmentInfo['category']>('Engineering');
  const [newManager, setNewManager] = useState('');

  useEffect(() => {
    let mounted = true;
    setIsLoading(true);

    const activeUser = api.getActiveUser();
    if (activeUser?.name) {
      setNewManager(activeUser.name);
    }

    Promise.all([
      api.getDepartments(),
      api.getUsers({ limit: 100 }),
    ])
      .then(([deptData, userData]) => {
        if (!mounted) return;
        setDepartments(deptData || []);

        if (userData?.items && userData.items.length > 0) {
          const list = userData.items.map((u: any) => ({
            id: u.id,
            name: u.full_name || u.name || `User #${u.id}`,
          }));
          setAvailableManagers(list);
          if (!activeUser?.name && list.length > 0) {
            setNewManager(list[0].name);
          }
        }
      })
      .catch((err) => {
        console.error('Failed to load departments data:', err);
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
    <div className="tc-fade-in tc-dept-view-container">
      {/* 1. HEADER */}
      <div className="tc-page-header-row">
        <div>
          <div className="tc-live-indicator">
            <span className="tc-badge-gold-pill">
              <Building2 size={13} />
              Organizational Matrix
            </span>
            <span className="tc-badge-muted-pill">
              {departments.length} Active Startup Departments
            </span>
          </div>
          <h1 className="tc-page-title">
            TitanCode Tech Firm Departments
          </h1>
          <p className="tc-page-subtitle">
            Functional business units, appointed department heads, 70/30 profit distributions, and project allocations.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowCreateModal(true)}
          className="tc-gold-btn"
        >
          <Plus size={18} strokeWidth={2.5} />
          <span>New Department</span>
        </button>
      </div>

      {/* 2. FILTER TABS & SEARCH BAR */}
      <div className="tc-filter-bar">
        {/* Category Pills */}
        <div className="tc-tab-pill-group">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={`tc-tab-pill-btn ${selectedCategory === cat ? 'tc-tab-pill-btn--active' : ''}`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="tc-search-wrapper">
          <Search size={16} className="tc-search-icon-pos" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search departments or leads..."
            className="tc-search-input-field"
          />
        </div>
      </div>

      {/* 3. DEPARTMENTS GRID */}
      <div className={`tc-dept-grid ${isLoading || filtered.length === 0 ? 'tc-dept-grid--empty' : ''}`}>
        {isLoading ? (
          <div className="tc-dept-empty-box">
            <div className="tc-flex-center-gap tc-justify-center">
              <Loader2 size={20} className="tc-spin tc-text-gold" />
              <span>Loading organizational departments...</span>
            </div>
          </div>
        ) : filtered.length === 0 ? (
          <div className="tc-dept-empty-box">
            No departments found matching the filter.
          </div>
        ) : (
          filtered.map((dept) => (
            <div key={dept.id} className="tc-dept-card">
              <div>
                {/* Top Meta Line */}
                <div className="tc-dept-meta-row">
                  <span className="tc-dept-code-tag">
                    {dept.id} • {dept.code.toUpperCase()}
                  </span>
                  <span className="tc-dept-cat-badge">
                    {dept.category}
                  </span>
                </div>

                {/* Department Title */}
                <h3 className="tc-dept-card-title">
                  {dept.name}
                </h3>

                <p className="tc-dept-card-desc">
                  {dept.description}
                </p>

                {/* Department Head & Staff Meta */}
                <div className="tc-dept-head-box">
                  <div className="tc-flex-center-gap">
                    {dept.manager_avatar ? (
                      <img
                        src={dept.manager_avatar}
                        alt={dept.manager_name}
                        className="tc-dept-avatar-img"
                      />
                    ) : (
                      <div className="tc-dept-avatar-fallback">
                        {dept.manager_name
                          ?.split(' ')
                          .map((n) => n[0])
                          .join('')
                          .slice(0, 2)}
                      </div>
                    )}
                    <div>
                      <div className="tc-dept-lead-label">
                        Lead
                      </div>
                      <div className="tc-dept-lead-name">
                        {dept.manager_name}
                      </div>
                    </div>
                  </div>

                  <div className="tc-text-right">
                    <div className="tc-dept-staff-count">
                      {dept.member_count} Staff
                    </div>
                    <div className="tc-dept-projects-count">
                      {dept.active_projects_count} Active Projects
                    </div>
                  </div>
                </div>
              </div>

              {/* Bottom Row: Profit Share & Open Dashboard Button */}
              <div className="tc-dept-footer-row">
                <div>
                  <span className="tc-dept-profit-label">Profit Pool Share: </span>
                  <span className="tc-dept-profit-val">
                    {dept.profit_pool_share_percent}%
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => onNavigate && onNavigate('manager_dashboard')}
                  className="tc-dept-dashboard-btn"
                >
                  Dept Dashboard <ArrowRight size={12} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* 4. MODAL: CREATE DEPARTMENT */}
      {showCreateModal && (
        <div className="tc-modal-backdrop">
          <div className="tc-dept-modal-box">
            <div className="tc-card-header-row tc-mb-4">
              <h3 className="tc-card-title">
                Create New Department
              </h3>
              <button
                type="button"
                onClick={() => setShowCreateModal(false)}
                className="tc-modal-close-btn"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleCreate}>
              <div className="tc-form-group">
                <label className="tc-form-label">
                  Department Name *
                </label>
                <input
                  type="text"
                  required
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="e.g. Developer Experience (DX)"
                  className="tc-form-input"
                />
              </div>

              <div className="tc-form-group">
                <label className="tc-form-label">
                  Category
                </label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value as DepartmentInfo['category'])}
                  className="tc-form-select"
                >
                  <option value="Engineering">Engineering</option>
                  <option value="Product">Product</option>
                  <option value="Growth">Growth</option>
                  <option value="Operations">Operations</option>
                  <option value="Finance">Finance</option>
                </select>
              </div>

              <div className="tc-form-group">
                <label className="tc-form-label">
                  Appoint Department Head
                </label>
                <select
                  value={newManager}
                  onChange={(e) => setNewManager(e.target.value)}
                  className="tc-form-select"
                >
                  {availableManagers.length > 0 ? (
                    availableManagers.map((m) => (
                      <option key={m.id} value={m.name}>
                        {m.name}
                      </option>
                    ))
                  ) : (
                    <>
                      <option value="Joseph John">Joseph John</option>
                      <option value="Benedicta Atagamen">Benedicta Atagamen</option>
                      <option value="Alex Morgan">Alex Morgan</option>
                      <option value="Munis Samuel">Munis Samuel</option>
                    </>
                  )}
                </select>
              </div>

              <div className="tc-form-group">
                <label className="tc-form-label">
                  Mandate & Description
                </label>
                <textarea
                  rows={3}
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  placeholder="Describe functional objectives, tools and key metrics..."
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
                  disabled={isSubmitting}
                  className="tc-gold-btn"
                >
                  {isSubmitting ? 'Creating...' : 'Create Department'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
