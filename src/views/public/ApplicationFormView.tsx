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
    <div style={{ backgroundColor: '#0B0E14', color: '#FFFFFF', padding: '80px 40px 140px', position: 'relative' }}>
      <div style={{ maxWidth: '980px', margin: '0 auto' }}>
        {/* Header matching Figma */}
        <div style={{ textAlign: 'center', marginBottom: '70px' }}>
          <h1 style={{ fontSize: '42px', fontWeight: '800', marginBottom: '14px' }}>
            Fill in Your Details to <span style={{ color: '#E5A83B' }}>Get Started</span>
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
              <label style={{ display: 'block', fontSize: '18px', fontWeight: '600', marginBottom: '12px', color: '#FFFFFF' }}>
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
                  backgroundColor: '#0B0E14',
                  border: '1px solid #73531D',
                  borderRadius: '8px',
                  color: '#FFFFFF',
                  padding: '0 20px',
                  fontSize: '15px',
                  outline: 'none',
                  transition: 'border-color 0.2s',
                }}
                onFocus={(e) => (e.target.style.borderColor = '#E5A83B')}
                onBlur={(e) => (e.target.style.borderColor = '#73531D')}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '18px', fontWeight: '600', marginBottom: '12px', color: '#FFFFFF' }}>
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
                  backgroundColor: '#0B0E14',
                  border: '1px solid #73531D',
                  borderRadius: '8px',
                  color: '#FFFFFF',
                  padding: '0 20px',
                  fontSize: '15px',
                  outline: 'none',
                  transition: 'border-color 0.2s',
                }}
                onFocus={(e) => (e.target.style.borderColor = '#E5A83B')}
                onBlur={(e) => (e.target.style.borderColor = '#73531D')}
              />
            </div>
          </div>

          {/* Row 2: Email (with Required Error or Email Exists states matching Figma) */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
              <label style={{ fontSize: '18px', fontWeight: '600', color: '#FFFFFF' }}>
                Email
              </label>
              {appState === 'required' && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#EF4444', fontSize: '14px', fontWeight: '500' }}>
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
                backgroundColor: '#0B0E14',
                border: (appState === 'required' || appState === 'email_exists') ? '1px solid #EF4444' : '1px solid #73531D',
                borderRadius: '8px',
                color: (appState === 'required' || appState === 'email_exists') ? '#EF4444' : '#FFFFFF',
                padding: '0 20px',
                fontSize: '15px',
                outline: 'none',
                transition: 'border-color 0.2s',
              }}
            />
            {appState === 'email_exists' && (
              <p style={{ color: '#EF4444', fontSize: '14px', marginTop: '8px' }}>
                Email already exist
              </p>
            )}
          </div>

          {/* Row 3: Phone Number */}
          <div>
            <label style={{ display: 'block', fontSize: '18px', fontWeight: '600', marginBottom: '12px', color: '#FFFFFF' }}>
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
                backgroundColor: '#0B0E14',
                border: '1px solid #73531D',
                borderRadius: '8px',
                color: '#FFFFFF',
                padding: '0 20px',
                fontSize: '15px',
                outline: 'none',
              }}
            />
          </div>

          {/* Row 4: Location */}
          <div>
            <label style={{ display: 'block', fontSize: '18px', fontWeight: '600', marginBottom: '12px', color: '#FFFFFF' }}>
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
                backgroundColor: '#0B0E14',
                border: '1px solid #73531D',
                borderRadius: '8px',
                color: '#FFFFFF',
                padding: '0 20px',
                fontSize: '15px',
                outline: 'none',
              }}
            />
          </div>

          {/* Row 5: Department */}
          <div style={{ position: 'relative' }}>
            <label style={{ display: 'block', fontSize: '18px', fontWeight: '600', marginBottom: '12px', color: '#FFFFFF' }}>
              Department
            </label>
            <div
              onClick={() => setDepartmentOpen(!departmentOpen)}
              style={{
                width: '100%',
                height: '56px',
                backgroundColor: '#0B0E14',
                border: '1px solid #73531D',
                borderRadius: '8px',
                color: '#FFFFFF',
                padding: '0 20px',
                fontSize: '15px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                cursor: 'pointer',
              }}
            >
              <span>{formData.department}</span>
              <ChevronDown size={18} color="#E5A83B" />
            </div>

            {departmentOpen && (
              <div
                style={{
                  position: 'absolute',
                  top: '90px',
                  left: 0,
                  right: 0,
                  backgroundColor: '#161922',
                  border: '1px solid #73531D',
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
                      color: formData.department === dept ? '#E5A83B' : '#FFFFFF',
                      fontWeight: formData.department === dept ? '600' : '400',
                      cursor: 'pointer',
                    }}
                    onMouseOver={(e) => (e.currentTarget.style.backgroundColor = 'rgba(229, 168, 59, 0.1)')}
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
            <label style={{ display: 'block', fontSize: '18px', fontWeight: '600', marginBottom: '12px', color: '#FFFFFF' }}>
              Linkedin <span style={{ color: '#9CA3AF', fontWeight: '400', fontSize: '15px' }}>(compulsory)</span>
            </label>
            <input
              type="text"
              value={formData.linkedin}
              onChange={(e) => setFormData({ ...formData, linkedin: e.target.value })}
              style={{
                width: '100%',
                height: '56px',
                backgroundColor: '#0B0E14',
                border: '1px solid #73531D',
                borderRadius: '8px',
                color: '#FFFFFF',
                padding: '0 20px',
                fontSize: '15px',
                outline: 'none',
              }}
            />
          </div>

          {/* Row 7: Github */}
          <div>
            <label style={{ display: 'block', fontSize: '18px', fontWeight: '600', marginBottom: '12px', color: '#FFFFFF' }}>
              Github
            </label>
            <input
              type="text"
              value={formData.github}
              onChange={(e) => setFormData({ ...formData, github: e.target.value })}
              style={{
                width: '100%',
                height: '56px',
                backgroundColor: '#0B0E14',
                border: '1px solid #73531D',
                borderRadius: '8px',
                color: '#FFFFFF',
                padding: '0 20px',
                fontSize: '15px',
                outline: 'none',
              }}
            />
          </div>

          {/* Row 8: Tell Us About Yourself */}
          <div>
            <label style={{ display: 'block', fontSize: '18px', fontWeight: '600', marginBottom: '12px', color: '#FFFFFF' }}>
              Tell Us About Yourself
            </label>
            <textarea
              rows={6}
              value={formData.about}
              onChange={(e) => setFormData({ ...formData, about: e.target.value })}
              style={{
                width: '100%',
                backgroundColor: '#0B0E14',
                border: '1px solid #73531D',
                borderRadius: '8px',
                color: '#FFFFFF',
                padding: '18px 20px',
                fontSize: '15px',
                lineHeight: '1.6',
                outline: 'none',
                resize: 'none',
              }}
            />
          </div>

          {/* Submit Button matching Figma */}
          <div style={{ textAlign: 'center', marginTop: '20px' }}>
            <button
              type="submit"
              style={{
                backgroundColor: '#E5A83B',
                color: '#0A0D14',
                fontWeight: '700',
                fontSize: '16px',
                padding: '14px 64px',
                borderRadius: '8px',
                border: 'none',
                cursor: 'pointer',
                boxShadow: '0 4px 14px rgba(229, 168, 59, 0.35)',
                transition: 'all 0.2s ease',
              }}
              onMouseOver={(e) => (e.currentTarget.style.backgroundColor = '#F4B333')}
              onMouseOut={(e) => (e.currentTarget.style.backgroundColor = '#E5A83B')}
            >
              Submit
            </button>
          </div>
        </form>
      </div>

      {/* MODAL POPUP: Submitted Application matching Figma Submitted Application.png */}
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
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              backgroundColor: '#E5A83B',
              borderRadius: '24px',
              padding: '60px 48px',
              maxWidth: '560px',
              width: '100%',
              textAlign: 'center',
              boxShadow: '0 24px 60px rgba(0, 0, 0, 0.6)',
              animation: 'tcModalIn 0.25s ease-out',
            }}
          >
            {/* Big Black Circle with Checkmark Icon */}
            <div
              style={{
                width: '90px',
                height: '90px',
                borderRadius: '50%',
                backgroundColor: '#0B0E14',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 30px',
              }}
            >
              <Check size={48} color="#E5A83B" strokeWidth={3.5} />
            </div>

            {/* Heading */}
            <h2
              style={{
                fontSize: '34px',
                fontWeight: '800',
                color: '#0B0E14',
                marginBottom: '16px',
                letterSpacing: '-0.5px',
              }}
            >
              Application Submitted
            </h2>

            {/* Message */}
            <p
              style={{
                fontSize: '16px',
                color: '#1A1E26',
                lineHeight: '1.6',
                maxWidth: '440px',
                margin: '0 auto 36px',
                fontWeight: '500',
              }}
            >
              Thank you for applying! We have received your application and we will be in touch soon.
            </p>

            <button
              type="button"
              onClick={() => setAppState('default')}
              style={{
                backgroundColor: '#0B0E14',
                color: '#FFFFFF',
                fontWeight: '700',
                fontSize: '15px',
                padding: '12px 36px',
                borderRadius: '8px',
                border: 'none',
                cursor: 'pointer',
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
