import React, { useState, useEffect } from 'react';
import {
  CheckCircle2,
  ExternalLink,
  Code2,
  Globe,
  X,
  Search,
  Loader2,
} from 'lucide-react';
import type { ScreenId } from '../App';
import { api } from '../services/api';

interface Application {
  id: string;
  applicantName: string;
  email: string;
  phone: string;
  department: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  appliedDate: string;
  githubUrl: string;
  portfolioUrl: string;
  experienceYears: number;
  coverNote: string;
  reviewNotes?: string;
}

const mapApiApp = (rec: any): Application => {
  const statusMap: Record<string, 'Pending' | 'Approved' | 'Rejected'> = {
    pending: 'Pending',
    approved: 'Approved',
    rejected: 'Rejected',
  };
  return {
    id: `APP-${rec.id}`,
    applicantName: rec.applicant_name,
    email: rec.email,
    phone: rec.phone || 'N/A',
    department: rec.department_name || 'Engineering',
    status: statusMap[rec.status] || 'Pending',
    appliedDate: rec.created_at ? rec.created_at.split('T')[0] : '2026-09-18',
    githubUrl: rec.github_url || '',
    portfolioUrl: rec.portfolio_url || '',
    experienceYears: rec.experience_years || 1,
    coverNote: rec.skills?.length > 0 ? `Skills: ${rec.skills.join(', ')}` : 'Applicant engineering submission.',
    reviewNotes: rec.rejection_reason,
  };
};

interface ApplicationsManagementViewProps {
  onNavigate?: (view: ScreenId) => void;
}

