import React, { useState } from 'react';
import type { ScreenId } from '../../App';
import {
  Globe,
  Smartphone,
  Palette,
  Layers,
  Zap,
  Settings,
  Users,
  TrendingUp,
  ShieldCheck,
  Mail,
  Phone,
  Music2,
} from 'lucide-react';
import '../../styles/public.css';

interface HomepageViewProps {
  onNavigate: (view: ScreenId) => void;
}

export const HomepageView: React.FC<HomepageViewProps> = ({ onNavigate }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = (view: ScreenId) => {
    setIsMenuOpen(false);
    onNavigate(view);
  };

  const whatWeDo = [
    { icon: Globe, title: 'Web Development', description: 'Modern, responsive websites built for performance and scalability.' },
    { icon: Smartphone, title: 'Mobile App Development', description: 'High-quality mobile apps designed for seamless user experience.' },
    { icon: Palette, title: 'UI/UX Design', description: 'User-focused designs that create intuitive and engaging experiences.' },
  ];

  const whatWeOffer = [
    { icon: Globe, title: 'Custom Website Development', description: 'We create modern, responsive websites tailored to your business needs and goals.' },
    { icon: Smartphone, title: 'Mobile App Solutions', description: 'We build high-performance mobile applications designed for seamless user experience.' },
    { icon: Palette, title: 'UI/UX Design Services', description: 'We design intuitive and user-friendly interfaces that enhance digital experiences.' },
    { icon: Layers, title: 'Digital Product Development', description: 'We turn ideas into scalable digital products from concept to launch.' },
    { icon: Zap, title: 'System Optimization', description: 'We improve performance and efficiency of existing digital platforms and systems.' },
    { icon: Settings, title: 'Support & Maintenance', description: 'We provide ongoing support to ensure your digital solutions run smoothly.' },
  ];

  const whyChooseUs = [
    { icon: Users, title: 'User-Centered Design', description: 'We design intuitive and engaging experiences tailored to meet real user needs.', theme: 'dark' },
    { icon: TrendingUp, title: 'Scalable Solutions', description: 'Our solutions are built to grow with your business and adapt over time.', theme: 'gold' },
    { icon: ShieldCheck, title: 'Reliable Delivery', description: 'We deliver high-quality results on time with a strong focus on performance.', theme: 'dark' },
  ];

  return (
    <div className="tc-homepage">
      {/* ── HEADER ── */}
      <header className="tc-homepage-header">
        <div className="tc-header-brand-wrap">
          <div className="tc-logo-crop tc-logo-crop--header" aria-label="TitanCode logo">
            <img src="/assets/logo.png" alt="" />
          </div>
        </div>

        <button
          type="button"
          className="tc-mobile-menu-button"
          aria-label={isMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
          aria-expanded={isMenuOpen}
          onClick={() => setIsMenuOpen((open) => !open)}
        >
          <span />
          <span />
          <span />
        </button>

        <nav
          className={`tc-homepage-nav${isMenuOpen ? ' is-open' : ''}`}
        >
          <button type="button" onClick={() => navigate('home')} className="tc-nav-link tc-nav-link--active">Home</button>
          <button type="button" onClick={() => navigate('about_us')} className="tc-nav-link">About Us</button>
          <button type="button" onClick={() => navigate('services')} className="tc-nav-link">Services</button>
          <button type="button" onClick={() => navigate('contact_us')} className="tc-nav-link">Contact Us</button>
        </nav>

        <button
          type="button"
          className="tc-btn-gold tc-homepage-cta tc-btn-portal-header"
          onClick={() => navigate('hire_us')}
        >
          Hire Us
        </button>
      </header>

      <main className="tc-homepage-main">
        {/* ── HERO SECTION ── */}
        <section className="tc-homepage-hero-figma">
          {/* Gold blur shadow: bg #DFAE32, blur(50px), w:1440, h:631, left:11, top:251 */}
          <div className="tc-hero-gold-glow" />

          {/* Dark overlay: #0B0B0C 80% opacity, w:1440, h:1038, top:140 */}
          <div className="tc-hero-dark-overlay" />

          {/* Background image container: w:1440, h:742, top:140, no border-radius */}
          <div className="tc-hero-img-wrap">
            <div className="tc-hero-img-gradient" />
            <img
              src="/assets/landingpage1.jpg"
              alt="TitanCode product interface"
              className="tc-hero-img"
            />
          </div>

          {/* Hero text overlay */}
          <div className="tc-hero-text-overlay">
            <h1 className="tc-hero-h1">
              Empowering Your <span className="tc-gold">Business Ideas</span>
              <br />
              with <span className="tc-gold">Innovative</span> Software
              <br />
              Solutions
            </h1>

            <p className="tc-hero-p">
              We design and develop websites, mobile apps, and software platforms
              <br />
              that solve real-world problems.
            </p>

            <div className="tc-hero-cta-row">
              <button
                type="button"
                onClick={() => navigate('hire_us')}
                className="tc-btn-gold tc-btn-gold--hero"
              >
                Hire Us
              </button>
              <button
                type="button"
                onClick={() => navigate('hire_us')}
                className="tc-btn-outline-gold"
              >
                Join Team
              </button>
            </div>
          </div>
        </section>

        {/* ── WHAT WE DO ── */}
        <section className="tc-homepage-section">
          <div className="tc-section-header">
            <h2 className="tc-section-title tc-section-title--lg">
              What We <span className="tc-gold">Do</span>
            </h2>
            <p className="tc-homepage-section-sub">
              We design and develop websites, mobile apps, and software solutions that help businesses
              grow and solve real-world problems.
            </p>
          </div>

          <div className="tc-homepage-cards-grid">
            {whatWeDo.map(({ icon: Icon, title, description }) => (
              <div key={title} className="tc-feature-card">
                <div className="tc-icon-badge tc-icon-badge--lg">
                  <Icon size={38} strokeWidth={2.2} color="#0B0B0C" />
                </div>
                <h3 className="tc-homepage-card-h3">{title}</h3>
                <p className="tc-homepage-card-p">{description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── WHAT WE OFFER ── */}
        <section className="tc-homepage-section tc-homepage-section--flush">
          <div className="tc-section-header">
            <h2 className="tc-section-title tc-section-title--lg">
              What We <span className="tc-gold">Offer</span>
            </h2>
            <p className="tc-homepage-section-sub">
              A range of digital solutions designed to support your business growth and long-term success
              across different platforms and industries.
            </p>
          </div>

          <div className="tc-homepage-cards-grid">
            {whatWeOffer.map(({ icon: Icon, title, description }) => (
              <div key={title} className="tc-feature-card tc-feature-card--fixed-h">
                <div className="tc-icon-badge tc-icon-badge--lg">
                  <Icon size={38} strokeWidth={2.2} color="#0B0B0C" />
                </div>
                <h3 className="tc-feature-card-h3">{title}</h3>
                <p className="tc-feature-card-p">{description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── WHY CHOOSE US ── */}
        <section className="tc-homepage-section tc-homepage-section--flush">
          <div className="tc-section-header">
            <h2 className="tc-section-title tc-section-title--lg">
              Why <span className="tc-gold">Choose Us</span>
            </h2>
            <p className="tc-homepage-section-sub">
              A range of digital solutions designed to support your business growth and long-term success
              across different platforms and industries.
            </p>
          </div>

          <div className="tc-homepage-cards-grid">
            {whyChooseUs.map(({ icon: Icon, title, description, theme }) => {
              const isGold = theme === 'gold';
              return (
                <div
                  key={title}
                  className={`tc-choose-card ${isGold ? 'tc-choose-card--gold' : ''}`}
                >
                  <div
                    className={`tc-choose-icon-badge ${isGold ? 'tc-choose-icon-badge--gold' : ''}`}
                  >
                    <Icon size={34} strokeWidth={2.2} />
                  </div>
                  <h3 className="tc-choose-title">{title}</h3>
                  <p className={`tc-choose-desc ${isGold ? 'tc-choose-desc--gold' : ''}`}>{description}</p>
                </div>
              );
            })}
          </div>
        </section>

        {/* ── FOOTER ── */}
        <footer className="tc-homepage-footer">
          <div className="tc-homepage-footer-inner">
            {/* Column 1: Brand & Socials */}
            <div>
              <div className="tc-logo-crop tc-logo-crop--footer" aria-label="TitanCode logo">
                <img src="/assets/logo.png" alt="" />
              </div>
              <p className="tc-footer-brand-p">
                We design and develop modern digital solutions that help businesses grow and stand out in
                today's competitive world.
              </p>
              <div className="tc-footer-social-row">
                <span className="tc-social-icon"><Music2 size={16} /></span>
                <span className="tc-social-icon tc-social-badge">in</span>
                <span className="tc-social-icon tc-social-badge">X</span>
                <span className="tc-social-icon tc-social-badge">◎</span>
              </div>
            </div>

            {/* Column 2: Quick Links */}
            <div>
              <h3 className="tc-footer-heading">Quick Links</h3>
              <ul className="tc-footer-ul">
                {[
                  { label: 'Home', view: 'home' as ScreenId },
                  { label: 'About', view: 'about_us' as ScreenId },
                  { label: 'Services', view: 'services' as ScreenId },
                  { label: 'FAQs', view: 'faqs' as ScreenId },
                  { label: 'Testimonies', view: 'testimonials' as ScreenId },
                ].map(({ label, view }) => (
                  <li key={label}>
                    <button type="button" onClick={() => onNavigate(view)} className="tc-footer-link">
                      {label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Column 3: Contact */}
            <div>
              <h3 className="tc-footer-heading">Contact</h3>
              <div className="tc-footer-contact-list">
                <div className="tc-footer-contact-row">
                  <Phone size={18} color="#FFFFFF" />
                  <span>+233(0)546606807</span>
                </div>
                <div className="tc-footer-contact-row">
                  <Mail size={18} color="#FFFFFF" />
                  <span>Titancode@gmail.com</span>
                </div>
              </div>
            </div>
          </div>

          <div className="tc-homepage-copyright-wrap">
            <div className="tc-footer-divider" />
            <p className="tc-footer-bottom">© Copyright 2026 TitanCode. All right reserved</p>
          </div>
        </footer>
      </main>
    </div>
  );
};
