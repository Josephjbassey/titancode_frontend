import React, { useState } from 'react';
import type { ScreenId } from '../../App';
import { Mail, Phone, MapPin, ChevronDown, CheckCircle2, AlertCircle } from 'lucide-react';
import { api } from '../../services/api';
import { useCompany } from '../../contexts/CompanyContext';
import {
  ContactCornerTopLeft,
  ContactCornerTopRight,
  ContactCornerBottomLeft,
  ContactCornerBottomRight,
} from '../../components/common/CornerGradients';

interface ContactUsViewProps {
  onNavigate: (view: ScreenId) => void;
}

export const ContactUsView: React.FC<ContactUsViewProps> = ({ onNavigate: _onNavigate }) => {
  const company = useCompany();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    subject: 'General Inquiry',
    message: '',
  });

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const subjectOptions = [
    'General Inquiry',
    'Project Request',
    'Collaboration',
    'Join our team',
    'Assistance',
    'Feedback',
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    try {
      await api.submitContact({
        first_name: formData.firstName,
        last_name: formData.lastName,
        email: formData.email,
        subject: formData.subject,
        message: formData.message,
      });
      setSubmitted(true);
      setFormData({ firstName: '', lastName: '', email: '', subject: 'General Inquiry', message: '' });
      setTimeout(() => setSubmitted(false), 6000);
    } catch (err: any) {
      setError(err.message || 'Failed to send message. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="tc-page-root tc-contact-root">
      {/* 1. HERO — Figma: x:0, y:154, w:1440, h:463, sharp corners */}
      <section
        className="tc-subpage-hero tc-subpage-hero--contact"
      >
        <div className="tc-subpage-hero__content">
          <h1 className="tc-hero-title">
            Contact <span className="tc-gold">Us</span>
          </h1>
          <p className="tc-hero-subtitle">
            Send us a message and our team will get back to you shortly. We're always available.
          </p>
        </div>
      </section>

      {/* 2. SPLIT SECTION: contact info + form */}
      <section className="tc-section">
        <div className="tc-section-inner">
          <div className="tc-contact-split-grid">

            {/* Left: contact details */}
            <div>
              <h2 className="tc-contact-heading-title">
                Let's Get in Touch
              </h2>
              <p className="tc-body-text tc-contact-intro-desc">
                Have a project, an inquiry, or looking to collaborate with us? Our team is ready to assist.
                Send us a message and we'll respond as soon as possible.
              </p>

              <div className="tc-contact-info-list">
                <div className="tc-contact-row">
                  <div className="tc-contact-icon"><Mail size={20} /></div>
                  <span className="tc-contact-value">{company.support_email}</span>
                </div>
                <div className="tc-contact-row">
                  <div className="tc-contact-icon"><Phone size={20} /></div>
                  <span className="tc-contact-value">{company.phone}</span>
                </div>
                <div className="tc-contact-row">
                  <div className="tc-contact-icon"><MapPin size={20} /></div>
                  <span className="tc-contact-value">{company.address}</span>
                </div>
              </div>
            </div>

            {/* Right: form with corner gradient accents */}
            <div className="tc-form-frame">
              {/* Figma gradient corner accents */}
              <ContactCornerTopLeft className="tc-corner-svg-tl" />
              <ContactCornerTopRight className="tc-corner-svg-tr" />
              <ContactCornerBottomLeft className="tc-corner-svg-bl" />
              <ContactCornerBottomRight className="tc-corner-svg-br" />

              {submitted && (
                <div className="tc-form-success">
                  <CheckCircle2 size={20} />
                  <span>Message sent! Our support and engineering team will reach back shortly.</span>
                </div>
              )}

              {error && (
                <div className="tc-contact-error-banner">
                  <AlertCircle size={15} />
                  <span>{error}</span>
                </div>
              )}

              <form onSubmit={handleSubmit}>
                {/* Row 1: First Name | Last Name */}
                <div className="tc-form-grid-2col">
                  <input
                    type="text"
                    required
                    placeholder="First Name"
                    value={formData.firstName}
                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                    className="tc-pill-input"
                  />
                  <input
                    type="text"
                    required
                    placeholder="Last Name"
                    value={formData.lastName}
                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                    className="tc-pill-input"
                  />
                </div>

                {/* Row 2: Email */}
                <div className="tc-form-row">
                  <input
                    type="email"
                    required
                    placeholder="Email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="tc-pill-input"
                  />
                </div>

                {/* Row 3: Subject dropdown */}
                <div className="tc-form-row tc-form-row--relative">
                  <div
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    className={`tc-pill-input tc-dropdown-trigger ${dropdownOpen ? 'tc-dropdown-trigger--open' : ''}`}
                  >
                    <span>{formData.subject}</span>
                    <ChevronDown
                      size={18}
                      color="#DFAE32"
                      className={`tc-dropdown-chevron ${dropdownOpen ? 'tc-dropdown-chevron--open' : ''}`}
                    />
                  </div>

                  {dropdownOpen && (
                    <div className="tc-dropdown-menu">
                      {subjectOptions.map((opt) => (
                        <div
                          key={opt}
                          onClick={() => { setFormData({ ...formData, subject: opt }); setDropdownOpen(false); }}
                          className={`tc-dropdown-option ${formData.subject === opt ? 'tc-dropdown-option--active' : ''}`}
                        >
                          {opt}
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Row 4: Message */}
                <div className="tc-form-row tc-form-row--msg">
                  <textarea
                    rows={6}
                    required
                    placeholder="Message"
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="tc-textarea"
                  />
                </div>

                <div className="tc-form-submit-row">
                  <button type="submit" className="tc-btn-gold tc-btn-gold--submit" disabled={isLoading}>
                    {isLoading ? 'Sending…' : 'Submit'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
