import { useState } from 'react';
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
import { NotificationModal } from './components/NotificationModal';
import { Modal } from './components/Modal';
import { OtpInput } from './components/OtpInput';
import { MOCK_MEMBER_USER, MOCK_ADMIN_USER } from './services/api';
import type { User } from './types';
import { Layers, Shield } from 'lucide-react';
import './App.css';

export type ScreenId =
  | 'sign_in'
  | 'sign_up'
  | 'qualification'
  | 'forgot_password_1'
  | 'forgot_password_2'
  | 'forgot_password_3'
  | 'successful_password'
  | 'dashboard'
  | 'clients'
  | 'profile_settings'
  | 'password_settings'
  | 'change_password'
  | 'incorrect_current_password'
  | 'confirm_password_otp'
  | 'incorrect_code_toast'
  | 'password_changed_success_toast'
  | 'services'
  | 'hire_us'
  | 'contact_us'
  | 'faqs'
  | 'testimonials'
  | 'application_form'
  | 'application_required'
  | 'application_email_exists'
  | 'application_submitted';

export function App() {
  const [currentView, setCurrentView] = useState<ScreenId>('services');
  const [currentUser, setCurrentUser] = useState<User>(MOCK_MEMBER_USER);
  const [settingsTab, setSettingsTab] = useState<'profile' | 'password' | 'notifications'>('profile');

  // Interactive standalone modal previews for Screens 14, 15, 16
  const [standaloneOtp, setStandaloneOtp] = useState('12345');

  const screensList: { id: ScreenId; label: string; number: number }[] = [
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
    { id: 'clients', label: '9. Clients CRM (Metrics, Table, Inquiries)', number: 9 },
    { id: 'profile_settings', label: '10. Profile Settings (Sumsub KYC, Avatar)', number: 10 },
    { id: 'password_settings', label: '11. Password Settings (Status & Auth)', number: 11 },
    { id: 'change_password', label: '12. Change Password (Sessions Manager)', number: 12 },
    { id: 'incorrect_current_password', label: '13. Incorrect Current Password (Error State)', number: 13 },
    { id: 'confirm_password_otp', label: '14. Confirm Password Modal (5-Digit OTP)', number: 14 },
    { id: 'incorrect_code_toast', label: '15. Incorrect Code Modal (Solid Gold Alert)', number: 15 },
    { id: 'password_changed_success_toast', label: '16. Password Changed Successfully (Solid Gold Alert)', number: 16 },
  ];

  const handleRoleToggle = () => {
    if (currentUser.role === 'Member') {
      setCurrentUser(MOCK_ADMIN_USER);
    } else {
      setCurrentUser(MOCK_MEMBER_USER);
    }
  };

  // Determine view group
  const isWorkspaceView = [
    'dashboard',
    'clients',
    'profile_settings',
    'password_settings',
    'change_password',
    'incorrect_current_password',
  ].includes(currentView);

  const isPublicView = [
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
        <PublicLayout currentView={currentView} onNavigate={setCurrentView}>
          {currentView === 'services' && <ServicesView onNavigate={setCurrentView} />}
          {currentView === 'hire_us' && <HireUsView onNavigate={setCurrentView} />}
          {currentView === 'contact_us' && <ContactUsView onNavigate={setCurrentView} />}
          {currentView === 'faqs' && <FaqsView onNavigate={setCurrentView} />}
          {currentView === 'testimonials' && <TestimonialsView onNavigate={setCurrentView} />}
          {currentView === 'application_form' && (
            <ApplicationFormView initialState="default" onNavigate={setCurrentView} />
          )}
          {currentView === 'application_required' && (
            <ApplicationFormView initialState="required" onNavigate={setCurrentView} />
          )}
          {currentView === 'application_email_exists' && (
            <ApplicationFormView initialState="email_exists" onNavigate={setCurrentView} />
          )}
          {currentView === 'application_submitted' && (
            <ApplicationFormView initialState="submitted" onNavigate={setCurrentView} />
          )}
        </PublicLayout>
      ) : isWorkspaceView ? (
        /* 2. AUTHENTICATED WORKSPACE WITH SIDEBAR & HEADER */
        <div style={{ display: 'flex', width: '100%', minHeight: '100vh' }}>
          <Sidebar
            currentView={currentView}
            userRole={currentUser.role}
            onNavigate={(view) => {
              if (view === 'settings') {
                setCurrentView('profile_settings');
                setSettingsTab('profile');
              } else {
                setCurrentView(view as ScreenId);
              }
            }}
            onLogout={() => setCurrentView('sign_in')}
          />

          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
            <Header
              user={currentUser}
              onOpenProfile={() => {
                setCurrentView('profile_settings');
                setSettingsTab('profile');
              }}
              onOpenNotifications={() => {
                setCurrentView('profile_settings');
                setSettingsTab('notifications');
              }}
            />

            <main style={{ flex: 1, padding: '32px', overflowY: 'auto' }}>
              {currentView === 'dashboard' && <TeamDashboardView />}

              {currentView === 'clients' && <ClientsView />}

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
                      user={currentUser}
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
                setCurrentView(user.role === 'Admin' ? 'clients' : 'dashboard');
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
                setCurrentUser({ ...currentUser, role });
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
              style={{ background: 'none', border: 'none', color: '#E5A83B', fontWeight: '600', cursor: 'pointer' }}
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

      {/* FLOATING PILL SCREEN & ROLE SWITCHER */}
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

        <button
          type="button"
          onClick={handleRoleToggle}
          title="Toggle current user role between Member and Admin"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            padding: '3px 8px',
            borderRadius: 'var(--tc-radius-sm)',
            backgroundColor: currentUser.role === 'Admin' ? 'var(--tc-brand-gold-light)' : 'rgba(255, 255, 255, 0.08)',
            color: currentUser.role === 'Admin' ? 'var(--tc-brand-gold)' : '#FFFFFF',
            fontSize: '11px',
            fontWeight: '600',
            border: 'none',
            cursor: 'pointer',
          }}
        >
          <Shield size={12} />
          <span>{currentUser.role}</span>
        </button>
      </div>
    </div>
  );
}

export default App;
