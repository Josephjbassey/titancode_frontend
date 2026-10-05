import React, { useState, useEffect } from 'react';
import {
  UploadCloud,
  CheckCircle2,
  Loader2,
} from 'lucide-react';
import type { ScreenId } from '../App';
import { api } from '../services/api';
import type { PricingTier } from '../types';

interface ClientProjectRequest {
  id: string;
  projectName: string;
  budgetTier: string;
  deadlinePreference: string;
  status: 'In Review' | 'Proposal Ready' | 'Active Development' | 'Completed';
  submittedDate: string;
  description: string;
}

export const ClientRequestProjectView: React.FC<{ onNavigate?: (view: ScreenId) => void }> = () => {
  const [activeTab, setActiveTab] = useState<'request_form' | 'my_projects'>('request_form');
  const [projectName, setProjectName] = useState('');
  const [budgetTier, setBudgetTier] = useState('$15,000 - $30,000');
  const [timeline, setTimeline] = useState('2 - 3 Months');
  const [brief, setBrief] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [pricingTiers, setPricingTiers] = useState<PricingTier[]>([]);
  const [isLoadingTiers, setIsLoadingTiers] = useState(true);
  const [isLoadingProjects, setIsLoadingProjects] = useState(true);
  const [myProjects, setMyProjects] = useState<ClientProjectRequest[]>([]);

  useEffect(() => {
    let mounted = true;
    setIsLoadingTiers(true);
    setIsLoadingProjects(true);

    api.getFinancialSettings()
      .then((settings) => {
        if (!mounted) return;
        if (settings.pricing_tiers && settings.pricing_tiers.length > 0) {
          const active = settings.pricing_tiers.filter((t: PricingTier) => t.is_active);
          setPricingTiers(active);
          if (active.length > 0) {
            setBudgetTier(active[0].label);
          }
        }
      })
      .catch(() => {})
      .finally(() => {
        if (mounted) setIsLoadingTiers(false);
      });

    api.getProjects()
      .then((projs) => {
        if (!mounted) return;
        if (projs && projs.length > 0) {
          const mapped: ClientProjectRequest[] = projs.map((p) => ({
            id: `PRJ-${p.id}`,
            projectName: p.project_name || p.name || 'Enterprise Project',
            budgetTier: `$${(p.budget || 25000).toLocaleString()} USD`,
            deadlinePreference: p.deadline ? p.deadline.split('T')[0] : '2 - 3 Months',
            status: p.status === 'completed'
              ? 'Completed'
              : p.status === 'in_progress'
              ? 'Active Development'
              : 'In Review',
            submittedDate: p.created_at ? p.created_at.split('T')[0] : new Date().toISOString().split('T')[0],
            description: p.description || 'Enterprise solution engineered by TitanCode.',
          }));
          setMyProjects(mapped);
        }
      })
      .catch(() => {})
      .finally(() => {
        if (mounted) setIsLoadingProjects(false);
      });

    return () => {
      mounted = false;
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!projectName.trim() || isSubmitting) return;

    setIsSubmitting(true);
    const activeUser = api.getActiveUser();
    try {
      await api.submitHireUs({
        name: activeUser?.name || 'Valued Client',
        email: activeUser?.email || 'client@titancode.tech',
        project_type: projectName.trim(),
        description: `${brief.trim()} (Budget: ${budgetTier}, Timeline: ${timeline})`,
      });

      const newReq: ClientProjectRequest = {
        id: `REQ-${Math.floor(400 + Math.random() * 600)}`,
        projectName,
        budgetTier,
        deadlinePreference: timeline,
        status: 'In Review',
        submittedDate: new Date().toISOString().split('T')[0],
        description: brief,
      };

      setMyProjects((prev) => [newReq, ...prev]);
      setSubmitted(true);
    } catch (err: any) {
      alert(err.message || 'Failed to submit project request.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="tc-fade-in tc-req-proj-container">
      {/* Header */}
      <div className="tc-req-header-row">
        <div>
          <h1 className="tc-page-title">
            Client Project Portal
          </h1>
          <p className="tc-page-subtitle">
            Commission bespoke software solutions, upload technical briefs, and monitor milestones.
          </p>
        </div>

        <div className="tc-view-mode-toggle">
          <button
            type="button"
            onClick={() => {
              setActiveTab('request_form');
              setSubmitted(false);
            }}
            className={`tc-view-mode-btn ${activeTab === 'request_form' ? 'tc-view-mode-btn--active' : ''}`}
          >
            Submit New Request
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('my_projects')}
            className={`tc-view-mode-btn ${activeTab === 'my_projects' ? 'tc-view-mode-btn--active' : ''}`}
          >
            My Commissioned Projects ({myProjects.length})
          </button>
        </div>
      </div>

      {activeTab === 'request_form' ? (
        submitted ? (
          <div className="tc-req-success-card">
            <CheckCircle2 size={54} color="#10B981" className="tc-mx-auto tc-mb-4" />
            <h2 className="tc-card-title tc-text-xl tc-mb-2">
              Project Request Received
            </h2>
            <p className="tc-text-muted tc-text-base tc-mb-4">
              Our engineering leadership will review your specifications and prepare an architectural
              milestone breakdown and binding escrow quote within 24 hours.
            </p>
            <button
              type="button"
              onClick={() => setActiveTab('my_projects')}
              className="tc-action-btn-gold"
            >
              View In My Projects
            </button>
          </div>
        ) : (
          <div className="tc-req-form-card tc-mx-auto">
            <h2 className="tc-card-title tc-text-xl tc-mb-4">
              Project Commissioning Brief
            </h2>

            <form onSubmit={handleSubmit}>
              <div className="tc-form-group">
                <label className="tc-form-label">
                  Project / Platform Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Next-Gen Cross-Border Logistics Engine"
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                  className="tc-form-input"
                />
              </div>

              <div className="tc-grid-2col tc-mb-4">
                <div>
                  <label className="tc-form-label">
                    Target Budget Range
                  </label>
                  <select
                    value={budgetTier}
                    onChange={(e) => setBudgetTier(e.target.value)}
                    className="tc-form-input"
                  >
                    {isLoadingTiers ? (
                      <option value="">Loading tiers...</option>
                    ) : pricingTiers.length === 0 ? (
                      <option value="">No tiers configured (admin setup required)</option>
                    ) : (
                      pricingTiers.map((tier) => (
                        <option key={tier.id} value={`${tier.min_amount} - ${tier.max_amount ?? '∞'}`}>
                          {tier.label}: ${tier.min_amount.toLocaleString()}{tier.max_amount !== null ? ` - $${tier.max_amount.toLocaleString()}` : '+'} USD
                        </option>
                      ))
                    )}
                  </select>
                </div>

                <div>
                  <label className="tc-form-label">
                    Target Completion Timeline
                  </label>
                  <select
                    value={timeline}
                    onChange={(e) => setTimeline(e.target.value)}
                    className="tc-form-input"
                  >
                    <option value="1 - 2 Months">1 - 2 Months (Rapid MVP)</option>
                    <option value="2 - 3 Months">2 - 3 Months (Standard)</option>
                    <option value="3 - 6 Months">3 - 6 Months (Enterprise)</option>
                  </select>
                </div>
              </div>

              <div className="tc-form-group">
                <label className="tc-form-label">
                  Functional Requirements & Target Deliverables
                </label>
                <textarea
                  rows={4}
                  required
                  placeholder="Outline key user workflows, integrations, target platforms, and performance targets..."
                  value={brief}
                  onChange={(e) => setBrief(e.target.value)}
                  className="tc-form-input tc-resize-none"
                />
              </div>

              {/* Upload brief attachment box */}
              <div className="tc-req-dropzone tc-mb-4">
                <UploadCloud size={32} color="#dfae32" className="tc-mx-auto tc-mb-2" />
                <div className="tc-font-semibold tc-text-sm tc-text-white">
                  Upload Technical Brief or Architecture Diagrams
                </div>
                <div className="tc-text-muted tc-text-xs tc-mt-1">
                  PDF, DOCX, Figma or ZIP up to 50MB
                </div>
              </div>

              <button
                type="submit"
                className="tc-action-btn-gold tc-w-full"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Submitting Request...' : 'Submit Project Request to TitanCode'}
              </button>
            </form>
          </div>
        )
      ) : (
        /* MY PROJECTS LIST */
        <div className="tc-req-projects-list">
          {isLoadingProjects ? (
            <div className="tc-empty-state">
              <div className="tc-flex-center-all">
                <Loader2 size={20} className="tc-spin" color="#dfae32" />
                <span>Loading commissioned projects...</span>
              </div>
            </div>
          ) : myProjects.length === 0 ? (
            <div className="tc-empty-state">
              No commissioned projects on file yet. Submit your first request using the form above!
            </div>
          ) : (
            myProjects.map((p) => (
              <div key={p.id} className="tc-req-project-card">
                <div>
                  <div className="tc-flex-center-gap tc-mb-2">
                    <span className="tc-text-xs tc-font-bold tc-text-gold">{p.id}</span>
                    <span
                      className={
                        p.status === 'Active Development'
                          ? 'tc-badge-healthy'
                          : 'tc-badge-pending'
                      }
                    >
                      ● {p.status}
                    </span>
                    <span className="tc-text-xs tc-text-muted">Submitted {p.submittedDate}</span>
                  </div>
                  <h3 className="tc-card-title tc-mb-1">
                    {p.projectName}
                  </h3>
                  <p className="tc-text-muted tc-text-sm">{p.description}</p>
                </div>

                <div className="tc-text-right">
                  <div className="tc-text-lg tc-font-bold tc-text-gold">{p.budgetTier}</div>
                  <div className="tc-text-xs tc-text-muted tc-mt-1">
                    Target: {p.deadlinePreference}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

