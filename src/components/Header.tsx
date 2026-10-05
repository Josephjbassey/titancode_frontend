import React from 'react';
import { Search, Bell, Shield } from 'lucide-react';
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
    <header className="tc-app-header">
      {/* Search Pill on Left (Figma Rectangle 255: 482px x 36px) */}
      <div className="tc-header-search-wrap">
        <Search
          size={16}
          className="tc-header-search-icon"
        />
        <input
          type="text"
          placeholder="Search..."
          aria-label="Search workspace"
          className="tc-header-search-input"
        />
      </div>

      {/* Right Controls: Role Badge, Bell, and Avatar */}
      <div className="tc-header-right-controls">
        {/* Static Role Badge */}
        <div className="tc-header-role-badge">
          <Shield size={14} color="currentColor" />
          <span>{user.role}</span>
        </div>

        {/* Notification Bell (Figma Rectangle 265: 34px x 34px) */}
        <button
          type="button"
          onClick={onOpenNotifications}
          aria-label="View notifications"
          className="tc-header-bell-btn"
        >
          <Bell size={17} />
          {/* Notification pink dot */}
          <span className="tc-header-bell-dot" />
        </button>

        {/* Profile Avatar (Figma Ellipse 9: 50px x 50px) */}
        <button
          type="button"
          onClick={onOpenProfile}
          aria-label="User Profile and Settings"
          className="tc-header-avatar-btn"
        >
          <div className="tc-header-avatar-circle">
            {user.avatar_url ? (
              <img
                src={user.avatar_url}
                alt={user.full_name}
                className="tc-header-avatar-img"
              />
            ) : (
              user.full_name
                ?.split(' ')
                .map((n) => n[0])
                .join('')
                .slice(0, 2)
            )}
          </div>
          <div className="tc-header-user-info">
            <div className="tc-header-user-name">
              {user.first_name || user.full_name}
            </div>
            <div className="tc-header-user-role">
              {user.role}
            </div>
          </div>
        </button>
      </div>
    </header>
  );
};
