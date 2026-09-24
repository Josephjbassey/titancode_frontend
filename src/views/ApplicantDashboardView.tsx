import React, { useState } from 'react';
import {
  CheckCircle2,
  Clock,
  XCircle,
  Sparkles,
  Send,
  ShieldCheck,
} from 'lucide-react';
import { api } from '../services/api';
import type { KycStatus } from '../types';
import type { ScreenId } from '../App';

type ApplicantState = 'under_review' | 'approved' | 'rejected' | 'reapply';

interface ApplicantDashboardViewProps {
  onNavigate?: (view: ScreenId) => void;
  initialState?: ApplicantState;
}

export const ApplicantDashboardView: React.FC<ApplicantDashboardViewProps> = ({
  onNavigate: _onNavigate,
  initialState = 'under_review',
}) => {
  const [activeState, setActiveState] = useState<ApplicantState>(initialState);
  const [kycStatus, setKycStatus] = useState<KycStatus>('not_verified');
  const [kycLoading, setKycLoading] = useState(false);

  // Reapply form state
  const [reapplyGithub, setReapplyGithub] = useState('https://github.com/applicant-dev');
  const [reapplySkills, setReapplySkills] = useState('Next.js 15, React 19, WebSockets, PostgreSQL');
  const [reapplyNotes, setReapplyNotes] = useState('');
  const [reapplySubmitted, setReapplySubmitted] = useState(false);

  const handleStartKyc = async () => {
    setKycLoading(true);
    try {
      const res = await api.initiateSumsubKyc(999);
      alert(`Sumsub KYC WebSDK session initialized!\nApplicant ID: ${res.applicant_id}\nLevel: Identity & Proof of Address.`);
      setKycStatus('pending');
    } catch {
      alert('KYC simulation triggered.');
      setKycStatus('verified');
    } finally {
      setKycLoading(false);
    }
  };

  const handleReapplySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setReapplySubmitted(true);
    setTimeout(() => {
      setReapplySubmitted(false);
      setActiveState('under_review');
    }, 1500);
  };

  return (
    <div style={{ color: '#FFFFFF', width: '100%' }}>
      {/* State Switcher Previewer Banner */}
      <div
        style={{
          backgroundColor: '#FFFFFF1A',
          border: '1px solid #FFFFFF26',
          borderRadius: '12px',
          padding: '12px 20px',
          marginBottom: '24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '12px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Sparkles size={16} style={{ color: '#dfae32' }} />
          <span style={{ fontSize: '12px', fontWeight: 700, color: '#dfae32' }}>
            Figma Frames 17–20 Applicant State Switcher:
          </span>
        </div>

        <div style={{ display: 'flex', gap: '8px' }}>
          {[
            { id: 'under_review', label: 'Frame 17: Under Review' },
            { id: 'approved', label: 'Frame 18: Approved / KYC' },
            { id: 'rejected', label: 'Frame 19: Rejected / Cooldown' },
            { id: 'reapply', label: 'Frame 20: Reapply Form' },
          ].map((st) => (
            <button
              key={st.id}
              type="button"
              onClick={() => setActiveState(st.id as ApplicantState)}
              style={{
                padding: '6px 12px',
                borderRadius: '6px',
                border: 'none',
                backgroundColor: activeState === st.id ? '#dfae32' : 'rgba(255, 255, 255, 0.08)',
                color: activeState === st.id ? '#000000' : '#D1D5DB',
                fontSize: '11px',
                fontWeight: activeState === st.id ? 700 : 500,
                cursor: 'pointer',
                transition: 'all 0.15s ease',
              }}
            >
              {st.label}
            </button>
          ))}
        </div>
      </div>

      {/* STATE 1: FRAME 17 - UNDER REVIEW */}
      {activeState === 'under_review' && (
        <div
          style={{
            backgroundColor: '#FFFFFF1A',
            border: '1px solid #FFFFFF26',
            borderRadius: '16px',
            padding: '32px',
          }}
        >
          <div style={{ textAlign: 'center', marginBottom: '32px' }}>
            <div
              style={{
                width: '64px',
                height: '64px',
                borderRadius: '50%',
                backgroundColor: 'rgba(223, 174, 50, 0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 16px',
                color: '#dfae32',
              }}
            >
              <Clock size={32} />
            </div>
            <h1 style={{ fontSize: '26px', fontWeight: 800, margin: 0, color: '#FFFFFF' }}>
              Your Application is Under Review
            </h1>
            <p style={{ color: '#9CA3AF', fontSize: '14px', maxWidth: '520px', margin: '8px auto 0' }}>
              Thank you for applying to TitanCode Technologies. Our HR Concierge and Technical Department Leads are reviewing your profile.
            </p>
          </div>

          {/* Stepper Pipeline */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(4, 1fr)',
              gap: '12px',
              marginBottom: '32px',
            }}
          >
            {[
              { step: 1, title: 'Submitted', status: 'done', desc: 'Sep 20, 2026' },
              { step: 2, title: 'HR Screening', status: 'current', desc: 'In Progress' },
              { step: 3, title: 'Tech Assessment', status: 'upcoming', desc: '48h Review' },
              { step: 4, title: 'Offer & KYC', status: 'upcoming', desc: 'Final Step' },
            ].map((s) => {
              const isDone = s.status === 'done';
              const isCurrent = s.status === 'current';
              return (
                <div
                  key={s.step}
                  style={{
                    backgroundColor: isCurrent
                      ? 'rgba(223, 174, 50, 0.1)'
                      : isDone
                      ? 'rgba(16, 185, 129, 0.1)'
                      : 'rgba(255, 255, 255, 0.02)',
                    border: `1px solid ${
                      isCurrent
                        ? '#dfae32'
                        : isDone
                        ? 'rgba(16, 185, 129, 0.3)'
                        : 'rgba(255, 255, 255, 0.06)'
                    }`,
                    borderRadius: '12px',
                    padding: '16px',
                    textAlign: 'center',
                  }}
                >
                  <div
                    style={{
                      fontSize: '12px',
                      fontWeight: 800,
                      color: isCurrent ? '#dfae32' : isDone ? '#10B981' : '#6B7280',
                      marginBottom: '4px',
                    }}
                  >
                    STEP {s.step}
                  </div>
                  <div style={{ fontSize: '14px', fontWeight: 700, color: '#FFFFFF' }}>
                    {s.title}
                  </div>
                  <div style={{ fontSize: '11px', color: '#9CA3AF', marginTop: '2px' }}>
                    {s.desc}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Submitted Information Card */}
          <div
            style={{
              backgroundColor: 'rgba(255, 255, 255, 0.02)',
              border: '1px solid rgba(255, 255, 255, 0.06)',
              borderRadius: '12px',
              padding: '20px',
            }}
          >
            <h3 style={{ fontSize: '15px', fontWeight: 700, margin: '0 0 14px', color: '#FFFFFF' }}>
              Application Snapshot
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', fontSize: '13px' }}>
              <div>
                <span style={{ color: '#9CA3AF' }}>Applicant Name:</span>{' '}
                <strong style={{ color: '#FFFFFF' }}>Korede Babalola</strong>
              </div>
              <div>
                <span style={{ color: '#9CA3AF' }}>Department:</span>{' '}
                <strong style={{ color: '#dfae32' }}>Frontend Engineering</strong>
              </div>
              <div>
                <span style={{ color: '#9CA3AF' }}>Experience:</span>{' '}
                <strong style={{ color: '#FFFFFF' }}>6 Years Senior</strong>
              </div>
              <div>
                <span style={{ color: '#9CA3AF' }}>GitHub:</span>{' '}
                <a
                  href="https://github.com/korede-dev"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: '#3B82F6', textDecoration: 'none' }}
                >
                  github.com/korede-dev ↗
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* STATE 2: FRAME 18 - APPROVED & KYC */}
      {activeState === 'approved' && (
        <div
          style={{
            backgroundColor: '#FFFFFF1A',
            border: '1px solid #FFFFFF26',
            borderRadius: '16px',
            padding: '32px',
          }}
        >
          <div style={{ textAlign: 'center', marginBottom: '32px' }}>
            <div
              style={{
                width: '64px',
                height: '64px',
                borderRadius: '50%',
                backgroundColor: 'rgba(16, 185, 129, 0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 16px',
                color: '#10B981',
              }}
            >
              <CheckCircle2 size={32} />
            </div>
            <h1 style={{ fontSize: '26px', fontWeight: 800, margin: 0, color: '#FFFFFF' }}>
              Congratulations, You've Been Accepted!
            </h1>
            <p style={{ color: '#9CA3AF', fontSize: '14px', maxWidth: '520px', margin: '8px auto 0' }}>
              Your technical assessment for <strong style={{ color: '#dfae32' }}>Frontend Engineering</strong> scored in the 98th percentile. Complete KYC to activate your 70% developer pool payouts.
            </p>
          </div>

          {/* Sumsub KYC Integration Card */}
          <div
            style={{
              backgroundColor: 'rgba(223, 174, 50, 0.08)',
              border: '1px solid rgba(223, 174, 50, 0.3)',
              borderRadius: '14px',
              padding: '24px',
              marginBottom: '24px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '16px',
            }}
          >
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <ShieldCheck size={20} style={{ color: '#dfae32' }} />
                <h3 style={{ fontSize: '16px', fontWeight: 700, margin: 0, color: '#FFFFFF' }}>
                  Sumsub Employee KYC Verification
                </h3>
              </div>
              <p style={{ fontSize: '13px', color: '#9CA3AF', margin: '4px 0 0' }}>
                Government-issued ID and Proof of Address required for escrow treasury compliance.
              </p>
            </div>

            <button
              type="button"
              disabled={kycLoading || kycStatus === 'verified'}
              onClick={handleStartKyc}
              className="tc-btn tc-btn-primary"
              style={{
                padding: '12px 24px',
                borderRadius: '10px',
                fontSize: '14px',
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              <ShieldCheck size={16} />
              {kycLoading
                ? 'Initializing WebSDK...'
                : kycStatus === 'verified'
                ? 'Identity Verified ✓'
                : kycStatus === 'pending'
                ? 'Verification In Review...'
                : 'Start Sumsub Verification'}
            </button>
          </div>

          {/* Onboarding Steps */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.02)',
                border: '1px solid rgba(255, 255, 255, 0.06)',
                borderRadius: '12px',
                padding: '16px',
              }}
            >
              <h4 style={{ fontSize: '14px', fontWeight: 700, margin: '0 0 6px', color: '#FFFFFF' }}>
                1. Join Slack Engineering Workspace
              </h4>
              <p style={{ fontSize: '12px', color: '#9CA3AF', margin: 0 }}>
                Collaborate with 78 staff members across Frontend, Backend, UI/UX, and AI labs.
              </p>
              <a
                href="https://slack.com"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px',
                  fontSize: '12px',
                  color: '#dfae32',
                  fontWeight: 600,
                  marginTop: '10px',
                  textDecoration: 'none',
                }}
              >
                Accept Slack Invite →
              </a>
            </div>

            <div
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.02)',
                border: '1px solid rgba(255, 255, 255, 0.06)',
                borderRadius: '12px',
                padding: '16px',
              }}
            >
              <h4 style={{ fontSize: '14px', fontWeight: 700, margin: '0 0 6px', color: '#FFFFFF' }}>
                2. Developer Welcome Kit & Guidelines
              </h4>
              <p style={{ fontSize: '12px', color: '#9CA3AF', margin: 0 }}>
                Review our git branch conventions, PR review standards, and 70/30 escrow model.
              </p>
              <button
                type="button"
                onClick={() => alert('Downloading TitanCode Developer Welcome Pack PDF...')}
                style={{
                  background: 'none',
                  border: 'none',
                  padding: 0,
                  fontSize: '12px',
                  color: '#dfae32',
                  fontWeight: 600,
                  marginTop: '10px',
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px',
                }}
              >
                Download Handbook (PDF) →
              </button>
            </div>
          </div>
        </div>
      )}

      {/* STATE 3: FRAME 19 - REJECTED / 30-DAY COOLDOWN */}
      {activeState === 'rejected' && (
        <div
          style={{
            backgroundColor: '#FFFFFF1A',
            border: '1px solid #FFFFFF26',
            borderRadius: '16px',
            padding: '32px',
          }}
        >
          <div style={{ textAlign: 'center', marginBottom: '28px' }}>
            <div
              style={{
                width: '64px',
                height: '64px',
                borderRadius: '50%',
                backgroundColor: 'rgba(239, 68, 68, 0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 16px',
                color: '#EF4444',
              }}
            >
              <XCircle size={32} />
            </div>
            <h1 style={{ fontSize: '26px', fontWeight: 800, margin: 0, color: '#FFFFFF' }}>
              Application Status: Not Selected for this Cohort
            </h1>
            <p style={{ color: '#9CA3AF', fontSize: '14px', maxWidth: '560px', margin: '8px auto 0' }}>
              Thank you for your interest in TitanCode. Our current engineering roster for this quarter is fully allocated. We encourage you to strengthen your public repositories and reapply.
            </p>
          </div>

          {/* 30-Day Cooldown Countdown Card */}
          <div
            style={{
              backgroundColor: 'rgba(255, 255, 255, 0.02)',
              border: '1px solid rgba(255, 255, 255, 0.06)',
              borderRadius: '14px',
              padding: '24px',
              textAlign: 'center',
              marginBottom: '28px',
            }}
          >
            <div style={{ fontSize: '12px', fontWeight: 700, color: '#dfae32', textTransform: 'uppercase' }}>
              Reapplication Window Unlocks In
            </div>
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                gap: '16px',
                marginTop: '12px',
              }}
            >
              {[
                { val: '24', label: 'DAYS' },
                { val: '14', label: 'HOURS' },
                { val: '38', label: 'MINUTES' },
                { val: '52', label: 'SECONDS' },
              ].map((cd, i) => (
                <div
                  key={i}
                  style={{
                    backgroundColor: '#121214',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '10px',
                    padding: '12px 18px',
                    minWidth: '70px',
                  }}
                >
                  <div style={{ fontSize: '24px', fontWeight: 800, color: '#FFFFFF' }}>{cd.val}</div>
                  <div style={{ fontSize: '10px', color: '#9CA3AF', fontWeight: 600 }}>{cd.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Feedback & Improvement Plan */}
          <div
            style={{
              backgroundColor: 'rgba(255, 255, 255, 0.02)',
              border: '1px solid rgba(255, 255, 255, 0.06)',
              borderRadius: '12px',
              padding: '20px',
            }}
          >
            <h3 style={{ fontSize: '15px', fontWeight: 700, margin: '0 0 10px', color: '#FFFFFF' }}>
              Technical Evaluator Feedback
            </h3>
            <p style={{ fontSize: '13px', color: '#9CA3AF', lineHeight: '1.6', margin: 0 }}>
              "Candidate demonstrated solid foundation in React and TypeScript. For future cohorts, we highly recommend showcasing production E2E tests (Playwright), state machine implementations, and distributed backend caching patterns."
            </p>
          </div>
        </div>
      )}

      {/* STATE 4: FRAME 20 - REAPPLICATION FORM */}
      {activeState === 'reapply' && (
        <div
          style={{
            backgroundColor: '#FFFFFF1A',
            border: '1px solid #FFFFFF26',
            borderRadius: '16px',
            padding: '32px',
          }}
        >
          <div style={{ marginBottom: '24px' }}>
            <h1 style={{ fontSize: '24px', fontWeight: 800, margin: 0, color: '#FFFFFF' }}>
              Reapply for TitanCode Engineering Cohort
            </h1>
            <p style={{ color: '#9CA3AF', fontSize: '14px', margin: '4px 0 0' }}>
              Update your skills, projects, and latest CV to re-enter our priority evaluation queue.
            </p>
          </div>

          {reapplySubmitted ? (
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
                Reapplication Received!
              </div>
              <div style={{ fontSize: '13px' }}>
                Your updated portfolio has been prioritized for next week's ATS screening batch.
              </div>
            </div>
          ) : (
            <form onSubmit={handleReapplySubmit}>
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#9CA3AF', marginBottom: '6px' }}>
                  Target Department *
                </label>
                <select
                  defaultValue="Frontend Engineering"
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
                  <option value="Frontend Engineering">Frontend Engineering</option>
                  <option value="Backend & Cloud Infrastructure">Backend & Cloud Infrastructure</option>
                  <option value="Mobile Development">Mobile Development (iOS & Android)</option>
                  <option value="UI/UX & Product Design">UI/UX & Product Design</option>
                  <option value="QA & Automated Testing">QA & Automated Testing</option>
                  <option value="DevOps, SecOps & Cybersecurity">DevOps, SecOps & Cybersecurity</option>
                  <option value="Research & Development (R&D / AI)">Research & Development (R&D / AI)</option>
                </select>
              </div>

              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#9CA3AF', marginBottom: '6px' }}>
                  Updated GitHub / Portfolio URL *
                </label>
                <input
                  type="url"
                  required
                  value={reapplyGithub}
                  onChange={(e) => setReapplyGithub(e.target.value)}
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
                  New Skills & Technologies Acquired *
                </label>
                <input
                  type="text"
                  required
                  value={reapplySkills}
                  onChange={(e) => setReapplySkills(e.target.value)}
                  placeholder="e.g. Docker, Playwright, WebSockets, Next.js 15"
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

              <div style={{ marginBottom: '24px' }}>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#9CA3AF', marginBottom: '6px' }}>
                  What high-impact projects have you shipped recently?
                </label>
                <textarea
                  rows={3}
                  value={reapplyNotes}
                  onChange={(e) => setReapplyNotes(e.target.value)}
                  placeholder="Briefly describe what you built and the metrics achieved..."
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

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
                <button
                  type="submit"
                  className="tc-btn tc-btn-primary"
                  style={{
                    padding: '12px 24px',
                    borderRadius: '8px',
                    fontSize: '14px',
                    fontWeight: 700,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                  }}
                >
                  <Send size={15} />
                  Submit Reapplication
                </button>
              </div>
            </form>
          )}
        </div>
      )}
    </div>
  );
};
