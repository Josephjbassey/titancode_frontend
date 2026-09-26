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
    <div className="tc-homepage" style={{ backgroundColor: '#0B0B0C', color: '#FFFFFF', minHeight: '100vh' }}>
      {/* ── HEADER ── */}
      <header className="tc-homepage-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div className="tc-logo-crop" aria-label="TitanCode logo" style={{ width: '158px', height: '38px' }}>
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
          style={{ display: 'flex', alignItems: 'center', gap: 32, fontSize: 18, flexWrap: 'wrap', justifyContent: 'center' }}
        >
          <button type="button" onClick={() => navigate('home')} className="tc-nav-link tc-nav-link--active">Home</button>
          <button type="button" onClick={() => navigate('about_us')} className="tc-nav-link">About Us</button>
          <button type="button" onClick={() => navigate('services')} className="tc-nav-link">Services</button>
          <button type="button" onClick={() => navigate('contact_us')} className="tc-nav-link">Contact Us</button>
        </nav>

        <button
          type="button"
          className="tc-btn-gold tc-homepage-cta"
          onClick={() => navigate('hire_us')}
          style={{ fontSize: 18, borderRadius: 6, padding: '10px 24px' }}
        >
          Hire Us
        </button>
      </header>

      <main style={{ position: 'relative' }}>
        {/* ── HERO SECTION ── */}
        <section
          style={{
            width: '100%',
            maxWidth: 'none',
            margin: '0 auto',
            padding: '44px 60px 0',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          {/* Gold blur shadow: bg #DFAE32, blur(50px), w:1440, h:631, left:11, top:251 */}
          <div
            style={{
              position: 'absolute',
              left: 11,
              top: 251,
              width: 1440,
              height: 631,
              background: '#DFAE32',
              filter: 'blur(50px)',
              pointerEvents: 'none',
              zIndex: 0,
            }}
          />

          {/* Dark overlay: #0B0B0C 80% opacity, w:1440, h:1038, top:140 */}
          <div
            style={{
              position: 'absolute',
              left: 0,
              top: 0,
              width: '100%',
              height: 1038,
              background: 'rgba(11,11,12,0.80)',
              pointerEvents: 'none',
              zIndex: 1,
            }}
          />

          {/* Background image container: w:1440, h:742, top:140, no border-radius */}
          <div
            style={{
              position: 'relative',
              height: 742,
              borderRadius: 0,
              overflow: 'hidden',
              zIndex: 2,
            }}
          >
            <div
              style={{
                position: 'absolute',
                inset: 0,
                background: 'linear-gradient(90deg, rgba(0,0,0,0.38), rgba(0,0,0,0.08) 35%, rgba(0,0,0,0.24)), linear-gradient(180deg, rgba(0,0,0,0.08), rgba(0,0,0,0.28))',
                pointerEvents: 'none',
              }}
            />
            <img
              src="/assets/landingpage1.jpg"
              alt="TitanCode product interface"
              style={{
                display: 'block',
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                filter: 'saturate(0.9) contrast(1.08) brightness(0.75)',
              }}
            />
          </div>

          {/* Hero text overlay */}
          <div
            style={{
              position: 'absolute',
              inset: '0 0 auto 0',
              padding: '100px 0 0',
              textAlign: 'center',
              zIndex: 3,
            }}
          >
            <h1
              style={{
                margin: '0 auto',
                maxWidth: 1040,
                fontSize: 66,
                lineHeight: 1.08,
                letterSpacing: '-0.04em',
                fontWeight: 800,
                color: '#FFFFFF',
                textAlign: 'center',
              }}
            >
              Empowering Your <span className="tc-gold">Business Ideas</span>
              <br />
              with <span className="tc-gold">Innovative</span> Software
              <br />
              Solutions
            </h1>

            <p
              style={{
                margin: '30px auto 36px',
                maxWidth: 730,
                fontSize: 22,
                lineHeight: 1.5,
                color: 'rgba(255,255,255,0.96)',
                fontWeight: 400,
              }}
            >
              We design and develop websites, mobile apps, and software platforms
              <br />
              that solve real-world problems.
            </p>

            <div style={{ display: 'flex', justifyContent: 'center', gap: 18, marginBottom: 30 }}>
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
        <section style={{ width: '100%', margin: '0 auto', padding: '118px clamp(24px, 4vw, 60px) 0' }}>
          <div className="tc-section-header">
            <h2 className="tc-section-title" style={{ fontSize: 55 }}>
              What We <span className="tc-gold">Do</span>
            </h2>
            <p style={{ margin: '18px auto 0', maxWidth: 680, color: 'rgba(255,255,255,0.82)', fontSize: 18, lineHeight: 1.6 }}>
              We design and develop websites, mobile apps, and software solutions that help businesses
              grow and solve real-world problems.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(180px, 1fr))', gap: 28 }}>
            {whatWeDo.map(({ icon: Icon, title, description }) => (
              <div key={title} className="tc-feature-card">
                <div className="tc-icon-badge" style={{ width: 78, height: 78, borderRadius: 18, marginBottom: 20 }}>
                  <Icon size={38} strokeWidth={2.2} color="#0B0B0C" />
                </div>
                <h3 style={{ fontSize: 26, fontWeight: 700, marginBottom: 12 }}>{title}</h3>
                <p style={{ fontSize: 17, lineHeight: 1.6, color: 'rgba(255,255,255,0.8)' }}>{description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── WHAT WE OFFER ── */}
        <section style={{ maxWidth: 'none', margin: '0 auto', padding: '116px 60px 0' }}>
          <div className="tc-section-header">
            <h2 className="tc-section-title" style={{ fontSize: 55 }}>
              What We <span className="tc-gold">Offer</span>
            </h2>
            <p style={{ margin: '18px auto 0', maxWidth: 690, color: 'rgba(255,255,255,0.82)', fontSize: 18, lineHeight: 1.6 }}>
              A range of digital solutions designed to support your business growth and long-term success
              across different platforms and industries.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(180px, 1fr))', gap: 28 }}>
            {whatWeOffer.map(({ icon: Icon, title, description }) => (
              <div key={title} className="tc-feature-card" style={{ minHeight: 296 }}>
                <div className="tc-icon-badge" style={{ width: 78, height: 78, borderRadius: 18, marginBottom: 20 }}>
                  <Icon size={38} strokeWidth={2.2} color="#0B0B0C" />
                </div>
                <h3 style={{ fontSize: 22, fontWeight: 700, marginBottom: 10 }}>{title}</h3>
                <p style={{ fontSize: 16, lineHeight: 1.6, color: 'rgba(255,255,255,0.8)' }}>{description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── WHY CHOOSE US ── */}
        <section style={{ maxWidth: 'none', margin: '0 auto', padding: '116px 60px 0' }}>
          <div className="tc-section-header">
            <h2 className="tc-section-title" style={{ fontSize: 55 }}>
              Why <span className="tc-gold">Choose Us</span>
            </h2>
            <p style={{ margin: '18px auto 0', maxWidth: 690, color: 'rgba(255,255,255,0.82)', fontSize: 18, lineHeight: 1.6 }}>
              A range of digital solutions designed to support your business growth and long-term success
              across different platforms and industries.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(180px, 1fr))', gap: 28 }}>
            {whyChooseUs.map(({ icon: Icon, title, description, theme }) => {
              const isGold = theme === 'gold';
              return (
                <div
                  key={title}
                  style={{
                    borderRadius: 30,
                    minHeight: 286,
                    padding: '34px 28px 26px',
                    display: 'flex',
                    flexDirection: 'column',
                    border: '1px solid rgba(255,255,255,0.2)',
                    background: isGold ? '#DFAE32' : '#191A1C',
                    color: '#FFFFFF',
                  }}
                >
                  <div
                    style={{
                      width: 68,
                      height: 68,
                      borderRadius: 18,
                      background: isGold ? '#0B0B0C' : 'rgba(223, 174, 50, 0.14)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginBottom: 20,
                      color: '#DFAE32',
                    }}
                  >
                    <Icon size={34} strokeWidth={2.2} />
                  </div>
                  <h3 style={{ fontSize: 22, fontWeight: 700, marginBottom: 12, color: '#FFFFFF' }}>{title}</h3>
                  <p style={{ fontSize: 16, lineHeight: 1.6, color: isGold ? '#171717' : 'rgba(255,255,255,0.8)' }}>{description}</p>
                </div>
              );
            })}
          </div>
        </section>

        {/* ── FOOTER ── */}
        <footer style={{ marginTop: 120, background: '#0B0B0C', borderTop: '1px solid rgba(255,255,255,0.08)', width: '100%' }}>
          <div
            style={{
              maxWidth: 'none',
              margin: '0 auto',
              padding: '44px 60px 20px',
              display: 'grid',
              gridTemplateColumns: '1.5fr 0.7fr 0.9fr',
              gap: 40,
              alignItems: 'start',
            }}
          >
            {/* Column 1: Brand & Socials */}
            <div>
              <div className="tc-logo-crop tc-logo-crop--footer" aria-label="TitanCode logo" style={{ marginBottom: 18 }}>
                <img src="/assets/logo.png" alt="" />
              </div>
              <p style={{ maxWidth: 400, color: 'rgba(255,255,255,0.8)', fontSize: 18, lineHeight: 1.7 }}>
                We design and develop modern digital solutions that help businesses grow and stand out in
                today's competitive world.
              </p>
              <div style={{ display: 'flex', gap: 14, marginTop: 24 }}>
                <span className="tc-social-icon"><Music2 size={16} /></span>
                <span className="tc-social-icon" style={{ fontSize: 12, fontWeight: 800 }}>in</span>
                <span className="tc-social-icon" style={{ fontSize: 12, fontWeight: 800 }}>X</span>
                <span className="tc-social-icon" style={{ fontSize: 12, fontWeight: 800 }}>◎</span>
              </div>
            </div>

            {/* Column 2: Quick Links */}
            <div>
              <h3 className="tc-footer-heading">Quick Links</h3>
              <ul style={{ listStyle: 'none', display: 'grid', gap: 10, padding: 0, margin: 0 }}>
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
              <div style={{ display: 'grid', gap: 12 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'rgba(255,255,255,0.85)', fontSize: 16 }}>
                  <Phone size={18} color="#FFFFFF" />
                  <span>+233(0)546606807</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'rgba(255,255,255,0.85)', fontSize: 16 }}>
                  <Mail size={18} color="#FFFFFF" />
                  <span>Titancode@gmail.com</span>
                </div>
              </div>
            </div>
          </div>

          <div style={{ maxWidth: 'none', margin: '0 auto', padding: '18px 60px 26px' }}>
            <div style={{ height: 1, background: 'rgba(255,255,255,0.12)', marginBottom: 26 }} />
            <p className="tc-footer-bottom">© Copyright 2026 TitanCode. All right reserved</p>
          </div>
        </footer>
      </main>
    </div>
  );
};
