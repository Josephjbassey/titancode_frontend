import React, { useState } from 'react';
import { ShieldCheck, Loader2, AlertCircle } from 'lucide-react';
import { api } from '../services/api';
import type { User } from '../types';

interface KycVerificationViewProps {
  user: User;
  onUpdateUser: (user: User) => void;
}

export const KycVerificationView: React.FC<KycVerificationViewProps> = ({ user, onUpdateUser }) => {
  const [isInitiating, setIsInitiating] = useState(false);
  const [error, setError] = useState('');
  const [initiated, setInitiated] = useState(false);

  const handleInitiate = async () => {
    setIsInitiating(true);
    setError('');
    try {
      await api.initiateSumsubKyc(user.id);
      setInitiated(true);
      const updated = await api.getCurrentUser();
      onUpdateUser(updated);
    } catch (err: any) {
      setError(err.message || 'Could not start verification. Please try again.');
    } finally {
      setIsInitiating(false);
    }
  };

  const isVerified = user.kyc_status === 'verified';
  const isPending = user.kyc_status === 'pending';
  const isRejected = user.kyc_status === 'rejected';

  return (
    <div className="tc-fade-in tc-view-container">
      <div className="tc-settings-card" style={{ maxWidth: 520 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
          <ShieldCheck size={28} color={isVerified ? '#10B981' : '#dfae32'} />
          <h2 className="tc-settings-section-title tc-mb-0">Identity Verification</h2>
        </div>

        {isVerified && (
          <div className="tc-form-success">
            <ShieldCheck size={16} /> Your identity has been verified.
            {user.kyc_verified_at && (
              <span style={{ marginLeft: 8, fontSize: 12, color: '#888' }}>
                {new Date(user.kyc_verified_at).toLocaleDateString()}
              </span>
            )}
          </div>
        )}

        {isPending && (
          <div className="tc-info-banner">
            <Loader2 size={16} className="tc-spin" /> Your verification is under review. You will be notified when it is complete.
          </div>
        )}

        {isRejected && (
          <div className="tc-error-banner">
            <AlertCircle size={16} /> Your previous verification was not successful. Please try again.
          </div>
        )}

        {!isVerified && !isPending && !initiated && (
          <>
            <p className="tc-body-text tc-mb-3">
              Verify your identity to unlock withdrawals and full platform access. The process takes 2–5 minutes and requires a government-issued ID.
            </p>
            {error && <div className="tc-error-banner"><AlertCircle size={14} /> {error}</div>}
            <button type="button" className="tc-btn-primary" onClick={handleInitiate} disabled={isInitiating}>
              {isInitiating ? <Loader2 size={14} className="tc-spin" /> : <ShieldCheck size={14} />}
              {isInitiating ? 'Starting…' : isRejected ? 'Retry Verification' : 'Start Verification'}
            </button>
          </>
        )}

        {initiated && !isVerified && (
          <div className="tc-form-success">
            Verification session started. Check your email or follow the on-screen instructions to complete the process.
          </div>
        )}
      </div>
    </div>
  );
};
