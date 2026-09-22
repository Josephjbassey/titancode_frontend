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
} from 'lucide-react';
import type { UserRole } from '../types';

interface SidebarProps {
  currentView: string;
  onNavigate: (view: string) => void;
  userRole?: UserRole;
  onLogout?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentView,
  onNavigate,
  userRole = 'Member',
  onLogout,
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
    { id: 'departments', label: 'Departments (14)', icon: Building2 },
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

  return (
    <aside
      style={{
        width: '280px',
        height: '100vh',
        backgroundColor: '#0b0b0c',
        borderRight: '1px solid rgba(255, 255, 255, 0.08)',
        display: 'flex',
        flexDirection: 'column',
        position: 'sticky',
        top: 0,
        zIndex: 40,
        flexShrink: 0,
        overflowY: 'auto',
      }}
    >
      {/* Brand Logo Header (Figma 606:58) */}
      <div
        style={{
          height: '100px',
          padding: '0 28px',
          display: 'flex',
          alignItems: 'center',
          flexShrink: 0,
          borderBottom: '1px solid rgba(255, 255, 255, 0.04)',
        }}
      >
        <img
          src="/assets/logo.png"
          alt="TitanCode"
          style={{
            height: '32px',
            objectFit: 'contain',
          }}
        />
      </div>

      {/* Navigation Links */}
      <div
        style={{
          padding: '20px 0',
          display: 'flex',
          flexDirection: 'column',
          gap: '4px',
          flex: 1,
        }}
      >
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentView === item.id;

          return (
            <div
              key={item.id}
              style={{
                position: 'relative',
                padding: '0 16px',
              }}
            >
              {/* Figma Active Left Indicator Bar (Rectangle 256) */}
              {isActive && (
                <div
                  style={{
                    position: 'absolute',
                    left: 0,
                    top: '6px',
                    bottom: '6px',
                    width: '4px',
                    backgroundColor: '#dfae32',
                    borderRadius: '0 4px 4px 0',
                  }}
                />
              )}

              <button
                type="button"
                onClick={() => onNavigate(item.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '14px',
                  padding: '10px 14px',
                  borderRadius: '12px',
                  backgroundColor: isActive ? 'rgba(223, 174, 50, 0.12)' : 'transparent',
                  color: isActive ? '#FFFFFF' : '#9CA3AF',
                  fontWeight: isActive ? 600 : 500,
                  fontSize: '14px',
                  width: '100%',
                  border: 'none',
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'all 0.15s ease',
                }}
                onMouseEnter={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.04)';
                    e.currentTarget.style.color = '#FFFFFF';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.backgroundColor = 'transparent';
                    e.currentTarget.style.color = '#9CA3AF';
                  }
                }}
              >
                {/* Squircle Icon Container */}
                <div
                  style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '10px',
                    backgroundColor: isActive ? '#dfae32' : 'rgba(255, 255, 255, 0.05)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: isActive ? '#0b0b0c' : '#9CA3AF',
                    flexShrink: 0,
                    transition: 'all 0.15s ease',
                  }}
                >
                  <Icon size={18} strokeWidth={isActive ? 2.5 : 1.8} />
                </div>
                <span style={{ flex: 1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {item.label}
                </span>
              </button>
            </div>
          );
        })}
      </div>

      {/* Bottom Nav: Settings & Log out (Figma 606:394 & 606:403) */}
      <div
        style={{
          padding: '16px 16px 24px',
          display: 'flex',
          flexDirection: 'column',
          gap: '4px',
          borderTop: '1px solid rgba(255, 255, 255, 0.06)',
          flexShrink: 0,
        }}
      >
        {/* Settings button */}
        <div style={{ position: 'relative' }}>
          {isSettingsActive && (
            <div
              style={{
                position: 'absolute',
                left: '-16px',
                top: '6px',
                bottom: '6px',
                width: '4px',
                backgroundColor: '#dfae32',
                borderRadius: '0 4px 4px 0',
              }}
            />
          )}
          <button
            type="button"
            onClick={() => onNavigate('profile_settings')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '14px',
              padding: '10px 14px',
              borderRadius: '12px',
              backgroundColor: isSettingsActive ? 'rgba(223, 174, 50, 0.12)' : 'transparent',
              color: isSettingsActive ? '#FFFFFF' : '#9CA3AF',
              fontWeight: isSettingsActive ? 600 : 500,
              fontSize: '14px',
              width: '100%',
              border: 'none',
              cursor: 'pointer',
              textAlign: 'left',
              transition: 'all 0.15s ease',
            }}
            onMouseEnter={(e) => {
              if (!isSettingsActive) {
                e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.04)';
                e.currentTarget.style.color = '#FFFFFF';
              }
            }}
            onMouseLeave={(e) => {
              if (!isSettingsActive) {
                e.currentTarget.style.backgroundColor = 'transparent';
                e.currentTarget.style.color = '#9CA3AF';
              }
            }}
          >
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '10px',
                backgroundColor: isSettingsActive ? '#dfae32' : 'rgba(255, 255, 255, 0.05)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: isSettingsActive ? '#0b0b0c' : '#9CA3AF',
                flexShrink: 0,
              }}
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
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '14px',
            padding: '10px 14px',
            borderRadius: '12px',
            backgroundColor: 'transparent',
            color: '#9CA3AF',
            fontSize: '14px',
            fontWeight: 500,
            width: '100%',
            border: 'none',
            cursor: 'pointer',
            textAlign: 'left',
            transition: 'all 0.15s ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = 'rgba(239, 68, 68, 0.1)';
            e.currentTarget.style.color = '#EF4444';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'transparent';
            e.currentTarget.style.color = '#9CA3AF';
          }}
        >
          <div
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '10px',
              backgroundColor: 'rgba(255, 255, 255, 0.05)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#9CA3AF',
              flexShrink: 0,
            }}
          >
            <LogOut size={18} />
          </div>
          <span>Log out</span>
        </button>
      </div>
    </aside>
  );
};
