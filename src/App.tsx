import { useState, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { PublicLayout } from './components/PublicLayout';
import { SignInView } from './views/SignInView';
import { SignUpView } from './views/SignUpView';
import { QualificationView } from './views/QualificationView';
import { ForgotPasswordWizard } from './views/ForgotPasswordWizard';
import { TeamDashboardView } from './views/TeamDashboardView';
import { ClientsView } from './views/ClientsView';
import { SettingsLayout } from './views/SettingsLayout';
import { ProfileSettingsView } from './views/ProfileSettingsView';
import { PasswordSettingsView } from './views/PasswordSettingsView';
import { ChangePasswordView } from './views/ChangePasswordView';
import { ServicesView } from './views/public/ServicesView';
import { HireUsView } from './views/public/HireUsView';
import { ContactUsView } from './views/public/ContactUsView';
import { FaqsView } from './views/public/FaqsView';
import { TestimonialsView } from './views/public/TestimonialsView';
import { ApplicationFormView } from './views/public/ApplicationFormView';
import { HomepageView } from './views/public/HomepageView';
import { AboutUsView } from './views/public/AboutUsView';
import { ProjectsView } from './views/ProjectsView';
import { TasksView } from './views/TasksView';
import { MeetingsView } from './views/MeetingsView';
import { LiveMeetingRoomView } from './views/LiveMeetingRoomView';
import { UsersManagementView } from './views/UsersManagementView';
import { ApplicationsManagementView } from './views/ApplicationsManagementView';
import { DepartmentsView } from './views/DepartmentsView';
import { FinancialsView } from './views/FinancialsView';
import { RevenueProductsView } from './views/RevenueProductsView';
import { ClientRequestProjectView } from './views/ClientRequestProjectView';
import { SystemSettingsView } from './views/SystemSettingsView';
import { HrDashboardView } from './views/HrDashboardView';
import { ManagerDashboardView } from './views/ManagerDashboardView';
import { CeoDashboardView } from './views/CeoDashboardView';
import { ClientDashboardView } from './views/ClientDashboardView';
import { ApplicantDashboardView } from './views/ApplicantDashboardView';
import { api } from './services/api';
import type { User } from './types';
import './App.css';

export type ScreenId =
  | 'home'
  | 'about_us'
  | 'services'
  | 'hire_us'
  | 'contact_us'
  | 'faqs'
  | 'testimonials'
  | 'application_form'
  | 'application_required'
  | 'application_email_exists'
  | 'application_submitted'
  | 'sign_in'
  | 'sign_up'
  | 'qualification'
  | 'forgot_password_1'
  | 'forgot_password_2'
  | 'forgot_password_3'
  | 'successful_password'
  | 'dashboard'
  | 'manager_dashboard'
  | 'hr_dashboard'
  | 'ceo_dashboard'
  | 'client_dashboard'
  | 'applicant_dashboard'
  | 'clients'
  | 'projects'
  | 'tasks'
  | 'meetings'
  | 'meeting_room'
  | 'users_management'
  | 'applications_management'
  | 'departments'
  | 'financials'
  | 'revenue_products'
  | 'client_request_project'
  | 'client_projects'
  | 'system_settings'
  | 'profile_settings'
  | 'password_settings'
  | 'change_password'
  | 'incorrect_current_password';

const fallbackUser: User = {
  id: 0,
  email: '',
  full_name: 'Team Member',
  first_name: 'Team',
  last_name: 'Member',
  role: 'Member',
  status: 'active',
  department_id: 1,
  department_name: 'Engineering',
  created_at: new Date().toISOString(),
};

export function App() {
  const [currentView, setCurrentView] = useState<ScreenId>('home');
  const [currentUser, setCurrentUser] = useState<User | null>(() => api.getActiveUser());
  const [settingsTab, setSettingsTab] = useState<'profile' | 'password' | 'notifications'>('profile');

  // Attempt session hydration on mount
  useEffect(() => {
    if (api.isAuthenticated()) {
      api.getCurrentUser()
        .then((user) => {
          setCurrentUser(user);
          api.saveActiveUser(user);
        })
        .catch(() => {
          api.logout();
          setCurrentUser(null);
        });
    }
  }, []);

  const activeUser: User = currentUser || fallbackUser;

  // Determine view group
  const isWorkspaceView = [
    'dashboard',
    'manager_dashboard',
    'hr_dashboard',
    'ceo_dashboard',
    'client_dashboard',
    'applicant_dashboard',
    'clients',
    'projects',
    'tasks',
    'meetings',
    'meeting_room',
    'users_management',
    'applications_management',
    'departments',
    'financials',
    'revenue_products',
    'client_request_project',
    'client_projects',
    'system_settings',
    'profile_settings',
    'password_settings',
    'change_password',
    'incorrect_current_password',
  ].includes(currentView);

  const isPublicView = [
    'home',
    'about_us',
    'services',
    'hire_us',
    'contact_us',
    'faqs',
    'testimonials',
    'application_form',
    'application_required',
    'application_email_exists',
    'application_submitted',
  ].includes(currentView);

  return (
    <div className="tc-app-container">
      {/* 1. PUBLIC MARKETING & APPLICATION PAGES */}
      {isPublicView ? (
        currentView === 'home' ? (
          <HomepageView onNavigate={setCurrentView} />
        ) : (
        <PublicLayout currentView={currentView} onNavigate={setCurrentView}>
          {currentView === 'about_us' && <AboutUsView onNavigate={setCurrentView} />}
          {currentView === 'services' && <ServicesView onNavigate={setCurrentView} />}
          {currentView === 'hire_us' && <HireUsView onNavigate={setCurrentView} />}
          {currentView === 'contact_us' && <ContactUsView onNavigate={setCurrentView} />}
          {currentView === 'faqs' && <FaqsView onNavigate={setCurrentView} />}
          {currentView === 'testimonials' && <TestimonialsView onNavigate={setCurrentView} />}
          {currentView === 'application_form' && (
            <ApplicationFormView key={currentView} initialState="default" onNavigate={setCurrentView} />
          )}
          {currentView === 'application_required' && (
            <ApplicationFormView key={currentView} initialState="required" onNavigate={setCurrentView} />
          )}
          {currentView === 'application_email_exists' && (
            <ApplicationFormView key={currentView} initialState="email_exists" onNavigate={setCurrentView} />
          )}
          {currentView === 'application_submitted' && (
            <ApplicationFormView key={currentView} initialState="submitted" onNavigate={setCurrentView} />
          )}
        </PublicLayout>
        )
      ) : isWorkspaceView ? (
        /* 2. AUTHENTICATED WORKSPACE WITH SIDEBAR & HEADER */
        <div style={{ display: 'flex', width: '100%', minHeight: '100vh' }}>
          <Sidebar
            currentView={currentView}
            userRole={activeUser.role}
            onNavigate={(view) => {
              if (view === 'settings') {
                setCurrentView('profile_settings');
                setSettingsTab('profile');
              } else {
                setCurrentView(view as ScreenId);
              }
            }}
            onLogout={() => {
              api.logout();
              setCurrentUser(null);
              setCurrentView('sign_in');
            }}
          />

          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
            <Header
              user={activeUser}
              onOpenProfile={() => {
                setCurrentView('profile_settings');
                setSettingsTab('profile');
              }}
              onOpenNotifications={() => {
                setCurrentView('profile_settings');
                setSettingsTab('notifications');
              }}
            />

            <main className="tc-workspace-main" style={{ flex: 1, padding: '32px', overflowY: 'auto' }}>
              {currentView === 'dashboard' && <TeamDashboardView onNavigate={setCurrentView} />}

              {currentView === 'manager_dashboard' && (
                <ManagerDashboardView onNavigate={setCurrentView} />
              )}

              {currentView === 'hr_dashboard' && (
                <HrDashboardView onNavigate={setCurrentView} />
              )}

              {currentView === 'ceo_dashboard' && (
                <CeoDashboardView onNavigate={setCurrentView} />
              )}

              {currentView === 'client_dashboard' && (
                <ClientDashboardView onNavigate={setCurrentView} />
              )}

              {currentView === 'applicant_dashboard' && (
                <ApplicantDashboardView onNavigate={setCurrentView} />
              )}

              {currentView === 'clients' && <ClientsView />}

              {currentView === 'projects' && <ProjectsView onNavigate={setCurrentView} />}

              {currentView === 'tasks' && <TasksView onNavigate={setCurrentView} />}

              {currentView === 'meetings' && (
                <MeetingsView
                  onNavigate={setCurrentView}
                  onJoinRoom={() => setCurrentView('meeting_room')}
                />
              )}

              {currentView === 'meeting_room' && (
                <LiveMeetingRoomView onLeave={() => setCurrentView('meetings')} />
              )}

              {currentView === 'users_management' && (
                <UsersManagementView onNavigate={setCurrentView} />
              )}

              {currentView === 'applications_management' && (
                <ApplicationsManagementView onNavigate={setCurrentView} />
              )}

              {currentView === 'departments' && <DepartmentsView onNavigate={setCurrentView} />}

              {currentView === 'financials' && <FinancialsView onNavigate={setCurrentView} />}

              {currentView === 'revenue_products' && (
                <RevenueProductsView onNavigate={setCurrentView} />
              )}

              {(currentView === 'client_request_project' || currentView === 'client_projects') && (
                <ClientRequestProjectView onNavigate={setCurrentView} />
              )}

              {currentView === 'system_settings' && (
                <SystemSettingsView onNavigate={setCurrentView} />
              )}

              {(currentView === 'profile_settings' || currentView === 'password_settings') && (
                <SettingsLayout
                  activeTab={settingsTab}
                  onTabChange={(tab) => {
                    setSettingsTab(tab);
                    setCurrentView(tab === 'profile' ? 'profile_settings' : 'password_settings');
                  }}
                >
                  {settingsTab === 'profile' ? (
                    <ProfileSettingsView
                      user={activeUser}
                      onUpdateUser={(u) => setCurrentUser(u)}
                    />
                  ) : (
                    <PasswordSettingsView
                      onNavigateChangePassword={() => setCurrentView('change_password')}
                    />
                  )}
                </SettingsLayout>
              )}

              {currentView === 'change_password' && (
                <SettingsLayout
                  activeTab="password"
                  onTabChange={(tab) => {
                    setSettingsTab(tab);
                    setCurrentView(tab === 'profile' ? 'profile_settings' : 'password_settings');
                  }}
                >
                  <ChangePasswordView
                    onBackToSettings={() => {
                      setCurrentView('password_settings');
                      setSettingsTab('password');
                    }}
                  />
                </SettingsLayout>
              )}

              {currentView === 'incorrect_current_password' && (
                <SettingsLayout
                  activeTab="password"
                  onTabChange={(tab) => {
                    setSettingsTab(tab);
                    setCurrentView(tab === 'profile' ? 'profile_settings' : 'password_settings');
                  }}
                >
                  <ChangePasswordView
                    initialShowError={true}
                    onBackToSettings={() => {
                      setCurrentView('password_settings');
                      setSettingsTab('password');
                    }}
                  />
                </SettingsLayout>
              )}
            </main>
          </div>
        </div>
      ) : (
        /* 3. STANDALONE AUTH & WIZARD VIEWS */
        <div style={{ width: '100%', minHeight: '100vh' }}>
          {currentView === 'sign_in' && (
            <SignInView
              onSuccess={(user) => {
                setCurrentUser(user);
                if (user.role === 'CEO') setCurrentView('ceo_dashboard');
                else if (user.role === 'Manager' || user.role === 'Team Lead' || user.role === 'Project Manager') setCurrentView('manager_dashboard');
                else if (user.role === 'HR') setCurrentView('hr_dashboard');
                else if (user.role === 'Client') setCurrentView('client_dashboard');
                else if (user.role === 'Applicant') setCurrentView('applicant_dashboard');
                else if (user.role === 'Admin') setCurrentView('clients');
                else setCurrentView('dashboard');
              }}
              onNavigateSignUp={() => setCurrentView('sign_up')}
              onNavigateForgotPassword={() => setCurrentView('forgot_password_1')}
              onNavigateQualification={() => setCurrentView('qualification')}
            />
          )}

          {currentView === 'sign_up' && (
            <SignUpView
              onSuccess={(user) => {
                setCurrentUser(user);
                setCurrentView('qualification');
              }}
              onNavigateSignIn={() => setCurrentView('sign_in')}
              onNavigateQualification={() => setCurrentView('qualification')}
            />
          )}

          {currentView === 'qualification' && (
            <QualificationView
              onSelectRole={(role) => {
                const base = currentUser || fallbackUser;
                const updated = { ...base, role };
                setCurrentUser(updated);
                api.saveActiveUser(updated);
                setCurrentView(role === 'Client' ? 'client_dashboard' : 'dashboard');
              }}
              onBack={() => setCurrentView('sign_in')}
            />
          )}

          {currentView === 'forgot_password_1' && (
            <ForgotPasswordWizard
              initialStep={1}
              onDone={() => setCurrentView('sign_in')}
              onBackToSignIn={() => setCurrentView('sign_in')}
            />
          )}

          {currentView === 'forgot_password_2' && (
            <ForgotPasswordWizard
              initialStep={2}
              onDone={() => setCurrentView('sign_in')}
              onBackToSignIn={() => setCurrentView('sign_in')}
            />
          )}

          {currentView === 'forgot_password_3' && (
            <ForgotPasswordWizard
              initialStep={3}
              onDone={() => setCurrentView('sign_in')}
              onBackToSignIn={() => setCurrentView('sign_in')}
            />
          )}

          {currentView === 'successful_password' && (
            <ForgotPasswordWizard
              initialStep={4}
              onDone={() => setCurrentView('sign_in')}
              onBackToSignIn={() => setCurrentView('sign_in')}
            />
          )}
        </div>
      )}

    </div>
  );
}

export default App;
