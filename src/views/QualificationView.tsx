import React, { useState } from 'react';
import { Users, Briefcase, Check } from 'lucide-react';
import { AuthLayout } from '../components/AuthLayout';

interface QualificationViewProps {
  onSelectRole: (role: 'Member' | 'Client') => void;
  onBack: () => void;
}

export const QualificationView: React.FC<QualificationViewProps> = ({
  onSelectRole,
  onBack,
}) => {
  const [selectedRole, setSelectedRole] = useState<'Member' | 'Client'>('Member');

  return (
    <AuthLayout
      title="Welcome to TitanCode"
      subtitle="Select your role"
    >
      <div className="tc-fade-in">
        {/* Two Side-by-Side Role Cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '16px',
          margin: '28px 0 32px',
        }}>
          {/* Member Card */}
          <div
            onClick={() => setSelectedRole('Member')}
            style={{
              padding: '24px 18px',
              borderRadius: '16px',
              backgroundColor: 'rgba(255, 255, 255, 0.04)',
              border: `2px solid ${selectedRole === 'Member' ? '#E5A83B' : 'rgba(255, 255, 255, 0.1)'}`,
              cursor: 'pointer',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              minHeight: '150px',
              transition: 'all 0.2s ease',
              position: 'relative',
            }}
          >
            {/* Top row with Icon and Radio Check */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}>
              <div style={{
                color: selectedRole === 'Member' ? '#E5A83B' : '#9CA3AF',
              }}>
                <Users size={28} />
              </div>

              <div style={{
                width: '20px',
                height: '20px',
                borderRadius: '50%',
                backgroundColor: selectedRole === 'Member' ? '#E5A83B' : 'transparent',
                border: `2px solid ${selectedRole === 'Member' ? '#E5A83B' : 'rgba(255, 255, 255, 0.3)'}`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#000000',
              }}>
                {selectedRole === 'Member' && <Check size={13} strokeWidth={3} />}
              </div>
            </div>

            {/* Label */}
            <div style={{
              fontSize: '18px',
              fontWeight: '700',
              color: '#FFFFFF',
              marginTop: '16px',
            }}>
              Member
            </div>
          </div>

          {/* Client Card */}
          <div
            onClick={() => setSelectedRole('Client')}
            style={{
              padding: '24px 18px',
              borderRadius: '16px',
              backgroundColor: 'rgba(255, 255, 255, 0.04)',
              border: `2px solid ${selectedRole === 'Client' ? '#E5A83B' : 'rgba(255, 255, 255, 0.1)'}`,
              cursor: 'pointer',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              minHeight: '150px',
              transition: 'all 0.2s ease',
              position: 'relative',
            }}
          >
            {/* Top row with Icon and Radio Check */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}>
              <div style={{
                color: selectedRole === 'Client' ? '#E5A83B' : '#9CA3AF',
              }}>
                <Briefcase size={28} />
              </div>

              <div style={{
                width: '20px',
                height: '20px',
                borderRadius: '50%',
                backgroundColor: selectedRole === 'Client' ? '#E5A83B' : 'transparent',
                border: `2px solid ${selectedRole === 'Client' ? '#E5A83B' : 'rgba(255, 255, 255, 0.3)'}`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#000000',
              }}>
                {selectedRole === 'Client' && <Check size={13} strokeWidth={3} />}
              </div>
            </div>

            {/* Label */}
            <div style={{
              fontSize: '18px',
              fontWeight: '700',
              color: '#FFFFFF',
              marginTop: '16px',
            }}>
              Client
            </div>
          </div>
        </div>

        {/* Action Button: Solid Gold Pill */}
        <button
          type="button"
          onClick={() => onSelectRole(selectedRole)}
          style={{
            width: '100%',
            height: '46px',
            borderRadius: '9999px',
            backgroundColor: '#E5A83B',
            color: '#000000',
            fontSize: '15px',
            fontWeight: '700',
            border: 'none',
            cursor: 'pointer',
            boxShadow: '0 4px 14px rgba(229, 168, 59, 0.3)',
            marginBottom: '24px',
          }}
        >
          Continue
        </button>

        {/* Bottom Switch Link */}
        <div style={{
          textAlign: 'center',
          fontSize: '14px',
          color: '#9CA3AF',
        }}>
          Already have an account?{' '}
          <button
            type="button"
            onClick={onBack}
            style={{
              background: 'none',
              border: 'none',
              color: '#E5A83B',
              fontWeight: '600',
              cursor: 'pointer',
              padding: 0,
            }}
          >
            Login
          </button>
        </div>
      </div>
    </AuthLayout>
  );
};
