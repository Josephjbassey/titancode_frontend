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
    password: '',
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

      // If client provided a password, instantly activate and authenticate their client account
      if (formData.password.trim().length >= 6) {
        try {
          await api.register({
            full_name: formData.fullName.trim(),
            email: formData.email.trim(),
            password: formData.password,
            role: 'Client',
            phone_number: formData.phoneNumber || undefined,
          });
          await api.login(formData.email.trim(), formData.password);
          _onNavigate('client_dashboard');
          return;
        } catch (authErr) {
          console.warn('Auto-login after hire us inquiry failed:', authErr);
        }
      }

      setSubmitted(true);
      setFormData({ fullName: '', email: '', companyName: '', projectType: '', phoneNumber: '', projectDescription: '', password: '' });
      setTimeout(() => setSubmitted(false), 8000);
    } catch (err: any) {
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="tc-page-root tc-hireus-root">
      {/* 1. HERO BANNER — Figma: x:0, y:154, w:1440, h:463, no border-radius */}
      <section
        className="tc-subpage-hero tc-subpage-hero--hireus"
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
      <section className="tc-section tc-section-inner tc-section--center">
        <h2 className="tc-section-title tc-hireus-section-title">
          What do you need <span className="tc-gold">help with?</span>
        </h2>
        <p className="tc-body-text tc-hireus-desc">
          Provide the details so we can understand your need
        </p>

        {submitted && (
          <div className="tc-form-success tc-hireus-success">
            <div className="tc-hireus-success-row">
              <CheckCircle2 size={20} />
              <span>Thank you for reaching out! Our project team will review your inquiry and reply within 24 hours.</span>
            </div>
            <button
              type="button"
              onClick={() => _onNavigate('sign_in')}
              className="tc-hireus-portal-btn"
            >
              Sign In to Your Client Portal →
            </button>
          </div>
        )}

        {error && (
          <div className="tc-hireus-error-banner">
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

            {/* Row 3: Phone Number | Optional Password */}
            <div className="tc-form-grid-2col tc-form-grid-2col--wide">
              <input
                type="tel"
                placeholder="Phone Number"
                value={formData.phoneNumber}
                onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                className="tc-pill-input tc-pill-input--lg"
              />
              <input
                type="password"
                placeholder="Create Password (Optional — unlocks instant Client Portal)"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="tc-pill-input tc-pill-input--lg"
              />
            </div>

            {/* Row 4: Project Description */}
            <div className="tc-form-row tc-form-row--lg tc-form-row--mb48">
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
            <div className="tc-form-submit-center">
              <button type="submit" className="tc-btn-gold tc-btn-gold--full" disabled={isLoading}>
                {isLoading ? 'Submitting…' : 'Submit'}
              </button>
            </div>
          </form>
        </div>
      </section>
    </div>
  );
};
