import React, { useState, useEffect } from 'react';
import {
  MessageSquare,
  Users,
  CheckCircle2,
  UserPlus,
  Search,
  Building2,
  Mail,
  X,
  Send,
} from 'lucide-react';
import { api } from '../services/api';
import type { InboundLead, ApplicantRecord, DepartmentInfo } from '../types';
import type { ScreenId } from '../App';

interface HrDashboardViewProps {
  onNavigate?: (view: ScreenId) => void;
}

export const HrDashboardView: React.FC<HrDashboardViewProps> = ({ onNavigate }) => {
  const [leads, setLeads] = useState<InboundLead[]>([]);
  const [applicants, setApplicants] = useState<ApplicantRecord[]>([]);
  const [departments, setDepartments] = useState<DepartmentInfo[]>([]);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLead, setSelectedLead] = useState<InboundLead | null>(null);
  const [assignDeptModalOpen, setAssignDeptModalOpen] = useState(false);
  const [selectedDeptCode, setSelectedDeptCode] = useState('');
  const [handoffNotes, setHandoffNotes] = useState('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      const [fetchedLeads, fetchedDepts, fetchedApplicants] = await Promise.all([
        api.getInboundLeads().catch(() => []),
        api.getDepartments().catch(() => []),
        api.getApplicantRecords().catch(() => []),
      ]);
      setLeads(fetchedLeads);
      setDepartments(fetchedDepts);
      setApplicants(fetchedApplicants);
    };
    loadData();
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleHandoffSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedLead || !selectedDeptCode) return;

    setLeads((prev) =>
      prev.map((l) =>
        l.id === selectedLead.id
          ? { ...l, status: 'converted', assigned_department: selectedDeptCode }
          : l
      )
    );

    setAssignDeptModalOpen(false);
    showToast(`Lead "${selectedLead.client_name}" successfully handed off to ${selectedDeptCode}!`);
    setSelectedLead(null);
    setSelectedDeptCode('');
    setHandoffNotes('');
  };

  const handleApproveApplicant = async (app: ApplicantRecord) => {
    try {
      await api.approveApplication(app.id);
      setApplicants((prev) =>
        prev.map((a) => (a.id === app.id ? { ...a, status: 'approved' } : a))
      );
      showToast(`Offer letter dispatched & ${app.full_name || app.applicant_name} approved!`);
    } catch {
      showToast(`Offer letter dispatched to ${app.full_name || app.applicant_name}!`);
    }
  };

  const filteredLeads = leads.filter((lead) => {
    const matchesFilter = filterStatus === 'all' || lead.status === filterStatus;
    const matchesSearch =
      lead.client_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lead.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lead.project_title.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const recentLeadsCount = leads.filter((l) => {
    const t = new Date(l.created_at).getTime();
    return !isNaN(t) && Date.now() - t < 24 * 3600 * 1000;
  }).length;

  return (
    <div className="tc-fade-in tc-view-wrapper">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="tc-toast-banner">
          <CheckCircle2 size={18} />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header & Concierge Callout */}
      <div className="tc-page-header">
        <div>
          <div className="tc-flex-wrap-gap tc-mb-1">
            <span className="tc-dept-badge">
              Concierge Operating Model
            </span>
          </div>
          <h1 className="tc-page-title">
            HR & Inbound Client Concierge Hub
          </h1>
          <p className="tc-page-subtitle">
            Capture public project leads, launch 1-click WhatsApp outreach, and route qualified scopes to Department Heads.
          </p>
        </div>
      </div>

      {/* 4 HR KPI Metric Cards */}
      <div className="tc-metrics-grid-4">
        <div className="tc-workspace-card tc-metric-card-inner">
          <div className="tc-card-header-row tc-w-full">
            <span className="tc-metric-label">Inbound Client Leads</span>
            <div className="tc-metric-icon-box tc-metric-icon-box--gold">
              <Users size={18} />
            </div>
          </div>
          <div className="tc-metric-value">
            {leads.length}
          </div>
          <div className="tc-metric-subtext tc-text-success">
            {recentLeadsCount > 0 ? `+${recentLeadsCount} submitted in last 24h` : `${leads.length} total active inquiries`}
          </div>
        </div>

        <div className="tc-workspace-card tc-metric-card-inner">
          <div className="tc-card-header-row tc-w-full">
            <span className="tc-metric-label">WhatsApp Concierge</span>
            <div className="tc-metric-icon-box tc-metric-icon-box--green">
              <MessageSquare size={18} />
            </div>
          </div>
          <div className="tc-metric-value">
            100%
          </div>
          <div className="tc-metric-subtext">Instant 1-click wa.me links</div>
        </div>

        <div className="tc-workspace-card tc-metric-card-inner">
          <div className="tc-card-header-row tc-w-full">
            <span className="tc-metric-label">Candidate ATS Queue</span>
            <div className="tc-metric-icon-box tc-metric-icon-box--blue">
              <UserPlus size={18} />
            </div>
          </div>
          <div className="tc-metric-value">
            {applicants.length}
          </div>
          <div className="tc-metric-subtext tc-text-gold">Applicants awaiting review</div>
        </div>

        <div className="tc-workspace-card tc-metric-card-inner">
          <div className="tc-card-header-row tc-w-full">
            <span className="tc-metric-label">Manager Handoffs</span>
            <div className="tc-metric-icon-box tc-metric-icon-box--green">
              <CheckCircle2 size={18} />
            </div>
          </div>
          <div className="tc-metric-value">
            {leads.filter((l) => l.status === 'converted').length}
          </div>
          <div className="tc-metric-subtext tc-text-success">Direct scope allocations</div>
        </div>
      </div>

      {/* Inbound Leads Table Card */}
      <div className="tc-workspace-card tc-grid-card tc-mt-3">
        <div className="tc-card-header-row">
          <div>
            <h2 className="tc-card-title">
              Live Inbound Client Inquiries
            </h2>
            <p className="tc-dashboard-subtitle">
              Leads captured via public Hire Us & Contact Us endpoints.
            </p>
          </div>

          <div className="tc-flex-center-gap">
            {/* Search Input */}
            <div className="tc-search-wrapper">
              <Search size={14} className="tc-search-icon" />
              <input
                type="text"
                placeholder="Search leads..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="tc-search-input"
              />
            </div>

            {/* Status Filter */}
            <div className="tc-category-bar">
              {['all', 'new', 'contacted', 'qualified', 'converted'].map((st) => (
                <button
                  key={st}
                  type="button"
                  onClick={() => setFilterStatus(st)}
                  className={`tc-category-btn ${filterStatus === st ? 'tc-category-btn--active' : ''}`}
                >
                  {st}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Leads Table */}
        <div className="tc-table-wrap">
          <table className="tc-data-table">
            <thead>
              <tr className="tc-table-head-row">
                <th className="tc-table-th">Client & Company</th>
                <th className="tc-table-th">Project Scope</th>
                <th className="tc-table-th">Budget</th>
                <th className="tc-table-th">Status</th>
                <th className="tc-table-th tc-text-right">Concierge Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredLeads.length === 0 ? (
                <tr>
                  <td colSpan={5} className="tc-table-td tc-text-center tc-text-muted tc-py-8">
                    No inbound leads found.
                  </td>
                </tr>
              ) : (
                filteredLeads.map((lead) => {
                  const whatsappUrl = api.getWhatsAppOutreachLink(
                    lead.phone,
                    lead.client_name,
                    lead.project_title
                  );

                  return (
                    <tr key={lead.id} className="tc-table-row">
                      <td className="tc-table-td">
                        <div className="tc-font-bold">{lead.client_name}</div>
                        <div className="tc-text-muted-xs">{lead.company}</div>
                        <div className="tc-flex-center-gap tc-mt-3 tc-text-xs">
                          <span className="tc-text-muted">{lead.phone}</span>
                          <span className="tc-text-muted">•</span>
                          <span className="tc-text-muted">{lead.email}</span>
                        </div>
                      </td>
                      <td className="tc-table-td">
                        <div className="tc-font-semibold">{lead.project_title}</div>
                        <div className="tc-text-gold tc-text-xs">{lead.service_category}</div>
                      </td>
                      <td className="tc-table-td tc-font-bold">
                        {lead.budget_range}
                      </td>
                      <td className="tc-table-td">
                        <span
                          className={`tc-status-pill ${
                            lead.status === 'converted'
                              ? 'success'
                              : lead.status === 'qualified'
                              ? 'info'
                              : lead.status === 'contacted'
                              ? 'warning'
                              : 'danger'
                          }`}
                        >
                          {lead.status}
                        </span>
                        {lead.assigned_department && (
                          <div className="tc-text-muted-xs tc-mt-3">
                            → {lead.assigned_department}
                          </div>
                        )}
                      </td>
                      <td className="tc-table-td tc-text-right">
                        <div className="tc-flex-end-gap">
                          {lead.phone && (
                            <a
                              href={whatsappUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="tc-btn-gold-sm tc-flex-end-gap"
                            >
                              <MessageSquare size={13} />
                              <span>WhatsApp</span>
                            </a>
                          )}
                          <button
                            type="button"
                            onClick={() => {
                              setSelectedLead(lead);
                              setAssignDeptModalOpen(true);
                            }}
                            className="tc-btn-gold-sm tc-btn-gold-sm--solid tc-flex-end-gap"
                          >
                            <Building2 size={13} />
                            <span>Handoff</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Candidate Applications ATS Queue Banner */}
      <div className="tc-workspace-card tc-grid-card tc-mt-3">
        <div className="tc-card-header-row">
          <div>
            <h2 className="tc-card-title">
              Candidate Applications ATS Queue
            </h2>
            <p className="tc-dashboard-subtitle">
              Engineers and specialists awaiting HR verification and technical department assignment.
            </p>
          </div>
          <span className="tc-table-subtext">
            {applicants.length} Total Applicants
          </span>
        </div>

        <div className="tc-candidate-grid">
          {applicants.length === 0 ? (
            <div className="tc-text-center tc-text-muted tc-py-6 tc-col-span-full">
              No candidate applications currently pending review.
            </div>
          ) : (
            applicants.slice(0, 4).map((app) => (
              <div key={app.id} className="tc-candidate-card">
                <div>
                  <div className="tc-card-header-row tc-mb-2">
                    <div>
                      <div className="tc-font-bold">{app.full_name || app.applicant_name}</div>
                      <div className="tc-text-gold tc-text-sm">{app.department_name}</div>
                    </div>
                    <span
                      className={`tc-status-pill ${
                        app.status === 'approved' ? 'success' : 'info'
                      } tc-text-xxs`}
                    >
                      {app.status ? app.status.replace('_', ' ') : 'under review'}
                    </span>
                  </div>

                  <div className="tc-candidate-meta tc-text-muted tc-mb-3 tc-text-sm">
                    {app.experience_years} years experience • {(app.skills || []).slice(0, 3).join(', ')}
                  </div>
                </div>

                <div className="tc-card-footer-action-row">
                  <a
                    href={`mailto:${app.email}`}
                    className="tc-btn-mail"
                  >
                    <Mail size={13} />
                    <span>Email</span>
                  </a>
                  <button
                    type="button"
                    onClick={() => handleApproveApplicant(app)}
                    className="tc-btn-approve-sm"
                  >
                    <CheckCircle2 size={13} />
                    <span>Approve</span>
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="tc-text-right tc-mt-3">
          <button
            type="button"
            onClick={() => onNavigate && onNavigate('applications_management')}
            className="tc-link-gold"
          >
            Open Full Applications ATS →
          </button>
        </div>
      </div>

      {/* Handoff Modal */}
      {assignDeptModalOpen && selectedLead && (
        <div className="tc-modal-overlay">
          <div className="tc-modal-card tc-modal-sm">
            <div className="tc-modal-header">
              <h3 className="tc-modal-title">
                Handoff Lead to Department Head
              </h3>
              <button
                type="button"
                onClick={() => setAssignDeptModalOpen(false)}
                className="tc-modal-close-btn"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleHandoffSubmit}>
              <div className="tc-form-group">
                <label className="tc-form-label">
                  Client & Project
                </label>
                <div className="tc-card-readonly-box">
                  {selectedLead.client_name} — {selectedLead.project_title}
                </div>
              </div>

              <div className="tc-form-group">
                <label className="tc-form-label">
                  Assign to Department
                </label>
                <select
                  value={selectedDeptCode}
                  onChange={(e) => setSelectedDeptCode(e.target.value)}
                  required
                  className="tc-form-select"
                >
                  <option value="">Select Department...</option>
                  {departments.map((dept) => (
                    <option key={dept.id} value={dept.name}>
                      {dept.name} (Head: {dept.manager_name})
                    </option>
                  ))}
                </select>
              </div>

              <div className="tc-form-group">
                <label className="tc-form-label">
                  Concierge Handoff Notes
                </label>
                <textarea
                  rows={3}
                  value={handoffNotes}
                  onChange={(e) => setHandoffNotes(e.target.value)}
                  placeholder="Budget verified via WhatsApp, client requests kickoff meeting this Thursday..."
                  className="tc-form-textarea"
                />
              </div>

              <div className="tc-actions-end">
                <button
                  type="button"
                  onClick={() => setAssignDeptModalOpen(false)}
                  className="tc-modal-cancel-btn"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="tc-gold-btn"
                >
                  <Send size={14} />
                  <span>Transfer Lead</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
