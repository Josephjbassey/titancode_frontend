import React, { useState } from 'react';
import type { ScreenId } from '../../App';
import { Mail, Phone, MapPin, ChevronDown, CheckCircle2, AlertCircle } from 'lucide-react';
import { api } from '../../services/api';
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
    <div className="tc-page-root" style={{ paddingBottom: '120px' }}>
      {/* 1. HERO — Figma: x:0, y:154, w:1440, h:463, sharp corners */}
      <section
        className="tc-subpage-hero"
        style={{ backgroundImage: 'url(/assets/contactus_bg.jpg)' }}
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
          <div style={{ display: 'grid', gridTemplateColumns: '1.1fr 1.3fr', gap: '80px', alignItems: 'start' }}>

            {/* Left: contact details */}
            <div>
              <h2 style={{ fontSize: '46px', fontWeight: '800', marginBottom: '20px', color: '#FFFFFF', fontFamily: "'Inter', sans-serif" }}>
                Let's Get in Touch
              </h2>
              <p className="tc-body-text" style={{ marginBottom: '48px', maxWidth: '480px' }}>
                Have a project, an inquiry, or looking to collaborate with us? Our team is ready to assist.
                Send us a message and we'll respond as soon as possible.
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
                <div className="tc-contact-row">
                  <div className="tc-contact-icon"><Mail size={20} /></div>
                  <span style={{ fontSize: '15px', color: '#E5E7EB' }}>Titancodetechnologies@gmail.com</span>
                </div>
                <div className="tc-contact-row">
                  <div className="tc-contact-icon"><Phone size={20} /></div>
                  <span style={{ fontSize: '15px', color: '#E5E7EB' }}>+233(0)546606807</span>
                </div>
                <div className="tc-contact-row">
                  <div className="tc-contact-icon"><MapPin size={20} /></div>
                  <span style={{ fontSize: '15px', color: '#E5E7EB' }}>Remote</span>
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
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px', color: '#EF4444', fontSize: '13px' }}>
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
                    onFocus={(e) => (e.target.style.borderColor = '#DFAE32')}
                    onBlur={(e) => (e.target.style.borderColor = '#FFFFFF59')}
                  />
                  <input
                    type="text"
                    required
                    placeholder="Last Name"
                    value={formData.lastName}
                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                    className="tc-pill-input"
                    onFocus={(e) => (e.target.style.borderColor = '#DFAE32')}
                    onBlur={(e) => (e.target.style.borderColor = '#FFFFFF59')}
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
                    onFocus={(e) => (e.target.style.borderColor = '#DFAE32')}
                    onBlur={(e) => (e.target.style.borderColor = '#FFFFFF59')}
                  />
                </div>

                {/* Row 3: Subject dropdown */}
                <div className="tc-form-row" style={{ position: 'relative' }}>
                  <div
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    className="tc-pill-input"
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      cursor: 'pointer',
                      userSelect: 'none',
                      borderColor: dropdownOpen ? '#DFAE32' : '#FFFFFF59',
                    }}
                  >
                    <span>{formData.subject}</span>
                    <ChevronDown
                      size={18}
                      color="#DFAE32"
                      style={{ transform: dropdownOpen ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s ease' }}
                    />
                  </div>

                  {dropdownOpen && (
                    <div style={{
                      position: 'absolute',
                      top: '66px',
                      right: 0,
                      width: '260px',
                      backgroundColor: '#0B0B0C',
                      border: '1px solid rgba(223,174,50,0.4)',
                      borderRadius: '14px',
                      padding: '10px 0',
                      boxShadow: '0 12px 32px rgba(0,0,0,0.7)',
                      zIndex: 50,
                    }}>
                      {subjectOptions.map((opt) => (
                        <div
                          key={opt}
                          onClick={() => { setFormData({ ...formData, subject: opt }); setDropdownOpen(false); }}
                          style={{
                            padding: '10px 20px',
                            fontSize: '14px',
                            color: formData.subject === opt ? '#DFAE32' : '#E5E7EB',
                            fontWeight: formData.subject === opt ? '600' : '400',
                            cursor: 'pointer',
                          }}
                          onMouseOver={(e) => (e.currentTarget.style.backgroundColor = 'rgba(223,174,50,0.15)')}
                          onMouseOut={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                        >
                          {opt}
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Row 4: Message */}
                <div className="tc-form-row" style={{ marginBottom: '32px' }}>
                  <textarea
                    rows={6}
                    required
                    placeholder="Message"
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="tc-textarea"
                    onFocus={(e) => (e.target.style.borderColor = '#DFAE32')}
                    onBlur={(e) => (e.target.style.borderColor = '#FFFFFF59')}
                  />
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <button type="submit" className="tc-btn-gold tc-btn-gold--submit" disabled={isLoading} style={{ opacity: isLoading ? 0.7 : 1 }}>
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
