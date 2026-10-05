import React from 'react';
import { Check, X, ShieldCheck } from 'lucide-react';
import { Modal } from './Modal';

interface NotificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: 'success' | 'error' | 'kyc';
  title?: string;
  message?: string;
  actionText?: string;
  onAction?: () => void;
}

export const NotificationModal: React.FC<NotificationModalProps> = ({
  isOpen,
  onClose,
  type,
  title,
  message,
  actionText,
  onAction,
}) => {
  if (!isOpen) return null;

  // Sumsub KYC modal
  if (type === 'kyc') {
    return (
      <Modal isOpen={isOpen} onClose={onClose} maxWidth="480px">
        <div className="tc-kyc-modal-body">
          <div className="tc-kyc-modal-icon-wrap">
            <ShieldCheck size={32} />
          </div>

          <h3 className="tc-kyc-modal-title">
            {title || 'Employee Identity Verification (Sumsub)'}
          </h3>

          <p className="tc-kyc-modal-desc">
            {message || 'As a TitanCode engineering team member, KYC identity verification is securely handled by Sumsub. Your National ID and biometric data are verified directly without storing sensitive government credentials on our servers.'}
          </p>

          <div className="tc-kyc-modal-actions">
            <button className="tc-btn tc-btn-secondary tc-kyc-btn-dismiss" onClick={onClose}>
              Dismiss
            </button>
            <button
              className="tc-btn tc-btn-primary tc-kyc-btn-launch"
              onClick={() => {
                if (onAction) onAction();
                onClose();
              }}
            >
              {actionText || 'Launch Sumsub SDK'}
            </button>
          </div>
        </div>
      </Modal>
    );
  }

  const isSuccess = type === 'success';

  // Figma Solid Gold Modals for Incorrect Code (Screen 15) and Password Changed Successfully (Screen 16)
  return (
    <div className="tc-notification-backdrop">
      <div className="tc-gold-modal-card">
        {/* Top Right Close 'x' */}
        <button
          type="button"
          onClick={onClose}
          className="tc-gold-modal-close"
        >
          <X size={20} strokeWidth={2.5} />
        </button>

        {/* Dark Circle Icon Container */}
        <div className="tc-gold-modal-icon-circle">
          {isSuccess ? (
            <Check size={36} color="#dfae32" strokeWidth={3} />
          ) : (
            <X size={36} color="#EF4444" strokeWidth={3} />
          )}
        </div>

        {/* Modal Title (Black Bold) */}
        <h3 className="tc-gold-modal-title">
          {title || (isSuccess ? 'Password Changed Successfully' : 'Incorrect Code')}
        </h3>

        {/* Modal Subtitle Message */}
        <p className="tc-gold-modal-message">
          {message || (isSuccess
            ? 'Your password has been changed successfully'
            : 'Your code is incorrect. Please, try again to confirm your password.')}
        </p>

        {/* Dark Button on Gold Background */}
        <button
          type="button"
          onClick={() => {
            if (onAction) onAction();
            onClose();
          }}
          className="tc-gold-modal-btn"
        >
          {actionText || (isSuccess ? 'Continue' : 'Try Again')}
        </button>
      </div>
    </div>
  );
};
