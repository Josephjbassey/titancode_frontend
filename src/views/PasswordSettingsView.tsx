import React from 'react';

interface PasswordSettingsViewProps {
  onNavigateChangePassword: () => void;
}

export const PasswordSettingsView: React.FC<PasswordSettingsViewProps> = ({
  onNavigateChangePassword,
}) => {
  return (
    <div style={{
      backgroundColor: '#121620',
      border: '1px solid rgba(255, 255, 255, 0.08)',
      borderRadius: '16px',
      padding: '28px',
      maxWidth: '680px',
    }}
    className="tc-fade-in"
    >
      <h2 style={{
        fontSize: '18px',
        fontWeight: '700',
        color: '#FFFFFF',
        marginBottom: '20px',
      }}>
        Password Settings
      </h2>

      <div style={{
        fontSize: '15px',
        fontWeight: '700',
        color: '#FFFFFF',
        marginBottom: '6px',
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

      {/* Current password status input */}
      <div style={{ marginBottom: '24px' }}>
        <input
          type="text"
          readOnly
          value="Current password (updated on 13/08/2026)"
          style={{
            width: '100%',
            height: '46px',
            borderRadius: '8px',
            backgroundColor: 'rgba(255, 255, 255, 0.04)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            color: '#9CA3AF',
            padding: '0 16px',
            fontSize: '14px',
            outline: 'none',
            cursor: 'default',
          }}
        />
      </div>

      {/* Change Password Solid Gold Pill Button */}
      <button
        type="button"
        onClick={onNavigateChangePassword}
        style={{
          height: '44px',
          padding: '0 28px',
          borderRadius: '9999px',
          backgroundColor: '#E5A83B',
          color: '#000000',
          fontSize: '14px',
          fontWeight: '700',
          border: 'none',
          cursor: 'pointer',
          boxShadow: '0 4px 14px rgba(229, 168, 59, 0.3)',
        }}
      >
        Change Password
      </button>
    </div>
  );
};
