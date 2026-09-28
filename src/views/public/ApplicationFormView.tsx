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
    <div className="tc-page-root" style={{ padding: '80px clamp(20px, 5vw, 80px) 140px', position: 'relative', width: '100%' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        {/* Header */}
        <div className="tc-section-header" style={{ marginBottom: '70px' }}>
          <h1 className="tc-section-title" style={{ fontSize: '42px', fontWeight: 800 }}>
            Fill in Your Details to <span className="tc-gold">Get Started</span>
          </h1>
          <p className="tc-body-text">
            Tell us a bit about yourself and the role you're interested in.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
          {/* Row 1: First Name | Last Name */}
          <div className="tc-form-grid-2col">
            <div>
              <label className="tc-form-label">First Name</label>
              <input
                type="text"
                placeholder="Enter Name"
                value={formData.firstName}
                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                className="tc-rect-input"
              />
            </div>
            <div>
              <label className="tc-form-label">Last Name</label>
              <input
                type="text"
                placeholder="Enter Name"
                value={formData.lastName}
                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                className="tc-rect-input"
              />
            </div>
          </div>

          {/* Row 2: Email (with error states) */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
              <label className="tc-form-label" style={{ marginBottom: 0 }}>Email</label>
              {appState === 'required' && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#df0e0e', fontSize: '14px', fontWeight: '600' }}>
                  <AlertCircle size={16} />
                  <span>Required</span>
                </div>
              )}
            </div>
            <input
              type="text"
              placeholder="Enter Email"
              value={formData.email}
              onChange={(e) => {
                setFormData({ ...formData, email: e.target.value });
                if (appState === 'required' || appState === 'email_exists') {
                  setAppState('default');
                }
              }}
              className="tc-rect-input"
              style={{
                border: isEmailError ? '1px solid #df0e0e' : undefined,
                color: isEmailError ? '#df0e0e' : undefined,
              }}
            />
            {appState === 'email_exists' && (
              <p style={{ color: '#df0e0e', fontSize: '14px', marginTop: '8px', fontWeight: '500' }}>
                Email already exist
              </p>
            )}
          </div>

          {/* Row 3: Phone Number */}
          <div>
            <label className="tc-form-label">Phone Number</label>
            <input
              type="text"
              placeholder="1234567890"
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
              placeholder="Lagos"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              className="tc-rect-input"
            />
          </div>

          {/* Row 5: Department dropdown */}
          <div style={{ position: 'relative' }}>
            <label className="tc-form-label">Department</label>
            <div
              onClick={() => setDepartmentOpen(!departmentOpen)}
              className="tc-rect-input"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                cursor: 'pointer',
                border: departmentOpen ? '1px solid var(--tc-figma-gold, #DFAE32)' : undefined,
              }}
            >
              <span>{formData.department}</span>
              <ChevronDown
                size={18}
                color="#DFAE32"
                style={{ transform: departmentOpen ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s ease' }}
              />
            </div>

            {departmentOpen && (
              <div
                style={{
                  position: 'absolute',
                  top: '90px',
                  left: 0,
                  right: 0,
                  backgroundColor: '#1E1E20',
                  border: '1px solid var(--tc-figma-input-border, #FFFFFF59)',
                  borderRadius: '8px',
                  padding: '8px 0',
                  zIndex: 20,
                  boxShadow: '0 12px 28px rgba(0, 0, 0, 0.6)',
                }}
              >
                {departments.map((dept) => (
                  <div
                    key={dept}
                    onClick={() => { setFormData({ ...formData, department: dept }); setDepartmentOpen(false); }}
                    style={{
                      padding: '10px 20px',
                      fontSize: '14px',
                      color: formData.department === dept ? '#DFAE32' : '#FFFFFF',
                      fontWeight: formData.department === dept ? '600' : '400',
                      cursor: 'pointer',
                      fontFamily: "'Poppins', sans-serif",
                    }}
                    onMouseOver={(e) => (e.currentTarget.style.backgroundColor = 'rgba(223, 174, 50, 0.15)')}
                    onMouseOut={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
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
              Linkedin <span style={{ color: '#9CA3AF', fontWeight: '400', fontSize: '15px' }}>(compulsory)</span>
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
              Create Password <span style={{ color: '#9CA3AF', fontWeight: '400', fontSize: '15px' }}>(set password to log in and track your application status)</span>
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
              className="tc-textarea"
              style={{ borderRadius: '8px', padding: '18px 20px' }}
            />
          </div>

          {submitError && (
            <div style={{
              padding: '12px 16px',
              borderRadius: '8px',
              backgroundColor: 'rgba(239, 68, 68, 0.12)',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              color: '#EF4444',
              fontSize: '14px',
              textAlign: 'center',
            }}>
              {submitError}
            </div>
          )}

          {/* Submit */}
          <div style={{ textAlign: 'center', marginTop: '20px' }}>
            <button
              type="submit"
              disabled={isSubmitting}
              className="tc-btn-gold"
              style={{
                padding: '14px 64px',
                fontSize: '16px',
                borderRadius: '8px',
                opacity: isSubmitting ? 0.7 : 1,
                cursor: isSubmitting ? 'not-allowed' : 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
              }}
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
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.75)',
            backdropFilter: 'blur(6px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
            padding: '20px',
            cursor: 'pointer',
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              backgroundColor: '#dfae32',
              borderRadius: '24px',
              padding: '60px 48px',
              maxWidth: '560px',
              width: '100%',
              textAlign: 'center',
              boxShadow: '0 24px 60px rgba(0, 0, 0, 0.6)',
              animation: 'tcModalIn 0.25s ease-out',
              cursor: 'default',
              position: 'relative',
            }}
          >
            <button
              type="button"
              onClick={() => setAppState('default')}
              style={{ position: 'absolute', top: '20px', right: '20px', background: 'none', border: 'none', color: '#000000', cursor: 'pointer', padding: '6px', display: 'flex' }}
            >
              <X size={22} strokeWidth={2.5} />
            </button>

            <div
              style={{
                width: '88px',
                height: '88px',
                borderRadius: '50%',
                backgroundColor: '#0b0b0c',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 28px',
              }}
            >
              <Check size={46} color="#dfae32" strokeWidth={3} />
            </div>

            <h2 style={{ fontSize: '32px', fontWeight: '800', color: '#000000', marginBottom: '16px', letterSpacing: '-0.5px', fontFamily: "'Inter', sans-serif" }}>
              Application Submitted
            </h2>
            <p style={{ fontSize: '16px', color: '#1F2937', lineHeight: '1.6', maxWidth: '460px', margin: '0 auto', fontWeight: '500', fontFamily: "'Poppins', sans-serif" }}>
              Thank you for applying! Your candidate profile has been created and our team is actively reviewing your qualifications.
            </p>
            <div style={{ marginTop: '28px' }}>
              <button
                type="button"
                onClick={() => onNavigate('applicant_dashboard')}
                style={{
                  padding: '14px 36px',
                  backgroundColor: '#0B0B0C',
                  color: '#DFAE32',
                  border: 'none',
                  borderRadius: '9999px',
                  fontWeight: '700',
                  fontSize: '15px',
                  cursor: 'pointer',
                  boxShadow: '0 8px 24px rgba(0,0,0,0.3)',
                }}
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
