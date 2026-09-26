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
      answer: 'TitanCode Technologies is a tech company building a remote work ecosystem for tech professionals to collaborate, innovate, and grow.',
    },
    {
      id: 2,
      question: 'What services do you offer?',
      answer: 'We offer end-to-end digital solutions including responsive Web Development, native & cross-platform Mobile Apps, UI/UX Design Systems, and custom scalable digital products.',
    },
    {
      id: 3,
      question: 'How long does it take to complete a project?',
      answer: 'Project timelines depend on project scope and complexity. Standard websites and MVPs typically take 2 to 4 weeks, while comprehensive enterprise platforms take 6 to 12 weeks.',
    },
    {
      id: 4,
      question: 'Do you work with international clients?',
      answer: 'Yes! TitanCode operates globally, collaborating with visionary founders, enterprises, and clients across North America, Europe, Africa, and Asia.',
    },
    {
      id: 5,
      question: 'How can I join your team?',
      answer: 'We are always looking for exceptional developers, designers, and project managers. You can apply directly through our Member Application Form.',
    },
  ];

  const toggleFaq = (id: number) => {
    setOpenFaq(openFaq === id ? null : id);
  };

  return (
    <div className="tc-page-root" style={{ paddingBottom: '140px' }}>
      {/* 1. HERO — Figma: x:0, y:154, w:1440, h:463, sharp corners */}
      <section
        className="tc-subpage-hero"
        style={{ backgroundImage: 'url(/assets/faqhero_bg.jpg)' }}
      >
        <div className="tc-subpage-hero__content">
          <h1 className="tc-hero-title">
            FA<span className="tc-gold">Q</span>s
          </h1>
          <p className="tc-hero-subtitle">
            Find answers to common questions about our services and how we work.
          </p>
        </div>
      </section>

      {/* 2. FAQ ACCORDION */}
      <section className="tc-section">
        <div className="tc-section-inner">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: '80px', alignItems: 'start' }}>

            {/* Left: heading + sub-copy */}
            <div>
              <h2 className="tc-section-title" style={{ fontSize: '46px', lineHeight: 1.2, marginBottom: '20px' }}>
                Frequently Asked <br />
                <span className="tc-gold">Questions</span>
              </h2>
              <p className="tc-body-text" style={{ maxWidth: '420px' }}>
                Have questions? Send us a message and our team will get back to you shortly
              </p>
            </div>

            {/* Right: accordion card */}
            <div className="figma-card" style={{ borderRadius: '24px', padding: '32px 36px', display: 'flex', flexDirection: 'column' }}>
              {faqs.map((faq, index) => {
                const isOpen = openFaq === faq.id;
                const isLast = index === faqs.length - 1;
                return (
                  <div
                    key={faq.id}
                    style={{
                      borderBottom: isLast ? 'none' : '1px solid rgba(255,255,255,0.08)',
                      paddingTop: index === 0 ? '0' : '20px',
                      paddingBottom: isLast ? '0' : '20px',
                    }}
                  >
                    <button
                      type="button"
                      onClick={() => toggleFaq(faq.id)}
                      style={{
                        width: '100%',
                        padding: '12px 0',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        textAlign: 'left',
                        color: isOpen ? '#DFAE32' : '#FFFFFF',
                        fontSize: '18px',
                        fontWeight: '600',
                        cursor: 'pointer',
                        border: 'none',
                        background: 'none',
                        fontFamily: 'inherit',
                      }}
                    >
                      <span>{faq.question}</span>
                      <ChevronDown
                        size={20}
                        color="#DFAE32"
                        style={{
                          transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                          transition: 'transform 0.25s ease',
                          flexShrink: 0,
                          marginLeft: '16px',
                        }}
                      />
                    </button>

                    {isOpen && (
                      <div className="tc-body-text" style={{ padding: '8px 0 14px', fontSize: '15px', lineHeight: 1.7 }}>
                        {faq.answer}
                        {faq.id === 5 && (
                          <div style={{ marginTop: '12px' }}>
                            <button
                              type="button"
                              onClick={() => onNavigate('application_form')}
                              style={{
                                color: '#DFAE32',
                                fontWeight: '600',
                                fontSize: '14px',
                                textDecoration: 'underline',
                                cursor: 'pointer',
                                background: 'none',
                                border: 'none',
                                padding: 0,
                                fontFamily: 'inherit',
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
        </div>
      </section>
    </div>
  );
};