export const ApplicationsManagementView: React.FC<ApplicationsManagementViewProps> = () => {
  const [applications, setApplications] = useState<Application[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [tab, setTab] = useState<'Pending' | 'Approved' | 'Rejected' | 'All'>('Pending');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedApp, setSelectedApp] = useState<Application | null>(null);
  const [reviewNoteInput, setReviewNoteInput] = useState('');

  useEffect(() => {
    let mounted = true;
    setIsLoading(true);
    api.getApplicantRecords()
      .then((records) => {
        if (!mounted) return;
        setApplications(records.map(mapApiApp));
      })
      .catch(() => {
        if (!mounted) return;
        setApplications([]);
      })
      .finally(() => {
        if (mounted) setIsLoading(false);
      });
    return () => { mounted = false; };
  }, []);

  const filteredApps = applications.filter((app) => {
    const matchesTab = tab === 'All' || app.status === tab;
    const matchesSearch =
      app.applicantName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.email.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesSearch;
  });

  const handleApprove = async (appId: string) => {
    const numericId = parseInt(appId.replace('APP-', ''), 10);
    setApplications((prev) =>
      prev.map((a) => (a.id === appId ? { ...a, status: 'Approved', reviewNotes: reviewNoteInput || 'Approved by reviewer.' } : a))
    );
    setSelectedApp(null);
    setReviewNoteInput('');

    if (!isNaN(numericId)) {
      try {
        await api.approveApplication(numericId);
      } catch (err: any) {
        alert(err.message || 'Failed to approve application on server');
      }
    }
  };

  const handleReject = async (appId: string) => {
    const numericId = parseInt(appId.replace('APP-', ''), 10);
    setApplications((prev) =>
      prev.map((a) => (a.id === appId ? { ...a, status: 'Rejected', reviewNotes: reviewNoteInput || 'Application declined.' } : a))
    );
    setSelectedApp(null);
    setReviewNoteInput('');

    if (!isNaN(numericId)) {
      try {
        await api.rejectApplication(numericId, reviewNoteInput || undefined);
      } catch (err: any) {
        alert(err.message || 'Failed to record rejection on server');
      }
    }
  };

  return (
    <div className="tc-fade-in tc-products-container">
      {/* Header */}
      <div className="tc-card-header-row tc-mb-4">
        <div>
          <h1 className="tc-page-title">
            Member Applications
          </h1>
          <p className="tc-page-subtitle">
            Review candidate qualifications, inspect code repositories, and approve incoming engineers.
          </p>
        </div>

        <div className="tc-table-filter-bar">
          <div className="tc-users-search-box">
            <Search
              size={15}
              color="#9CA3AF"
              className="tc-search-icon-pos"
            />
            <input
              type="text"
              placeholder="Search applicants..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="tc-form-input tc-search-input-padded"
            />
          </div>

          <div className="tc-flex-center-gap">
            {(['Pending', 'Approved', 'Rejected', 'All'] as const).map((t) => {
              const count = applications.filter((a) => (t === 'All' ? true : a.status === t)).length;
              return (
                <button
                  key={t}
                  type="button"
                  onClick={() => setTab(t)}
                  className={`tc-filter-pill-btn tc-flex-center-gap ${tab === t ? 'tc-filter-pill-btn--active' : ''}`}
                >
                  <span>{t}</span>
                  <span className="tc-tier-badge">
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Applications Table */}
      <div className="tc-tx-table-card">
        <table className="tc-tx-table">
          <thead>
            <tr className="tc-tx-table-tr">
              <th className="tc-tx-table-th">Applicant</th>
              <th className="tc-tx-table-th">Department</th>
              <th className="tc-tx-table-th">Experience</th>
              <th className="tc-tx-table-th">Applied Date</th>
              <th className="tc-tx-table-th">Status</th>
              <th className="tc-tx-table-th tc-tx-table-th--right">Review Action</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={6} className="tc-tx-table-td tc-text-center tc-text-muted">
                  <div className="tc-flex-center-all">
                    <Loader2 size={18} className="tc-spin" color="#dfae32" />
                    <span>Loading applicant records...</span>
                  </div>
                </td>
              </tr>
            ) : filteredApps.length === 0 ? (
              <tr>
                <td colSpan={6} className="tc-tx-table-td tc-text-center tc-text-muted">
                  No applicant records found matching the current criteria.
                </td>
              </tr>
            ) : (
              filteredApps.map((app) => (
                <tr
                  key={app.id}
                  onClick={() => setSelectedApp(app)}
                  className="tc-tx-table-tr tc-cursor-pointer"
                >
                  <td className="tc-tx-table-td">
                    <div className="tc-font-bold tc-text-white">{app.applicantName}</div>
                    <div className="tc-text-muted tc-text-xs">{app.email}</div>
                  </td>
                  <td className="tc-tx-table-td tc-text-gold tc-font-semibold">{app.department}</td>
                  <td className="tc-tx-table-td tc-text-muted">{app.experienceYears} Years</td>
                  <td className="tc-tx-table-td tc-text-muted">{app.appliedDate}</td>
                  <td className="tc-tx-table-td">
                    <span
                      className={
                        app.status === 'Approved'
                          ? 'tc-badge-status-approved'
                          : app.status === 'Rejected'
                          ? 'tc-badge-status-declined'
                          : 'tc-badge-role-ceo'
                      }
                    >
                      ● {app.status}
                    </span>
                  </td>
                  <td className="tc-tx-table-td tc-tx-table-th--right">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedApp(app);
                      }}
                      className="tc-action-btn-gold tc-py-1 tc-px-3 tc-text-xs"
                    >
                      Review
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* DETAIL MODAL */}
      {selectedApp && (
        <div className="tc-modal-overlay" onClick={() => setSelectedApp(null)}>
          <div className="tc-modal-card tc-modal-md" onClick={(e) => e.stopPropagation()}>
            <div className="tc-modal-header">
              <div>
                <span className="tc-text-gold tc-text-xs tc-font-bold">
                  {selectedApp.id} ● {selectedApp.department}
                </span>
                <h3 className="tc-modal-title tc-mt-1">
                  {selectedApp.applicantName}
                </h3>
                <div className="tc-text-muted tc-text-xs tc-mt-1">
                  Applied on {selectedApp.appliedDate}
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelectedApp(null)}
                className="tc-modal-close-btn"
              >
                <X size={20} />
              </button>
            </div>

            {/* Candidate details */}
            <div className="tc-grid-2col tc-mb-4">
              <div className="tc-user-detail-box">
                <div className="tc-user-detail-box-label">Email Address</div>
                <div className="tc-user-detail-box-val">{selectedApp.email}</div>
              </div>
              <div className="tc-user-detail-box">
                <div className="tc-user-detail-box-label">Phone Number</div>
                <div className="tc-user-detail-box-val">{selectedApp.phone}</div>
              </div>
            </div>

            {/* Links */}
            <div className="tc-flex-center-gap tc-mb-4">
              {selectedApp.githubUrl && (
                <a
                  href={selectedApp.githubUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="tc-filter-pill-btn tc-flex-center-gap tc-text-xs"
                >
                  <Code2 size={14} />
                  <span>GitHub Repository</span>
                  <ExternalLink size={12} />
                </a>
              )}
              {selectedApp.portfolioUrl && (
                <a
                  href={selectedApp.portfolioUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="tc-filter-pill-btn tc-flex-center-gap tc-text-xs"
                >
                  <Globe size={14} />
                  <span>Live Portfolio</span>
                  <ExternalLink size={12} />
                </a>
              )}
            </div>

            {/* Statement */}
            <div className="tc-mb-4">
              <div className="tc-text-muted tc-text-xs tc-mb-1">Applicant Statement:</div>
              <p className="tc-user-detail-box tc-text-muted tc-text-sm tc-line-relaxed">
                {selectedApp.coverNote}
              </p>
            </div>

            {/* Review Notes Input */}
            {selectedApp.status === 'Pending' && (
              <div className="tc-form-group tc-mb-4">
                <label className="tc-form-label">
                  Review Evaluation Note
                </label>
                <input
                  type="text"
                  placeholder="e.g. Cleared technical assessment with engineering panel; recommended for frontend."
                  value={reviewNoteInput}
                  onChange={(e) => setReviewNoteInput(e.target.value)}
                  className="tc-form-input"
                />
              </div>
            )}

            {/* Actions */}
            <div className="tc-flex-between tc-mt-4">
              {selectedApp.status === 'Pending' ? (
                <>
                  <button
                    type="button"
                    onClick={() => handleReject(selectedApp.id)}
                    className="tc-btn-danger"
                  >
                    Reject Application
                  </button>

                  <button
                    type="button"
                    onClick={() => handleApprove(selectedApp.id)}
                    className="tc-btn-success tc-flex-center-gap"
                  >
                    <CheckCircle2 size={16} />
                    <span>Approve & Onboard</span>
                  </button>
                </>
              ) : (
                <div className="tc-flex-end-gap tc-w-full">
                  <button
                    type="button"
                    onClick={() => setSelectedApp(null)}
                    className="tc-action-btn-gold"
                  >
                    Close
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
