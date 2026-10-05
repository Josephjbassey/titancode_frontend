import React from 'react';
import { User, Lock, Bell } from 'lucide-react';

interface SettingsLayoutProps {
  activeTab: 'profile' | 'password' | 'notifications';
  onTabChange: (tab: 'profile' | 'password' | 'notifications') => void;
  children: React.ReactNode;
}

export const SettingsLayout: React.FC<SettingsLayoutProps> = ({
  activeTab,
  onTabChange,
  children,
}) => {
  return (
    <div className="tc-fade-in tc-settings-layout-container">
      {/* Top Title: Account Settings */}
      <h1 className="tc-page-title">
        Account Settings
      </h1>

      {/* Main Settings Body: Left Subnav Column + Right Content Area */}
      <div className="tc-settings-split">
        {/* Left Sub-Navigation Menu (Figma) */}
        <div className="tc-settings-subnav">
          {/* Profile Settings Tab */}
          <button
            type="button"
            onClick={() => onTabChange('profile')}
            className={`tc-settings-subnav-btn ${activeTab === 'profile' ? 'tc-settings-subnav-btn--active' : ''}`}
          >
            <User size={18} />
            <span>Profile Settings</span>
          </button>

          {/* Password Tab */}
          <button
            type="button"
            onClick={() => onTabChange('password')}
            className={`tc-settings-subnav-btn ${activeTab === 'password' ? 'tc-settings-subnav-btn--active' : ''}`}
          >
            <Lock size={18} />
            <span>Password</span>
          </button>

          {/* Notifications Tab */}
          <button
            type="button"
            onClick={() => onTabChange('notifications')}
            className={`tc-settings-subnav-btn ${activeTab === 'notifications' ? 'tc-settings-subnav-btn--active' : ''}`}
          >
            <Bell size={18} />
            <span>Notifications</span>
          </button>
        </div>

        {/* Right Content Panel */}
        <div className="tc-flex-1-min-0">
          {children}
        </div>
      </div>

      <style>{`
        @media (max-width: 860px) {
          .tc-settings-split {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
};
