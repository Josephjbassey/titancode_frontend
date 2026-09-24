import React, { useState } from 'react';
import type { ScreenId } from '../../App';
import { Mail, Phone, MapPin, ChevronDown, CheckCircle2 } from 'lucide-react';

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

  const subjectOptions = [
    'General Inquiry',
    'Project Request',
    'Collaboration',
    'Join our team',
    'Assistance',
    'Feedback',
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
    }, 4000);
  };

  return (
    <div style={{ backgroundColor: 'var(--tc-figma-black)', color: '#FFFFFF', paddingBottom: '120px' }}>
      {/* 1. HERO BANNER */}
      <section
        style={{
          width: '100%',
          position: 'relative',
          overflow: 'hidden',
          padding: '120px 40px 110px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          backgroundImage: 'linear-gradient(rgba(11, 11, 12, 0.72), rgba(11, 11, 12, 0.88)), url(/assets/contactus_bg.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }}
      >
        <div style={{ maxWidth: '840px', margin: '0 auto' }}>
          <h1
            style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: '64px',
              fontWeight: 800,
              lineHeight: '100%',
              letterSpacing: '-0.5px',
              color: '#FFFFFF',
              marginBottom: '20px',
            }}
          >
            Contact <span style={{ color: 'var(--tc-figma-gold, #DFAE32)' }}>Us</span>
          </h1>

          <p
            style={{
              fontFamily: "'Poppins', sans-serif",
              fontSize: '20px',
              fontWeight: 500,
              lineHeight: '32px',
              letterSpacing: '0%',
              textAlign: 'center',
              color: '#9CA3AF',
              maxWidth: '680px',
              margin: '0 auto',
            }}
          >
            Send us a message and our team will get back to you shortly. We’re always available.
          </p>
        </div>
      </section>

      {/* 2. MAIN SPLIT SECTION */}
      <section style={{ maxWidth: '1280px', margin: '90px auto 0', padding: '0 40px' }}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1.1fr 1.3fr',
            gap: '80px',
            alignItems: 'start',
          }}
        >
          {/* Left Column: Let's Get in Touch */}
          <div>
            <h2 style={{ fontSize: '46px', fontWeight: '800', marginBottom: '20px', color: '#FFFFFF', fontFamily: "'Inter', sans-serif" }}>
              Let’s Get in Touch
            </h2>
            <p style={{ fontSize: '16px', color: '#9CA3AF', lineHeight: '1.7', marginBottom: '48px', maxWidth: '480px', fontFamily: "'Poppins', sans-serif" }}>
              Have a project, an inquiry, or looking to collaborate with us? Our team is ready to assist. Send us a message and we’ll respond as soon as possible.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div
                  style={{
                    width: '44px',
                    height: '44px',
                    borderRadius: '8px',
                    backgroundColor: '#111214',
                    border: '1px solid rgba(223, 174, 50, 0.24)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#DFAE32',
                  }}
                >
                  <Mail size={20} />
                </div>
                <span style={{ fontSize: '15px', color: '#E5E7EB' }}>Titancodetechnologies@gmail.com</span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div
                  style={{
                    width: '44px',
                    height: '44px',
                    borderRadius: '8px',
                    backgroundColor: '#111214',
                    border: '1px solid rgba(223, 174, 50, 0.24)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#DFAE32',
                  }}
                >
                  <Phone size={20} />
                </div>
                <span style={{ fontSize: '15px', color: '#E5E7EB' }}>+233(0)546606807</span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div
                  style={{
                    width: '44px',
                    height: '44px',
                    borderRadius: '8px',
                    backgroundColor: '#111214',
                    border: '1px solid rgba(223, 174, 50, 0.24)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#DFAE32',
                  }}
                >
                  <MapPin size={20} />
                </div>
                <span style={{ fontSize: '15px', color: '#E5E7EB' }}>Remote</span>
              </div>
            </div>
          </div>

          {/* Right Column: Contact Form with exact golden linear gradient corner accents from Figma */}
          <div
            style={{
              position: 'relative',
              padding: '44px',
              borderRadius: '16px',
              backgroundColor: 'var(--tc-figma-black)',
              border: '1px solid var(--tc-figma-card-border)',
              boxShadow: '0 16px 40px rgba(0, 0, 0, 0.4)',
            }}
          >
            {submitted && (
              <div
                style={{
                  backgroundColor: 'rgba(16, 185, 129, 0.15)',
                  border: '1px solid #10B981',
                  color: '#10B981',
                  padding: '16px 20px',
                  borderRadius: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  marginBottom: '24px',
                  fontSize: '14px',
                  fontWeight: '600',
                }}
              >
                <CheckCircle2 size={20} />
                <span>Message sent! Our support and engineering team will reach back shortly.</span>
              </div>
            )}

            <form onSubmit={handleSubmit}>
              {/* Row 1: First Name | Last Name */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '24px' }}>
                <div>
                  <input
                    type="text"
                    required
                    placeholder="First Name"
                    value={formData.firstName}
                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                    style={{
                      width: '100%',
                      height: '58px',
                      borderRadius: '9999px',
                      backgroundColor: 'var(--tc-bg-input)',
                      border: '1px solid var(--tc-figma-input-border)',
                      color: '#FFFFFF',
                      padding: '0 28px',
                      fontSize: '15px',
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
                    required
                    placeholder="Last Name"
                    value={formData.lastName}
                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                    style={{
                      width: '100%',
                      height: '58px',
                      borderRadius: '9999px',
                      backgroundColor: 'var(--tc-bg-input)',
                      border: '1px solid var(--tc-figma-input-border)',
                      color: '#FFFFFF',
                      padding: '0 28px',
                      fontSize: '15px',
                      outline: 'none',
                      transition: 'border-color 0.2s',
                    }}
                    onFocus={(e) => (e.target.style.borderColor = '#DFAE32')}
                    onBlur={(e) => (e.target.style.borderColor = '#FFFFFF59')}
                  />
                </div>
              </div>

              {/* Row 2: Email */}
              <div style={{ marginBottom: '24px' }}>
                <input
                  type="email"
                  required
                  placeholder="Email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  style={{
                    width: '100%',
                    height: '58px',
                    borderRadius: '9999px',
                    backgroundColor: 'var(--tc-bg-input)',
                    border: '1px solid var(--tc-figma-input-border)',
                    color: '#FFFFFF',
                    padding: '0 28px',
                    fontSize: '15px',
                    outline: 'none',
                    transition: 'border-color 0.2s',
                  }}
                  onFocus={(e) => (e.target.style.borderColor = '#DFAE32')}
                  onBlur={(e) => (e.target.style.borderColor = '#FFFFFF59')}
                />
              </div>

              {/* Row 3: Subject Dropdown matching Figma */}
              <div style={{ position: 'relative', marginBottom: '24px' }}>
                <div
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  style={{
                    width: '100%',
                    height: '58px',
                    borderRadius: '9999px',
                    backgroundColor: 'var(--tc-bg-input)',
                    border: dropdownOpen ? '1px solid #DFAE32' : '1px solid #FFFFFF59',
                    color: '#FFFFFF',
                    padding: '0 28px',
                    fontSize: '15px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    cursor: 'pointer',
                    userSelect: 'none',
                  }}
                >
                  <span>{formData.subject}</span>
                  <ChevronDown
                    size={18}
                    color="#DFAE32"
                    style={{
                      transform: dropdownOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                      transition: 'transform 0.2s ease',
                    }}
                  />
                </div>

                {/* Dropdown Menu matching Figma slice */}
                {dropdownOpen && (
                  <div
                    style={{
                      position: 'absolute',
                      top: '66px',
                      right: 0,
                      width: '260px',
                      backgroundColor: 'var(--tc-bg-input)',
                      border: '1px solid rgba(223, 174, 50, 0.4)',
                      borderRadius: '14px',
                      padding: '10px 0',
                      boxShadow: '0 12px 32px rgba(0, 0, 0, 0.7)',
                      zIndex: 50,
                    }}
                  >
                    {subjectOptions.map((opt) => (
                      <div
                        key={opt}
                        onClick={() => {
                          setFormData({ ...formData, subject: opt });
                          setDropdownOpen(false);
                        }}
                        style={{
                          padding: '10px 20px',
                          fontSize: '14px',
                          color: formData.subject === opt ? '#DFAE32' : '#E5E7EB',
                          fontWeight: formData.subject === opt ? '600' : '400',
                          cursor: 'pointer',
                          transition: 'background-color 0.15s',
                        }}
                        onMouseOver={(e) => (e.currentTarget.style.backgroundColor = 'rgba(223, 174, 50, 0.15)')}
                        onMouseOut={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                      >
                        {opt}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Row 4: Message Textarea */}
              <div style={{ marginBottom: '32px' }}>
                <textarea
                  rows={6}
                  required
                  placeholder="Message"
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  style={{
                    width: '100%',
                    borderRadius: '20px',
                    backgroundColor: 'var(--tc-bg-input)',
                    border: '1px solid #FFFFFF59',
                    color: '#FFFFFF',
                    padding: '22px 28px',
                    fontSize: '15px',
                    lineHeight: '1.6',
                    outline: 'none',
                    resize: 'none',
                    transition: 'border-color 0.2s',
                  }}
                  onFocus={(e) => (e.target.style.borderColor = '#DFAE32')}
                  onBlur={(e) => (e.target.style.borderColor = '#FFFFFF59')}
                />
              </div>

              {/* Submit button aligned to the right matching Figma */}
              <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <button
                  type="submit"
                  style={{
                    backgroundColor: '#DFAE32',
                    color: '#0B0B0C',
                    fontWeight: '700',
                    fontSize: '16px',
                    padding: '14px 52px',
                    borderRadius: '8px',
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
          </div>
        </div>
      </section>
    </div>
  );
};
