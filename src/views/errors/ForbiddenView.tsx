import React from 'react';
import { ShieldAlert, Clock, LogOut, CheckCircle2, ArrowRight, ShieldCheck, Mail } from 'lucide-react';
import type { ScreenId } from '../../App';
import { api } from '../../services/api';

interface ForbiddenViewProps {
  variant?: 'pending_approval' | 'access_denied';
  userEmail?: string;
  requiredRole?: string;
  onNavigate: (view: ScreenId) => void;
  onLogout?: () => void;
}

export const ForbiddenView: React.FC<ForbiddenViewProps> = ({
  variant = 'pending_approval',
  userEmail,
  requiredRole,
  onNavigate,
  onLogout,
}) => {
  const isPending = variant === 'pending_approval';

  const handleSignOut = () => {
    if (onLogout) {
      onLogout();
    } else {
      api.logout();
      onNavigate('sign_in');
    }
  };

  return (
    <div className="tc-fade-in tc-error-page-container">
      {/* Background Ambient Glow */}
      <div
        className={`tc-error-ambient-glow tc-error-ambient-glow--forbidden ${
          isPending ? 'tc-error-ambient-glow--forbidden-pending' : 'tc-error-ambient-glow--forbidden-denied'
        }`}
      />

      <div className="tc-error-card tc-error-card--wide">
        {/* Status Icon */}
        <div className={`tc-error-icon-box ${isPending ? '' : 'tc-error-icon-box--red'}`}>
          {isPending ? (
            <Clock size={44} color="#DFAE32" strokeWidth={1.8} />
          ) : (
            <ShieldAlert size={44} color="#EF4444" strokeWidth={1.8} />
          )}
        </div>

        {/* Status Badge */}
        <div className={`tc-error-badge ${isPending ? '' : 'tc-error-badge--red'}`}>
          {isPending ? 'Status: 403 Verification Pending' : 'Status: 403 Access Denied'}
        </div>

        <h1 className="tc-error-title">
          {isPending ? 'Account Pending Administrative Review' : 'Restricted Platform Sector'}
        </h1>

        <p className="tc-error-desc">
          {isPending ? (
            <>
              Your registration has been created successfully. For security and quality control, new staff and member accounts must be vetted and approved by our Executive/HR team before workspace credentials become active.
              {userEmail && (
                <span className="tc-error-meta-line">
                  Registered Email: {userEmail}
                </span>
              )}
            </>
          ) : (
            <>
              You do not have the required permissions to access this view or resource.
              {requiredRole && (
                <span className="tc-error-meta-line tc-error-meta-line--danger">
                  Requires role: {requiredRole}
                </span>
              )}
            </>
          )}
        </p>

        {/* Verification Steps Visual (only for Pending Approval) */}
        {isPending && (
          <div className="tc-forbidden-timeline">
            <div className="tc-forbidden-timeline-header">
              <ShieldCheck size={16} />
              Onboarding Progression Timeline
            </div>

            <div className="tc-forbidden-timeline-list">
              <div className="tc-forbidden-timeline-item">
                <CheckCircle2 size={18} color="#10B981" />
                <span className="tc-forbidden-timeline-text">
                  1. Credentials Created & Stored
                </span>
              </div>
              <div className="tc-forbidden-timeline-item">
                <div className="tc-forbidden-spinner-bullet" />
                <span className="tc-forbidden-timeline-text tc-forbidden-timeline-text--active">
                  2. Administrative & Department Allocation Review (In Progress)
                </span>
              </div>
              <div className="tc-forbidden-timeline-item tc-forbidden-timeline-item--dim">
                <div className="tc-forbidden-empty-bullet" />
                <span className="tc-forbidden-timeline-text tc-forbidden-timeline-text--muted">
                  3. Production Sprints & Wallet Access Granted
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="tc-error-actions-stack">
          {isPending ? (
            <>
              <button
                type="button"
                onClick={() => onNavigate('contact_us')}
                className="tc-btn-error-primary"
              >
                <Mail size={18} />
                Contact HR / Inquire on Status
              </button>

              <button
                type="button"
                onClick={handleSignOut}
                className="tc-btn-error-secondary"
              >
                <LogOut size={16} />
                Sign in with Another Account
              </button>
            </>
          ) : (
            <>
              <button
                type="button"
                onClick={() => onNavigate('dashboard')}
                className="tc-btn-error-primary"
              >
                <ArrowRight size={18} />
                Return to My Dashboard
              </button>

              <button
                type="button"
                onClick={handleSignOut}
                className="tc-btn-error-secondary"
              >
                <LogOut size={16} />
                Sign Out
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
