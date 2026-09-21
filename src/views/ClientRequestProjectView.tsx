import React, { useState } from 'react';
import {
  UploadCloud,
  CheckCircle2,
} from 'lucide-react';
import type { ScreenId } from '../App';

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

  const [myProjects, setMyProjects] = useState<ClientProjectRequest[]>([
    {
      id: 'REQ-401',
      projectName: 'Aurelia FinTech Cross-border Mobile App',
      budgetTier: '$24,500',
      deadlinePreference: '2026-10-15',
      status: 'Active Development',
      submittedDate: '2026-08-01',
      description: 'End-to-end multi-currency wallet with automated escrow conversion.',
    },
    {
      id: 'REQ-402',
      projectName: 'Institutional Wealth Management Dashboard',
      budgetTier: '$35,000 - $50,000',
      deadlinePreference: '2026-12-01',
      status: 'In Review',
      submittedDate: '2026-09-17',
      description: 'Portfolio balancing dashboard with live Bloomberg API data feeds.',
    },
  ]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!projectName.trim()) return;

    const newReq: ClientProjectRequest = {
      id: `REQ-${Math.floor(400 + Math.random() * 600)}`,
      projectName,
      budgetTier,
      deadlinePreference: timeline,
      status: 'In Review',
      submittedDate: new Date().toISOString().split('T')[0],
      description: brief,
    };

    setMyProjects([newReq, ...myProjects]);
    setSubmitted(true);
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
            Client Project Portal
          </h1>
          <p style={{ color: '#9CA3AF', fontSize: '14px', margin: '4px 0 0' }}>
            Commission bespoke software solutions, upload technical briefs, and monitor milestones.
          </p>
        </div>

        <div
          style={{
            display: 'flex',
            backgroundColor: '#11151F',
            borderRadius: '8px',
            padding: '3px',
            border: '1px solid rgba(255, 255, 255, 0.08)',
          }}
        >
          <button
            type="button"
            onClick={() => {
              setActiveTab('request_form');
              setSubmitted(false);
            }}
            style={{
              padding: '8px 18px',
              borderRadius: '6px',
              border: 'none',
              backgroundColor: activeTab === 'request_form' ? '#dfae32' : 'transparent',
              color: activeTab === 'request_form' ? '#0A0D14' : '#9CA3AF',
              fontWeight: 700,
              fontSize: '13px',
              cursor: 'pointer',
            }}
          >
            Submit New Request
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('my_projects')}
            style={{
              padding: '8px 18px',
              borderRadius: '6px',
              border: 'none',
              backgroundColor: activeTab === 'my_projects' ? '#dfae32' : 'transparent',
              color: activeTab === 'my_projects' ? '#0A0D14' : '#9CA3AF',
              fontWeight: 700,
              fontSize: '13px',
              cursor: 'pointer',
            }}
          >
            My Commissioned Projects ({myProjects.length})
          </button>
        </div>
      </div>

      {activeTab === 'request_form' ? (
        submitted ? (
          <div
            style={{
              backgroundColor: '#11151F',
              borderRadius: '16px',
              padding: '48px',
              textAlign: 'center',
              maxWidth: '640px',
              margin: '40px auto',
              border: '1px solid rgba(223, 174, 50, 0.3)',
            }}
          >
            <CheckCircle2 size={54} color="#10B981" style={{ margin: '0 auto 16px' }} />
            <h2 style={{ fontSize: '24px', fontWeight: 800, color: '#FFFFFF', marginBottom: '10px' }}>
              Project Request Received
            </h2>
            <p style={{ color: '#9CA3AF', fontSize: '15px', lineHeight: 1.6, marginBottom: '28px' }}>
              Our engineering leadership will review your specifications and prepare an architectural
              milestone breakdown and binding escrow quote within 24 hours.
            </p>
            <button
              type="button"
              onClick={() => setActiveTab('my_projects')}
              style={{
                backgroundColor: '#dfae32',
                color: '#0A0D14',
                fontWeight: 700,
                fontSize: '14px',
                padding: '12px 28px',
                borderRadius: '8px',
                border: 'none',
                cursor: 'pointer',
              }}
            >
              View In My Projects
            </button>
          </div>
        ) : (
          <div
            style={{
              backgroundColor: '#11151F',
              borderRadius: '16px',
              padding: '36px',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              maxWidth: '720px',
              margin: '0 auto',
            }}
          >
            <h2 style={{ fontSize: '20px', fontWeight: 800, marginBottom: '20px', color: '#FFFFFF' }}>
              Project Commissioning Brief
            </h2>

            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: '18px' }}>
                <label style={{ display: 'block', fontSize: '13px', color: '#9CA3AF', marginBottom: '6px' }}>
                  Project / Platform Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Next-Gen Cross-Border Logistics Engine"
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                  style={{
                    width: '100%',
                    backgroundColor: '#161617',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '8px',
                    padding: '12px 14px',
                    color: '#FFFFFF',
                    fontSize: '14px',
                    outline: 'none',
                  }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '18px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', color: '#9CA3AF', marginBottom: '6px' }}>
                    Target Budget Range
                  </label>
                  <select
                    value={budgetTier}
                    onChange={(e) => setBudgetTier(e.target.value)}
                    style={{
                      width: '100%',
                      backgroundColor: '#161617',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      borderRadius: '8px',
                      padding: '12px 14px',
                      color: '#FFFFFF',
                      fontSize: '13px',
                      outline: 'none',
                    }}
                  >
                    <option value="$10,000 - $20,000">$10,000 - $20,000 USD</option>
                    <option value="$20,000 - $40,000">$20,000 - $40,000 USD</option>
                    <option value="$40,000 - $75,000">$40,000 - $75,000 USD</option>
                    <option value="$75,000+">$75,000+ USD (Enterprise)</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '13px', color: '#9CA3AF', marginBottom: '6px' }}>
                    Target Completion Timeline
                  </label>
                  <select
                    value={timeline}
                    onChange={(e) => setTimeline(e.target.value)}
                    style={{
                      width: '100%',
                      backgroundColor: '#161617',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      borderRadius: '8px',
                      padding: '12px 14px',
                      color: '#FFFFFF',
                      fontSize: '13px',
                      outline: 'none',
                    }}
                  >
                    <option value="1 - 2 Months">1 - 2 Months (Rapid MVP)</option>
                    <option value="2 - 3 Months">2 - 3 Months (Standard)</option>
                    <option value="3 - 6 Months">3 - 6 Months (Enterprise)</option>
                  </select>
                </div>
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', fontSize: '13px', color: '#9CA3AF', marginBottom: '6px' }}>
                  Functional Requirements & Target Deliverables
                </label>
                <textarea
                  rows={4}
                  required
                  placeholder="Outline key user workflows, integrations, target platforms, and performance targets..."
                  value={brief}
                  onChange={(e) => setBrief(e.target.value)}
                  style={{
                    width: '100%',
                    backgroundColor: '#161617',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '8px',
                    padding: '12px 14px',
                    color: '#FFFFFF',
                    fontSize: '14px',
                    outline: 'none',
                    resize: 'none',
                  }}
                />
              </div>

              {/* Upload brief mock box */}
              <div
                style={{
                  border: '2px dashed rgba(223, 174, 50, 0.3)',
                  borderRadius: '10px',
                  padding: '24px',
                  textAlign: 'center',
                  marginBottom: '28px',
                  backgroundColor: '#161617',
                }}
              >
                <UploadCloud size={32} color="#dfae32" style={{ margin: '0 auto 8px' }} />
                <div style={{ fontSize: '13px', fontWeight: 600, color: '#FFFFFF' }}>
                  Upload Technical Brief or Architecture Diagrams
                </div>
                <div style={{ fontSize: '12px', color: '#9CA3AF', marginTop: '4px' }}>
                  PDF, DOCX, Figma or ZIP up to 50MB
                </div>
              </div>

              <button
                type="submit"
                style={{
                  width: '100%',
                  backgroundColor: '#dfae32',
                  color: '#0A0D14',
                  fontWeight: 700,
                  fontSize: '15px',
                  padding: '14px',
                  borderRadius: '8px',
                  border: 'none',
                  cursor: 'pointer',
                  boxShadow: '0 4px 14px rgba(223, 174, 50, 0.3)',
                }}
              >
                Submit Project Request to TitanCode
              </button>
            </form>
          </div>
        )
      ) : (
        /* MY PROJECTS LIST */
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {myProjects.map((p) => (
            <div
              key={p.id}
              style={{
                backgroundColor: '#11151F',
                borderRadius: '14px',
                padding: '24px',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '16px',
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                  <span style={{ color: '#dfae32', fontSize: '12px', fontWeight: 700 }}>{p.id}</span>
                  <span
                    style={{
                      padding: '3px 8px',
                      borderRadius: '999px',
                      fontSize: '11px',
                      fontWeight: 700,
                      backgroundColor:
                        p.status === 'Active Development'
                          ? 'rgba(16, 185, 129, 0.15)'
                          : 'rgba(223, 174, 50, 0.15)',
                      color: p.status === 'Active Development' ? '#10B981' : '#dfae32',
                    }}
                  >
                    ● {p.status}
                  </span>
                  <span style={{ color: '#9CA3AF', fontSize: '12px' }}>Submitted {p.submittedDate}</span>
                </div>
                <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#FFFFFF', margin: '0 0 6px' }}>
                  {p.projectName}
                </h3>
                <p style={{ color: '#9CA3AF', fontSize: '13px', margin: 0 }}>{p.description}</p>
              </div>

              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '18px', fontWeight: 800, color: '#dfae32' }}>{p.budgetTier}</div>
                <div style={{ fontSize: '12px', color: '#9CA3AF', marginTop: '4px' }}>
                  Target: {p.deadlinePreference}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
