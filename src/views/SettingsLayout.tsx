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
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', paddingBottom: '32px' }} className="tc-fade-in">
      {/* Top Title: Account Settings */}
      <h1 style={{
        fontSize: '24px',
        fontWeight: '700',
        color: '#FFFFFF',
        letterSpacing: '-0.4px',
        margin: 0,
      }}>
        Account Settings
      </h1>

      {/* Main Settings Body: Left Subnav Column + Right Content Area */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '240px minmax(0, 1fr)',
        gap: '24px',
        alignItems: 'start',
      }}
      className="tc-settings-split"
      >
        {/* Left Sub-Navigation Menu (Figma) */}
        <div style={{
          backgroundColor: '#121620',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          borderRadius: '16px',
          padding: '16px 12px',
          display: 'flex',
          flexDirection: 'column',
          gap: '6px',
        }}>
          {/* Profile Settings Tab */}
          <button
            type="button"
            onClick={() => onTabChange('profile')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '10px 16px',
              borderRadius: '9999px',
              backgroundColor: activeTab === 'profile' ? 'transparent' : 'transparent',
              border: activeTab === 'profile' ? '1px solid #E5A83B' : '1px solid transparent',
              color: activeTab === 'profile' ? '#E5A83B' : '#9CA3AF',
              fontWeight: activeTab === 'profile' ? 700 : 500,
              fontSize: '14px',
              cursor: 'pointer',
              textAlign: 'left',
              width: '100%',
              transition: 'all 0.15s ease',
            }}
          >
            <User size={18} />
            <span>Profile Settings</span>
          </button>

          {/* Password Tab */}
          <button
            type="button"
            onClick={() => onTabChange('password')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '10px 16px',
              borderRadius: '9999px',
              backgroundColor: activeTab === 'password' ? 'transparent' : 'transparent',
              border: activeTab === 'password' ? '1px solid #E5A83B' : '1px solid transparent',
              color: activeTab === 'password' ? '#E5A83B' : '#9CA3AF',
              fontWeight: activeTab === 'password' ? 700 : 500,
              fontSize: '14px',
              cursor: 'pointer',
              textAlign: 'left',
              width: '100%',
              transition: 'all 0.15s ease',
            }}
          >
            <Lock size={18} />
            <span>Password</span>
          </button>

          {/* Notifications Tab */}
          <button
            type="button"
            onClick={() => onTabChange('notifications')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '10px 16px',
              borderRadius: '9999px',
              backgroundColor: activeTab === 'notifications' ? 'transparent' : 'transparent',
              border: activeTab === 'notifications' ? '1px solid #E5A83B' : '1px solid transparent',
              color: activeTab === 'notifications' ? '#E5A83B' : '#9CA3AF',
              fontWeight: activeTab === 'notifications' ? 700 : 500,
              fontSize: '14px',
              cursor: 'pointer',
              textAlign: 'left',
              width: '100%',
              transition: 'all 0.15s ease',
            }}
          >
            <Bell size={18} />
            <span>Notifications</span>
          </button>
        </div>

        {/* Right Content Panel */}
        <div style={{ minWidth: 0 }}>
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
