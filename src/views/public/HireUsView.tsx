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
    <div style={{ backgroundColor: 'var(--tc-figma-black, #0B0B0C)', color: '#FFFFFF', paddingBottom: '120px' }}>
      {/* 1. HERO BANNER */}
      <section style={{ width: '100%', position: 'relative', overflow: 'hidden' }}>
        <img
          src="/assets/hireushero_bg.jpg"
          alt="Hire Us"
          style={{ width: '100%', maxHeight: '580px', objectFit: 'cover', display: 'block' }}
        />
      </section>

      {/* 2. FORM SECTION */}
      <section style={{ maxWidth: '1280px', margin: '90px auto 0', padding: '0 40px', textAlign: 'center' }}>
        <h2 style={{ fontSize: '42px', fontWeight: '800', marginBottom: '16px', color: '#FFFFFF', fontFamily: "'Inter', sans-serif" }}>
          What do you need <span style={{ color: 'var(--tc-figma-gold, #DFAE32)' }}>help with?</span>
        </h2>
        <p style={{ fontSize: '16px', color: '#9CA3AF', maxWidth: '600px', margin: '0 auto 60px', lineHeight: '1.6', fontFamily: "'Poppins', sans-serif" }}>
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
              marginBottom: '40px',
              fontSize: '15px',
              fontWeight: '600',
            }}
          >
            <CheckCircle2 size={20} />
            <span>Thank you for reaching out! Our project team will review your inquiry and reply within 24 hours.</span>
          </div>
        )}

        {/* Form Inputs directly on #0B0B0C matching Figma Hire Us.png */}
        <form onSubmit={handleSubmit} style={{ maxWidth: '1200px', margin: '0 auto' }}>
          {/* Row 1: Full Name | Email */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px', marginBottom: '32px' }}>
            <div>
              <input
                type="text"
                required
                placeholder="Full Name"
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                style={{
                  width: '100%',
                  height: '64px',
                  borderRadius: '9999px',
                  backgroundColor: '#232324',
                  border: '1px solid #FFFFFF59',
                  color: '#FFFFFF',
                  padding: '0 32px',
                  fontSize: '16px',
                  outline: 'none',
                  transition: 'border-color 0.2s',
                }}
                onFocus={(e) => (e.target.style.borderColor = '#DFAE32')}
                onBlur={(e) => (e.target.style.borderColor = '#FFFFFF59')}
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
                  height: '64px',
                  borderRadius: '9999px',
                  backgroundColor: '#232324',
                  border: '1px solid #FFFFFF59',
                  color: '#FFFFFF',
                  padding: '0 32px',
                  fontSize: '16px',
                  outline: 'none',
                  transition: 'border-color 0.2s',
                }}
                onFocus={(e) => (e.target.style.borderColor = '#DFAE32')}
                onBlur={(e) => (e.target.style.borderColor = '#FFFFFF59')}
              />
            </div>
          </div>

          {/* Row 2: Company Name | Project Type */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px', marginBottom: '32px' }}>
            <div>
              <input
                type="text"
                placeholder="Company Name"
                value={formData.companyName}
                onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                style={{
                  width: '100%',
                  height: '64px',
                  borderRadius: '9999px',
                  backgroundColor: '#232324',
                  border: '1px solid #FFFFFF59',
                  color: '#FFFFFF',
                  padding: '0 32px',
                  fontSize: '16px',
                  outline: 'none',
                  transition: 'border-color 0.2s',
                }}
                onFocus={(e) => (e.target.style.borderColor = '#DFAE32')}
                onBlur={(e) => (e.target.style.borderColor = '#FFFFFF59')}
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
                  height: '64px',
                  borderRadius: '9999px',
                  backgroundColor: '#232324',
                  border: '1px solid #FFFFFF59',
                  color: '#FFFFFF',
                  padding: '0 32px',
                  fontSize: '16px',
                  outline: 'none',
                  transition: 'border-color 0.2s',
                }}
                onFocus={(e) => (e.target.style.borderColor = '#DFAE32')}
                onBlur={(e) => (e.target.style.borderColor = '#FFFFFF59')}
              />
            </div>
          </div>

          {/* Row 3: Phone Number */}
          <div style={{ marginBottom: '32px' }}>
            <input
              type="tel"
              placeholder="Phone Number"
              value={formData.phoneNumber}
              onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
              style={{
                width: '100%',
                height: '64px',
                borderRadius: '9999px',
                backgroundColor: '#232324',
                border: '1px solid #FFFFFF59',
                color: '#FFFFFF',
                padding: '0 32px',
                fontSize: '16px',
                outline: 'none',
                transition: 'border-color 0.2s',
              }}
              onFocus={(e) => (e.target.style.borderColor = '#DFAE32')}
              onBlur={(e) => (e.target.style.borderColor = '#FFFFFF59')}
            />
          </div>

          {/* Row 4: Project Description */}
          <div style={{ marginBottom: '48px' }}>
            <textarea
              rows={8}
              required
              placeholder="Project Description"
              value={formData.projectDescription}
              onChange={(e) => setFormData({ ...formData, projectDescription: e.target.value })}
              style={{
                width: '100%',
                borderRadius: '20px',
                backgroundColor: '#232324',
                border: '1px solid #FFFFFF59',
                color: '#FFFFFF',
                padding: '24px 32px',
                fontSize: '16px',
                lineHeight: '1.6',
                outline: 'none',
                resize: 'none',
                transition: 'border-color 0.2s',
              }}
              onFocus={(e) => (e.target.style.borderColor = '#DFAE32')}
              onBlur={(e) => (e.target.style.borderColor = '#FFFFFF59')}
            />
          </div>

          {/* Centered Submit button matching Figma */}
          <div style={{ textAlign: 'center' }}>
            <button
              type="submit"
              style={{
                backgroundColor: '#DFAE32',
                color: '#0B0B0C',
                fontWeight: '700',
                fontSize: '17px',
                width: '100%',
                maxWidth: '420px',
                height: '62px',
                borderRadius: '12px',
                border: 'none',
                cursor: 'pointer',
                transition: 'background-color 0.2s ease',
              }}
              onMouseOver={(e) => (e.currentTarget.style.backgroundColor = '#eec147')}
              onMouseOut={(e) => (e.currentTarget.style.backgroundColor = '#DFAE32')}
            >
              Submit
            </button>
          </div>
        </form>
      </section>
    </div>
  );
};
