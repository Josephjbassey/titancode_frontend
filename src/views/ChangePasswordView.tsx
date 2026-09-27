import React, { useState } from 'react';
import {
  Eye,
  EyeOff,
  Laptop,
  AlertCircle,
} from 'lucide-react';
import { Modal } from '../components/Modal';
import { OtpInput } from '../components/OtpInput';
import { NotificationModal } from '../components/NotificationModal';
import { api } from '../services/api';

interface ChangePasswordViewProps {
  onBackToSettings: () => void;
  initialShowError?: boolean;
}

export const ChangePasswordView: React.FC<ChangePasswordViewProps> = ({
  onBackToSettings,
  initialShowError = false,
}) => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [hasCurrentPasswordError, setHasCurrentPasswordError] = useState(initialShowError);

  // Modals
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  const [showIncorrectCodeModal, setShowIncorrectCodeModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [validationError, setValidationError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError('');

    if (newPassword !== confirmPassword) {
      setValidationError('New password and confirmation password do not match.');
      return;
    }

    if (newPassword.length < 8) {
      setValidationError('Password must be at least 8 characters long.');
      return;
    }

    // Open Screen 14: Confirm Password modal
    setIsConfirmModalOpen(true);
  };

  const handleConfirmOtp = async () => {
    if (otpCode.length < 5 || isSubmitting) return;

    setIsSubmitting(true);
    try {
      await api.changePassword(currentPassword, newPassword);
      setIsConfirmModalOpen(false);
      setShowSuccessModal(true);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setOtpCode('');
      setHasCurrentPasswordError(false);
    } catch (err: any) {
      setIsConfirmModalOpen(false);
      const errMsg = (err.message || '').toLowerCase();
      if (errMsg.includes('current') || errMsg.includes('incorrect') || errMsg.includes('invalid credentials')) {
        setHasCurrentPasswordError(true);
      } else {
        setShowIncorrectCodeModal(true);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="tc-fade-in">
      {/* Split Cards: Change Password on Left, Where You're Logged In on Right (Figma) */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'minmax(0, 1.3fr) minmax(320px, 1fr)',
        gap: '24px',
        alignItems: 'start',
      }}
      className="tc-pw-split"
      >
        {/* Left Card: Change Password Form */}
        <div style={{
          backgroundColor: '#232324',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          borderRadius: '16px',
          padding: '28px',
        }}>
          <h2 style={{
            fontSize: '18px',
            fontWeight: '700',
            color: '#FFFFFF',
            marginBottom: '4px',
          }}>
            Password Settings
          </h2>

          <div style={{
            fontSize: '15px',
            fontWeight: '700',
            color: '#FFFFFF',
            marginBottom: '6px',
            marginTop: '16px',
          }}>
            Change Password
          </div>

          <p style={{
            fontSize: '13px',
            color: '#9CA3AF',
            lineHeight: '1.6',
            margin: '0 0 24px',
          }}>
            Your password must be at least 6 characters and should include combination of numbers, letters and special characters.
          </p>

          {validationError && (
            <div style={{
              padding: '10px 14px',
              borderRadius: '8px',
              backgroundColor: 'rgba(239, 68, 68, 0.1)',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              color: '#EF4444',
              fontSize: '13px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              marginBottom: '16px',
            }}>
              <AlertCircle size={16} />
              <span>{validationError}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {/* Current Password Field */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <label style={{ fontSize: '13px', color: '#D1D5DB' }}>
                  Current password
                </label>
                {/* Figma Screen 13: Red error message next to label */}
                {hasCurrentPasswordError && (
                  <span style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px',
                    fontSize: '12px',
                    color: '#EF4444',
                    fontWeight: '500',
                  }}>
                    <AlertCircle size={13} />
                    Incorrect password
                  </span>
                )}
              </div>
              <div style={{ position: 'relative' }}>
                <input
                  type={showCurrent ? 'text' : 'password'}
                  value={currentPassword}
                  onChange={(e) => {
                    setCurrentPassword(e.target.value);
                    if (hasCurrentPasswordError) setHasCurrentPasswordError(false);
                  }}
                  placeholder="••••••••"
                  required
                  style={{
                    width: '100%',
                    height: '44px',
                    borderRadius: '8px',
                    backgroundColor: 'rgba(255, 255, 255, 0.05)',
                    border: `1px solid ${hasCurrentPasswordError ? '#EF4444' : 'rgba(255, 255, 255, 0.12)'}`,
                    color: '#FFFFFF',
                    padding: '0 44px 0 16px',
                    fontSize: '14px',
                    outline: 'none',
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowCurrent(!showCurrent)}
                  style={{
                    position: 'absolute',
                    right: '14px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    color: 'rgba(255, 255, 255, 0.4)',
                    cursor: 'pointer',
                    display: 'flex',
                    padding: 0,
                  }}
                >
                  {showCurrent ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* New Password Field */}
            <div>
              <label style={{ display: 'block', fontSize: '13px', color: '#D1D5DB', marginBottom: '8px' }}>
                New password
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showNew ? 'text' : 'password'}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  style={{
                    width: '100%',
                    height: '44px',
                    borderRadius: '8px',
                    backgroundColor: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(255, 255, 255, 0.12)',
                    color: '#FFFFFF',
                    padding: '0 44px 0 16px',
                    fontSize: '14px',
                    outline: 'none',
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowNew(!showNew)}
                  style={{
                    position: 'absolute',
                    right: '14px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    color: 'rgba(255, 255, 255, 0.4)',
                    cursor: 'pointer',
                    display: 'flex',
                    padding: 0,
                  }}
                >
                  {showNew ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Confirm New Password Field */}
            <div>
              <label style={{ display: 'block', fontSize: '13px', color: '#D1D5DB', marginBottom: '8px' }}>
                Confirm new password
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showConfirm ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  style={{
                    width: '100%',
                    height: '44px',
                    borderRadius: '8px',
                    backgroundColor: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(255, 255, 255, 0.12)',
                    color: '#FFFFFF',
                    padding: '0 44px 0 16px',
                    fontSize: '14px',
                    outline: 'none',
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  style={{
                    position: 'absolute',
                    right: '14px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    color: 'rgba(255, 255, 255, 0.4)',
                    cursor: 'pointer',
                    display: 'flex',
                    padding: 0,
                  }}
                >
                  {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Forgot Password Link */}
            <div>
              <button
                type="button"
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#dfae32',
                  fontSize: '13px',
                  fontWeight: '500',
                  cursor: 'pointer',
                  padding: 0,
                }}
              >
                Forgot Password?
              </button>
            </div>

            {/* Buttons: Cancel (outline pill) & Update Password (solid gold pill) */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '14px', marginTop: '12px' }}>
              <button
                type="button"
                onClick={onBackToSettings}
                style={{
                  height: '44px',
                  padding: '0 24px',
                  borderRadius: '9999px',
                  backgroundColor: 'transparent',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  color: '#FFFFFF',
                  fontSize: '14px',
                  fontWeight: '500',
                  cursor: 'pointer',
                }}
              >
                Cancel
              </button>

              <button
                type="submit"
                style={{
                  height: '44px',
                  padding: '0 28px',
                  borderRadius: '9999px',
                  backgroundColor: '#dfae32',
                  color: '#000000',
                  fontSize: '14px',
                  fontWeight: '700',
                  border: 'none',
                  cursor: 'pointer',
                  boxShadow: '0 4px 14px rgba(223, 174, 50, 0.3)',
                }}
              >
                Update Password
              </button>
            </div>
          </form>

        </div>

        {/* Right Card: Where you're logged in (Figma) */}
        <div style={{
          backgroundColor: '#232324',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          borderRadius: '16px',
          padding: '28px',
        }}>
          <h3 style={{
            fontSize: '16px',
            fontWeight: '700',
            color: '#FFFFFF',
            marginBottom: '20px',
          }}>
            Where you're logged in
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {/* Session 1: Current Session with Green Dot */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '12px',
            }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                <div style={{ color: '#9CA3AF', marginTop: '2px' }}>
                  <Laptop size={20} />
                </div>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '14px', fontWeight: '600', color: '#FFFFFF' }}>
                      2018 Macbook Pro 15-inch
                    </span>
                    {/* Green active dot */}
                    <span style={{
                      width: '8px',
                      height: '8px',
                      borderRadius: '50%',
                      backgroundColor: '#10B981',
                    }} />
                  </div>
                  <div style={{ fontSize: '12px', color: '#9CA3AF', marginTop: '2px' }}>
                    Melbourne, Australia • 22 Jan at 10:40am
                  </div>
                </div>
              </div>

              <button
                type="button"
                style={{
                  height: '32px',
                  padding: '0 16px',
                  borderRadius: '9999px',
                  backgroundColor: 'transparent',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  color: '#FFFFFF',
                  fontSize: '12px',
                  fontWeight: '500',
                  cursor: 'pointer',
                  flexShrink: 0,
                }}
              >
                Log Out
              </button>
            </div>

            {/* Divider */}
            <div style={{ height: '1px', backgroundColor: 'rgba(255, 255, 255, 0.06)' }} />

            {/* Session 2 */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '12px',
            }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                <div style={{ color: '#9CA3AF', marginTop: '2px' }}>
                  <Laptop size={20} />
                </div>
                <div>
                  <div style={{ fontSize: '14px', fontWeight: '600', color: '#FFFFFF' }}>
                    2018 Macbook Pro 15-inch
                  </div>
                  <div style={{ fontSize: '12px', color: '#9CA3AF', marginTop: '2px' }}>
                    Melbourne, Australia • 22 Jan at 12:15pm
                  </div>
                </div>
              </div>

              <button
                type="button"
                style={{
                  height: '32px',
                  padding: '0 16px',
                  borderRadius: '9999px',
                  backgroundColor: 'transparent',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  color: '#FFFFFF',
                  fontSize: '12px',
                  fontWeight: '500',
                  cursor: 'pointer',
                  flexShrink: 0,
                }}
              >
                Log Out
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Screen 14: Confirm Password Modal (Figma Confim Password.png) */}
      <Modal
        isOpen={isConfirmModalOpen}
        onClose={() => setIsConfirmModalOpen(false)}
        maxWidth="440px"
      >
        <div style={{ textAlign: 'center', padding: '10px 0' }}>
          <h3 style={{
            fontSize: '20px',
            fontWeight: '700',
            color: '#FFFFFF',
            marginBottom: '8px',
          }}>
            Confirm Password
          </h3>

          <p style={{
            fontSize: '13px',
            color: '#9CA3AF',
            lineHeight: '1.5',
            margin: '0 0 20px',
          }}>
            A 5-digit confirmation code has been sent to your email. Enter code to confirm your password.
          </p>

          <OtpInput
            length={5}
            value={otpCode}
            onChange={setOtpCode}
          />

          <div style={{
            fontSize: '13px',
            color: '#9CA3AF',
            margin: '16px 0 24px',
          }}>
            Didn't get code?{' '}
            <button
              type="button"
              onClick={() => alert('Code resent')}
              style={{
                background: 'none',
                border: 'none',
                color: '#dfae32',
                fontWeight: '600',
                cursor: 'pointer',
                padding: 0,
              }}
            >
              Resend code
            </button>
          </div>

          <button
            type="button"
            onClick={handleConfirmOtp}
            disabled={otpCode.length < 5}
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
            Confirm
          </button>

        </div>
      </Modal>

      {/* Screen 15: Incorrect code (Solid Gold Modal in Figma) */}
      <NotificationModal
        isOpen={showIncorrectCodeModal}
        onClose={() => setShowIncorrectCodeModal(false)}
        type="error"
        title="Incorrect Code"
        message="Your code is incorrect. Please, try again to confirm your password."
        actionText="Try Again"
        onAction={() => {
          setOtpCode('');
          setIsConfirmModalOpen(true);
        }}
      />

      {/* Screen 16: Password changed successfully (Solid Gold Modal in Figma) */}
      <NotificationModal
        isOpen={showSuccessModal}
        onClose={() => {
          setShowSuccessModal(false);
          onBackToSettings();
        }}
        type="success"
        title="Password Changed Successfully"
        message="Your password has been changed successfully"
        actionText="Back to Settings"
      />

      <style>{`
        @media (max-width: 900px) {
          .tc-pw-split {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
};
