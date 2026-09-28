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
    <div
      className="tc-fade-in"
      style={{
        minHeight: '100vh',
        width: '100%',
        backgroundColor: '#0B0B0C',
        color: '#FFFFFF',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '40px 24px',
        position: 'relative',
        overflow: 'hidden',
        fontFamily: "'Poppins', sans-serif",
      }}
    >
      {/* Background Ambient Glow */}
      <div
        style={{
          position: 'absolute',
          top: '25%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '600px',
          height: '600px',
          borderRadius: '50%',
          background: isPending
            ? 'radial-gradient(circle, rgba(223, 174, 50, 0.14) 0%, rgba(11, 11, 12, 0) 70%)'
            : 'radial-gradient(circle, rgba(239, 68, 68, 0.12) 0%, rgba(11, 11, 12, 0) 70%)',
          pointerEvents: 'none',
          filter: 'blur(50px)',
          zIndex: 0,
        }}
      />

      <div
        style={{
          position: 'relative',
          zIndex: 1,
          maxWidth: '580px',
          width: '100%',
          textAlign: 'center',
          backgroundColor: 'rgba(255, 255, 255, 0.03)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          borderRadius: '24px',
          padding: '48px 36px',
          backdropFilter: 'blur(16px)',
          boxShadow: '0 24px 60px rgba(0, 0, 0, 0.65)',
        }}
      >
        {/* Status Icon */}
        <div
          style={{
            width: '88px',
            height: '88px',
            borderRadius: '24px',
            backgroundColor: isPending ? 'rgba(223, 174, 50, 0.12)' : 'rgba(239, 68, 68, 0.12)',
            border: `1px solid ${isPending ? 'rgba(223, 174, 50, 0.3)' : 'rgba(239, 68, 68, 0.3)'}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 24px',
            boxShadow: `0 0 30px ${isPending ? 'rgba(223, 174, 50, 0.25)' : 'rgba(239, 68, 68, 0.25)'}`,
          }}
        >
          {isPending ? (
            <Clock size={44} color="#DFAE32" strokeWidth={1.8} />
          ) : (
            <ShieldAlert size={44} color="#EF4444" strokeWidth={1.8} />
          )}
        </div>

        {/* Status Badge */}
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            padding: '4px 14px',
            borderRadius: '9999px',
            backgroundColor: isPending ? 'rgba(223, 174, 50, 0.12)' : 'rgba(239, 68, 68, 0.12)',
            border: `1px solid ${isPending ? 'rgba(223, 174, 50, 0.25)' : 'rgba(239, 68, 68, 0.25)'}`,
            fontSize: '12px',
            fontWeight: 600,
            color: isPending ? '#DFAE32' : '#EF4444',
            marginBottom: '16px',
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
          }}
        >
          {isPending ? 'Status: 403 Verification Pending' : 'Status: 403 Access Denied'}
        </div>

        <h1
          style={{
            fontSize: '24px',
            fontWeight: 700,
            color: '#FFFFFF',
            marginBottom: '12px',
            fontFamily: "'Inter', sans-serif",
            letterSpacing: '-0.3px',
          }}
        >
          {isPending ? 'Account Pending Administrative Review' : 'Restricted Platform Sector'}
        </h1>

        <p
          style={{
            fontSize: '14px',
            color: '#9CA3AF',
            lineHeight: '1.6',
            marginBottom: isPending ? '24px' : '32px',
          }}
        >
          {isPending ? (
            <>
              Your registration has been created successfully. For security and quality control, new staff and member accounts must be vetted and approved by our Executive/HR team before workspace credentials become active.
              {userEmail && (
                <span
                  style={{
                    display: 'block',
                    marginTop: '8px',
                    color: '#DFAE32',
                    fontWeight: 500,
                  }}
                >
                  Registered Email: {userEmail}
                </span>
              )}
            </>
          ) : (
            <>
              You do not have the required permissions to access this view or resource.
              {requiredRole && (
                <span
                  style={{
                    display: 'block',
                    marginTop: '6px',
                    color: '#EF4444',
                    fontWeight: 500,
                  }}
                >
                  Requires role: {requiredRole}
                </span>
              )}
            </>
          )}
        </p>

        {/* Verification Steps Visual (only for Pending Approval) */}
        {isPending && (
          <div
            style={{
              backgroundColor: 'rgba(0, 0, 0, 0.35)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: '16px',
              padding: '20px 24px',
              marginBottom: '32px',
              textAlign: 'left',
            }}
          >
            <div style={{ fontSize: '13px', fontWeight: 600, color: '#DFAE32', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <ShieldCheck size={16} />
              Onboarding Progression Timeline
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <CheckCircle2 size={18} color="#10B981" />
                <span style={{ fontSize: '13px', color: '#FFFFFF', fontWeight: 500 }}>
                  1. Credentials Created & Stored
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div
                  style={{
                    width: '18px',
                    height: '18px',
                    borderRadius: '50%',
                    border: '2px solid #DFAE32',
                    borderTopColor: 'transparent',
                    animation: 'spin 1.5s linear infinite',
                  }}
                />
                <span style={{ fontSize: '13px', color: '#DFAE32', fontWeight: 600 }}>
                  2. Administrative & Department Allocation Review (In Progress)
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', opacity: 0.5 }}>
                <div
                  style={{
                    width: '18px',
                    height: '18px',
                    borderRadius: '50%',
                    border: '2px solid rgba(255, 255, 255, 0.3)',
                  }}
                />
                <span style={{ fontSize: '13px', color: '#9CA3AF' }}>
                  3. Production Sprints & Wallet Access Granted
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Actions */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {isPending ? (
            <>
              <button
                type="button"
                onClick={() => onNavigate('contact_us')}
                style={{
                  height: '48px',
                  borderRadius: '9999px',
                  backgroundColor: '#DFAE32',
                  color: '#0B0B0C',
                  fontSize: '15px',
                  fontWeight: 700,
                  border: 'none',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  boxShadow: '0 4px 16px rgba(223, 174, 50, 0.3)',
                  transition: 'opacity 0.15s ease',
                }}
              >
                <Mail size={18} />
                Contact HR / Inquire on Status
              </button>

              <button
                type="button"
                onClick={handleSignOut}
                style={{
                  height: '44px',
                  borderRadius: '9999px',
                  backgroundColor: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  color: '#FFFFFF',
                  fontSize: '14px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                }}
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
                style={{
                  height: '48px',
                  borderRadius: '9999px',
                  backgroundColor: '#DFAE32',
                  color: '#0B0B0C',
                  fontSize: '15px',
                  fontWeight: 700,
                  border: 'none',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  boxShadow: '0 4px 16px rgba(223, 174, 50, 0.3)',
                }}
              >
                <ArrowRight size={18} />
                Return to My Dashboard
              </button>

              <button
                type="button"
                onClick={handleSignOut}
                style={{
                  height: '44px',
                  borderRadius: '9999px',
                  backgroundColor: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  color: '#FFFFFF',
                  fontSize: '14px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                }}
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
