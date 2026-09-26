import React, { useState } from 'react';
import type { ScreenId } from '../../App';
import { CheckCircle2, AlertCircle } from 'lucide-react';
import {
  HireUsCornerTopLeft,
  HireUsCornerTopRight,
  HireUsCornerBottomLeft,
  HireUsCornerBottomRight,
} from '../../components/common/CornerGradients';
import '../../styles/public.css';
import { api } from '../../services/api';

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
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    try {
      await api.submitHireUs({
        name: formData.fullName,
        email: formData.email,
        phone: formData.phoneNumber || undefined,
        company: formData.companyName || undefined,
        project_type: formData.projectType || undefined,
        description: formData.projectDescription,
      });
      setSubmitted(true);
      setFormData({ fullName: '', email: '', companyName: '', projectType: '', phoneNumber: '', projectDescription: '' });
      setTimeout(() => setSubmitted(false), 6000);
    } catch (err: any) {
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="tc-page-root" style={{ paddingBottom: '120px' }}>
      {/* 1. HERO BANNER — Figma: x:0, y:154, w:1440, h:463, no border-radius */}
      <section
        className="tc-subpage-hero"
        style={{ backgroundImage: 'url(/assets/hireushero_bg.jpg)' }}
      >
        <div className="tc-subpage-hero__content">
          <h1 className="tc-hero-title">
            Hire <span className="tc-gold">Us</span>
          </h1>
          <p className="tc-hero-subtitle">
            Tell us about yourself let's build something great together
          </p>
        </div>
      </section>

      {/* 2. FORM SECTION */}
      <section className="tc-section tc-section-inner" style={{ textAlign: 'center' }}>
        <h2 className="tc-section-title" style={{ marginTop: '90px' }}>
          What do you need <span className="tc-gold">help with?</span>
        </h2>
        <p className="tc-body-text" style={{ maxWidth: '600px', margin: '0 auto 60px' }}>
          Provide the details so we can understand your need
        </p>

        {submitted && (
          <div className="tc-form-success" style={{ justifyContent: 'center', marginBottom: '40px', fontSize: '15px' }}>
            <CheckCircle2 size={20} />
            <span>Thank you for reaching out! Our project team will review your inquiry and reply within 24 hours.</span>
          </div>
        )}

        {error && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', justifyContent: 'center', marginBottom: '24px', color: '#EF4444', fontSize: '14px' }}>
            <AlertCircle size={16} />
            <span>{error}</span>
          </div>
        )}

        {/* Form Container framed by exact Figma linear gradient SVG corner vectors */}
        <div className="tc-form-frame tc-form-frame--wide">
          <HireUsCornerTopLeft className="tc-corner-svg-tl" />
          <HireUsCornerTopRight className="tc-corner-svg-tr" />
          <HireUsCornerBottomLeft className="tc-corner-svg-bl" />
          <HireUsCornerBottomRight className="tc-corner-svg-br" />

          <form onSubmit={handleSubmit}>
            {/* Row 1: Full Name | Email */}
            <div className="tc-form-grid-2col tc-form-grid-2col--wide">
              <input
                type="text"
                required
                placeholder="Full Name"
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                className="tc-pill-input tc-pill-input--lg"
              />
              <input
                type="email"
                required
                placeholder="Email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="tc-pill-input tc-pill-input--lg"
              />
            </div>

            {/* Row 2: Company Name | Project Type */}
            <div className="tc-form-grid-2col tc-form-grid-2col--wide">
              <input
                type="text"
                placeholder="Company Name"
                value={formData.companyName}
                onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                className="tc-pill-input tc-pill-input--lg"
              />
              <input
                type="text"
                placeholder="Project Type"
                value={formData.projectType}
                onChange={(e) => setFormData({ ...formData, projectType: e.target.value })}
                className="tc-pill-input tc-pill-input--lg"
              />
            </div>

            {/* Row 3: Phone Number */}
            <div className="tc-form-row tc-form-row--lg">
              <input
                type="tel"
                placeholder="Phone Number"
                value={formData.phoneNumber}
                onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                className="tc-pill-input tc-pill-input--lg"
              />
            </div>

            {/* Row 4: Project Description */}
            <div className="tc-form-row tc-form-row--lg" style={{ marginBottom: '48px' }}>
              <textarea
                rows={8}
                required
                placeholder="Project Description"
                value={formData.projectDescription}
                onChange={(e) => setFormData({ ...formData, projectDescription: e.target.value })}
                className="tc-textarea tc-textarea--lg"
              />
            </div>

            {/* Submit */}
            <div style={{ textAlign: 'center' }}>
              <button type="submit" className="tc-btn-gold tc-btn-gold--full" disabled={isLoading} style={{ opacity: isLoading ? 0.7 : 1, cursor: isLoading ? 'not-allowed' : 'pointer' }}>
                {isLoading ? 'Submitting…' : 'Submit'}
              </button>
            </div>
          </form>
        </div>
      </section>
    </div>
  );
};
