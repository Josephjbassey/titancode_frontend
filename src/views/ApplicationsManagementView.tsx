import React, { useState } from 'react';
import {
  CheckCircle2,
  ExternalLink,
  Code2,
  Globe,
  X,
  Search,
} from 'lucide-react';
import type { ScreenId } from '../App';

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

const INITIAL_APPLICATIONS: Application[] = [
  {
    id: 'APP-501',
    applicantName: 'David K. Mensah',
    email: 'david.mensah@techlead.dev',
    phone: '+233 24 123 4567',
    department: 'Fullstack Engineering',
    status: 'Pending',
    appliedDate: '2026-09-18',
    githubUrl: 'https://github.com/davidmensah-dev',
    portfolioUrl: 'https://davidmensah.design',
    experienceYears: 4,
    coverNote: 'Experienced in React, TypeScript, FastAPI and building high-concurrency microservices. Excited about contributing to TitanCode scalable platforms.',
  },
  {
    id: 'APP-502',
    applicantName: 'Sarah Al-Mansoor',
    email: 'sarah.ux@flowstudio.io',
    phone: '+971 50 987 6543',
    department: 'UI/UX Design',
    status: 'Pending',
    appliedDate: '2026-09-19',
    githubUrl: '',
    portfolioUrl: 'https://sarahdesign.framer.website',
    experienceYears: 5,
    coverNote: 'Senior Product Designer specializing in dark-mode FinTech design systems, mobile design tokens, and user conversion psychology.',
  },
  {
    id: 'APP-503',
    applicantName: 'Emmanuel Adeyemi',
    email: 'emmanuel.code@swiftmail.ng',
    phone: '+234 803 765 4321',
    department: 'Mobile Development',
    status: 'Approved',
    appliedDate: '2026-09-10',
    githubUrl: 'https://github.com/e-adeyemi',
    portfolioUrl: 'https://emmanuelmobile.dev',
    experienceYears: 3,
    coverNote: 'Flutter and React Native developer with 6 apps published on the App Store and Google Play.',
    reviewNotes: 'Strong Flutter portfolio and solid live demo apps. Approved for mobile sprint team.',
  },
  {
    id: 'APP-504',
    applicantName: 'Carlos Rodriguez',
    email: 'carlos@botnet-security.es',
    phone: '+34 612 345 678',
    department: 'Digital Products',
    status: 'Rejected',
    appliedDate: '2026-09-05',
    githubUrl: 'https://github.com/carlos-r-dev',
    portfolioUrl: '',
    experienceYears: 1,
    coverNote: 'Junior developer looking for my first internship in software engineering.',
    reviewNotes: 'Looking for senior/lead level engineer for our algorithmic trading systems at this time.',
  },
];

interface ApplicationsManagementViewProps {
  onNavigate?: (view: ScreenId) => void;
}

