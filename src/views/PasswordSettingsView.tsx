import React from 'react';

interface PasswordSettingsViewProps {
  onNavigateChangePassword: () => void;
}

export const PasswordSettingsView: React.FC<PasswordSettingsViewProps> = ({
  onNavigateChangePassword,
}) => {
  return (
    <div className="tc-fade-in tc-settings-panel">
      <h2 className="tc-card-title tc-text-lg tc-mb-4">
        Password Settings
      </h2>

      <div className="tc-font-bold tc-text-white tc-text-base tc-mb-1">
        Change Password
      </div>

      <p className="tc-text-muted tc-text-sm tc-line-relaxed tc-mb-4">
        Your password must be at least 6 characters and should include combination of numbers, letters and special characters.
      </p>

      {/* Current password status input */}
      <div className="tc-form-group tc-mb-4">
        <input
          type="text"
          readOnly
          value="Current password (updated on 13/08/2026)"
          className="tc-input-readonly"
        />
      </div>

      {/* Change Password Solid Gold Pill Button */}
      <button
        type="button"
        onClick={onNavigateChangePassword}
        className="tc-action-btn-gold"
      >
        Change Password
      </button>
    </div>
  );
};
