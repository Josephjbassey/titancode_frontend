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
      <div className="tc-fade-in" style={{ textAlign: 'center', padding: '10px 0' }}>
        {status === 'verifying' && (
          <div style={{ padding: '40px 0' }}>
            <Loader2
              size={48}
              color="#dfae32"
              className="animate-spin"
              style={{ margin: '0 auto 20px', animation: 'spin 1s linear infinite' }}
            />
            <h2 style={{ fontSize: '20px', fontWeight: '700', color: '#FFFFFF', marginBottom: '8px' }}>
              Activating your Client Portal
            </h2>
            <p style={{ fontSize: '14px', color: '#9CA3AF' }}>
              Please wait while we verify your invitation token...
            </p>
          </div>
        )}

        {status === 'success' && (
          <div style={{ textAlign: 'left' }}>
            <div style={{
              width: '60px',
              height: '60px',
              borderRadius: '50%',
              backgroundColor: 'rgba(16, 185, 129, 0.15)',
              border: '2px solid rgba(16, 185, 129, 0.4)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '20px',
            }}>
              <CheckCircle2 size={32} color="#10B981" />
            </div>

            <h1 style={{
              fontSize: '26px',
              fontWeight: '700',
              color: '#FFFFFF',
              marginBottom: '8px',
            }}>
              Welcome to TitanCode!
            </h1>

            <p style={{
              fontSize: '15px',
              color: '#9CA3AF',
              lineHeight: '1.6',
              marginBottom: '24px',
            }}>
              Hi <strong style={{ color: '#FFFFFF' }}>{clientUser?.full_name || 'Client'}</strong>, your account is now fully approved and your dedicated Client Portal is ready.
            </p>

            <div style={{
              backgroundColor: 'rgba(223, 174, 50, 0.08)',
              border: '1px solid rgba(223, 174, 50, 0.25)',
              borderRadius: '12px',
              padding: '16px 20px',
              marginBottom: '28px',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#dfae32', fontWeight: '600', marginBottom: '6px' }}>
                <ShieldCheck size={18} />
                <span>Zero-Friction Access Granted</span>
              </div>
              <p style={{ fontSize: '13px', color: 'rgba(255, 255, 255, 0.7)', margin: 0 }}>
                You can now review project architecture, track deliverables, communicate with your lead engineer, and fund project milestones via Escrow.
              </p>
            </div>

            <button
              type="button"
              onClick={handleEnterDashboard}
              style={{
                width: '100%',
                height: '50px',
                borderRadius: '9999px',
                backgroundColor: '#dfae32',
                color: '#000000',
                fontSize: '15px',
                fontWeight: '700',
                border: 'none',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                boxShadow: '0 4px 14px rgba(223, 174, 50, 0.3)',
                marginBottom: '16px',
              }}
            >
              <span>Enter Client Portal</span>
              <ArrowRight size={18} />
            </button>
          </div>
        )}

        {status === 'expired_or_used' && (
          <div style={{ textAlign: 'left' }}>
            <div style={{
              width: '60px',
              height: '60px',
              borderRadius: '50%',
              backgroundColor: 'rgba(223, 174, 50, 0.15)',
              border: '2px solid rgba(223, 174, 50, 0.4)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '20px',
            }}>
              <KeyRound size={28} color="#dfae32" />
            </div>

            <h1 style={{
              fontSize: '24px',
              fontWeight: '700',
              color: '#FFFFFF',
              marginBottom: '8px',
            }}>
              Link Already Activated or Expired
            </h1>

            <p style={{
              fontSize: '14px',
              color: '#9CA3AF',
              lineHeight: '1.6',
              marginBottom: '24px',
            }}>
              {errorMessage.includes('already')
                ? 'Your client portal has already been activated! You can sign in directly or request a password reset below.'
                : 'This invitation link has expired (24h limit) or has already been used. Please log in or request a new login code.'}
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '24px' }}>
              <button
                type="button"
                onClick={() => onNavigate('sign_in')}
                style={{
                  width: '100%',
                  height: '46px',
                  borderRadius: '9999px',
                  backgroundColor: '#dfae32',
                  color: '#000000',
                  fontSize: '15px',
                  fontWeight: '700',
                  border: 'none',
                  cursor: 'pointer',
                  boxShadow: '0 4px 14px rgba(223, 174, 50, 0.3)',
                }}
              >
                Sign In to Portal
              </button>

              <button
                type="button"
                onClick={() => onNavigate('forgot_password_1')}
                style={{
                  width: '100%',
                  height: '46px',
                  borderRadius: '9999px',
                  backgroundColor: 'transparent',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  color: '#FFFFFF',
                  fontSize: '14px',
                  fontWeight: '500',
                  cursor: 'pointer',
                }}
              >
                Reset Password / Send OTP
              </button>
            </div>
          </div>
        )}

        {status === 'no_token' && (
          <div style={{ textAlign: 'left' }}>
            <div style={{
              width: '60px',
              height: '60px',
              borderRadius: '50%',
              backgroundColor: 'rgba(239, 68, 68, 0.15)',
              border: '2px solid rgba(239, 68, 68, 0.4)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '20px',
            }}>
              <AlertTriangle size={28} color="#EF4444" />
            </div>

            <h1 style={{
              fontSize: '24px',
              fontWeight: '700',
              color: '#FFFFFF',
              marginBottom: '8px',
            }}>
              Missing Activation Token
            </h1>

            <p style={{
              fontSize: '14px',
              color: '#9CA3AF',
              lineHeight: '1.6',
              marginBottom: '24px',
            }}>
              Please click the direct link provided in your TitanCode invitation email, or sign in using your existing credentials.
            </p>

            <button
              type="button"
              onClick={() => onNavigate('sign_in')}
              style={{
                width: '100%',
                height: '46px',
                borderRadius: '9999px',
                backgroundColor: '#dfae32',
                color: '#000000',
                fontSize: '15px',
                fontWeight: '700',
                border: 'none',
                cursor: 'pointer',
                boxShadow: '0 4px 14px rgba(223, 174, 50, 0.3)',
              }}
            >
              Go to Sign In
            </button>
          </div>
        )}
      </div>

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </AuthLayout>
  );
};
