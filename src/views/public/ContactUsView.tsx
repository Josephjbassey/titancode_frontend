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
    <div style={{ backgroundColor: '#0B0E14', color: '#FFFFFF', paddingBottom: '120px' }}>
      {/* 1. HERO BANNER */}
      <section style={{ width: '100%', position: 'relative', overflow: 'hidden' }}>
        <img
          src="/assets/contact_us_hero_banner.png"
          alt="Contact Us"
          style={{ width: '100%', maxHeight: '580px', objectFit: 'cover', display: 'block' }}
        />
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
            <h2 style={{ fontSize: '46px', fontWeight: '800', marginBottom: '20px', color: '#FFFFFF' }}>
              Let’s Get in Touch
            </h2>
            <p style={{ fontSize: '16px', color: '#9CA3AF', lineHeight: '1.7', marginBottom: '48px', maxWidth: '480px' }}>
              Have a project, an inquiry, or looking to collaborate with us? Our team is ready to assist. Send us a message and we’ll respond as soon as possible.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div
                  style={{
                    width: '42px',
                    height: '42px',
                    borderRadius: '8px',
                    backgroundColor: 'rgba(229, 168, 59, 0.1)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#E5A83B',
                  }}
                >
                  <Mail size={20} />
                </div>
                <span style={{ fontSize: '15px', color: '#E5E7EB' }}>Titancodetechnologies@gmail.com</span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div
                  style={{
                    width: '42px',
                    height: '42px',
                    borderRadius: '8px',
                    backgroundColor: 'rgba(229, 168, 59, 0.1)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#E5A83B',
                  }}
                >
                  <Phone size={20} />
                </div>
                <span style={{ fontSize: '15px', color: '#E5E7EB' }}>+233(0)546606807</span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div
                  style={{
                    width: '42px',
                    height: '42px',
                    borderRadius: '8px',
                    backgroundColor: 'rgba(229, 168, 59, 0.1)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#E5A83B',
                  }}
                >
                  <MapPin size={20} />
                </div>
                <span style={{ fontSize: '15px', color: '#E5E7EB' }}>Remote</span>
              </div>
            </div>
          </div>

          {/* Right Column: Contact Form */}
          <div>
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
              <div
                style={{
                  backgroundColor: '#14171D',
                  border: '1px solid rgba(229, 168, 59, 0.35)',
                  borderRadius: '24px',
                  padding: '40px 36px',
                  boxShadow: '0 16px 40px rgba(0, 0, 0, 0.5)',
                  marginBottom: '24px',
                }}
              >
                {/* Row 1: First Name | Last Name */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
                  <div>
                    <input
                      type="text"
                      required
                      placeholder="First Name"
                      value={formData.firstName}
                      onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                      style={{
                        width: '100%',
                        height: '54px',
                        borderRadius: '9999px',
                        backgroundColor: '#20242D',
                        border: '1px solid transparent',
                        color: '#FFFFFF',
                        padding: '0 24px',
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
                      required
                      placeholder="Last Name"
                      value={formData.lastName}
                      onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                      style={{
                        width: '100%',
                        height: '54px',
                        borderRadius: '9999px',
                        backgroundColor: '#20242D',
                        border: '1px solid transparent',
                        color: '#FFFFFF',
                        padding: '0 24px',
                        fontSize: '15px',
                        outline: 'none',
                        transition: 'border-color 0.2s',
                      }}
                      onFocus={(e) => (e.target.style.borderColor = '#E5A83B')}
                      onBlur={(e) => (e.target.style.borderColor = 'transparent')}
                    />
                  </div>
                </div>

                {/* Row 2: Email */}
                <div style={{ marginBottom: '20px' }}>
                  <input
                    type="email"
                    required
                    placeholder="Email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    style={{
                      width: '100%',
                      height: '54px',
                      borderRadius: '9999px',
                      backgroundColor: '#20242D',
                      border: '1px solid transparent',
                      color: '#FFFFFF',
                      padding: '0 24px',
                      fontSize: '15px',
                      outline: 'none',
                      transition: 'border-color 0.2s',
                    }}
                    onFocus={(e) => (e.target.style.borderColor = '#E5A83B')}
                    onBlur={(e) => (e.target.style.borderColor = 'transparent')}
                  />
                </div>

                {/* Row 3: Subject Dropdown matching Figma */}
                <div style={{ position: 'relative', marginBottom: '20px' }}>
                  <div
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    style={{
                      width: '100%',
                      height: '54px',
                      borderRadius: '9999px',
                      backgroundColor: '#20242D',
                      border: dropdownOpen ? '1px solid #E5A83B' : '1px solid transparent',
                      color: '#FFFFFF',
                      padding: '0 24px',
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
                      color="#E5A83B"
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
                        top: '60px',
                        right: 0,
                        width: '240px',
                        backgroundColor: '#161922',
                        border: '1px solid rgba(229, 168, 59, 0.4)',
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
                            color: formData.subject === opt ? '#E5A83B' : '#E5E7EB',
                            fontWeight: formData.subject === opt ? '600' : '400',
                            cursor: 'pointer',
                            transition: 'background-color 0.15s',
                          }}
                          onMouseOver={(e) => (e.currentTarget.style.backgroundColor = 'rgba(229, 168, 59, 0.1)')}
                          onMouseOut={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                        >
                          {opt}
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Row 4: Message Textarea */}
                <div>
                  <textarea
                    rows={6}
                    required
                    placeholder="Message"
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    style={{
                      width: '100%',
                      borderRadius: '20px',
                      backgroundColor: '#20242D',
                      border: '1px solid transparent',
                      color: '#FFFFFF',
                      padding: '20px 24px',
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

              {/* Submit button aligned to the right matching Figma */}
              <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <button
                  type="submit"
                  style={{
                    backgroundColor: '#E5A83B',
                    color: '#0A0D14',
                    fontWeight: '700',
                    fontSize: '15px',
                    padding: '13px 48px',
                    borderRadius: '8px',
                    border: 'none',
                    cursor: 'pointer',
                    boxShadow: '0 4px 14px rgba(229, 168, 59, 0.3)',
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
        </div>
      </section>
    </div>
  );
};
