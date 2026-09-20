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
        <div style={{ textAlign: 'center', padding: '10px 0 6px' }}>
          <div style={{
            width: '64px',
            height: '64px',
            borderRadius: '50%',
            background: 'var(--tc-brand-gold-light)',
            color: 'var(--tc-brand-gold)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 20px',
            border: '1px solid rgba(229, 168, 59, 0.3)',
          }}>
            <ShieldCheck size={32} />
          </div>

          <h3 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '8px', color: '#FFFFFF' }}>
            {title || 'Employee Identity Verification (Sumsub)'}
          </h3>

          <p style={{ fontSize: '14px', color: 'var(--tc-text-secondary)', lineHeight: '1.6', marginBottom: '24px' }}>
            {message || 'As a TitanCode engineering team member, KYC identity verification is securely handled by Sumsub. Your National ID and biometric data are verified directly without storing sensitive government credentials on our servers.'}
          </p>

          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
            <button className="tc-btn tc-btn-secondary" onClick={onClose} style={{ flex: 1 }}>
              Dismiss
            </button>
            <button
              className="tc-btn tc-btn-primary"
              onClick={() => {
                if (onAction) onAction();
                onClose();
              }}
              style={{ flex: 1.2 }}
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
    <div style={{
      position: 'fixed',
      inset: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.75)',
      backdropFilter: 'blur(4px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 100,
      padding: '20px',
    }}>
      <div style={{
        backgroundColor: '#E5A83B',
        borderRadius: '20px',
        padding: '36px 28px',
        width: '100%',
        maxWidth: '440px',
        textAlign: 'center',
        position: 'relative',
        boxShadow: '0 20px 50px rgba(0, 0, 0, 0.5)',
        animation: 'tc-fadeIn 0.2s ease',
      }}>
        {/* Top Right Close 'x' */}
        <button
          type="button"
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '16px',
            right: '16px',
            background: 'none',
            border: 'none',
            color: '#000000',
            cursor: 'pointer',
            padding: '4px',
            display: 'flex',
          }}
        >
          <X size={20} strokeWidth={2.5} />
        </button>

        {/* Dark Circle Icon Container */}
        <div style={{
          width: '68px',
          height: '68px',
          borderRadius: '50%',
          backgroundColor: '#0F1218',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 20px',
        }}>
          {isSuccess ? (
            <Check size={36} color="#E5A83B" strokeWidth={3} />
          ) : (
            <X size={36} color="#EF4444" strokeWidth={3} />
          )}
        </div>

        {/* Modal Title (Black Bold) */}
        <h3 style={{
          fontSize: '22px',
          fontWeight: '800',
          color: '#000000',
          marginBottom: '10px',
          letterSpacing: '-0.3px',
        }}>
          {title || (isSuccess ? 'Password Changed Successfully' : 'Incorrect Code')}
        </h3>

        {/* Modal Subtitle Message */}
        <p style={{
          fontSize: '14px',
          color: '#1F2937',
          lineHeight: '1.5',
          margin: '0 0 24px',
          fontWeight: '500',
        }}>
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
          style={{
            width: '100%',
            height: '44px',
            borderRadius: '9999px',
            backgroundColor: '#0F1218',
            color: '#FFFFFF',
            fontSize: '14px',
            fontWeight: '600',
            border: 'none',
            cursor: 'pointer',
            transition: 'background-color 0.15s ease',
          }}
        >
          {actionText || (isSuccess ? 'Continue' : 'Try Again')}
        </button>
      </div>
    </div>
  );
};
