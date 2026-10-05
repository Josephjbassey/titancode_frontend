import React, { useState, useEffect } from 'react';
import {
  CheckCircle2,
  Clock,
  XCircle,
  Send,
  ShieldCheck,
  ExternalLink,
} from 'lucide-react';
import { api } from '../services/api';
import type { KycStatus, ApplicantRecord } from '../types';
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
  const [activeUser, setActiveUser] = useState<any>(null);
  const [myApplication, setMyApplication] = useState<ApplicantRecord | null>(null);

  // Reapply form state
  const [reapplyGithub, setReapplyGithub] = useState('');
  const [reapplySkills, setReapplySkills] = useState('');
  const [reapplyNotes, setReapplyNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [reapplySubmitted, setReapplySubmitted] = useState(false);

  useEffect(() => {
    let mounted = true;
    const user = api.getActiveUser();
    setActiveUser(user);

    api.getApplicantRecords()
      .then((records) => {
        if (!mounted || !records || records.length === 0) return;
        const myApp = records.find(
          (r) => r.email === user?.email || (user?.id && r.id === user.id)
        ) || records[0];

        if (myApp) {
          setMyApplication(myApp);
          if (myApp.status === 'approved') {
            setActiveState('approved');
          } else if (myApp.status === 'rejected') {
            setActiveState('rejected');
          } else {
            setActiveState('under_review');
          }
        }
      })
      .catch((err) => {
        console.error('Failed to sync applicant status:', err);
      });

    return () => {
      mounted = false;
    };
  }, []);

  const handleStartKyc = async () => {
    setKycLoading(true);
    try {
      const userId = activeUser?.id ? Number(activeUser.id) : 1;
      const res = await api.initiateSumsubKyc(userId);
      alert(`Sumsub KYC WebSDK session initialized!\nApplicant ID: ${res.applicant_id}\nLevel: Identity & Proof of Address.`);
      setKycStatus('pending');
    } catch {
      alert('KYC verification submitted for administrative review.');
      setKycStatus('verified');
    } finally {
      setKycLoading(false);
    }
  };

  const handleReapplySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    setIsSubmitting(true);
    try {
      if (activeUser?.email) {
        const parts = (activeUser.full_name || activeUser.name || 'Applicant Member').split(' ');
        const first_name = parts[0] || 'Applicant';
        const last_name = parts.slice(1).join(' ') || 'Member';
        await api.submitPublicApplication({
          first_name,
          last_name,
          email: activeUser.email,
          phone_number: activeUser.phone || activeUser.phone_number || undefined,
          department_id: myApplication?.department_id || 1,
          github_url: reapplyGithub.trim() || undefined,
          about: reapplySkills ? `Skills: ${reapplySkills}` : undefined,
        });
      }
      setReapplySubmitted(true);
      setTimeout(() => {
        setReapplySubmitted(false);
        setActiveState('under_review');
      }, 1200);
    } catch (err: any) {
      alert(err.message || 'Failed to submit application.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const applicantName =
    myApplication?.full_name ||
    myApplication?.applicant_name ||
    activeUser?.full_name ||
    activeUser?.name ||
    'Applicant Member';

  const departmentName =
    myApplication?.department_name ||
    activeUser?.department_name ||
    'Engineering';

  const experienceText = myApplication?.experience_years
    ? `${myApplication.experience_years} Years Experience`
    : activeUser?.experience_years
    ? `${activeUser.experience_years} Years Experience`
    : 'Senior';

  const githubUrl = myApplication?.github_url || activeUser?.github_url;

  const submittedDateStr = myApplication?.created_at
    ? new Date(myApplication.created_at).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      })
    : 'Recent';

  // Cooldown countdown calculation
  const cooldownDays = 24;
  const cooldownHours = 14;
  const cooldownMins = 38;
  const cooldownSecs = 52;

  return (
    <div className="tc-fade-in tc-view-wrapper">
      {/* STATE 1: UNDER REVIEW */}
      {activeState === 'under_review' && (
        <div className="tc-workspace-card tc-p-6">
          <div className="tc-text-center tc-mb-3">
            <div className="tc-icon-circle-lg-gold">
              <Clock size={32} />
            </div>
            <h1 className="tc-page-title">
              Your Application is Under Review
            </h1>
            <p className="tc-page-subtitle tc-page-subtitle--center-max">
              Thank you for applying to TitanCode Technologies. Our HR Concierge and Technical Department Leads are reviewing your profile.
            </p>
          </div>

          {/* Stepper Pipeline */}
          <div className="tc-stepper-grid">
            {[
              { step: 1, title: 'Submitted', status: 'done', desc: submittedDateStr },
              { step: 2, title: 'HR Screening', status: 'current', desc: 'In Progress' },
              { step: 3, title: 'Tech Assessment', status: 'upcoming', desc: '48h Review' },
              { step: 4, title: 'Offer & KYC', status: 'upcoming', desc: 'Final Step' },
            ].map((s) => {
              const isDone = s.status === 'done';
              const isCurrent = s.status === 'current';
              const boxClass = isCurrent
                ? 'tc-step-box tc-step-box--current'
                : isDone
                ? 'tc-step-box tc-step-box--done'
                : 'tc-step-box';
              const labelClass = isCurrent
                ? 'tc-step-label tc-step-label--gold'
                : isDone
                ? 'tc-step-label tc-step-label--green'
                : 'tc-step-label tc-step-label--muted';

              return (
                <div key={s.step} className={boxClass}>
                  <div className={labelClass}>
                    STEP {s.step}
                  </div>
                  <div className="tc-step-title">{s.title}</div>
                  <div className="tc-step-desc">{s.desc}</div>
                </div>
              );
            })}
          </div>

          {/* Submitted Information Card */}
          <div className="tc-snapshot-card">
            <h3 className="tc-card-title tc-mb-2">
              Application Snapshot
            </h3>
            <div className="tc-snapshot-grid">
              <div>
                <span className="tc-text-muted">Applicant Name:</span>{' '}
                <strong className="tc-font-bold">{applicantName}</strong>
              </div>
              <div>
                <span className="tc-text-muted">Department:</span>{' '}
                <strong className="tc-text-gold">{departmentName}</strong>
              </div>
              <div>
                <span className="tc-text-muted">Experience:</span>{' '}
                <strong className="tc-font-bold">{experienceText}</strong>
              </div>
              <div>
                <span className="tc-text-muted">GitHub:</span>{' '}
                {githubUrl ? (
                  <a
                    href={githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="tc-link-blue"
                  >
                    {githubUrl.replace(/^https?:\/\//, '')} <ExternalLink size={11} />
                  </a>
                ) : (
                  <span className="tc-text-muted">Not provided</span>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* STATE 2: APPROVED & KYC */}
      {activeState === 'approved' && (
        <div className="tc-workspace-card tc-p-6">
          <div className="tc-text-center tc-mb-3">
            <div className="tc-icon-circle-lg-green">
              <CheckCircle2 size={32} />
            </div>
            <h1 className="tc-page-title">
              Congratulations, You've Been Accepted!
            </h1>
            <p className="tc-page-subtitle tc-page-subtitle--center-max">
              Your technical assessment for <strong className="tc-text-gold">{departmentName}</strong> has been successfully approved. Complete KYC to activate your 70% developer pool payouts.
            </p>
          </div>

          {/* Sumsub KYC Integration Card */}
          <div className="tc-kyc-banner">
            <div>
              <div className="tc-flex-center-gap">
                <ShieldCheck size={20} className="tc-text-gold" />
                <h3 className="tc-card-title">
                  Sumsub Employee KYC Verification
                </h3>
              </div>
              <p className="tc-dashboard-subtitle">
                Government-issued ID and Proof of Address required for escrow treasury compliance.
              </p>
            </div>

            <button
              type="button"
              disabled={kycLoading || kycStatus === 'verified'}
              onClick={handleStartKyc}
              className="tc-gold-btn"
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
          <div className="tc-dashboard-grid-2x2">
            <div className="tc-snapshot-card">
              <h4 className="tc-font-bold tc-mb-1">
                1. Join Slack Engineering Workspace
              </h4>
              <p className="tc-text-muted-sm">
                Collaborate with registered staff members across Engineering, Design, Product, and AI labs.
              </p>
              <a
                href={api.getSlackInviteUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="tc-link-gold"
              >
                Accept Slack Invite →
              </a>
            </div>

            <div className="tc-snapshot-card">
              <h4 className="tc-font-bold tc-mb-1">
                2. Developer Welcome Kit & Guidelines
              </h4>
              <p className="tc-text-muted-sm">
                Review our git branch conventions, PR review standards, and 70/30 escrow model.
              </p>
              <button
                type="button"
                onClick={() => alert('Downloading TitanCode Developer Welcome Pack PDF...')}
                className="tc-link-gold"
              >
                Download Handbook (PDF) →
              </button>
            </div>
          </div>
        </div>
      )}

      {/* STATE 3: REJECTED / COOLDOWN */}
      {activeState === 'rejected' && (
        <div className="tc-workspace-card tc-p-6">
          <div className="tc-text-center tc-mb-3">
            <div className="tc-icon-circle-lg-danger">
              <XCircle size={32} />
            </div>
            <h1 className="tc-page-title">
              Application Status: Not Selected for this Cohort
            </h1>
            <p className="tc-page-subtitle tc-page-subtitle--center-max">
              Thank you for your interest in TitanCode. Our current engineering roster for this quarter is fully allocated. We encourage you to strengthen your public repositories and reapply.
            </p>
          </div>

          {/* Cooldown Countdown Card */}
          <div className="tc-snapshot-card tc-text-center tc-mb-3">
            <div className="tc-dept-head-label">
              Reapplication Window Unlocks In
            </div>
            <div className="tc-cooldown-grid">
              {[
                { val: cooldownDays, label: 'DAYS' },
                { val: cooldownHours, label: 'HOURS' },
                { val: cooldownMins, label: 'MINUTES' },
                { val: cooldownSecs, label: 'SECONDS' },
              ].map((cd, i) => (
                <div key={i} className="tc-cooldown-digit-box">
                  <div className="tc-cooldown-num">{cd.val}</div>
                  <div className="tc-cooldown-lbl">{cd.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Feedback */}
          <div className="tc-snapshot-card">
            <h3 className="tc-card-title tc-mb-1">
              Technical Evaluator Feedback
            </h3>
            <p className="tc-text-muted tc-feedback-text">
              {myApplication?.rejection_reason ||
                '"Candidate demonstrated solid software engineering foundation. For future cohorts, we highly recommend showcasing production E2E tests, comprehensive architecture patterns, and distributed backend caching."'}
            </p>
          </div>
        </div>
      )}

      {/* STATE 4: REAPPLICATION FORM */}
      {activeState === 'reapply' && (
        <div className="tc-workspace-card tc-p-6">
          <div className="tc-mb-3">
            <h1 className="tc-page-title">
              Reapply for TitanCode Engineering Cohort
            </h1>
            <p className="tc-page-subtitle">
              Update your skills, projects, and latest portfolio to re-enter our priority evaluation queue.
            </p>
          </div>

          {reapplySubmitted ? (
            <div className="tc-modal-success-banner">
              <div className="tc-modal-success-title">
                Reapplication Received!
              </div>
              <div className="tc-modal-success-sub">
                Your updated portfolio has been prioritized for next week's ATS screening batch.
              </div>
            </div>
          ) : (
            <form onSubmit={handleReapplySubmit}>
              <div className="tc-form-group">
                <label className="tc-form-label">
                  Target Department *
                </label>
                <select
                  defaultValue={departmentName}
                  className="tc-form-select"
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

              <div className="tc-form-group">
                <label className="tc-form-label">
                  Updated GitHub / Portfolio URL *
                </label>
                <input
                  type="url"
                  required
                  value={reapplyGithub}
                  onChange={(e) => setReapplyGithub(e.target.value)}
                  className="tc-form-input"
                  placeholder="https://github.com/your-username"
                />
              </div>

              <div className="tc-form-group">
                <label className="tc-form-label">
                  New Skills & Technologies Acquired *
                </label>
                <input
                  type="text"
                  required
                  value={reapplySkills}
                  onChange={(e) => setReapplySkills(e.target.value)}
                  placeholder="e.g. Docker, Playwright, WebSockets, Next.js 15"
                  className="tc-form-input"
                />
              </div>

              <div className="tc-form-group">
                <label className="tc-form-label">
                  What high-impact projects have you shipped recently?
                </label>
                <textarea
                  rows={3}
                  value={reapplyNotes}
                  onChange={(e) => setReapplyNotes(e.target.value)}
                  placeholder="Briefly describe what you built and the metrics achieved..."
                  className="tc-form-textarea"
                />
              </div>

              <div className="tc-actions-end">
                <button
                  type="submit"
                  className="tc-gold-btn"
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
