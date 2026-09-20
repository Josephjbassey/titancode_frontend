import React, { useState } from 'react';
import type { ScreenId } from '../../App';
import { CheckCircle2 } from 'lucide-react';

interface HireUsViewProps {
  onNavigate: (view: ScreenId) => void;
}

export const HireUsView: React.FC<HireUsViewProps> = ({ onNavigate: _onNavigate }) => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    companyName: '',
    projectType: '',
    phoneNumber: '',
    projectDescription: '',
  });

  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
    }, 4000);
  };

  return (
    <div style={{ backgroundColor: '#0B0E14', color: '#FFFFFF', paddingBottom: '120px' }}>
      {/* 1. HERO BANNER */}
      <section style={{ width: '100%', position: 'relative', overflow: 'hidden' }}>
        <img
          src="/assets/hire_us_hero_banner.png"
          alt="Hire Us"
          style={{ width: '100%', maxHeight: '580px', objectFit: 'cover', display: 'block' }}
        />
      </section>

      {/* 2. FORM SECTION */}
      <section style={{ maxWidth: '1040px', margin: '90px auto 0', padding: '0 40px', textAlign: 'center' }}>
        <h2 style={{ fontSize: '38px', fontWeight: '800', marginBottom: '16px' }}>
          What do you need <span style={{ color: '#E5A83B' }}>help with?</span>
        </h2>
        <p style={{ fontSize: '16px', color: '#9CA3AF', maxWidth: '600px', margin: '0 auto 60px', lineHeight: '1.6' }}>
          Provide the details so we can understand your need
        </p>

        {submitted && (
          <div
            style={{
              backgroundColor: 'rgba(16, 185, 129, 0.15)',
              border: '1px solid #10B981',
              color: '#10B981',
              padding: '16px 24px',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '10px',
              marginBottom: '30px',
              fontSize: '15px',
              fontWeight: '600',
            }}
          >
            <CheckCircle2 size={20} />
            <span>Thank you for reaching out! Our project team will review your inquiry and reply within 24 hours.</span>
          </div>
        )}

        {/* Form Container with Gold Edge Accents matching Figma */}
        <form onSubmit={handleSubmit}>
          <div
            style={{
              backgroundColor: '#14171D',
              border: '1px solid rgba(229, 168, 59, 0.35)',
              borderRadius: '24px',
              padding: '50px 48px',
              boxShadow: '0 16px 40px rgba(0, 0, 0, 0.5)',
              position: 'relative',
              textAlign: 'left',
            }}
          >
            {/* Grid Fields */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '24px' }}>
              <div>
                <input
                  type="text"
                  required
                  placeholder="Full Name"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  style={{
                    width: '100%',
                    height: '56px',
                    borderRadius: '9999px',
                    backgroundColor: '#20242D',
                    border: '1px solid transparent',
                    color: '#FFFFFF',
                    padding: '0 26px',
                    fontSize: '15px',
                    outline: 'none',
                    transition: 'border-color 0.2s',
                  }}
                  onFocus={(e) => (e.target.style.borderColor = '#E5A83B')}
                  onBlur={(e) => (e.target.style.borderColor = 'transparent')}
                />
              </div>

              <div>
                <input
                  type="email"
                  required
                  placeholder="Email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  style={{
                    width: '100%',
                    height: '56px',
                    borderRadius: '9999px',
                    backgroundColor: '#20242D',
                    border: '1px solid transparent',
                    color: '#FFFFFF',
                    padding: '0 26px',
                    fontSize: '15px',
                    outline: 'none',
                    transition: 'border-color 0.2s',
                  }}
                  onFocus={(e) => (e.target.style.borderColor = '#E5A83B')}
                  onBlur={(e) => (e.target.style.borderColor = 'transparent')}
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '24px' }}>
              <div>
                <input
                  type="text"
                  placeholder="Company Name"
                  value={formData.companyName}
                  onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                  style={{
                    width: '100%',
                    height: '56px',
                    borderRadius: '9999px',
                    backgroundColor: '#20242D',
                    border: '1px solid transparent',
                    color: '#FFFFFF',
                    padding: '0 26px',
                    fontSize: '15px',
                    outline: 'none',
                    transition: 'border-color 0.2s',
                  }}
                  onFocus={(e) => (e.target.style.borderColor = '#E5A83B')}
                  onBlur={(e) => (e.target.style.borderColor = 'transparent')}
                />
              </div>

              <div>
                <input
                  type="text"
                  placeholder="Project Type"
                  value={formData.projectType}
                  onChange={(e) => setFormData({ ...formData, projectType: e.target.value })}
                  style={{
                    width: '100%',
                    height: '56px',
                    borderRadius: '9999px',
                    backgroundColor: '#20242D',
                    border: '1px solid transparent',
                    color: '#FFFFFF',
                    padding: '0 26px',
                    fontSize: '15px',
                    outline: 'none',
                    transition: 'border-color 0.2s',
                  }}
                  onFocus={(e) => (e.target.style.borderColor = '#E5A83B')}
                  onBlur={(e) => (e.target.style.borderColor = 'transparent')}
                />
              </div>
            </div>

            <div style={{ marginBottom: '24px' }}>
              <input
                type="tel"
                placeholder="Phone Number"
                value={formData.phoneNumber}
                onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                style={{
                  width: '100%',
                  height: '56px',
                  borderRadius: '9999px',
                  backgroundColor: '#20242D',
                  border: '1px solid transparent',
                  color: '#FFFFFF',
                  padding: '0 26px',
                  fontSize: '15px',
                  outline: 'none',
                  transition: 'border-color 0.2s',
                }}
                onFocus={(e) => (e.target.style.borderColor = '#E5A83B')}
                onBlur={(e) => (e.target.style.borderColor = 'transparent')}
              />
            </div>

            <div>
              <textarea
                rows={6}
                required
                placeholder="Project Description"
                value={formData.projectDescription}
                onChange={(e) => setFormData({ ...formData, projectDescription: e.target.value })}
                style={{
                  width: '100%',
                  borderRadius: '20px',
                  backgroundColor: '#20242D',
                  border: '1px solid transparent',
                  color: '#FFFFFF',
                  padding: '22px 26px',
                  fontSize: '15px',
                  lineHeight: '1.6',
                  outline: 'none',
                  resize: 'none',
                  transition: 'border-color 0.2s',
                }}
                onFocus={(e) => (e.target.style.borderColor = '#E5A83B')}
                onBlur={(e) => (e.target.style.borderColor = 'transparent')}
              />
            </div>
          </div>

          {/* Centered Submit button */}
          <div style={{ marginTop: '40px', textAlign: 'center' }}>
            <button
              type="submit"
              style={{
                backgroundColor: '#E5A83B',
                color: '#0A0D14',
                fontWeight: '700',
                fontSize: '16px',
                padding: '14px 60px',
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
      </section>
    </div>
  );
};
