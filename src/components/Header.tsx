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
    <header style={{
      height: '76px',
      backgroundColor: '#0A0C10',
      borderBottom: '1px solid rgba(255, 255, 255, 0.06)',
      padding: '0 36px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      position: 'sticky',
      top: 0,
      zIndex: 30,
    }}>
      {/* Search Pill on Left (Figma) */}
      <div style={{
        position: 'relative',
        width: '100%',
        maxWidth: '440px',
        display: 'flex',
        alignItems: 'center',
      }}>
        <Search
          size={18}
          style={{
            position: 'absolute',
            left: '18px',
            color: 'rgba(255, 255, 255, 0.4)',
            pointerEvents: 'none',
          }}
        />
        <input
          type="text"
          placeholder="Search"
          style={{
            width: '100%',
            height: '42px',
            backgroundColor: 'rgba(255, 255, 255, 0.05)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: '9999px',
            padding: '0 20px 0 46px',
            color: '#FFFFFF',
            fontSize: '14px',
            outline: 'none',
            transition: 'all 0.2s ease',
          }}
          onFocus={(e) => {
            e.target.style.borderColor = '#E5A83B';
            e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.08)';
          }}
          onBlur={(e) => {
            e.target.style.borderColor = 'rgba(255, 255, 255, 0.08)';
            e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.05)';
          }}
        />
      </div>

      {/* Right Controls: Bell and Avatar (Figma) */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        {/* Notification Bell with Badge */}
        <button
          type="button"
          onClick={onOpenNotifications}
          style={{
            position: 'relative',
            width: '42px',
            height: '42px',
            borderRadius: '12px',
            backgroundColor: 'rgba(255, 255, 255, 0.05)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#FFFFFF',
            cursor: 'pointer',
            transition: 'background-color 0.15s ease',
          }}
          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)'}
          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.05)'}
        >
          <Bell size={19} />
          {/* Pink notification dot badge */}
          <span style={{
            position: 'absolute',
            top: '9px',
            right: '9px',
            width: '8px',
            height: '8px',
            borderRadius: '50%',
            backgroundColor: '#FF3B8A',
            border: '2px solid #0A0C10',
          }} />
        </button>

        {/* Benedicta Round Avatar */}
        <div
          onClick={onOpenProfile}
          style={{
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <img
            src="/assets/benedicta_avatar_sm.png"
            alt={user.full_name}
            style={{
              width: '42px',
              height: '42px',
              borderRadius: '50%',
              objectFit: 'cover',
              border: '2px solid rgba(229, 168, 59, 0.4)',
            }}
          />
        </div>
      </div>
    </header>
  );
};
