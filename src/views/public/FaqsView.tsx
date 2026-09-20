import React, { useState } from 'react';
import type { ScreenId } from '../../App';
import { ChevronDown } from 'lucide-react';

interface FaqsViewProps {
  onNavigate: (view: ScreenId) => void;
}

interface FaqItem {
  id: number;
  question: string;
  answer: string;
}

export const FaqsView: React.FC<FaqsViewProps> = ({ onNavigate }) => {
  const [openFaq, setOpenFaq] = useState<number | null>(1); // FAQ 1 open by default per Figma

  const faqs: FaqItem[] = [
    {
      id: 1,
      question: 'What is TitanCode Technologies?',
      answer:
        'TitanCode Technologies is a tech company building a remote work ecosystem for tech professionals to collaborate, innovate, and grow.',
    },
    {
      id: 2,
      question: 'What services do you offer?',
      answer:
        'We offer end-to-end digital solutions including responsive Web Development, native & cross-platform Mobile Apps, UI/UX Design Systems, and custom scalable digital products.',
    },
    {
      id: 3,
      question: 'How long does it take to complete a project?',
      answer:
        'Project timelines depend on project scope and complexity. Standard websites and MVPs typically take 2 to 4 weeks, while comprehensive enterprise platforms take 6 to 12 weeks.',
    },
    {
      id: 4,
      question: 'Do you work with international clients?',
      answer:
        'Yes! TitanCode operates globally, collaborating with visionary founders, enterprises, and clients across North America, Europe, Africa, and Asia.',
    },
    {
      id: 5,
      question: 'How can I join your team?',
      answer:
        'We are always looking for exceptional developers, designers, and project managers. You can apply directly through our Member Application Form.',
    },
  ];

  const toggleFaq = (id: number) => {
    setOpenFaq(openFaq === id ? null : id);
  };

  return (
    <div style={{ backgroundColor: '#0B0E14', color: '#FFFFFF', paddingBottom: '120px' }}>
      {/* 1. HERO BANNER */}
      <section style={{ width: '100%', position: 'relative', overflow: 'hidden' }}>
        <img
          src="/assets/faqs_hero_banner.png"
          alt="Frequently Asked Questions"
          style={{ width: '100%', maxHeight: '580px', objectFit: 'cover', display: 'block' }}
        />
      </section>

      {/* 2. MAIN ACCORDION SECTION */}
      <section style={{ maxWidth: '1280px', margin: '90px auto 0', padding: '0 40px' }}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1.5fr',
            gap: '80px',
            alignItems: 'start',
          }}
        >
          {/* Left Side: Header & Inquiry CTA */}
          <div>
            <h2 style={{ fontSize: '46px', fontWeight: '800', lineHeight: '1.2', marginBottom: '16px', color: '#FFFFFF' }}>
              Frequently Asked <br />
              <span style={{ color: '#E5A83B' }}>Questions</span>
            </h2>
            <p style={{ fontSize: '16px', color: '#9CA3AF', lineHeight: '1.6', marginBottom: '32px' }}>
              Have questions? Send us a message and our team will get back to you shortly
            </p>

            <button
              type="button"
              onClick={() => onNavigate('contact_us')}
              style={{
                backgroundColor: 'transparent',
                border: '1px solid #E5A83B',
                color: '#E5A83B',
                fontWeight: '600',
                fontSize: '15px',
                padding: '12px 28px',
                borderRadius: '8px',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.backgroundColor = '#E5A83B';
                e.currentTarget.style.color = '#0A0D14';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
                e.currentTarget.style.color = '#E5A83B';
              }}
            >
              Contact Support
            </button>
          </div>

          {/* Right Side: Accordion Container matching Figma */}
          <div
            style={{
              backgroundColor: '#14171D',
              borderRadius: '24px',
              padding: '36px',
              boxShadow: '0 16px 40px rgba(0, 0, 0, 0.5)',
              display: 'flex',
              flexDirection: 'column',
              gap: '16px',
            }}
          >
            {faqs.map((faq) => {
              const isOpen = openFaq === faq.id;
              return (
                <div
                  key={faq.id}
                  style={{
                    backgroundColor: '#1A1D24',
                    border: '1px solid rgba(229, 168, 59, 0.35)',
                    borderRadius: '14px',
                    overflow: 'hidden',
                    transition: 'border-color 0.2s ease',
                  }}
                >
                  <button
                    type="button"
                    onClick={() => toggleFaq(faq.id)}
                    style={{
                      width: '100%',
                      padding: '22px 26px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      textAlign: 'left',
                      color: '#FFFFFF',
                      fontSize: '16px',
                      fontWeight: '600',
                      cursor: 'pointer',
                      border: 'none',
                      background: 'none',
                    }}
                  >
                    <span>{faq.question}</span>
                    <ChevronDown
                      size={20}
                      color="#E5A83B"
                      style={{
                        transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                        transition: 'transform 0.25s ease',
                        flexShrink: 0,
                        marginLeft: '16px',
                      }}
                    />
                  </button>

                  {isOpen && (
                    <div
                      style={{
                        padding: '0 26px 24px',
                        color: '#9CA3AF',
                        fontSize: '15px',
                        lineHeight: '1.7',
                        borderTop: '1px solid rgba(255, 255, 255, 0.05)',
                        paddingTop: '16px',
                      }}
                    >
                      {faq.answer}
                      {faq.id === 5 && (
                        <div style={{ marginTop: '12px' }}>
                          <button
                            type="button"
                            onClick={() => onNavigate('application_form')}
                            style={{
                              color: '#E5A83B',
                              fontWeight: '600',
                              fontSize: '14px',
                              textDecoration: 'underline',
                              cursor: 'pointer',
                              background: 'none',
                              border: 'none',
                              padding: 0,
                            }}
                          >
                            Open Member Application Form →
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
};