export const ApplicationsManagementView: React.FC<ApplicationsManagementViewProps> = () => {
  const [applications, setApplications] = useState<Application[]>(INITIAL_APPLICATIONS);
  const [tab, setTab] = useState<'Pending' | 'Approved' | 'Rejected' | 'All'>('Pending');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedApp, setSelectedApp] = useState<Application | null>(null);
  const [reviewNoteInput, setReviewNoteInput] = useState('');

  const filteredApps = applications.filter((app) => {
    const matchesTab = tab === 'All' || app.status === tab;
    const matchesSearch =
      app.applicantName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.email.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesSearch;
  });

  const handleApprove = (appId: string) => {
    setApplications((prev) =>
      prev.map((a) => (a.id === appId ? { ...a, status: 'Approved', reviewNotes: reviewNoteInput || 'Approved by reviewer.' } : a))
    );
    setSelectedApp(null);
    setReviewNoteInput('');
  };

  const handleReject = (appId: string) => {
    setApplications((prev) =>
      prev.map((a) => (a.id === appId ? { ...a, status: 'Rejected', reviewNotes: reviewNoteInput || 'Application declined.' } : a))
    );
    setSelectedApp(null);
    setReviewNoteInput('');
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
            Member Applications
          </h1>
          <p style={{ color: '#9CA3AF', fontSize: '14px', margin: '4px 0 0' }}>
            Review candidate qualifications, inspect code repositories, and approve incoming engineers.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
          <div style={{ position: 'relative', width: '240px' }}>
            <Search
              size={15}
              color="#9CA3AF"
              style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)' }}
            />
            <input
              type="text"
              placeholder="Search applicants..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                backgroundColor: '#11151F',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: '8px',
                padding: '7px 12px 7px 32px',
                color: '#FFFFFF',
                fontSize: '12px',
                outline: 'none',
              }}
            />
          </div>

          <div style={{ display: 'flex', gap: '6px' }}>
            {(['Pending', 'Approved', 'Rejected', 'All'] as const).map((t) => {
              const count = applications.filter((a) => (t === 'All' ? true : a.status === t)).length;
              return (
                <button
                  key={t}
                  type="button"
                  onClick={() => setTab(t)}
                  style={{
                    padding: '8px 14px',
                    borderRadius: '8px',
                    border: '1px solid',
                    borderColor: tab === t ? '#dfae32' : 'rgba(255, 255, 255, 0.08)',
                    backgroundColor: tab === t ? 'rgba(223, 174, 50, 0.15)' : '#11151F',
                    color: tab === t ? '#dfae32' : '#9CA3AF',
                    fontSize: '12px',
                    fontWeight: 600,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                  }}
                >
                  <span>{t}</span>
                  <span
                    style={{
                      backgroundColor: 'rgba(255, 255, 255, 0.1)',
                      padding: '2px 6px',
                      borderRadius: '999px',
                      fontSize: '10px',
                    }}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>


      {/* Applications Table */}
      <div
        style={{
          backgroundColor: '#11151F',
          borderRadius: '12px',
          border: '1px solid rgba(255, 255, 255, 0.06)',
          overflow: 'hidden',
        }}
      >
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
          <thead>
            <tr style={{ backgroundColor: '#0E121B', color: '#9CA3AF', borderBottom: '1px solid rgba(255, 255, 255, 0.08)' }}>
              <th style={{ padding: '14px 18px' }}>Applicant</th>
              <th style={{ padding: '14px 18px' }}>Department</th>
              <th style={{ padding: '14px 18px' }}>Experience</th>
              <th style={{ padding: '14px 18px' }}>Applied Date</th>
              <th style={{ padding: '14px 18px' }}>Status</th>
              <th style={{ padding: '14px 18px', textAlign: 'right' }}>Review Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredApps.map((app) => (
              <tr
                key={app.id}
                onClick={() => setSelectedApp(app)}
                style={{
                  borderBottom: '1px solid rgba(255, 255, 255, 0.04)',
                  cursor: 'pointer',
                  transition: 'background-color 0.15s',
                }}
                onMouseOver={(e) => (e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.03)')}
                onMouseOut={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
              >
                <td style={{ padding: '14px 18px' }}>
                  <div style={{ fontWeight: 700, color: '#FFFFFF' }}>{app.applicantName}</div>
                  <div style={{ color: '#9CA3AF', fontSize: '12px' }}>{app.email}</div>
                </td>
                <td style={{ padding: '14px 18px', color: '#dfae32', fontWeight: 600 }}>{app.department}</td>
                <td style={{ padding: '14px 18px', color: '#9CA3AF' }}>{app.experienceYears} Years</td>
                <td style={{ padding: '14px 18px', color: '#9CA3AF' }}>{app.appliedDate}</td>
                <td style={{ padding: '14px 18px' }}>
                  <span
                    style={{
                      padding: '4px 10px',
                      borderRadius: '999px',
                      fontSize: '11px',
                      fontWeight: 700,
                      backgroundColor:
                        app.status === 'Approved'
                          ? 'rgba(16, 185, 129, 0.15)'
                          : app.status === 'Rejected'
                          ? 'rgba(239, 68, 68, 0.15)'
                          : 'rgba(223, 174, 50, 0.15)',
                      color:
                        app.status === 'Approved'
                          ? '#10B981'
                          : app.status === 'Rejected'
                          ? '#EF4444'
                          : '#dfae32',
                    }}
                  >
                    ● {app.status}
                  </span>
                </td>
                <td style={{ padding: '14px 18px', textAlign: 'right' }}>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedApp(app);
                    }}
                    style={{
                      backgroundColor: '#dfae32',
                      color: '#0A0D14',
                      fontWeight: 700,
                      border: 'none',
                      borderRadius: '6px',
                      padding: '6px 14px',
                      fontSize: '12px',
                      cursor: 'pointer',
                    }}
                  >
                    Review
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* DETAIL MODAL */}
      {selectedApp && (
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
          onClick={() => setSelectedApp(null)}
        >
          <div
            style={{
              backgroundColor: '#11151F',
              border: '1px solid rgba(223, 174, 50, 0.3)',
              borderRadius: '16px',
              maxWidth: '600px',
              width: '100%',
              padding: '32px',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
              <div>
                <span style={{ color: '#dfae32', fontSize: '12px', fontWeight: 700 }}>
                  {selectedApp.id} ● {selectedApp.department}
                </span>
                <h3 style={{ fontSize: '22px', fontWeight: 800, margin: '4px 0 0', color: '#FFFFFF' }}>
                  {selectedApp.applicantName}
                </h3>
                <div style={{ color: '#9CA3AF', fontSize: '13px', marginTop: '2px' }}>
                  Applied on {selectedApp.appliedDate}
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelectedApp(null)}
                style={{ background: 'none', border: 'none', color: '#9CA3AF', cursor: 'pointer' }}
              >
                <X size={20} />
              </button>
            </div>

            {/* Candidate details */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '18px' }}>
              <div style={{ backgroundColor: '#161617', padding: '12px', borderRadius: '8px', fontSize: '13px' }}>
                <div style={{ color: '#9CA3AF', fontSize: '11px' }}>Email Address</div>
                <div style={{ fontWeight: 600, color: '#FFFFFF', marginTop: '2px' }}>{selectedApp.email}</div>
              </div>
              <div style={{ backgroundColor: '#161617', padding: '12px', borderRadius: '8px', fontSize: '13px' }}>
                <div style={{ color: '#9CA3AF', fontSize: '11px' }}>Phone Number</div>
                <div style={{ fontWeight: 600, color: '#FFFFFF', marginTop: '2px' }}>{selectedApp.phone}</div>
              </div>
            </div>

            {/* Links */}
            <div style={{ display: 'flex', gap: '14px', marginBottom: '18px' }}>
              {selectedApp.githubUrl && (
                <a
                  href={selectedApp.githubUrl}
                  target="_blank"
                  rel="noreferrer"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    backgroundColor: '#161617',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    color: '#dfae32',
                    padding: '8px 14px',
                    borderRadius: '6px',
                    fontSize: '12px',
                    textDecoration: 'none',
                    fontWeight: 600,
                  }}
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
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    backgroundColor: '#161617',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    color: '#dfae32',
                    padding: '8px 14px',
                    borderRadius: '6px',
                    fontSize: '12px',
                    textDecoration: 'none',
                    fontWeight: 600,
                  }}
                >
                  <Globe size={14} />
                  <span>Live Portfolio</span>
                  <ExternalLink size={12} />
                </a>
              )}
            </div>

            {/* Statement */}
            <div style={{ marginBottom: '20px' }}>
              <div style={{ fontSize: '12px', color: '#9CA3AF', marginBottom: '6px' }}>Applicant Statement:</div>
              <p style={{ backgroundColor: '#161617', padding: '14px', borderRadius: '8px', color: '#D1D5DB', fontSize: '13px', lineHeight: 1.6 }}>
                {selectedApp.coverNote}
              </p>
            </div>

            {/* Review Notes Input */}
            {selectedApp.status === 'Pending' && (
              <div style={{ marginBottom: '24px' }}>
                <label style={{ display: 'block', fontSize: '12px', color: '#9CA3AF', marginBottom: '6px' }}>
                  Review Evaluation Note
                </label>
                <input
                  type="text"
                  placeholder="e.g. Cleared technical interview with Joseph; recommended for frontend."
                  value={reviewNoteInput}
                  onChange={(e) => setReviewNoteInput(e.target.value)}
                  style={{
                    width: '100%',
                    backgroundColor: '#161617',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '8px',
                    padding: '10px 14px',
                    color: '#FFFFFF',
                    fontSize: '13px',
                    outline: 'none',
                  }}
                />
              </div>
            )}

            {/* Actions */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              {selectedApp.status === 'Pending' ? (
                <>
                  <button
                    type="button"
                    onClick={() => handleReject(selectedApp.id)}
                    style={{
                      backgroundColor: 'rgba(239, 68, 68, 0.15)',
                      color: '#EF4444',
                      border: '1px solid rgba(239, 68, 68, 0.3)',
                      borderRadius: '8px',
                      padding: '10px 20px',
                      fontSize: '13px',
                      fontWeight: 700,
                      cursor: 'pointer',
                    }}
                  >
                    Reject Application
                  </button>

                  <button
                    type="button"
                    onClick={() => handleApprove(selectedApp.id)}
                    style={{
                      backgroundColor: '#10B981',
                      color: '#FFFFFF',
                      border: 'none',
                      borderRadius: '8px',
                      padding: '10px 24px',
                      fontSize: '13px',
                      fontWeight: 700,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                    }}
                  >
                    <CheckCircle2 size={16} />
                    <span>Approve & Onboard</span>
                  </button>
                </>
              ) : (
                <div style={{ width: '100%', display: 'flex', justifyContent: 'flex-end' }}>
                  <button
                    type="button"
                    onClick={() => setSelectedApp(null)}
                    style={{
                      backgroundColor: '#dfae32',
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
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
