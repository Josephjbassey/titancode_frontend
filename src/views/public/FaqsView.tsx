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
    <div className="tc-page-root tc-faqs-root">
      {/* 1. HERO — Figma: x:0, y:154, w:1440, h:463, sharp corners */}
      <section
        className="tc-subpage-hero tc-subpage-hero--faqs"
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
          <div className="tc-faqs-grid">

            {/* Left: heading + sub-copy */}
            <div>
              <h2 className="tc-section-title tc-faqs-heading-title">
                Frequently Asked <br />
                <span className="tc-gold">Questions</span>
              </h2>
              <p className="tc-body-text tc-faqs-subtext">
                Have questions? Send us a message and our team will get back to you shortly
              </p>
            </div>

            {/* Right: accordion card */}
            <div className="figma-card tc-faqs-card">
              {faqs.map((faq, index) => {
                const isOpen = openFaq === faq.id;
                const isFirst = index === 0;
                const isLast = index === faqs.length - 1;
                return (
                  <div
                    key={faq.id}
                    className={`tc-faq-row ${isFirst ? 'tc-faq-row--first' : ''} ${isLast ? 'tc-faq-row--last' : ''}`}
                  >
                    <button
                      type="button"
                      onClick={() => toggleFaq(faq.id)}
                      className={`tc-faq-trigger ${isOpen ? 'tc-faq-trigger--open' : ''}`}
                    >
                      <span>{faq.question}</span>
                      <ChevronDown
                        size={20}
                        color="#DFAE32"
                        className={`tc-faq-chevron ${isOpen ? 'tc-faq-chevron--open' : ''}`}
                      />
                    </button>

                    {isOpen && (
                      <div className="tc-body-text tc-faq-content-box">
                        {faq.answer}
                        {faq.id === 5 && (
                          <div className="tc-faq-extra-action">
                            <button
                              type="button"
                              onClick={() => onNavigate('application_form')}
                              className="tc-faq-link-btn"
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
