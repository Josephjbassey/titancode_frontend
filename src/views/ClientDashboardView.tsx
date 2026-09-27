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
  const [activeProject, setActiveProject] = useState<Project | null>(null);
  const [activeUser, setActiveUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const [showRequestModal, setShowRequestModal] = useState(false);
  const [newProjectTitle, setNewProjectTitle] = useState('');
  const [newProjectBudget, setNewProjectBudget] = useState('₦10M - ₦25M');
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
        const proj = projs[0] || null;
        setActiveProject(proj);
        const data = await api.getClientMilestones(proj ? proj.id : 1);
        if (!mounted) return;
        setMilestones(data);
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

  return (
    <div className="tc-fade-in" style={{ color: '#FFFFFF', width: '100%', display: 'flex', flexDirection: 'column', paddingBottom: '40px' }}>
      {/* 1. WELCOME CLIENT BANNER WITH WHATSAPP CONCIERGE */}
      <div
        style={{
          backgroundColor: '#232324',
          border: '1px solid rgba(223, 174, 50, 0.3)',
          borderRadius: '16px',
          padding: '28px',
          marginBottom: '28px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '20px',
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
              <Sparkles size={13} />
              Zero-Friction Client Portal
            </span>
            <span
              style={{
                padding: '4px 10px',
                borderRadius: '9999px',
                backgroundColor: 'rgba(16, 185, 129, 0.15)',
                color: '#10B981',
                fontSize: '12px',
                fontWeight: 600,
              }}
            >
              Enterprise Tier SLA
            </span>
          </div>
          <h1 style={{ fontSize: '28px', fontWeight: 800, margin: 0, color: '#FFFFFF' }}>
            Welcome, {activeUser?.name || 'Client Partner'}
          </h1>
          <p style={{ color: '#9CA3AF', fontSize: '14px', margin: '4px 0 0' }}>
            Tracking active development deliverables for <strong style={{ color: '#FFFFFF' }}>{activeProject?.project_name || 'Active Project Engagements'}</strong>.
          </p>
        </div>

        {/* Action CTAs */}
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          <a
            href="https://wa.me/2348000000000?text=Hello%20TitanCode%20Concierge,%20I'd%20like%20an%20update%20on%20my%20project%20deliverables."
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '10px 18px',
              borderRadius: '10px',
              backgroundColor: 'rgba(37, 211, 102, 0.15)',
              color: '#25D366',
              border: '1px solid rgba(37, 211, 102, 0.3)',
              fontSize: '13px',
              fontWeight: 700,
              textDecoration: 'none',
              transition: 'all 0.15s ease',
            }}
          >
            <MessageCircle size={16} />
            WhatsApp Dedicated Lead
          </a>

          <button
            type="button"
            className="tc-btn tc-btn-primary"
            onClick={() => setShowRequestModal(true)}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '10px 18px',
              borderRadius: '10px',
              fontSize: '13px',
              fontWeight: 700,
            }}
          >
            <Plus size={16} />
            Request Project / Scope Add-On
          </button>
        </div>
      </div>

      {/* 2. FOUR CLIENT KPI CARDS */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '16px',
          marginBottom: '28px',
        }}
      >
        {/* Metric 1: Contracted Projects */}
        <div
          style={{
            backgroundColor: '#FFFFFF1A',
            border: '1px solid #FFFFFF26',
            borderRadius: '16px',
            padding: '20px',
          }}
        >
          <div style={{ fontSize: '12px', color: '#9CA3AF', fontWeight: 600 }}>Contracted Projects</div>
          <div style={{ fontSize: '26px', fontWeight: 800, color: '#FFFFFF', marginTop: '4px' }}>
            1 Active Project
          </div>
          <div style={{ fontSize: '12px', color: '#10B981', fontWeight: 600, marginTop: '2px' }}>
            Phase 2 in active development
          </div>
        </div>

        {/* Metric 2: Milestones Progress */}
        <div
          style={{
            backgroundColor: '#FFFFFF1A',
            border: '1px solid #FFFFFF26',
            borderRadius: '16px',
            padding: '20px',
          }}
        >
          <div style={{ fontSize: '12px', color: '#9CA3AF', fontWeight: 600 }}>Milestone Completion</div>
          <div style={{ fontSize: '26px', fontWeight: 800, color: '#FFFFFF', marginTop: '4px' }}>
            {completedMilestones.length} of {milestones.length} Completed
          </div>
          <div style={{ fontSize: '12px', color: '#dfae32', fontWeight: 600, marginTop: '2px' }}>
            {Math.round((completedMilestones.length / milestones.length) * 100)}% Overall Progress
          </div>
        </div>

        {/* Metric 3: Total Deliverables */}
        <div
          style={{
            backgroundColor: '#FFFFFF1A',
            border: '1px solid #FFFFFF26',
            borderRadius: '16px',
            padding: '20px',
          }}
        >
          <div style={{ fontSize: '12px', color: '#9CA3AF', fontWeight: 600 }}>Deliverables Delivered</div>
          <div style={{ fontSize: '26px', fontWeight: 800, color: '#FFFFFF', marginTop: '4px' }}>
            9 Assets Verified
          </div>
          <div style={{ fontSize: '12px', color: '#9CA3AF', marginTop: '2px' }}>
            QA certified & code scanned
          </div>
        </div>

        {/* Metric 4: Settlement Status */}
        <div
          style={{
            backgroundColor: '#FFFFFF1A',
            border: '1px solid #FFFFFF26',
            borderRadius: '16px',
            padding: '20px',
          }}
        >
          <div style={{ fontSize: '12px', color: '#9CA3AF', fontWeight: 600 }}>Escrow Settled</div>
          <div style={{ fontSize: '26px', fontWeight: 800, color: '#dfae32', marginTop: '4px' }}>
            ₦{(totalPaid / 1000000).toFixed(1)}M
          </div>
          <div style={{ fontSize: '12px', color: '#6B7280', marginTop: '2px' }}>
            of ₦{(totalContractValue / 1000000).toFixed(1)}M Total Escrow
          </div>
        </div>
      </div>

      {/* 3. MILESTONES & DELIVERABLE TIMELINE TRACKER */}
      <div
        style={{
          backgroundColor: '#232324',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          borderRadius: '16px',
          padding: '24px',
          marginBottom: '28px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
          <div>
            <h2 style={{ fontSize: '18px', fontWeight: 700, margin: 0, color: '#FFFFFF' }}>
              Project Milestone Roadmap & Deliverables
            </h2>
            <p style={{ fontSize: '13px', color: '#9CA3AF', margin: '2px 0 0' }}>
              TitanCode holds client funds in escrow until each milestone's deliverables pass your sign-off.
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {isLoading ? (
            <div style={{ padding: '40px', textAlign: 'center', color: '#9CA3AF' }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                <Loader2 size={18} className="tc-spin" color="#dfae32" />
                <span>Loading project milestone roadmap...</span>
              </div>
            </div>
          ) : milestones.length === 0 ? (
            <div style={{ padding: '40px', textAlign: 'center', color: '#9CA3AF', fontSize: '13px' }}>
              No active deliverables or milestones registered yet. Click &quot;Request Project Scope&quot; above to submit an engagement.
            </div>
          ) : (
            milestones.map((m) => {
            const statusConfig = {
              paid: { label: 'PAID & APPROVED', bg: 'rgba(16, 185, 129, 0.15)', text: '#10B981', border: 'rgba(16, 185, 129, 0.3)' },
              ready_for_review: { label: 'READY FOR REVIEW', bg: 'rgba(223, 174, 50, 0.15)', text: '#dfae32', border: 'rgba(223, 174, 50, 0.3)' },
              in_progress: { label: 'IN PROGRESS', bg: 'rgba(59, 130, 246, 0.15)', text: '#3B82F6', border: 'rgba(59, 130, 246, 0.3)' },
              pending: { label: 'UPCOMING PHASE', bg: 'rgba(255, 255, 255, 0.06)', text: '#9CA3AF', border: 'rgba(255, 255, 255, 0.1)' },
              approved: { label: 'APPROVED', bg: 'rgba(16, 185, 129, 0.15)', text: '#10B981', border: 'rgba(16, 185, 129, 0.3)' },
            };
            const sc = statusConfig[m.status] || statusConfig.pending;

            return (
              <div
                key={m.id}
                style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.02)',
                  border: `1px solid ${sc.border}`,
                  borderRadius: '14px',
                  padding: '20px',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    justifyContent: 'space-between',
                    marginBottom: '12px',
                    flexWrap: 'wrap',
                    gap: '10px',
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <h3 style={{ fontSize: '16px', fontWeight: 700, margin: 0, color: '#FFFFFF' }}>
                        {m.title}
                      </h3>
                      <span
                        style={{
                          padding: '3px 8px',
                          borderRadius: '6px',
                          fontSize: '10px',
                          fontWeight: 800,
                          backgroundColor: sc.bg,
                          color: sc.text,
                          letterSpacing: '0.05em',
                        }}
                      >
                        {sc.label}
                      </span>
                    </div>
                    <p style={{ fontSize: '13px', color: '#9CA3AF', margin: '4px 0 0' }}>
                      {m.description}
                    </p>
                  </div>

                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '18px', fontWeight: 800, color: '#dfae32' }}>
                      ₦{(m.amount / 1000000).toFixed(2)}M
                    </div>
                    <div style={{ fontSize: '11px', color: '#6B7280', marginTop: '2px' }}>
                      Due: {m.due_date}
                    </div>
                  </div>
                </div>

                {/* Deliverables List */}
                <div style={{ marginTop: '12px' }}>
                  <div style={{ fontSize: '12px', fontWeight: 600, color: '#9CA3AF', marginBottom: '6px' }}>
                    Deliverables Included:
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                    {m.deliverables.map((del, idx) => (
                      <span
                        key={idx}
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '6px',
                          padding: '4px 10px',
                          borderRadius: '6px',
                          backgroundColor: 'rgba(255, 255, 255, 0.05)',
                          color: '#E5E7EB',
                          fontSize: '11px',
                          fontWeight: 500,
                        }}
                      >
                        <FileText size={12} style={{ color: '#dfae32' }} />
                        {del}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Interactive Action Bar */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'flex-end',
                    gap: '10px',
                    marginTop: '16px',
                    paddingTop: '12px',
                    borderTop: '1px solid rgba(255, 255, 255, 0.04)',
                  }}
                >
                  {m.status === 'ready_for_review' && (
                    <>
                      <button
                        type="button"
                        onClick={() => alert(`Reviewing deliverables for ${m.title}`)}
                        style={{
                          padding: '8px 14px',
                          borderRadius: '8px',
                          backgroundColor: 'rgba(255, 255, 255, 0.08)',
                          color: '#FFFFFF',
                          border: 'none',
                          fontSize: '12px',
                          fontWeight: 600,
                          cursor: 'pointer',
                        }}
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
                        className="tc-btn tc-btn-primary"
                        style={{
                          padding: '8px 16px',
                          borderRadius: '8px',
                          fontSize: '12px',
                          fontWeight: 700,
                        }}
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
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                        padding: '8px 16px',
                        borderRadius: '8px',
                        backgroundColor: '#dfae32',
                        color: '#000000',
                        fontSize: '12px',
                        fontWeight: 700,
                        textDecoration: 'none',
                      }}
                    >
                      <CreditCard size={14} />
                      Fund Escrow
                    </a>
                  )}

                  {m.status === 'paid' && (
                    <span
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '4px',
                        fontSize: '12px',
                        color: '#10B981',
                        fontWeight: 600,
                      }}
                    >
                      <CheckCircle2 size={14} />
                      Milestone Satisfied & Certified
                    </span>
                  )}
                </div>
              </div>
            );
          }))}
        </div>
      </div>

      {/* 4. MODAL: REQUEST NEW PROJECT / SCOPE EXTENSION */}
      {showRequestModal && (
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
              maxWidth: '520px',
              width: '100%',
              boxShadow: '0 20px 40px rgba(0, 0, 0, 0.6)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <FolderGit2 size={20} style={{ color: '#dfae32' }} />
                <h3 style={{ fontSize: '18px', fontWeight: 700, margin: 0, color: '#FFFFFF' }}>
                  Commission New Project Scope
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowRequestModal(false)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#9CA3AF',
                  cursor: 'pointer',
                }}
              >
                <X size={20} />
              </button>
            </div>

            {requestSubmitted ? (
              <div
                style={{
                  padding: '24px',
                  backgroundColor: 'rgba(16, 185, 129, 0.15)',
                  border: '1px solid rgba(16, 185, 129, 0.3)',
                  borderRadius: '12px',
                  textAlign: 'center',
                  color: '#10B981',
                }}
              >
                <div style={{ fontSize: '20px', fontWeight: 700, marginBottom: '4px' }}>
                  Scope Request Received!
                </div>
                <div style={{ fontSize: '13px' }}>
                  Our HR Concierge and Project Architect will contact you on WhatsApp within 15 minutes.
                </div>
              </div>
            ) : (
              <form onSubmit={handleRequestSubmit}>
                <div style={{ marginBottom: '16px' }}>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#9CA3AF', marginBottom: '6px' }}>
                    Project or Module Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={newProjectTitle}
                    onChange={(e) => setNewProjectTitle(e.target.value)}
                    placeholder="e.g. AI-Powered Fleet Telemetry Module"
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
                    Estimated Budget Allocation
                  </label>
                  <select
                    value={newProjectBudget}
                    onChange={(e) => setNewProjectBudget(e.target.value)}
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
                  >
                    <option value="₦3M - ₦5M">₦3,000,000 - ₦5,000,000 ($2k - $3.5k)</option>
                    <option value="₦5M - ₦10M">₦5,000,000 - ₦10,000,000 ($3.5k - $7k)</option>
                    <option value="₦10M - ₦25M">₦10,000,000 - ₦25,000,000 ($7k - $16k)</option>
                    <option value="₦25M+">₦25,000,000+ Enterprise Tier</option>
                  </select>
                </div>

                <div style={{ marginBottom: '24px' }}>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#9CA3AF', marginBottom: '6px' }}>
                    Scope Details & Business Objectives
                  </label>
                  <textarea
                    rows={4}
                    value={newProjectDescription}
                    onChange={(e) => setNewProjectDescription(e.target.value)}
                    placeholder="Describe the technical requirements, key features, and desired target completion date..."
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
                    onClick={() => setShowRequestModal(false)}
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
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                    }}
                  >
                    <Send size={15} />
                    Submit Request
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
