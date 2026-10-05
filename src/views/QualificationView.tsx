import React, { useState } from 'react';
import { Users, Briefcase, Check } from 'lucide-react';
import { AuthLayout } from '../components/AuthLayout';

interface QualificationViewProps {
  onSelectRole: (role: 'Member' | 'Client') => Promise<void> | void;
  onBack: () => void;
}

export const QualificationView: React.FC<QualificationViewProps> = ({
  onSelectRole,
  onBack,
}) => {
  const [selectedRole, setSelectedRole] = useState<'Member' | 'Client'>('Client');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleContinue = async () => {
    setIsSubmitting(true);
    try {
      await onSelectRole(selectedRole);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthLayout
      title="Welcome to TitanCode"
      subtitle="Select your role"
    >
      <div className="tc-fade-in">
        {/* Two Side-by-Side Role Cards matching Figma Frame 597:44 */}
        <div className="tc-role-selection-grid">
          {/* Member Card */}
          <div
            onClick={() => setSelectedRole('Member')}
            className={`tc-role-card ${selectedRole === 'Member' ? 'tc-role-card--active' : ''}`}
          >
            {/* Top row: Squircle Gold Icon Container matching Figma Frame 2147223471 */}
            <div className="tc-role-icon-box">
              <Users size={22} color="#0b0b0c" strokeWidth={2.4} />
            </div>

            {/* Bottom row: Label on left, Radio check on right */}
            <div className="tc-role-bottom-row">
              <span className="tc-role-title">
                Member
              </span>

              <div className={`tc-role-radio ${selectedRole === 'Member' ? 'tc-role-radio--checked' : ''}`}>
                {selectedRole === 'Member' && <Check size={13} strokeWidth={3} />}
              </div>
            </div>
          </div>

          {/* Client Card */}
          <div
            onClick={() => setSelectedRole('Client')}
            className={`tc-role-card ${selectedRole === 'Client' ? 'tc-role-card--active' : ''}`}
          >
            {/* Top row: Squircle Gold Icon Container matching Figma Frame 2147223472 */}
            <div className="tc-role-icon-box">
              <Briefcase size={22} color="#0b0b0c" strokeWidth={2.4} />
            </div>

            {/* Bottom row: Label on left, Radio check on right */}
            <div className="tc-role-bottom-row">
              <span className="tc-role-title">
                Client
              </span>

              <div className={`tc-role-radio ${selectedRole === 'Client' ? 'tc-role-radio--checked' : ''}`}>
                {selectedRole === 'Client' && <Check size={13} strokeWidth={3} />}
              </div>
            </div>
          </div>
        </div>

        {/* Action Button: Solid Gold Pill */}
        <button
          type="button"
          onClick={handleContinue}
          disabled={isSubmitting}
          className="tc-btn-submit-gold-full tc-mb-4"
        >
          {isSubmitting ? 'Configuring your portal...' : 'Continue'}
        </button>

        {/* Bottom Switch Link */}
        <div className="tc-auth-footer-prompt">
          Already have an account?{' '}
          <button
            type="button"
            onClick={onBack}
            className="tc-text-btn-gold"
          >
            Login
          </button>
        </div>
      </div>
    </AuthLayout>
  );
};
