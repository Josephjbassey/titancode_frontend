import React, { useState } from 'react';
import { Search, Bell, Shield, HelpCircle, MessageSquare, ExternalLink, LifeBuoy, Menu } from 'lucide-react';
import type { User } from '../types';
import { Modal } from './Modal';
import { useCompany } from '../contexts/CompanyContext';

interface HeaderProps {
  user: User;
  onOpenSidebar?: () => void;
  onOpenProfile?: () => void;
  onOpenNotifications?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  user,
  onOpenSidebar,
  onOpenProfile,
  onOpenNotifications,
}) => {
  const company = useCompany();
  const [isHelpOpen, setIsHelpOpen] = useState(false);

  const handleOpenCrispChat = () => {
    setIsHelpOpen(false);
    if ((window as any).$crisp) {
      (window as any).$crisp.push(['do', 'chat:open']);
    } else {
      alert('Live support chat widget loaded in bottom-right corner.');
    }
  };

  return (
    <header className="tc-app-header">
      {/* Sidebar hamburger — visible only on mobile */}
      <button
        type="button"
        className="tc-header-hamburger"
        onClick={onOpenSidebar}
        aria-label="Open navigation menu"
      >
        <Menu size={22} />
      </button>

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

      {/* Right Controls: Role Badge, Help, Bell, and Avatar */}
      <div className="tc-header-right-controls">
        {/* Static Role Badge */}
        <div className="tc-header-role-badge">
          <Shield size={14} color="currentColor" />
          <span>{user.role}</span>
        </div>

        {/* Support & Help Desk Button */}
        <button
          type="button"
          onClick={() => setIsHelpOpen(true)}
          aria-label="Customer & IT Support"
          title="Customer & IT Support"
          className="tc-header-bell-btn"
        >
          <HelpCircle size={17} />
        </button>

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

      {/* Support & Help Desk Modal */}
      <Modal
        isOpen={isHelpOpen}
        onClose={() => setIsHelpOpen(false)}
        title="Help & Support Concierge"
        maxWidth="500px"
      >
        <div className="tc-p-2">
          <p className="tc-text-muted-xs tc-mb-4">
            Connect with TitanCode live assistance or submit technical IT and DevOps inquiries directly.
          </p>

          <div className="tc-flex-col-gap tc-gap-3">
            {/* Live Customer Support */}
            <div className="tc-settings-card tc-mb-0">
              <div className="tc-flex-between tc-mb-2">
                <div className="tc-flex-center-gap">
                  <LifeBuoy size={16} className="tc-text-gold" />
                  <span className="tc-font-bold tc-text-white tc-text-sm">Live Customer Support</span>
                </div>
                <span className="tc-badge-status tc-badge-status--approved">Crisp Active</span>
              </div>
              <p className="tc-text-muted-xs tc-mb-3">
                Chat in real time with our client success concierge team.
              </p>
              <button
                type="button"
                onClick={handleOpenCrispChat}
                className="tc-gold-btn tc-w-full tc-justify-center"
              >
                <MessageSquare size={14} />
                <span>Launch Live Support Chat</span>
              </button>
            </div>

            {/* IT Support & Bug Reports */}
            <div className="tc-settings-card tc-mb-0">
              <div className="tc-flex-between tc-mb-2">
                <div className="tc-flex-center-gap">
                  <ExternalLink size={16} className="tc-text-info" />
                  <span className="tc-font-bold tc-text-white tc-text-sm">IT Support & Bug Desk</span>
                </div>
                <span className="tc-badge-muted-pill">GitHub Issues</span>
              </div>
              <p className="tc-text-muted-xs tc-mb-3">
                Zero-friction technical reporting for engineering bugs and DevOps issues.
              </p>
              <div className="tc-flex-center-gap">
                <a
                  href={company.it_github_issues_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="tc-btn-subtle-edit tc-flex-1 tc-text-center"
                >
                  Open GitHub Issues
                </a>
                <a
                  href={company.it_slack_channel_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="tc-btn-subtle-edit tc-flex-1 tc-text-center"
                >
                  Slack #it-support
                </a>
              </div>
            </div>
          </div>
        </div>
      </Modal>
    </header>
  );
};
