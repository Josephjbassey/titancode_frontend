import React, { useState, useEffect } from 'react';
import '../styles/auth.css';

interface AuthLayoutProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
}

interface CarouselSlide {
  image: string;
  title: string;
  description: string;
}

const CAROUSEL_SLIDES: CarouselSlide[] = [
  {
    image: '/assets/authside_bg.jpg',
    title: 'Autonomous Tech Squads',
    description: 'TitanCode pairs top-tier engineers with high-growth startup product roadmaps.',
  },
  {
    image: '/assets/aboutus_1.jpg',
    title: '70/30 Concierge Delivery',
    description: 'High-velocity sprints with audited milestone sign-offs and secure escrow protection.',
  },
  {
    image: '/assets/aboutus_2.jpg',
    title: 'Global Engineering Excellence',
    description: '17 specialized departments collaborating seamlessly under enterprise standards.',
  },
];

export const AuthLayout: React.FC<AuthLayoutProps> = ({ children, title, subtitle }) => {
  const [activeSlide, setActiveSlide] = useState(0);

  // Auto-rotate hero carousel every 6 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % CAROUSEL_SLIDES.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="tc-auth-shell">
      {/* 
        Single Unified Outer Card Container:
        Split into two equal halves (50% / 50%) with 0 gap and seamless seam
      */}
      <div className="tc-auth-unified-card">
        {/* LEFT HALF: AUTH FORM CONTAINER */}
        <div className="tc-auth-form-side">
          <div className="tc-auth-form-inner">
            {/* Prominent TitanCode Brand Logo */}
            <div className="tc-auth-logo-wrap">
              <div className="tc-logo-crop tc-logo-crop--auth" aria-label="TitanCode Technologies">
                <img src="/assets/logo.png" alt="" />
              </div>
            </div>

            {/* View Titles */}
            {title && <h1 className="tc-auth-title">{title}</h1>}
            {subtitle && <p className="tc-auth-subtitle">{subtitle}</p>}

            {/* Form Fields & Interactive Actions */}
            <div className="tc-w-full">{children}</div>
          </div>
        </div>

        {/* RIGHT HALF: INTERACTIVE HERO CAROUSEL */}
        <div className="tc-auth-hero-side">
          {CAROUSEL_SLIDES.map((slide, index) => (
            <div
              key={slide.title}
              className={`tc-auth-carousel-slide ${index === activeSlide ? 'active' : ''}`}
            >
              <img
                src={slide.image}
                alt={slide.title}
                className="tc-auth-carousel-img"
              />
              <div className="tc-auth-carousel-overlay" />
              <div className="tc-auth-carousel-caption">
                <h3>{slide.title}</h3>
                <p>{slide.description}</p>
              </div>
            </div>
          ))}

          {/* Interactive Carousel Indicator Pills (Figma Frame 158: 70px gold pill + two 25px pills) */}
          <div className="tc-auth-carousel-pills" role="tablist" aria-label="Hero Carousel Navigation">
            {CAROUSEL_SLIDES.map((slide, index) => (
              <button
                key={slide.title}
                type="button"
                className={`tc-auth-pill ${index === activeSlide ? 'active' : ''}`}
                onClick={() => setActiveSlide(index)}
                aria-label={`Go to slide ${index + 1}: ${slide.title}`}
                aria-selected={index === activeSlide}
                role="tab"
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
