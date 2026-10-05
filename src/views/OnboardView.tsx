import React, { useEffect, useState } from 'react';
import { CheckCircle2, AlertTriangle, ArrowRight, ShieldCheck, KeyRound, Loader2 } from 'lucide-react';
import { AuthLayout } from '../components/AuthLayout';
import { api } from '../services/api';
import type { User } from '../types';
import type { ScreenId } from '../App';

interface OnboardViewProps {
  onSuccess: (user: User) => void;
  onNavigate: (view: ScreenId) => void;
}

export const OnboardView: React.FC<OnboardViewProps> = ({ onSuccess, onNavigate }) => {
  const [status, setStatus] = useState<'verifying' | 'success' | 'expired_or_used' | 'no_token'>('verifying');
  const [clientUser, setClientUser] = useState<User | null>(null);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const urlToken = params.get('token');

    if (!urlToken) {
      setStatus('no_token');
      return;
    }

    // Call activation API
    api.activateClientOnboard(urlToken)
      .then((res) => {
        setClientUser(res.user);
        setStatus('success');
      })
      .catch((err: any) => {
        const msg = err.message || 'Activation failed';
        setErrorMessage(msg);
        setStatus('expired_or_used');
      });
  }, []);

  const handleEnterDashboard = () => {
    if (clientUser) {
      onSuccess(clientUser);
    } else {
      onNavigate('client_dashboard');
    }
  };

  return (
    <AuthLayout title="Client Portal Activation">
      <div className="tc-fade-in tc-text-center tc-py-1">
        {status === 'verifying' && (
          <div className="tc-py-40">
            <Loader2
              size={48}
              color="#dfae32"
              className="animate-spin tc-spin tc-mx-auto tc-mb-4"
            />
            <h2 className="tc-modal-title tc-mb-2">
              Activating your Client Portal
            </h2>
            <p className="tc-text-muted">
              Please wait while we verify your invitation token...
            </p>
          </div>
        )}

        {status === 'success' && (
          <div className="tc-text-left">
            <div className="tc-onboard-icon-badge tc-onboard-icon-badge--success">
              <CheckCircle2 size={32} color="#10B981" />
            </div>

            <h1 className="tc-page-title tc-mb-2">
              Welcome to TitanCode!
            </h1>

            <p className="tc-line-relaxed tc-mb-4 tc-text-muted">
              Hi <strong className="tc-text-white">{clientUser?.full_name || 'Client'}</strong>, your account is now fully approved and your dedicated Client Portal is ready.
            </p>

            <div className="tc-onboard-info-box">
              <div className="tc-onboard-info-title">
                <ShieldCheck size={18} />
                <span>Zero-Friction Access Granted</span>
              </div>
              <p className="tc-onboard-info-desc">
                You can now review project architecture, track deliverables, communicate with your lead engineer, and fund project milestones via Escrow.
              </p>
            </div>

            <button
              type="button"
              onClick={handleEnterDashboard}
              className="tc-btn-submit-gold-full tc-flex-center-gap tc-mb-4"
            >
              <span>Enter Client Portal</span>
              <ArrowRight size={18} />
            </button>
          </div>
        )}

        {status === 'expired_or_used' && (
          <div className="tc-text-left">
            <div className="tc-onboard-icon-badge tc-onboard-icon-badge--warning">
              <KeyRound size={28} color="#dfae32" />
            </div>

            <h1 className="tc-card-title tc-mb-2">
              Link Already Activated or Expired
            </h1>

            <p className="tc-line-relaxed tc-mb-4 tc-text-muted">
              {errorMessage.includes('already')
                ? 'Your client portal has already been activated! You can sign in directly or request a password reset below.'
                : 'This invitation link has expired (24h limit) or has already been used. Please log in or request a new login code.'}
            </p>

            <div className="tc-flex-col-gap tc-mb-4">
              <button
                type="button"
                onClick={() => onNavigate('sign_in')}
                className="tc-btn-submit-gold-full"
              >
                Sign In to Portal
              </button>

              <button
                type="button"
                onClick={() => onNavigate('forgot_password_1')}
                className="tc-btn-pill-full-outline"
              >
                Reset Password / Send OTP
              </button>
            </div>
          </div>
        )}

        {status === 'no_token' && (
          <div className="tc-text-left">
            <div className="tc-onboard-icon-badge tc-onboard-icon-badge--error">
              <AlertTriangle size={28} color="#EF4444" />
            </div>

            <h1 className="tc-card-title tc-mb-2">
              Missing Activation Token
            </h1>

            <p className="tc-line-relaxed tc-mb-4 tc-text-muted">
              Please click the direct link provided in your TitanCode invitation email, or sign in using your existing credentials.
            </p>

            <button
              type="button"
              onClick={() => onNavigate('sign_in')}
              className="tc-btn-submit-gold-full"
            >
              Go to Sign In
            </button>
          </div>
        )}
      </div>
    </AuthLayout>
  );
};
