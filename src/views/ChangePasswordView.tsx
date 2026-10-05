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
      <div className="tc-pw-split">
        {/* Left Card: Change Password Form */}
        <div className="tc-settings-panel">
          <h2 className="tc-card-title tc-mb-1">
            Password Settings
          </h2>

          <div className="tc-settings-panel-subheading">
            Change Password
          </div>

          <p className="tc-settings-panel-desc">
            Your password must be at least 6 characters and should include combination of numbers, letters and special characters.
          </p>

          {validationError && (
            <div className="tc-form-error-banner">
              <AlertCircle size={16} />
              <span>{validationError}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="tc-flex-col-gap">
            {/* Current Password Field */}
            <div>
              <div className="tc-flex-between tc-mb-2">
                <label className="tc-form-label tc-mb-0">
                  Current password
                </label>
                {/* Figma Screen 13: Red error message next to label */}
                {hasCurrentPasswordError && (
                  <span className="tc-field-error-inline">
                    <AlertCircle size={13} />
                    Incorrect password
                  </span>
                )}
              </div>
              <div className="tc-relative">
                <input
                  type={showCurrent ? 'text' : 'password'}
                  value={currentPassword}
                  onChange={(e) => {
                    setCurrentPassword(e.target.value);
                    if (hasCurrentPasswordError) setHasCurrentPasswordError(false);
                  }}
                  placeholder="••••••••"
                  required
                  className={`tc-form-input tc-input-with-icon ${hasCurrentPasswordError ? 'tc-form-input--error' : ''}`}
                />
                <button
                  type="button"
                  onClick={() => setShowCurrent(!showCurrent)}
                  className="tc-password-toggle-btn"
                >
                  {showCurrent ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* New Password Field */}
            <div>
              <label className="tc-form-label">
                New password
              </label>
              <div className="tc-relative">
                <input
                  type={showNew ? 'text' : 'password'}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="tc-form-input tc-input-with-icon"
                />
                <button
                  type="button"
                  onClick={() => setShowNew(!showNew)}
                  className="tc-password-toggle-btn"
                >
                  {showNew ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Confirm New Password Field */}
            <div>
              <label className="tc-form-label">
                Confirm new password
              </label>
              <div className="tc-relative">
                <input
                  type={showConfirm ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="tc-form-input tc-input-with-icon"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  className="tc-password-toggle-btn"
                >
                  {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Forgot Password Link */}
            <div>
              <button
                type="button"
                className="tc-text-btn-gold"
              >
                Forgot Password?
              </button>
            </div>

            {/* Buttons: Cancel (outline pill) & Update Password (solid gold pill) */}
            <div className="tc-form-actions">
              <button
                type="button"
                onClick={onBackToSettings}
                className="tc-btn-pill-cancel"
              >
                Cancel
              </button>

              <button
                type="submit"
                className="tc-action-btn-gold"
              >
                Update Password
              </button>
            </div>
          </form>

        </div>

        {/* Right Card: Where you're logged in (Figma) */}
        <div className="tc-settings-panel">
          <h3 className="tc-card-title tc-mb-4">
            Where you're logged in
          </h3>

          <div className="tc-flex-col-gap">
            {/* Session 1: Current Session with Green Dot */}
            <div className="tc-session-item">
              <div className="tc-session-info">
                <div className="tc-session-icon">
                  <Laptop size={20} />
                </div>
                <div>
                  <div className="tc-session-title-row">
                    <span className="tc-session-title">
                      2018 Macbook Pro 15-inch
                    </span>
                    {/* Green active dot */}
                    <span className="tc-session-dot-active" />
                  </div>
                  <div className="tc-session-meta">
                    Melbourne, Australia • 22 Jan at 10:40am
                  </div>
                </div>
              </div>

              <button
                type="button"
                className="tc-btn-pill-sm"
              >
                Log Out
              </button>
            </div>

            {/* Divider */}
            <div className="tc-separator-line" />

            {/* Session 2 */}
            <div className="tc-session-item">
              <div className="tc-session-info">
                <div className="tc-session-icon">
                  <Laptop size={20} />
                </div>
                <div>
                  <div className="tc-session-title">
                    2018 Macbook Pro 15-inch
                  </div>
                  <div className="tc-session-meta">
                    Melbourne, Australia • 22 Jan at 12:15pm
                  </div>
                </div>
              </div>

              <button
                type="button"
                className="tc-btn-pill-sm"
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
        <div className="tc-modal-center-body">
          <h3 className="tc-modal-title tc-mb-2">
            Confirm Password
          </h3>

          <p className="tc-settings-panel-desc tc-mb-4">
            A 5-digit confirmation code has been sent to your email. Enter code to confirm your password.
          </p>

          <OtpInput
            length={5}
            value={otpCode}
            onChange={setOtpCode}
          />

          <div className="tc-resend-prompt">
            Didn't get code?{' '}
            <button
              type="button"
              onClick={() => alert('Code resent')}
              className="tc-text-btn-gold"
            >
              Resend code
            </button>
          </div>

          <button
            type="button"
            onClick={handleConfirmOtp}
            disabled={otpCode.length < 5}
            className="tc-btn-submit-gold-full"
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
    </div>
  );
};
