import React from 'react';
import {
  LayoutDashboard,
  Users,
  FolderGit2,
  CheckSquare,
  Video,
  Settings,
  LogOut,
  UserCog,
  Wallet,
  FileText,
  Building2,
  Layers,
  Sliders,
  FolderPlus,
  Briefcase,
  ShieldAlert,
  X,
} from 'lucide-react';
import type { UserRole } from '../types';

interface SidebarProps {
  currentView: string;
  onNavigate: (view: string) => void;
  userRole?: UserRole;
  onLogout?: () => void;
  isOpen?: boolean;
  onClose?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentView,
  onNavigate,
  userRole = 'Member',
  onLogout,
  isOpen = false,
  onClose,
}) => {
  const memberNavItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'projects', label: 'Projects', icon: FolderGit2 },
    { id: 'tasks', label: 'My Task', icon: CheckSquare },
    { id: 'meetings', label: 'Meetings', icon: Video },
    { id: 'financials', label: 'My Wallet', icon: Wallet },
  ];

  const managerNavItems = [
    { id: 'manager_dashboard', label: 'Dept Dashboard', icon: LayoutDashboard },
    { id: 'projects', label: 'Projects', icon: FolderGit2 },
    { id: 'tasks', label: 'Sprint Tasks', icon: CheckSquare },
    { id: 'departments', label: 'Departments', icon: Building2 },
    { id: 'meetings', label: 'Meetings', icon: Video },
  ];

  const hrNavItems = [
    { id: 'hr_dashboard', label: 'HR Concierge', icon: Briefcase },
    { id: 'clients', label: 'Inbound Leads', icon: Users },
    { id: 'applications_management', label: 'Applications ATS', icon: FileText },
    { id: 'departments', label: 'Departments', icon: Building2 },
    { id: 'meetings', label: 'Meetings', icon: Video },
  ];

  const ceoAdminNavItems = [
    { id: 'ceo_dashboard', label: 'Executive Overview', icon: LayoutDashboard },
    { id: 'dashboard', label: 'Member View', icon: LayoutDashboard },
    { id: 'manager_dashboard', label: 'Dept Lead View', icon: Building2 },
    { id: 'hr_dashboard', label: 'HR Concierge', icon: Briefcase },
    { id: 'clients', label: 'Clients CRM', icon: Users },
    { id: 'projects', label: 'Projects Hub', icon: FolderGit2 },
    { id: 'tasks', label: 'All Tasks', icon: CheckSquare },
    { id: 'users_management', label: 'Staff Directory', icon: UserCog },
    { id: 'applications_management', label: 'Applications ATS', icon: FileText },
    { id: 'departments', label: 'Departments (17)', icon: Building2 },
    { id: 'financials', label: 'Financials Hub', icon: Wallet },
    { id: 'revenue_products', label: 'Products & Revenue', icon: Layers },
    { id: 'system_settings', label: 'System Settings', icon: Sliders },
  ];

  const clientNavItems = [
    { id: 'client_dashboard', label: 'Client Dashboard', icon: LayoutDashboard },
    { id: 'client_projects', label: 'My Projects', icon: FolderGit2 },
    { id: 'client_request_project', label: 'Request Project', icon: FolderPlus },
    { id: 'meetings', label: 'Meetings', icon: Video },
  ];

  const applicantNavItems = [
    { id: 'applicant_dashboard', label: 'Application Status', icon: ShieldAlert },
    { id: 'application_form', label: 'Edit Application', icon: FileText },
  ];

  const navItems =
    userRole === 'Admin' || userRole === 'CEO'
      ? ceoAdminNavItems
      : userRole === 'HR'
      ? hrNavItems
      : userRole === 'Manager' || userRole === 'Team Lead' || userRole === 'Project Manager'
      ? managerNavItems
      : userRole === 'Client'
      ? clientNavItems
      : userRole === 'Applicant'
      ? applicantNavItems
      : memberNavItems;

  const isSettingsActive =
    currentView === 'settings' ||
    currentView === 'profile_settings' ||
    currentView === 'password_settings' ||
    currentView === 'change_password';

  const handleNavigate = (view: string) => {
    if (onClose) onClose();
    onNavigate(view);
  };

  return (
    <>
      {/* Mobile overlay backdrop */}
      {isOpen && (
        <div
          className="tc-sidebar-overlay"
          onClick={onClose}
          aria-hidden="true"
        />
      )}
    <aside className={`tc-app-sidebar${isOpen ? ' tc-app-sidebar--open' : ''}`}>
      {/* Mobile close button */}
      <button
        type="button"
        className="tc-sidebar-close-btn"
        onClick={onClose}
        aria-label="Close navigation menu"
      >
        <X size={20} />
      </button>

      {/* Brand Logo Header (Figma 606:58) */}
      <div className="tc-sidebar-logo-header">
        <div
          className="tc-logo-crop tc-logo-crop--sidebar tc-cursor-pointer"
          role="img"
          aria-label="TitanCode"
          onClick={() => onNavigate(userRole === 'Admin' || userRole === 'CEO' ? 'ceo_dashboard' : 'dashboard')}
        >
          <img src="/assets/logo.png" alt="" />
        </div>
      </div>

      {/* Navigation Links */}
      <div className="tc-sidebar-nav-container">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentView === item.id;

          return (
            <div
              key={item.id}
              className="tc-sidebar-nav-wrapper"
            >
              {/* Figma Active Left Indicator Bar (Rectangle 256) */}
              {isActive && (
                <div className="tc-sidebar-active-indicator" />
              )}

              <button
                type="button"
                onClick={() => handleNavigate(item.id)}
                className={`tc-sidebar-nav-btn ${isActive ? 'tc-sidebar-nav-btn--active' : ''}`}
              >
                {/* Squircle Icon Container */}
                <div
                  className={`tc-sidebar-icon-box ${isActive ? 'tc-sidebar-icon-box--active' : ''}`}
                >
                  <Icon size={18} strokeWidth={isActive ? 2.5 : 1.8} />
                </div>
                <span className="tc-sidebar-nav-label">
                  {item.label}
                </span>
              </button>
            </div>
          );
        })}
      </div>

      {/* Bottom Nav: Settings & Log out (Figma 606:394 & 606:403) */}
      <div className="tc-sidebar-bottom-nav">
        {/* Settings button */}
        <div className="tc-relative">
          {isSettingsActive && (
            <div className="tc-sidebar-active-indicator tc-sidebar-active-indicator--settings" />
          )}
          <button
            type="button"
            onClick={() => handleNavigate('profile_settings')}
            className={`tc-sidebar-nav-btn ${isSettingsActive ? 'tc-sidebar-nav-btn--active' : ''}`}
          >
            <div
              className={`tc-sidebar-icon-box ${isSettingsActive ? 'tc-sidebar-icon-box--active' : ''}`}
            >
              <Settings size={18} strokeWidth={isSettingsActive ? 2.5 : 1.8} />
            </div>
            <span>Settings</span>
          </button>
        </div>

        {/* Log out button */}
        <button
          type="button"
          onClick={onLogout}
          className="tc-sidebar-logout-btn"
        >
          <div className="tc-sidebar-icon-box">
            <LogOut size={18} />
          </div>
          <span>Log out</span>
        </button>
      </div>
    </aside>
    </>
  );
};
