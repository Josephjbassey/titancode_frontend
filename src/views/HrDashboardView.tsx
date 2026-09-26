import React, { useState, useEffect } from 'react';
import {
  MessageSquare,
  Users,
  CheckCircle2,
  UserPlus,
  ArrowUpRight,
  Search,
  Building2,
  Mail,
  X,
  Send,
} from 'lucide-react';
import { api, MOCK_INBOUND_LEADS, MOCK_APPLICANT_RECORDS } from '../services/api';
import type { InboundLead, ApplicantRecord, DepartmentInfo } from '../types';
import type { ScreenId } from '../App';

interface HrDashboardViewProps {
  onNavigate?: (view: ScreenId) => void;
}

export const HrDashboardView: React.FC<HrDashboardViewProps> = ({ onNavigate }) => {
  const [leads, setLeads] = useState<InboundLead[]>(MOCK_INBOUND_LEADS);
  const [applicants, setApplicants] = useState<ApplicantRecord[]>(MOCK_APPLICANT_RECORDS);
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
      const fetchedLeads = await api.getInboundLeads();
      setLeads(fetchedLeads);
      const fetchedDepts = await api.getDepartments();
      setDepartments(fetchedDepts);
      const fetchedApplicants = await api.getApplicantRecords();
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

  const filteredLeads = leads.filter((lead) => {
    const matchesFilter = filterStatus === 'all' || lead.status === filterStatus;
    const matchesSearch =
      lead.client_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lead.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lead.project_title.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '28px',
        paddingBottom: '48px',
        width: '100%',
      }}
      className="tc-fade-in"
    >
      {/* Toast Notification */}
      {toastMessage && (
        <div
          style={{
            position: 'fixed',
            top: '24px',
            right: '24px',
            backgroundColor: '#DFAE32',
            color: '#0B0B0C',
            padding: '12px 20px',
            borderRadius: '10px',
            fontWeight: 700,
            fontSize: '14px',
            boxShadow: '0 8px 30px rgba(0, 0, 0, 0.4)',
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          <CheckCircle2 size={18} />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header & Concierge Callout */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <span
              style={{
                fontSize: '11px',
                fontWeight: 700,
                color: '#DFAE32',
                textTransform: 'uppercase',
                letterSpacing: '1px',
                padding: '3px 8px',
                borderRadius: '6px',
                backgroundColor: 'rgba(223, 174, 50, 0.15)',
              }}
            >
              Concierge Operating Model
            </span>
          </div>
          <h1 style={{ fontSize: '26px', fontWeight: 800, color: '#FFFFFF', margin: '4px 0' }}>
            HR & Inbound Client Concierge Hub
          </h1>
          <p style={{ color: '#9CA3AF', fontSize: '14px', margin: 0 }}>
            Capture public project leads, launch 1-click WhatsApp outreach, and route qualified scopes to Department Heads.
          </p>
        </div>
      </div>

      {/* 4 HR KPI Metric Cards */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '20px',
        }}
      >
        <div
          className="figma-card"
          style={{
            borderRadius: '16px',
            padding: '22px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            minHeight: '150px',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '13px', color: '#9CA3AF', fontWeight: 600 }}>Inbound Client Leads</span>
            <div style={{ width: '36px', height: '36px', borderRadius: '10px', backgroundColor: '#DFAE324D', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#DFAE32' }}>
              <Users size={18} />
            </div>
          </div>
          <div style={{ fontSize: '32px', fontWeight: 800, color: '#FFFFFF', lineHeight: 1 }}>
            {leads.length}
          </div>
          <div style={{ fontSize: '12px', color: '#10B981' }}>+2 submitted in last 24h</div>
        </div>

        <div
          className="figma-card"
          style={{
            borderRadius: '16px',
            padding: '22px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            minHeight: '150px',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '13px', color: '#9CA3AF', fontWeight: 600 }}>WhatsApp Concierge</span>
            <div style={{ width: '36px', height: '36px', borderRadius: '10px', backgroundColor: 'rgba(37, 211, 102, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#25D366' }}>
              <MessageSquare size={18} />
            </div>
          </div>
          <div style={{ fontSize: '32px', fontWeight: 800, color: '#FFFFFF', lineHeight: 1 }}>
            100%
          </div>
          <div style={{ fontSize: '12px', color: '#9CA3AF' }}>Instant 1-click wa.me links</div>
        </div>

        <div
          className="figma-card"
          style={{
            borderRadius: '16px',
            padding: '22px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            minHeight: '150px',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '13px', color: '#9CA3AF', fontWeight: 600 }}>Candidate ATS Queue</span>
            <div style={{ width: '36px', height: '36px', borderRadius: '10px', backgroundColor: 'rgba(59, 130, 246, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#3B82F6' }}>
              <UserPlus size={18} />
            </div>
          </div>
          <div style={{ fontSize: '32px', fontWeight: 800, color: '#FFFFFF', lineHeight: 1 }}>
            {applicants.length}
          </div>
          <div style={{ fontSize: '12px', color: '#DFAE32' }}>Applicants awaiting review</div>
        </div>

        <div
          className="figma-card"
          style={{
            borderRadius: '16px',
            padding: '22px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            minHeight: '150px',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '13px', color: '#9CA3AF', fontWeight: 600 }}>Manager Handoffs</span>
            <div style={{ width: '36px', height: '36px', borderRadius: '10px', backgroundColor: 'rgba(16, 185, 129, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#10B981' }}>
              <CheckCircle2 size={18} />
            </div>
          </div>
          <div style={{ fontSize: '32px', fontWeight: 800, color: '#FFFFFF', lineHeight: 1 }}>
            {leads.filter((l) => l.status === 'converted').length}
          </div>
          <div style={{ fontSize: '12px', color: '#10B981' }}>Direct scope allocations</div>
        </div>
      </div>

      {/* Inbound Leads Table Card */}
      <div
        style={{
          backgroundColor: '#232324',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          borderRadius: '16px',
          padding: '24px',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px', marginBottom: '20px' }}>
          <div>
            <h2 style={{ fontSize: '18px', fontWeight: 700, color: '#FFFFFF', margin: 0 }}>
              Live Inbound Client Inquiries
            </h2>
            <p style={{ color: '#9CA3AF', fontSize: '13px', margin: '4px 0 0' }}>
              Leads captured via public Hire Us & Contact Us endpoints.
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            {/* Search Input */}
            <div style={{ position: 'relative', width: '220px' }}>
              <Search size={14} style={{ position: 'absolute', left: '12px', top: '11px', color: '#9CA3AF' }} />
              <input
                type="text"
                placeholder="Search leads..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  width: '100%',
                  height: '34px',
                  backgroundColor: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '8px',
                  padding: '0 12px 0 34px',
                  color: '#FFFFFF',
                  fontSize: '12px',
                  outline: 'none',
                }}
              />
            </div>

            {/* Status Filter */}
            <div style={{ display: 'flex', gap: '6px' }}>
              {['all', 'new', 'contacted', 'qualified', 'converted'].map((st) => (
                <button
                  key={st}
                  type="button"
                  onClick={() => setFilterStatus(st)}
                  style={{
                    padding: '6px 12px',
                    borderRadius: '8px',
                    border: 'none',
                    fontSize: '11px',
                    fontWeight: 600,
                    textTransform: 'capitalize',
                    cursor: 'pointer',
                    backgroundColor: filterStatus === st ? '#DFAE32' : 'rgba(255, 255, 255, 0.05)',
                    color: filterStatus === st ? '#0B0B0C' : '#9CA3AF',
                  }}
                >
                  {st}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Leads Table */}
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.08)', color: '#9CA3AF' }}>
                <th style={{ padding: '12px 14px', fontWeight: 600 }}>Client & Company</th>
                <th style={{ padding: '12px 14px', fontWeight: 600 }}>Project Scope</th>
                <th style={{ padding: '12px 14px', fontWeight: 600 }}>Budget</th>
                <th style={{ padding: '12px 14px', fontWeight: 600 }}>Status</th>
                <th style={{ padding: '12px 14px', fontWeight: 600, textAlign: 'right' }}>Concierge Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredLeads.map((lead) => {
                const whatsappUrl = api.getWhatsAppOutreachLink(
                  lead.phone,
                  lead.client_name,
                  lead.project_title
                );

                return (
                  <tr
                    key={lead.id}
                    style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.04)', transition: 'background-color 0.15s' }}
                    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.02)')}
                    onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                  >
                    <td style={{ padding: '16px 14px' }}>
                      <div style={{ fontWeight: 600, color: '#FFFFFF' }}>{lead.client_name}</div>
                      <div style={{ fontSize: '12px', color: '#9CA3AF' }}>{lead.company}</div>
                      <div style={{ fontSize: '11px', color: '#6B7280', display: 'flex', gap: '8px', marginTop: '2px' }}>
                        <span>{lead.phone}</span>
                        <span>•</span>
                        <span>{lead.email}</span>
                      </div>
                    </td>
                    <td style={{ padding: '16px 14px' }}>
                      <div style={{ color: '#D1D5DB', fontWeight: 500 }}>{lead.project_title}</div>
                      <div style={{ fontSize: '11px', color: '#DFAE32' }}>{lead.service_category}</div>
                    </td>
                    <td style={{ padding: '16px 14px', color: '#FFFFFF', fontWeight: 600 }}>
                      {lead.budget_range}
                    </td>
                    <td style={{ padding: '16px 14px' }}>
                      <span
                        style={{
                          padding: '4px 10px',
                          borderRadius: '9999px',
                          fontSize: '11px',
                          fontWeight: 700,
                          textTransform: 'capitalize',
                          backgroundColor:
                            lead.status === 'new'
                              ? 'rgba(239, 68, 68, 0.15)'
                              : lead.status === 'contacted'
                              ? 'rgba(59, 130, 246, 0.15)'
                              : lead.status === 'qualified'
                              ? 'rgba(223, 174, 50, 0.15)'
                              : 'rgba(16, 185, 129, 0.15)',
                          color:
                            lead.status === 'new'
                              ? '#EF4444'
                              : lead.status === 'contacted'
                              ? '#3B82F6'
                              : lead.status === 'qualified'
                              ? '#DFAE32'
                              : '#10B981',
                        }}
                      >
                        {lead.status}
                      </span>
                    </td>
                    <td style={{ padding: '16px 14px', textAlign: 'right' }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '8px' }}>
                        {/* 1-Click WhatsApp Outreach Button */}
                        <a
                          href={whatsappUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '6px',
                            padding: '6px 12px',
                            borderRadius: '8px',
                            backgroundColor: '#25D366',
                            color: '#FFFFFF',
                            fontSize: '12px',
                            fontWeight: 700,
                            textDecoration: 'none',
                          }}
                          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#1EBE5D')}
                          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#25D366')}
                        >
                          <MessageSquare size={14} />
                          <span>WhatsApp</span>
                          <ArrowUpRight size={12} />
                        </a>

                        {/* Assign to Department Manager */}
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedLead(lead);
                            setAssignDeptModalOpen(true);
                          }}
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '6px',
                            padding: '6px 12px',
                            borderRadius: '8px',
                            backgroundColor: 'rgba(255, 255, 255, 0.05)',
                            border: '1px solid rgba(255, 255, 255, 0.12)',
                            color: '#FFFFFF',
                            fontSize: '12px',
                            fontWeight: 600,
                            cursor: 'pointer',
                          }}
                          onMouseEnter={(e) => (e.currentTarget.style.borderColor = '#DFAE32')}
                          onMouseLeave={(e) => (e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.12)')}
                        >
                          <Building2 size={14} />
                          <span>Handoff</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Candidate ATS Pipeline Section */}
      <div
        style={{
          backgroundColor: '#232324',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          borderRadius: '16px',
          padding: '24px',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
          <div>
            <h2 style={{ fontSize: '18px', fontWeight: 700, color: '#FFFFFF', margin: 0 }}>
              Talent Application Pipeline
            </h2>
            <p style={{ color: '#9CA3AF', fontSize: '13px', margin: '4px 0 0' }}>
              Candidate screening queue for developer, designer, and PM applicants.
            </p>
          </div>
          <span style={{ fontSize: '12px', color: '#DFAE32', fontWeight: 600 }}>
            {applicants.length} Total Candidates
          </span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '16px' }}>
          {applicants.map((app) => (
            <div
              key={app.id}
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.03)',
                border: '1px solid rgba(255, 255, 255, 0.06)',
                borderRadius: '12px',
                padding: '16px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
              }}
            >
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                  <div>
                    <div style={{ fontSize: '15px', fontWeight: 700, color: '#FFFFFF' }}>{app.applicant_name}</div>
                    <div style={{ fontSize: '12px', color: '#DFAE32' }}>{app.department_name}</div>
                  </div>
                  <span
                    style={{
                      padding: '3px 8px',
                      borderRadius: '9999px',
                      fontSize: '10px',
                      fontWeight: 700,
                      textTransform: 'uppercase',
                      backgroundColor:
                        app.status === 'approved'
                          ? 'rgba(16, 185, 129, 0.15)'
                          : 'rgba(59, 130, 246, 0.15)',
                      color: app.status === 'approved' ? '#10B981' : '#3B82F6',
                    }}
                  >
                    {app.status.replace('_', ' ')}
                  </span>
                </div>

                <div style={{ fontSize: '12px', color: '#9CA3AF', marginBottom: '12px' }}>
                  {app.experience_years} years experience • {app.skills.slice(0, 3).join(', ')}
                </div>
              </div>

              <div style={{ display: 'flex', gap: '8px', borderTop: '1px solid rgba(255, 255, 255, 0.04)', paddingTop: '12px' }}>
                <a
                  href={`mailto:${app.email}`}
                  style={{
                    flex: 1,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px',
                    height: '32px',
                    borderRadius: '8px',
                    backgroundColor: 'rgba(255, 255, 255, 0.05)',
                    color: '#FFFFFF',
                    fontSize: '12px',
                    fontWeight: 600,
                    textDecoration: 'none',
                  }}
                >
                  <Mail size={13} />
                  <span>Email</span>
                </a>
                <button
                  type="button"
                  onClick={() => showToast(`Offer letter dispatched to ${app.applicant_name}!`)}
                  style={{
                    flex: 1,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px',
                    height: '32px',
                    borderRadius: '8px',
                    backgroundColor: '#DFAE32',
                    color: '#0B0B0C',
                    fontSize: '12px',
                    fontWeight: 700,
                    border: 'none',
                    cursor: 'pointer',
                  }}
                >
                  <CheckCircle2 size={13} />
                  <span>Approve</span>
                </button>
              </div>
            </div>
          ))}
        </div>

        <div style={{ marginTop: '16px', textAlign: 'right' }}>
          <button
            type="button"
            onClick={() => onNavigate && onNavigate('applications_management')}
            style={{
              background: 'none',
              border: 'none',
              color: '#DFAE32',
              fontSize: '12px',
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            Open Full Applications ATS →
          </button>
        </div>
      </div>

      {/* Handoff Modal */}
      {assignDeptModalOpen && selectedLead && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.75)',
            backdropFilter: 'blur(6px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '20px',
          }}
        >
          <div
            style={{
              backgroundColor: '#1C1C1E',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              borderRadius: '16px',
              padding: '28px',
              width: '100%',
              maxWidth: '520px',
              boxShadow: '0 20px 50px rgba(0, 0, 0, 0.6)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#FFFFFF', margin: 0 }}>
                Handoff Lead to Department Head
              </h3>
              <button
                type="button"
                onClick={() => setAssignDeptModalOpen(false)}
                style={{ background: 'none', border: 'none', color: '#9CA3AF', cursor: 'pointer' }}
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleHandoffSubmit}>
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '13px', color: '#9CA3AF', marginBottom: '6px' }}>
                  Client & Project
                </label>
                <div style={{ padding: '10px 14px', borderRadius: '8px', backgroundColor: 'rgba(255, 255, 255, 0.05)', color: '#FFFFFF', fontSize: '14px', fontWeight: 600 }}>
                  {selectedLead.client_name} — {selectedLead.project_title}
                </div>
              </div>

              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '13px', color: '#9CA3AF', marginBottom: '6px' }}>
                  Assign to Department
                </label>
                <select
                  value={selectedDeptCode}
                  onChange={(e) => setSelectedDeptCode(e.target.value)}
                  required
                  style={{
                    width: '100%',
                    height: '42px',
                    borderRadius: '8px',
                    backgroundColor: '#232324',
                    border: '1px solid rgba(255, 255, 255, 0.15)',
                    color: '#FFFFFF',
                    padding: '0 12px',
                    fontSize: '13px',
                    outline: 'none',
                  }}
                >
                  <option value="">Select Department...</option>
                  {departments.map((dept) => (
                    <option key={dept.id} value={dept.name}>
                      {dept.name} (Head: {dept.manager_name})
                    </option>
                  ))}
                </select>
              </div>

              <div style={{ marginBottom: '24px' }}>
                <label style={{ display: 'block', fontSize: '13px', color: '#9CA3AF', marginBottom: '6px' }}>
                  Concierge Handoff Notes
                </label>
                <textarea
                  rows={3}
                  value={handoffNotes}
                  onChange={(e) => setHandoffNotes(e.target.value)}
                  placeholder="Budget verified via WhatsApp, client requests kickoff meeting this Thursday..."
                  style={{
                    width: '100%',
                    borderRadius: '8px',
                    backgroundColor: '#232324',
                    border: '1px solid rgba(255, 255, 255, 0.15)',
                    color: '#FFFFFF',
                    padding: '10px 12px',
                    fontSize: '13px',
                    outline: 'none',
                  }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
                <button
                  type="button"
                  onClick={() => setAssignDeptModalOpen(false)}
                  style={{
                    padding: '10px 18px',
                    borderRadius: '8px',
                    backgroundColor: 'transparent',
                    border: '1px solid rgba(255, 255, 255, 0.15)',
                    color: '#9CA3AF',
                    fontSize: '13px',
                    fontWeight: 600,
                    cursor: 'pointer',
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '10px 20px',
                    borderRadius: '8px',
                    backgroundColor: '#DFAE32',
                    color: '#0B0B0C',
                    fontSize: '13px',
                    fontWeight: 700,
                    border: 'none',
                    cursor: 'pointer',
                  }}
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
