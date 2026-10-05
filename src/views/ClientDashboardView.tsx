import React, { useState, useEffect } from 'react';
import {
  FolderGit2,
  CheckCircle2,
  MessageCircle,
  Plus,
  X,
  CreditCard,
  FileText,
  Send,
  Sparkles,
  Loader2,
} from 'lucide-react';
import { api } from '../services/api';
import type { ClientMilestone, Project } from '../types';
import type { ScreenId } from '../App';

interface ClientDashboardViewProps {
  onNavigate?: (view: ScreenId) => void;
}

export const ClientDashboardView: React.FC<ClientDashboardViewProps> = ({ onNavigate: _onNavigate }) => {
  const [milestones, setMilestones] = useState<ClientMilestone[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [activeProject, setActiveProject] = useState<Project | null>(null);
  const [activeUser, setActiveUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const [showRequestModal, setShowRequestModal] = useState(false);
  const [newProjectTitle, setNewProjectTitle] = useState('');
  const [newProjectBudget, setNewProjectBudget] = useState('$10M - $25M');
  const [newProjectDescription, setNewProjectDescription] = useState('');
  const [requestSubmitted, setRequestSubmitted] = useState(false);

  useEffect(() => {
    let mounted = true;
    setIsLoading(true);
    const user = api.getActiveUser();
    setActiveUser(user);

    api.getProjects()
      .then(async (projs) => {
        if (!mounted) return;
        setProjects(projs || []);
        const proj = projs && projs.length > 0 ? projs[0] : null;
        setActiveProject(proj);
        const data = await api.getClientMilestones(proj ? proj.id : 1);
        if (!mounted) return;
        setMilestones(data || []);
      })
      .catch((err) => {
        console.error('Failed to load client milestones:', err);
        if (!mounted) return;
        setMilestones([]);
      })
      .finally(() => {
        if (mounted) setIsLoading(false);
      });
    return () => {
      mounted = false;
    };
  }, []);

  const handleRequestSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProjectTitle.trim() || isSubmitting) return;

    setIsSubmitting(true);
    try {
      await api.submitHireUs({
        name: activeUser?.name || 'Enterprise Client',
        email: activeUser?.email || 'client@titancode.tech',
        project_type: newProjectTitle.trim(),
        description: `${newProjectDescription.trim()} (Budget: ${newProjectBudget})`,
      });
      setRequestSubmitted(true);
      setTimeout(() => {
        setRequestSubmitted(false);
        setShowRequestModal(false);
        setNewProjectTitle('');
        setNewProjectDescription('');
      }, 1200);
    } catch (err: any) {
      alert(err.message || 'Failed to submit project request.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const completedMilestones = milestones.filter((m) => m.status === 'paid' || m.status === 'approved');
  const totalContractValue = milestones.reduce((sum, m) => sum + m.amount, 0);
  const totalPaid = completedMilestones.reduce((sum, m) => sum + m.amount, 0);
  const totalDeliverablesCount = milestones.reduce((sum, m) => sum + (m.deliverables?.length || 0), 0);
  const milestoneProgressPct = milestones.length > 0
    ? Math.round((completedMilestones.length / milestones.length) * 100)
    : 0;

  return (
    <div className="tc-view-wrapper tc-fade-in">
      {/* 1. WELCOME CLIENT BANNER WITH WHATSAPP CONCIERGE */}
      <div className="tc-client-banner">
        <div>
          <div className="tc-live-indicator">
            <span className="tc-badge-executive">
              <Sparkles size={13} />
              Zero-Friction Client Portal
            </span>
            <span className="tc-badge-healthy">
              Enterprise Tier SLA
            </span>
          </div>
          <h1 className="tc-page-title">
            Welcome, {activeUser?.name || (activeUser?.full_name ? activeUser.full_name : 'Client Partner')}
          </h1>
          <p className="tc-page-subtitle">
            Tracking active development deliverables for <strong className="tc-text-white">{activeProject?.project_name || activeProject?.name || 'Active Project Engagements'}</strong>.
          </p>
          {projects.length > 1 && (
            <div className="tc-project-switcher-row">
              <span className="tc-project-switcher-label">Switch Project:</span>
              <select
                className="tc-project-switcher-select"
                value={activeProject?.id || ''}
                onChange={async (e) => {
                  const selected = projects.find((p) => p.id === Number(e.target.value));
                  if (selected) {
                    setActiveProject(selected);
                    setIsLoading(true);
                    try {
                      const data = await api.getClientMilestones(selected.id);
                      setMilestones(data || []);
                    } finally {
                      setIsLoading(false);
                    }
                  }
                }}
              >
                {projects.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.project_name || p.name} (Ref: TC-{p.id})
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>

        {/* Action CTAs */}
        <div className="tc-header-actions">
          <a
            href={api.getClientConciergeWhatsAppUrl({
              projectName: activeProject?.project_name || activeProject?.name,
              clientName: activeUser?.name || activeUser?.full_name,
              projectId: activeProject?.id,
            })}
            target="_blank"
            rel="noopener noreferrer"
            className="tc-whatsapp-btn"
            title="Chat directly with your dedicated TitanCode engineering concierge on WhatsApp"
          >
            <MessageCircle size={16} />
            WhatsApp Dedicated Lead
          </a>

          <button
            type="button"
            className="tc-gold-btn"
            onClick={() => setShowRequestModal(true)}
          >
            <Plus size={16} />
            Request Project / Scope Add-On
          </button>
        </div>
      </div>

      {/* 2. FOUR CLIENT KPI CARDS */}
      <div className="tc-metrics-grid-4">
        {/* Metric 1: Contracted Projects */}
        <div className="tc-workspace-card tc-metric-card">
          <div className="tc-metric-label">Contracted Projects</div>
          <div className="tc-metric-value">
            {projects.length} Active {projects.length === 1 ? 'Project' : 'Projects'}
          </div>
          <div className="tc-metric-subtext">
            {projects.length > 0 ? `${projects[0].project_name || projects[0].name} in progress` : 'Ready for onboarding'}
          </div>
        </div>

        {/* Metric 2: Milestones Progress */}
        <div className="tc-workspace-card tc-metric-card">
          <div className="tc-metric-label">Milestone Completion</div>
          <div className="tc-metric-value">
            {completedMilestones.length} of {milestones.length} Done
          </div>
          <div className="tc-metric-subtext">
            <span className="tc-split-legend-item--gold">{milestoneProgressPct}% Overall Progress</span>
          </div>
        </div>

        {/* Metric 3: Total Deliverables */}
        <div className="tc-workspace-card tc-metric-card">
          <div className="tc-metric-label">Deliverables Delivered</div>
          <div className="tc-metric-value">
            {totalDeliverablesCount} Assets Verified
          </div>
          <div className="tc-page-subtitle">
            QA certified & code scanned
          </div>
        </div>

        {/* Metric 4: Settlement Status */}
        <div className="tc-workspace-card tc-metric-card">
          <div className="tc-metric-label">Escrow Settled</div>
          <div className="tc-metric-value tc-split-legend-item--gold">
            ${(totalPaid / 1000000).toFixed(1)}M
          </div>
          <div className="tc-progress-date">
            of ${(totalContractValue / 1000000).toFixed(1)}M Total Escrow
          </div>
        </div>
      </div>

      {/* 3. MILESTONES & DELIVERABLE TIMELINE TRACKER */}
      <div className="tc-workspace-card tc-card-section">
        <div className="tc-card-header-row">
          <div>
            <h2 className="tc-card-title">
              Project Milestone Roadmap & Deliverables
            </h2>
            <p className="tc-page-subtitle">
              TitanCode holds client funds in escrow until each milestone's deliverables pass your sign-off.
            </p>
          </div>
        </div>

        <div className="tc-list-stack">
          {isLoading ? (
            <div className="tc-table-empty">
              <div className="tc-table-loading">
                <Loader2 size={18} className="tc-spin" color="#dfae32" />
                <span>Loading project milestone roadmap...</span>
              </div>
            </div>
          ) : milestones.length === 0 ? (
            <div className="tc-table-empty">
              No active deliverables or milestones registered yet. Click &quot;Request Project Scope&quot; above to submit an engagement.
            </div>
          ) : (
            milestones.map((m) => {
              const statusConfig = {
                paid: { label: 'PAID & APPROVED', badgeClass: 'tc-status-badge--completed' },
                ready_for_review: { label: 'READY FOR REVIEW', badgeClass: 'tc-status-badge--pending' },
                in_progress: { label: 'IN PROGRESS', badgeClass: 'tc-status-badge--in-progress' },
                pending: { label: 'UPCOMING PHASE', badgeClass: 'tc-priority-badge--low' },
                approved: { label: 'APPROVED', badgeClass: 'tc-status-badge--completed' },
              };
              const sc = statusConfig[m.status] || statusConfig.pending;

              return (
                <div key={m.id} className="tc-milestone-card tc-scorecard-item">
                  <div className="tc-approval-info">
                    <div>
                      <div className="tc-approval-title">
                        {m.title}
                        <span className={`tc-status-badge ${sc.badgeClass} tc-ml-2`}>
                          {sc.label}
                        </span>
                      </div>
                      <p className="tc-page-subtitle">
                        {m.description}
                      </p>

                      {/* Deliverables List */}
                      {m.deliverables && m.deliverables.length > 0 && (
                        <div className="tc-mt-3">
                          <div className="tc-metric-label tc-mb-1">
                            Deliverables Included:
                          </div>
                          <div className="tc-flex-wrap-gap">
                            {m.deliverables.map((del, idx) => (
                              <span key={idx} className="tc-deliverable-chip">
                                <FileText size={12} className="tc-icon-gold" />
                                {del}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="tc-scorecard-right">
                      <div className="tc-budget-val tc-text-lg">
                        ${(m.amount / 1000000).toFixed(2)}M
                      </div>
                      <div className="tc-progress-date">
                        Due: {m.due_date}
                      </div>
                    </div>
                  </div>

                  {/* Interactive Action Bar */}
                  <div className="tc-actions-end">
                    {m.status === 'ready_for_review' && (
                      <>
                        <button
                          type="button"
                          onClick={() => alert(`Reviewing deliverables for ${m.title}`)}
                          className="tc-btn-secondary"
                        >
                          Inspect Artifacts
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setMilestones((prev) =>
                              prev.map((item) => (item.id === m.id ? { ...item, status: 'approved' } : item))
                            );
                            alert('Milestone approved! Funds released to developer pool.');
                          }}
                          className="tc-gold-btn"
                        >
                          Approve & Release Funds
                        </button>
                      </>
                    )}

                    {m.status === 'pending' && (
                      <a
                        href={m.payment_url || '#'}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="tc-gold-btn"
                      >
                        <CreditCard size={14} />
                        Fund Escrow
                      </a>
                    )}

                    {m.status === 'paid' && (
                      <span className="tc-badge-healthy">
                        <CheckCircle2 size={14} />
                        Milestone Satisfied & Certified
                      </span>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* 4. MODAL: REQUEST NEW PROJECT / SCOPE EXTENSION */}
      {showRequestModal && (
        <div className="tc-modal-backdrop">
          <div className="tc-modal-container tc-modal-sm">
            <div className="tc-card-header-row">
              <div className="tc-metric-header">
                <FolderGit2 size={20} className="tc-icon-gold" />
                <h3 className="tc-card-title">
                  Commission New Project Scope
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowRequestModal(false)}
                className="tc-card-link-btn"
              >
                <X size={20} />
              </button>
            </div>

            {requestSubmitted ? (
              <div className="tc-meeting-inner-box tc-success-box">
                <div className="tc-card-title tc-mb-1">
                  Scope Request Received!
                </div>
                <div className="tc-page-subtitle">
                  Our HR Concierge and Project Architect will contact you on WhatsApp within 15 minutes.
                </div>
              </div>
            ) : (
              <form onSubmit={handleRequestSubmit}>
                <div className="tc-form-group">
                  <label className="tc-form-label">
                    Project or Module Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={newProjectTitle}
                    onChange={(e) => setNewProjectTitle(e.target.value)}
                    placeholder="e.g. AI-Powered Fleet Telemetry Module"
                    className="tc-form-input figma-input tc-w-full"
                  />
                </div>

                <div className="tc-form-group">
                  <label className="tc-form-label">
                    Estimated Budget Allocation
                  </label>
                  <select
                    value={newProjectBudget}
                    onChange={(e) => setNewProjectBudget(e.target.value)}
                    className="tc-dropdown-select tc-w-full"
                  >
                    <option value="$3M - $5M">$3,000,000 - $5,000,000 ($2k - $3.5k)</option>
                    <option value="$5M - $10M">$5,000,000 - $10,000,000 ($3.5k - $7k)</option>
                    <option value="$10M - $25M">$10,000,000 - $25,000,000 ($7k - $16k)</option>
                    <option value="$25M+">$25,000,000+ Enterprise Tier</option>
                  </select>
                </div>

                <div className="tc-form-group">
                  <label className="tc-form-label">
                    Scope Details & Business Objectives
                  </label>
                  <textarea
                    rows={4}
                    value={newProjectDescription}
                    onChange={(e) => setNewProjectDescription(e.target.value)}
                    placeholder="Describe the technical requirements, key features, and desired target completion date..."
                    className="tc-form-input figma-input tc-w-full tc-no-resize"
                  />
                </div>

                <div className="tc-header-actions tc-actions-end">
                  <button
                    type="button"
                    onClick={() => setShowRequestModal(false)}
                    className="tc-btn-secondary"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="tc-gold-btn"
                    disabled={isSubmitting}
                  >
                    <Send size={15} />
                    {isSubmitting ? 'Submitting...' : 'Submit Request'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
