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

  const adminNavItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'clients', label: 'Clients CRM', icon: Users },
    { id: 'projects', label: 'Projects', icon: FolderGit2 },
    { id: 'tasks', label: 'Sprint Tasks', icon: CheckSquare },
    { id: 'meetings', label: 'Meetings', icon: Video },
    { id: 'users_management', label: 'Staff Directory', icon: UserCog },
    { id: 'applications_management', label: 'Applications', icon: FileText },
    { id: 'departments', label: 'Departments', icon: Building2 },
    { id: 'financials', label: 'Financials Hub', icon: Wallet },
    { id: 'revenue_products', label: 'Products & Revenue', icon: Layers },
    { id: 'system_settings', label: 'System Settings', icon: Sliders },
  ];

  const clientNavItems = [
    { id: 'client_projects', label: 'My Projects', icon: FolderGit2 },
    { id: 'client_request_project', label: 'Request Project', icon: FolderPlus },
    { id: 'meetings', label: 'Meetings', icon: Video },
  ];

  const navItems =
    userRole === 'Admin' || userRole === 'CEO'
      ? adminNavItems
      : userRole === 'Client'
      ? clientNavItems
      : memberNavItems;

  const isSettingsActive = 
    currentView === 'settings' ||
    currentView === 'profile_settings' ||
    currentView === 'password_settings' ||
    currentView === 'change_password';

  return (
    <aside style={{
      width: '240px',
      height: '100vh',
      backgroundColor: '#0E1118',
      borderRight: '1px solid rgba(255, 255, 255, 0.08)',
      display: 'flex',
      flexDirection: 'column',
      position: 'sticky',
      top: 0,
      zIndex: 40,
      flexShrink: 0,
    }}>
      {/* Brand Logo Header */}
      <div style={{
        height: '76px',
        padding: '0 24px',
        display: 'flex',
        alignItems: 'center',
      }}>
        <img
          src="/assets/tc_brand_logo.png"
          alt="TitanCode"
          style={{
            height: '28px',
            objectFit: 'contain',
          }}
        />
      </div>

      {/* Navigation Links */}
      <div style={{
        padding: '16px 14px',
        display: 'flex',
        flexDirection: 'column',
        gap: '6px',
        flex: 1,
      }}>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentView === item.id;

          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '10px 16px',
                borderRadius: '9999px',
                backgroundColor: isActive ? '#E5A83B' : 'transparent',
                color: isActive ? '#000000' : '#9CA3AF',
                fontWeight: isActive ? 700 : 500,
                fontSize: '14px',
                width: '100%',
                border: 'none',
                cursor: 'pointer',
                textAlign: 'left',
                transition: 'all 0.15s ease',
              }}
              onMouseEnter={(e) => {
                if (!isActive) {
                  e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.05)';
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
              <div style={{
                width: '24px',
                height: '24px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: isActive ? '#000000' : 'inherit',
              }}>
                <Icon size={18} strokeWidth={isActive ? 2.4 : 1.8} />
              </div>
              <span style={{ flex: 1 }}>{item.label}</span>
            </button>
          );
        })}
      </div>

      {/* Bottom Nav: Settings & Log out */}
      <div style={{
        padding: '16px 14px 24px',
        display: 'flex',
        flexDirection: 'column',
        gap: '6px',
      }}>
        {/* Settings button */}
        <button
          onClick={() => onNavigate('profile_settings')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            padding: '10px 16px',
            borderRadius: '9999px',
            backgroundColor: isSettingsActive ? '#E5A83B' : 'transparent',
            color: isSettingsActive ? '#000000' : '#9CA3AF',
            fontWeight: isSettingsActive ? 700 : 500,
            fontSize: '14px',
            width: '100%',
            border: 'none',
            cursor: 'pointer',
            textAlign: 'left',
            transition: 'all 0.15s ease',
          }}
          onMouseEnter={(e) => {
            if (!isSettingsActive) {
              e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.05)';
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
          <div style={{
            width: '24px',
            height: '24px',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <Settings size={18} strokeWidth={isSettingsActive ? 2.4 : 1.8} />
          </div>
          <span>Settings</span>
        </button>

        {/* Log out button */}
        <button
          onClick={onLogout}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            padding: '10px 16px',
            borderRadius: '9999px',
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
          <div style={{
            width: '24px',
            height: '24px',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <LogOut size={18} />
          </div>
          <span>Log out</span>
        </button>
      </div>
    </aside>
  );
};
