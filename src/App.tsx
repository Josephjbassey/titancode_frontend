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
import { NotificationModal } from './components/NotificationModal';
import { Modal } from './components/Modal';
import { OtpInput } from './components/OtpInput';
import {
  api,
  MOCK_MEMBER_USER,
  MOCK_ADMIN_USER,
  MOCK_CEO_USER,
  MOCK_HR_USER,
  MOCK_MANAGER_USER,
  MOCK_CLIENT_USER,
  MOCK_APPLICANT_USER,
} from './services/api';
import type { User, UserRole } from './types';
import { Layers, Shield } from 'lucide-react';
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
  | 'incorrect_current_password'
  | 'confirm_password_otp'
  | 'incorrect_code_toast'
  | 'password_changed_success_toast';

export function App() {
  const [currentView, setCurrentView] = useState<ScreenId>('home');
  // Start unauthenticated — null means "not logged in".
  // Use MOCK_MEMBER_USER only as a fallback type reference, not as actual startup state.
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [settingsTab, setSettingsTab] = useState<'profile' | 'password' | 'notifications'>('profile');
  const [showPreviewBar, setShowPreviewBar] = useState(false);

  // Attempt session hydration on mount
  useEffect(() => {
    if (api.isAuthenticated()) {
      api.getCurrentUser()
        .then((user) => setCurrentUser(user))
        .catch(() => {
          api.logout();
          setCurrentUser(null);
        });
    }
  }, []);

  // Safe fallback user for preview navigator testing
  const activeUser: User = currentUser || MOCK_MEMBER_USER;

  // Interactive standalone modal previews for Screens 14, 15, 16
  const [standaloneOtp, setStandaloneOtp] = useState('12345');

  const screensList: { id: ScreenId; label: string; number: number }[] = [
    { id: 'home', label: 'Home (Hero, Offerings, Why Us, CTA)', number: 0 },
    { id: 'about_us', label: 'About Us (Story, Mission & Vision, Leadership)', number: 0 },
    { id: 'services', label: '17. Services (Full Marketing Page)', number: 17 },
    { id: 'hire_us', label: '18. Hire Us (Inquiry Form)', number: 18 },
    { id: 'contact_us', label: '19. Contact Us (Direct Reachout)', number: 19 },
    { id: 'faqs', label: '20. FAQs (Accordion Q&A)', number: 20 },
    { id: 'testimonials', label: '21. Testimonials (Client Reviews)', number: 21 },
    { id: 'application_form', label: '22. Member Application Form (Default)', number: 22 },
    { id: 'application_required', label: '23. Application Form (Required Error)', number: 23 },
    { id: 'application_email_exists', label: '24. Application Form (Email Exists Error)', number: 24 },
    { id: 'application_submitted', label: '25. Application Form (Submitted Modal)', number: 25 },
    { id: 'sign_in', label: '1. Sign In (Split Hero Carousel)', number: 1 },
    { id: 'sign_up', label: '2. Sign Up (Registration)', number: 2 },
    { id: 'qualification', label: '3. Role Qualification (Member vs Client)', number: 3 },
    { id: 'forgot_password_1', label: '4. Forgot Password 1 (Email)', number: 4 },
    { id: 'forgot_password_2', label: '5. Forgot Password 2 (4-Digit OTP)', number: 5 },
    { id: 'forgot_password_3', label: '6. Forgot Password 3 (Set Password)', number: 6 },
    { id: 'successful_password', label: '7. Successful Password (Confirmation)', number: 7 },
    { id: 'dashboard', label: '8. Team / Member Dashboard (KPIs, Tasks, Donut)', number: 8 },
    { id: 'manager_dashboard', label: '37. Dept Head / Lead Dashboard (All 17 Tech Depts)', number: 37 },
    { id: 'hr_dashboard', label: '38. HR Concierge (Inbound Leads & WhatsApp)', number: 38 },
    { id: 'ceo_dashboard', label: '39. CEO Executive & 70/30 Treasury Overview', number: 39 },
    { id: 'client_dashboard', label: '40. Client Portal (Milestones & Escrow)', number: 40 },
    { id: 'applicant_dashboard', label: '41. Applicant Status (Frames 17-20: Review, Approved, Rejected)', number: 41 },
    { id: 'clients', label: '9. Clients CRM (Metrics, Table, Inquiries)', number: 9 },
    { id: 'projects', label: '26. Projects Management (Escrow Payout, Subtasks)', number: 26 },
    { id: 'tasks', label: '27. Tasks & Kanban Board (Sprint Lifecycle)', number: 27 },
    { id: 'meetings', label: '28. Meetings Schedule (Upcoming/Live)', number: 28 },
    { id: 'meeting_room', label: '29. Live Meeting Room (WebRTC Video Grid & Chat)', number: 29 },
    { id: 'users_management', label: '30. Users Directory (Roles, Bank Details, Status)', number: 30 },
    { id: 'applications_management', label: '31. Applicants Tracking ATS (Review & Approve)', number: 31 },
    { id: 'departments', label: '32. Departments Hub (Heads, Active Projects)', number: 32 },
    { id: 'financials', label: '33. Financials & Wallet (Escrow Splits, Cashflow)', number: 33 },
    { id: 'revenue_products', label: '34. Revenue Products Telemetry (API Keys, MRR)', number: 34 },
    { id: 'client_request_project', label: '35. Client Request Project (Commissioning Form)', number: 35 },
    { id: 'system_settings', label: '36. System Settings (Commission, Currency, Webhooks)', number: 36 },
    { id: 'profile_settings', label: '10. Profile Settings (Sumsub KYC, Avatar)', number: 10 },
    { id: 'password_settings', label: '11. Password Settings (Status & Auth)', number: 11 },
    { id: 'change_password', label: '12. Change Password (Sessions Manager)', number: 12 },
    { id: 'incorrect_current_password', label: '13. Incorrect Current Password (Error State)', number: 13 },
    { id: 'confirm_password_otp', label: '14. Confirm Password Modal (5-Digit OTP)', number: 14 },
    { id: 'incorrect_code_toast', label: '15. Incorrect Code Modal (Solid Gold Alert)', number: 15 },
    { id: 'password_changed_success_toast', label: '16. Password Changed Successfully (Solid Gold Alert)', number: 16 },
  ];

  const handleRoleSelect = (role: UserRole) => {
    switch (role) {
      case 'Manager':
      case 'Team Lead':
      case 'Project Manager':
        setCurrentUser(MOCK_MANAGER_USER);
        setCurrentView('manager_dashboard');
        break;
      case 'HR':
        setCurrentUser(MOCK_HR_USER);
        setCurrentView('hr_dashboard');
        break;
      case 'CEO':
        setCurrentUser(MOCK_CEO_USER);
        setCurrentView('ceo_dashboard');
        break;
      case 'Client':
        setCurrentUser(MOCK_CLIENT_USER);
        setCurrentView('client_dashboard');
        break;
      case 'Applicant':
        setCurrentUser(MOCK_APPLICANT_USER);
        setCurrentView('applicant_dashboard');
        break;
      case 'Admin':
        setCurrentUser(MOCK_ADMIN_USER);
        break;
      default:
        setCurrentUser(MOCK_MEMBER_USER);
        setCurrentView('dashboard');
        break;
    }
  };

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
              onRoleChange={handleRoleSelect}
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
                const base = currentUser || MOCK_MEMBER_USER;
                setCurrentUser({ ...base, role });
                setCurrentView(role === 'Client' ? 'clients' : 'dashboard');
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

      {/* Screen 14 Standalone Modal Preview (Figma Confim Password.png) */}
      <Modal
        isOpen={currentView === 'confirm_password_otp'}
        onClose={() => setCurrentView('change_password')}
        title="Confirm Password"
        maxWidth="440px"
      >
        <div style={{ textAlign: 'center', padding: '10px 0' }}>
          <p style={{ fontSize: '13px', color: '#9CA3AF', lineHeight: '1.5', margin: '0 0 16px' }}>
            A 5-digit confirmation code has been sent to your email. Enter code to confirm your password.
          </p>
          <OtpInput
            length={5}
            value={standaloneOtp}
            onChange={setStandaloneOtp}
          />
          <div style={{ fontSize: '13px', color: '#9CA3AF', margin: '14px 0 20px' }}>
            Didn't get code?{' '}
            <button
              type="button"
              onClick={() => alert('Code resent')}
              style={{ background: 'none', border: 'none', color: '#dfae32', fontWeight: '600', cursor: 'pointer' }}
            >
              Resend code
            </button>
          </div>
          <button
            type="button"
            className="tc-btn tc-btn-primary"
            style={{ width: '100%', height: '46px', borderRadius: '9999px', fontSize: '15px' }}
            onClick={() => setCurrentView('password_changed_success_toast')}
          >
            Confirm
          </button>
        </div>
      </Modal>

      {/* Screen 15 Standalone Incorrect Code Modal Preview (Solid Gold Modal in Figma) */}
      <NotificationModal
        isOpen={currentView === 'incorrect_code_toast'}
        onClose={() => setCurrentView('change_password')}
        type="error"
        title="Incorrect Code"
        message="Your code is incorrect. Please, try again to confirm your password."
        actionText="Try Again"
        onAction={() => setCurrentView('confirm_password_otp')}
      />

      {/* Screen 16 Standalone Success Alert Modal Preview (Solid Gold Modal in Figma) */}
      <NotificationModal
        isOpen={currentView === 'password_changed_success_toast'}
        onClose={() => setCurrentView('password_settings')}
        type="success"
        title="Password Changed Successfully"
        message="Your password has been changed successfully"
        actionText="Back to Settings"
      />

      {/* FLOATING PILL SCREEN & ROLE SWITCHER (Collapsible for Testing) */}
      {!showPreviewBar ? (
        <button
          type="button"
          onClick={() => setShowPreviewBar(true)}
          style={{
            position: 'fixed',
            bottom: '18px',
            right: '18px',
            backgroundColor: '#161618',
            border: '1px solid rgba(223, 174, 50, 0.4)',
            color: '#dfae32',
            borderRadius: '9999px',
            padding: '8px 16px',
            fontSize: '12px',
            fontWeight: 700,
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            cursor: 'pointer',
            zIndex: 9999,
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.6)',
            transition: 'all 0.2s ease',
          }}
          title="Open screen selector for design review"
        >
          <Layers size={14} />
          <span>Figma Navigator</span>
        </button>
      ) : (
        <div className="tc-screen-switcher">
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--tc-brand-gold)' }}>
            <Layers size={16} />
            <span style={{ fontSize: '12px', fontWeight: '700' }}>Figma Preview:</span>
          </div>

          <select
            value={currentView}
            onChange={(e) => {
              const val = e.target.value as ScreenId;
              setCurrentView(val);
              if (val === 'profile_settings') setSettingsTab('profile');
              if (val === 'password_settings' || val === 'change_password' || val === 'incorrect_current_password') setSettingsTab('password');
            }}
            style={{ maxWidth: '300px' }}
          >
            {screensList.map((s) => (
              <option key={s.id} value={s.id}>
                {s.label}
              </option>
            ))}
          </select>

          <div style={{ height: '16px', width: '1px', backgroundColor: 'var(--tc-border-subtle)', margin: '0 4px' }} />

          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <Shield size={12} style={{ color: 'var(--tc-brand-gold)' }} />
            <select
              value={currentUser?.role ?? 'Member'}
              onChange={(e) => handleRoleSelect(e.target.value as UserRole)}
              style={{
                padding: '3px 8px',
                borderRadius: 'var(--tc-radius-sm)',
                backgroundColor: 'rgba(255, 255, 255, 0.08)',
                color: '#dfae32',
                fontSize: '11px',
                fontWeight: '700',
                border: '1px solid rgba(223, 174, 50, 0.3)',
                cursor: 'pointer',
                outline: 'none',
              }}
            >
              <option value="Member">Role: Member</option>
              <option value="Manager">Role: Manager / Lead</option>
              <option value="HR">Role: HR Concierge</option>
              <option value="CEO">Role: CEO / Exec</option>
              <option value="Client">Role: Client</option>
              <option value="Applicant">Role: Applicant</option>
              <option value="Admin">Role: Admin</option>
            </select>
          </div>

          <button
            type="button"
            onClick={() => setShowPreviewBar(false)}
            style={{
              background: 'none',
              border: 'none',
              color: '#9CA3AF',
              fontSize: '16px',
              cursor: 'pointer',
              padding: '0 4px',
              marginLeft: '4px',
              lineHeight: 1,
            }}
            title="Minimize preview navigator for testing"
          >
            ✕
          </button>
        </div>
      )}
    </div>
  );
}

export default App;
