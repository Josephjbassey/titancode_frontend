import React from 'react';
import { Search, Bell } from 'lucide-react';
import type { User } from '../types';

interface HeaderProps {
  user: User;
  onOpenProfile?: () => void;
  onOpenNotifications?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  user,
  onOpenProfile,
  onOpenNotifications,
}) => {
  return (
    <header
      style={{
        height: '100px',
        backgroundColor: '#0b0b0c',
        borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
        padding: '0 36px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        position: 'sticky',
        top: 0,
        zIndex: 30,
        flexShrink: 0,
      }}
    >
      {/* Search Pill on Left (Figma Rectangle 255: 482px x 36px) */}
      <div
        style={{
          position: 'relative',
          width: '100%',
          maxWidth: '482px',
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <Search
          size={16}
          style={{
            position: 'absolute',
            left: '16px',
            color: 'rgba(255, 255, 255, 0.4)',
            pointerEvents: 'none',
          }}
        />
        <input
          type="text"
          placeholder="Search..."
          aria-label="Search workspace"
          style={{
            width: '100%',
            height: '36px',
            backgroundColor: '#232324',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '9999px',
            padding: '0 18px 0 42px',
            color: '#FFFFFF',
            fontSize: '13px',
            outline: 'none',
            transition: 'all 0.2s ease',
          }}
          onFocus={(e) => {
            e.target.style.borderColor = '#dfae32';
            e.target.style.backgroundColor = '#2a2a2b';
          }}
          onBlur={(e) => {
            e.target.style.borderColor = 'rgba(255, 255, 255, 0.1)';
            e.target.style.backgroundColor = '#232324';
          }}
        />
      </div>

      {/* Right Controls: Bell and Avatar (Figma Rectangle 265 & Ellipse 9) */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        {/* Notification Bell (Figma Rectangle 265: 34px x 34px) */}
        <button
          type="button"
          onClick={onOpenNotifications}
          aria-label="View notifications"
          style={{
            position: 'relative',
            width: '34px',
            height: '34px',
            borderRadius: '10px',
            backgroundColor: 'rgba(255, 255, 255, 0.05)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#FFFFFF',
            cursor: 'pointer',
            transition: 'all 0.15s ease',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)')}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.05)')}
        >
          <Bell size={17} />
          {/* Notification pink dot */}
          <span
            style={{
              position: 'absolute',
              top: '6px',
              right: '6px',
              width: '7px',
              height: '7px',
              borderRadius: '50%',
              backgroundColor: '#EC4899',
              border: '1.5px solid #0b0b0c',
            }}
          />
        </button>

        {/* Profile Avatar (Figma Ellipse 9: 50px x 50px) */}
        <button
          type="button"
          onClick={onOpenProfile}
          aria-label="User Profile and Settings"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: 0,
          }}
        >
          <div
            style={{
              position: 'relative',
              width: '50px',
              height: '50px',
              borderRadius: '50%',
              overflow: 'hidden',
              border: '2px solid rgba(223, 174, 50, 0.4)',
              backgroundColor: '#232324',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.4)',
            }}
          >
            <img
              src={user.avatar_url || '/assets/dashprofile.jpg'}
              alt={user.full_name}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
              }}
            />
          </div>
          <div style={{ display: 'none', textAlign: 'left' }} className="tc-header-user-info">
            <div style={{ fontSize: '13px', fontWeight: 600, color: '#FFFFFF', lineHeight: 1.2 }}>
              {user.first_name || user.full_name}
            </div>
            <div style={{ fontSize: '11px', color: '#DFAE32', marginTop: '2px' }}>
              {user.role}
            </div>
          </div>
        </button>
      </div>

      <style>{`
        @media (min-width: 900px) {
          .tc-header-user-info {
            display: block !important;
          }
        }
      `}</style>
    </header>
  );
};
