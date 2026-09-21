import React, { useState, useEffect } from 'react';
import type { ScreenId } from '../../App';
import { AlertCircle, Check, ChevronDown } from 'lucide-react';

export type ApplicationState = 'default' | 'required' | 'email_exists' | 'submitted';

interface ApplicationFormViewProps {
  initialState?: ApplicationState;
  onNavigate: (view: ScreenId) => void;
}

export const ApplicationFormView: React.FC<ApplicationFormViewProps> = ({
  initialState = 'default',
  onNavigate: _onNavigate,
}) => {
  const [appState, setAppState] = useState<ApplicationState>(initialState);

  useEffect(() => {
    setAppState(initialState);
  }, [initialState]);

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: initialState === 'email_exists' ? 'Enter Email' : initialState === 'required' ? 'Enter Email' : '',
    phoneNumber: '1234567890',
    location: 'Lagos',
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.email.trim()) {
      setAppState('required');
      return;
    }
    if (formData.email.toLowerCase().includes('exists') || formData.email === 'test@titancode.com') {
      setAppState('email_exists');
      return;
    }
    setAppState('submitted');
  };

  return (
    <div style={{ backgroundColor: '#0b0b0c', color: '#FFFFFF', padding: '80px 40px 140px', position: 'relative' }}>
      <div style={{ maxWidth: '980px', margin: '0 auto' }}>
        {/* Header matching Figma */}
        <div style={{ textAlign: 'center', marginBottom: '70px' }}>
          <h1 style={{ fontSize: '42px', fontWeight: '800', marginBottom: '14px' }}>
            Fill in Your Details to <span style={{ color: '#dfae32' }}>Get Started</span>
          </h1>
          <p style={{ fontSize: '16px', color: '#9CA3AF' }}>
            Tell us a bit about yourself and the role you’re interested in.
          </p>
        </div>

        {/* Form Container */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
          {/* Row 1: First Name | Last Name */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '18px', fontWeight: '600', marginBottom: '12px', color: '#FFFFFF', fontFamily: "'Poppins', sans-serif" }}>
                First Name
              </label>
              <input
                type="text"
                placeholder="Enter Name"
                value={formData.firstName}
                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                style={{
                  width: '100%',
                  height: '56px',
                  backgroundColor: 'var(--tc-figma-black, #0B0B0C)',
                  border: '1px solid var(--tc-figma-input-border, #FFFFFF59)',
                  borderRadius: '8px',
                  color: '#FFFFFF',
                  padding: '0 20px',
                  fontSize: '15px',
                  outline: 'none',
                  transition: 'border-color 0.2s',
                  fontFamily: "'Poppins', sans-serif",
                }}
                onFocus={(e) => (e.target.style.borderColor = 'var(--tc-figma-gold, #DFAE32)')}
                onBlur={(e) => (e.target.style.borderColor = 'var(--tc-figma-input-border, #FFFFFF59)')}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '18px', fontWeight: '600', marginBottom: '12px', color: '#FFFFFF', fontFamily: "'Poppins', sans-serif" }}>
                Last Name
              </label>
              <input
                type="text"
                placeholder="Enter Name"
                value={formData.lastName}
                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                style={{
                  width: '100%',
                  height: '56px',
                  backgroundColor: 'var(--tc-figma-black, #0B0B0C)',
                  border: '1px solid var(--tc-figma-input-border, #FFFFFF59)',
                  borderRadius: '8px',
                  color: '#FFFFFF',
                  padding: '0 20px',
                  fontSize: '15px',
                  outline: 'none',
                  transition: 'border-color 0.2s',
                  fontFamily: "'Poppins', sans-serif",
                }}
                onFocus={(e) => (e.target.style.borderColor = 'var(--tc-figma-gold, #DFAE32)')}
                onBlur={(e) => (e.target.style.borderColor = 'var(--tc-figma-input-border, #FFFFFF59)')}
              />
            </div>
          </div>

          {/* Row 2: Email (with Required Error or Email Exists states matching Figma) */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
              <label style={{ fontSize: '18px', fontWeight: '600', color: '#FFFFFF', fontFamily: "'Poppins', sans-serif" }}>
                Email
              </label>
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
              style={{
                width: '100%',
                height: '56px',
                backgroundColor: 'var(--tc-figma-black, #0B0B0C)',
                border: (appState === 'required' || appState === 'email_exists') ? '1px solid #df0e0e' : '1px solid var(--tc-figma-input-border, #FFFFFF59)',
                borderRadius: '8px',
                color: (appState === 'required' || appState === 'email_exists') ? '#df0e0e' : '#FFFFFF',
                padding: '0 20px',
                fontSize: '15px',
                outline: 'none',
                transition: 'border-color 0.2s',
                fontFamily: "'Poppins', sans-serif",
              }}
              onFocus={(e) => (e.target.style.borderColor = (appState === 'required' || appState === 'email_exists') ? '#df0e0e' : 'var(--tc-figma-gold, #DFAE32)')}
              onBlur={(e) => (e.target.style.borderColor = (appState === 'required' || appState === 'email_exists') ? '#df0e0e' : 'var(--tc-figma-input-border, #FFFFFF59)')}
            />
            {appState === 'email_exists' && (
              <p style={{ color: '#df0e0e', fontSize: '14px', marginTop: '8px', fontWeight: '500' }}>
                Email already exist
              </p>
            )}
          </div>

          {/* Row 3: Phone Number */}
          <div>
            <label style={{ display: 'block', fontSize: '18px', fontWeight: '600', marginBottom: '12px', color: '#FFFFFF', fontFamily: "'Poppins', sans-serif" }}>
              Phone Number
            </label>
            <input
              type="text"
              placeholder="1234567890"
              value={formData.phoneNumber}
              onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
              style={{
                width: '100%',
                height: '56px',
                backgroundColor: 'var(--tc-figma-black, #0B0B0C)',
                border: '1px solid var(--tc-figma-input-border, #FFFFFF59)',
                borderRadius: '8px',
                color: '#FFFFFF',
                padding: '0 20px',
                fontSize: '15px',
                outline: 'none',
                transition: 'border-color 0.2s',
                fontFamily: "'Poppins', sans-serif",
              }}
              onFocus={(e) => (e.target.style.borderColor = 'var(--tc-figma-gold, #DFAE32)')}
              onBlur={(e) => (e.target.style.borderColor = 'var(--tc-figma-input-border, #FFFFFF59)')}
            />
          </div>

          {/* Row 4: Location */}
          <div>
            <label style={{ display: 'block', fontSize: '18px', fontWeight: '600', marginBottom: '12px', color: '#FFFFFF', fontFamily: "'Poppins', sans-serif" }}>
              Location
            </label>
            <input
              type="text"
              placeholder="Lagos"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              style={{
                width: '100%',
                height: '56px',
                backgroundColor: 'var(--tc-figma-black, #0B0B0C)',
                border: '1px solid var(--tc-figma-input-border, #FFFFFF59)',
                borderRadius: '8px',
                color: '#FFFFFF',
                padding: '0 20px',
                fontSize: '15px',
                outline: 'none',
                transition: 'border-color 0.2s',
                fontFamily: "'Poppins', sans-serif",
              }}
              onFocus={(e) => (e.target.style.borderColor = 'var(--tc-figma-gold, #DFAE32)')}
              onBlur={(e) => (e.target.style.borderColor = 'var(--tc-figma-input-border, #FFFFFF59)')}
            />
          </div>

          {/* Row 5: Department */}
          <div style={{ position: 'relative' }}>
            <label style={{ display: 'block', fontSize: '18px', fontWeight: '600', marginBottom: '12px', color: '#FFFFFF', fontFamily: "'Poppins', sans-serif" }}>
              Department
            </label>
            <div
              onClick={() => setDepartmentOpen(!departmentOpen)}
              style={{
                width: '100%',
                height: '56px',
                backgroundColor: 'var(--tc-figma-black, #0B0B0C)',
                border: departmentOpen ? '1px solid var(--tc-figma-gold, #DFAE32)' : '1px solid var(--tc-figma-input-border, #FFFFFF59)',
                borderRadius: '8px',
                color: '#FFFFFF',
                padding: '0 20px',
                fontSize: '15px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                cursor: 'pointer',
                fontFamily: "'Poppins', sans-serif",
              }}
            >
              <span>{formData.department}</span>
              <ChevronDown
                size={18}
                color="#DFAE32"
                style={{
                  transform: departmentOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                  transition: 'transform 0.2s ease',
                }}
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
                    onClick={() => {
                      setFormData({ ...formData, department: dept });
                      setDepartmentOpen(false);
                    }}
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

          {/* Row 6: Linkedin */}
          <div>
            <label style={{ display: 'block', fontSize: '18px', fontWeight: '600', marginBottom: '12px', color: '#FFFFFF', fontFamily: "'Poppins', sans-serif" }}>
              Linkedin <span style={{ color: '#9CA3AF', fontWeight: '400', fontSize: '15px' }}>(compulsory)</span>
            </label>
            <input
              type="text"
              value={formData.linkedin}
              onChange={(e) => setFormData({ ...formData, linkedin: e.target.value })}
              style={{
                width: '100%',
                height: '56px',
                backgroundColor: 'var(--tc-figma-black, #0B0B0C)',
                border: '1px solid var(--tc-figma-input-border, #FFFFFF59)',
                borderRadius: '8px',
                color: '#FFFFFF',
                padding: '0 20px',
                fontSize: '15px',
                outline: 'none',
                transition: 'border-color 0.2s',
                fontFamily: "'Poppins', sans-serif",
              }}
              onFocus={(e) => (e.target.style.borderColor = 'var(--tc-figma-gold, #DFAE32)')}
              onBlur={(e) => (e.target.style.borderColor = 'var(--tc-figma-input-border, #FFFFFF59)')}
            />
          </div>

          {/* Row 7: Github */}
          <div>
            <label style={{ display: 'block', fontSize: '18px', fontWeight: '600', marginBottom: '12px', color: '#FFFFFF', fontFamily: "'Poppins', sans-serif" }}>
              Github
            </label>
            <input
              type="text"
              value={formData.github}
              onChange={(e) => setFormData({ ...formData, github: e.target.value })}
              style={{
                width: '100%',
                height: '56px',
                backgroundColor: 'var(--tc-figma-black, #0B0B0C)',
                border: '1px solid var(--tc-figma-input-border, #FFFFFF59)',
                borderRadius: '8px',
                color: '#FFFFFF',
                padding: '0 20px',
                fontSize: '15px',
                outline: 'none',
                transition: 'border-color 0.2s',
                fontFamily: "'Poppins', sans-serif",
              }}
              onFocus={(e) => (e.target.style.borderColor = 'var(--tc-figma-gold, #DFAE32)')}
              onBlur={(e) => (e.target.style.borderColor = 'var(--tc-figma-input-border, #FFFFFF59)')}
            />
          </div>

          {/* Row 8: Tell Us About Yourself */}
          <div>
            <label style={{ display: 'block', fontSize: '18px', fontWeight: '600', marginBottom: '12px', color: '#FFFFFF', fontFamily: "'Poppins', sans-serif" }}>
              Tell Us About Yourself
            </label>
            <textarea
              rows={6}
              value={formData.about}
              onChange={(e) => setFormData({ ...formData, about: e.target.value })}
              style={{
                width: '100%',
                backgroundColor: 'var(--tc-figma-black, #0B0B0C)',
                border: '1px solid var(--tc-figma-input-border, #FFFFFF59)',
                borderRadius: '8px',
                color: '#FFFFFF',
                padding: '18px 20px',
                fontSize: '15px',
                lineHeight: '1.6',
                outline: 'none',
                resize: 'none',
                transition: 'border-color 0.2s',
                fontFamily: "'Poppins', sans-serif",
              }}
              onFocus={(e) => (e.target.style.borderColor = 'var(--tc-figma-gold, #DFAE32)')}
              onBlur={(e) => (e.target.style.borderColor = 'var(--tc-figma-input-border, #FFFFFF59)')}
            />
          </div>

          {/* Submit Button matching Figma */}
          <div style={{ textAlign: 'center', marginTop: '20px' }}>
            <button
              type="submit"
              style={{
                backgroundColor: 'var(--tc-figma-gold, #DFAE32)',
                color: '#0B0B0C',
                fontWeight: '700',
                fontSize: '16px',
                padding: '14px 64px',
                borderRadius: '8px',
                border: 'none',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                fontFamily: "'Poppins', sans-serif",
              }}
              onMouseOver={(e) => (e.currentTarget.style.backgroundColor = '#EEC147')}
              onMouseOut={(e) => (e.currentTarget.style.backgroundColor = '#DFAE32')}
            >
              Submit
            </button>
          </div>
        </form>
      </div>

      {/* MODAL POPUP: Submitted Application matching Figma Submitted Application.png (background: #FFFFFF1A, border: 1px solid #FFFFFF26) */}
      {appState === 'submitted' && (
        <div
          onClick={() => setAppState('default')}
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.75)',
            backdropFilter: 'blur(8px)',
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
            className="figma-card"
            style={{
              backgroundColor: 'var(--tc-figma-card-bg, #FFFFFF1A)',
              border: '1px solid var(--tc-figma-card-border, #FFFFFF26)',
              backdropFilter: 'blur(20px)',
              borderRadius: '24px',
              padding: '60px 48px',
              maxWidth: '560px',
              width: '100%',
              textAlign: 'center',
              boxShadow: '0 24px 60px rgba(0, 0, 0, 0.6)',
              animation: 'tcModalIn 0.25s ease-out',
              cursor: 'default',
            }}
          >
            {/* Circle with Checkmark Icon */}
            <div
              style={{
                width: '84px',
                height: '84px',
                borderRadius: '50%',
                backgroundColor: 'var(--tc-figma-gold, #DFAE32)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 28px',
              }}
            >
              <Check size={44} color="#0B0B0C" strokeWidth={3} />
            </div>

            {/* Heading */}
            <h2
              style={{
                fontSize: '32px',
                fontWeight: '800',
                color: '#FFFFFF',
                marginBottom: '16px',
                letterSpacing: '-0.5px',
                fontFamily: "'Inter', sans-serif",
              }}
            >
              Application Submitted
            </h2>

            {/* Message */}
            <p
              style={{
                fontSize: '16px',
                color: '#E5E7EB',
                lineHeight: '1.6',
                maxWidth: '440px',
                margin: '0 auto 28px',
                fontWeight: '400',
                fontFamily: "'Poppins', sans-serif",
              }}
            >
              Thank you for applying! We have received your application and we will be in touch soon.
            </p>

            <button
              onClick={() => setAppState('default')}
              style={{
                backgroundColor: 'var(--tc-figma-gold, #DFAE32)',
                color: '#0B0B0C',
                border: 'none',
                borderRadius: '8px',
                padding: '12px 36px',
                fontSize: '15px',
                fontWeight: '700',
                cursor: 'pointer',
                fontFamily: "'Poppins', sans-serif",
              }}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
