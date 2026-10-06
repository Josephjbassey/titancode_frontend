import React, { useState } from 'react';
import type { ScreenId } from '../../App';
import { AlertCircle, Check, ChevronDown, X, Loader2 } from 'lucide-react';
import '../../styles/public.css';
import { api } from '../../services/api';

export type ApplicationState = 'default' | 'required' | 'email_exists' | 'submitted';

interface ApplicationFormViewProps {
  initialState?: ApplicationState;
  onNavigate: (view: ScreenId) => void;
}

export const ApplicationFormView: React.FC<ApplicationFormViewProps> = ({
  initialState = 'default',
  onNavigate,
}) => {
  const [appState, setAppState] = useState<ApplicationState>(initialState);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    phoneNumber: '',
    location: '',
    department: 'UI/UX Design',
    linkedin: '',
    github: '',
    about: '',
  });

  const [departmentOpen, setDepartmentOpen] = useState(false);

  const departments = [
    'UI/UX Design',
    'Frontend Development',
    'Backend Development',
    'Mobile Development',
    'Product Management',
    'QA & Quality Engineering',
    'DevOps & Cloud',
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    if (!formData.firstName.trim() || !formData.lastName.trim() || !formData.email.trim()) {
      setAppState('required');
      return;
    }

    setIsSubmitting(true);
    setSubmitError('');
    try {
      await api.submitPublicApplication({
        first_name: formData.firstName.trim(),
        last_name: formData.lastName.trim(),
        email: formData.email.trim(),
        password: formData.password.trim() || undefined,
        phone_number: formData.phoneNumber.trim() || undefined,
        country: formData.location.trim() || undefined,
        department_name: formData.department,
        linkedin_url: formData.linkedin.trim() || undefined,
        github_url: formData.github.trim() || undefined,
        about: formData.about.trim() || undefined,
      });
      setAppState('submitted');
    } catch (err: any) {
      const msg = (err.message || '').toLowerCase();
      if (msg.includes('exists') || msg.includes('duplicate') || msg.includes('registered')) {
        setAppState('email_exists');
      } else {
        setSubmitError(err.message || 'Submission failed. Please check your information.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const isEmailError = appState === 'required' || appState === 'email_exists';

  return (
    <div className="tc-page-root tc-application-root">
      <div className="tc-application-container">
        {/* Header */}
        <div className="tc-section-header tc-application-header">
          <h1 className="tc-section-title tc-application-title">
            Fill in Your Details to <span className="tc-gold">Get Started</span>
          </h1>
          <p className="tc-body-text">
            Tell us a bit about yourself and the role you're interested in.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="tc-application-form">
          {/* Row 1: First Name | Last Name */}
          <div className="tc-form-grid-2col">
            <div>
              <label className="tc-form-label">First Name</label>
              <input
                type="text"
                placeholder="First Name (e.g. Alex)"
                value={formData.firstName}
                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                className="tc-rect-input"
              />
            </div>
            <div>
              <label className="tc-form-label">Last Name</label>
              <input
                type="text"
                placeholder="Last Name (e.g. Vance)"
                value={formData.lastName}
                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                className="tc-rect-input"
              />
            </div>
          </div>

          {/* Row 2: Email (with error states) */}
          <div>
            <div className="tc-app-label-row">
              <label className="tc-form-label tc-form-label--no-mb">Email</label>
              {appState === 'required' && (
                <div className="tc-email-error-badge">
                  <AlertCircle size={16} />
                  <span>Required</span>
                </div>
              )}
            </div>
            <input
              type="text"
              placeholder="alex.vance@example.com"
              value={formData.email}
              onChange={(e) => {
                setFormData({ ...formData, email: e.target.value });
                if (appState === 'required' || appState === 'email_exists') {
                  setAppState('default');
                }
              }}
              className={`tc-rect-input ${isEmailError ? 'tc-rect-input--error' : ''}`}
            />
            {appState === 'email_exists' && (
              <p className="tc-email-error-msg">
                Email already exist
              </p>
            )}
          </div>

          {/* Row 3: Phone Number */}
          <div>
            <label className="tc-form-label">Phone Number</label>
            <input
              type="text"
              placeholder="+234 801 234 5678"
              value={formData.phoneNumber}
              onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
              className="tc-rect-input"
            />
          </div>

          {/* Row 4: Location */}
          <div>
            <label className="tc-form-label">Location</label>
            <input
              type="text"
              placeholder="e.g. Accra, Ghana or Lagos, Nigeria"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              className="tc-rect-input"
            />
          </div>

          {/* Row 5: Department dropdown */}
          <div className="tc-dropdown-wrap">
            <label className="tc-form-label">Department</label>
            <div
              onClick={() => setDepartmentOpen(!departmentOpen)}
              className={`tc-rect-input tc-app-dept-trigger ${departmentOpen ? 'tc-app-dept-trigger--open' : ''}`}
            >
              <span>{formData.department}</span>
              <ChevronDown
                size={18}
                color="#DFAE32"
                className={`tc-dropdown-chevron ${departmentOpen ? 'tc-dropdown-chevron--open' : ''}`}
              />
            </div>

            {departmentOpen && (
              <div className="tc-app-dept-menu">
                {departments.map((dept) => (
                  <div
                    key={dept}
                    onClick={() => { setFormData({ ...formData, department: dept }); setDepartmentOpen(false); }}
                    className={`tc-app-dept-option ${formData.department === dept ? 'tc-app-dept-option--active' : ''}`}
                  >
                    {dept}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Row 6: LinkedIn */}
          <div>
            <label className="tc-form-label">
              Linkedin <span className="tc-field-hint">(compulsory)</span>
            </label>
            <input
              type="text"
              value={formData.linkedin}
              onChange={(e) => setFormData({ ...formData, linkedin: e.target.value })}
              className="tc-rect-input"
            />
          </div>

          {/* Row 7: Github */}
          <div>
            <label className="tc-form-label">Github</label>
            <input
              type="text"
              value={formData.github}
              onChange={(e) => setFormData({ ...formData, github: e.target.value })}
              className="tc-rect-input"
            />
          </div>

          {/* Row 8: Password for Status Tracking */}
          <div>
            <label className="tc-form-label">
              Create Password <span className="tc-field-hint">(set password to log in and track your application status)</span>
            </label>
            <input
              type="password"
              placeholder="••••••••"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className="tc-rect-input"
            />
          </div>

          {/* Row 9: About */}
          <div>
            <label className="tc-form-label">Tell Us About Yourself</label>
            <textarea
              rows={6}
              value={formData.about}
              onChange={(e) => setFormData({ ...formData, about: e.target.value })}
              className="tc-textarea tc-textarea--rounded8"
            />
          </div>

          {submitError && (
            <div className="tc-app-submit-error">
              {submitError}
            </div>
          )}

          {/* Submit */}
          <div className="tc-app-submit-wrap">
            <button
              type="submit"
              disabled={isSubmitting}
              className="tc-btn-gold tc-btn-gold--app-submit"
            >
              {isSubmitting && <Loader2 size={18} className="tc-spin" />}
              <span>{isSubmitting ? 'Submitting...' : 'Submit'}</span>
            </button>
          </div>
        </form>
      </div>

      {/* MODAL POPUP: Submitted Application */}
      {appState === 'submitted' && (
        <div
          onClick={() => setAppState('default')}
          className="tc-app-modal-backdrop"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="tc-app-modal-gold-card"
          >
            <button
              type="button"
              onClick={() => setAppState('default')}
              className="tc-app-modal-close-gold"
            >
              <X size={22} strokeWidth={2.5} />
            </button>

            <div className="tc-app-modal-icon-black">
              <Check size={46} color="#dfae32" strokeWidth={3} />
            </div>

            <h2 className="tc-app-modal-title">
              Application Submitted
            </h2>
            <p className="tc-app-modal-desc">
              Thank you for applying! Your candidate profile has been created and our team is actively reviewing your qualifications.
            </p>
            <div className="tc-app-modal-actions">
              <button
                type="button"
                onClick={() => onNavigate('applicant_dashboard')}
                className="tc-app-modal-btn-black"
              >
                Go to Candidate Dashboard →
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
