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
    <div style={{ backgroundColor: 'var(--tc-figma-black, #0B0B0C)', color: '#FFFFFF', paddingBottom: '140px' }}>
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
          backgroundImage: 'linear-gradient(rgba(11, 11, 12, 0.72), rgba(11, 11, 12, 0.88)), url(/assets/faqhero_bg.jpg)',
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
            FA<span style={{ color: 'var(--tc-figma-gold, #DFAE32)' }}>Q</span>s
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
            Find answers to common questions about our services and how we work.
          </p>
        </div>
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
          {/* Left Side: Header & Subtitle matching Figma FAQs.png (NO extra button) */}
          <div>
            <h2 style={{ fontSize: '46px', fontWeight: '800', lineHeight: '1.2', marginBottom: '20px', color: '#FFFFFF', fontFamily: "'Inter', sans-serif" }}>
              Frequently Asked <br />
              <span style={{ color: 'var(--tc-figma-gold, #DFAE32)' }}>Questions</span>
            </h2>
            <p style={{ fontSize: '16px', color: '#9CA3AF', lineHeight: '1.6', maxWidth: '420px', fontFamily: "'Poppins', sans-serif" }}>
              Have questions? Send us a message and our team will get back to you shortly
            </p>
          </div>

          {/* Right Side: Accordion Container matching Figma FAQs.png */}
          <div
            className="figma-card"
            style={{
              borderRadius: '24px',
              padding: '32px 36px',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            {faqs.map((faq, index) => {
              const isOpen = openFaq === faq.id;
              const isLast = index === faqs.length - 1;
              return (
                <div
                  key={faq.id}
                  style={{
                    borderBottom: isLast ? 'none' : '1px solid rgba(255, 255, 255, 0.08)',
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
                      color: '#FFFFFF',
                      fontSize: '18px',
                      fontWeight: '600',
                      cursor: 'pointer',
                      border: 'none',
                      background: 'none',
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
                    <div
                      style={{
                        padding: '8px 0 14px',
                        color: '#9CA3AF',
                        fontSize: '15px',
                        lineHeight: '1.7',
                      }}
                    >
                      {faq.answer}
                      {faq.id === 5 && (
                        <div style={{ marginTop: '12px' }}>
                          <button
                            type="button"
                            onClick={() => onNavigate('application_form')}
                            style={{
                              color: '#dfae32',
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
