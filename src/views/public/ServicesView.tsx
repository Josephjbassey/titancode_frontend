import React from 'react';
import type { ScreenId } from '../../App';
import { CheckCircle, Mail, Phone } from 'lucide-react';
import {
  ServiceWebGlobeIcon,
  ServiceMobileIcon,
  ServiceDesignIcon,
  ServiceLayersIcon,
  CircleSearchIcon,
  CirclePaletteIcon,
  CircleMonitorIcon,
  CircleVerifiedIcon,
  FlourishArrowIcon,
} from '../../components/FigmaIcons';
import '../../styles/public.css';

interface ServicesViewProps {
  onNavigate: (view: ScreenId) => void;
}

export const ServicesView: React.FC<ServicesViewProps> = ({ onNavigate }) => {
  return (
    <div className="tc-page-root" style={{ paddingBottom: '100px' }}>
      {/* 1. HERO BANNER — Figma: x:0, y:154, w:1440, h:463, no border-radius */}
      <section
        className="tc-subpage-hero"
        style={{ backgroundImage: 'url(/assets/servicesHero_bg.jpg)' }}
      >
        <div className="tc-subpage-hero__content">
          <h1 className="tc-hero-title">
            Our <span className="tc-gold">Services</span>
          </h1>
          <p className="tc-hero-subtitle">
            Comprehensive digital solutions tailored to meet your business needs and drive growth.
          </p>
        </div>
      </section>

      {/* 2. SERVICES SECTION */}
      <section className="tc-section" style={{ textAlign: 'center' }}>
        <div className="tc-section-inner">
          <h2 className="tc-section-title tc-section-title--gold">Services</h2>
          <p className="tc-body-text" style={{ maxWidth: '680px', margin: '0 auto 50px' }}>
            We design and develop websites, mobile apps, and software solutions that help businesses grow and solve real‑world problems.
          </p>

          {/* 4 Cards Grid */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(4, 1fr)',
              gap: '24px',
              textAlign: 'left',
            }}
          >
            <div className="tc-public-card">
              <div style={{ marginBottom: '24px' }}>
                <ServiceWebGlobeIcon style={{ width: '60px', height: '60px' }} />
              </div>
              <h3 className="tc-card-title">Web Development</h3>
              <p className="tc-body-text" style={{ fontSize: '14px' }}>We build responsive, websites tailored to your business goals.</p>
            </div>

            <div className="tc-public-card">
              <div style={{ marginBottom: '24px' }}>
                <ServiceMobileIcon style={{ width: '60px', height: '60px' }} />
              </div>
              <h3 className="tc-card-title">Mobile App</h3>
              <p className="tc-body-text" style={{ fontSize: '14px' }}>We develop mobile applications that deliver engaging experiences.</p>
            </div>

            <div className="tc-public-card">
              <div style={{ marginBottom: '24px' }}>
                <ServiceDesignIcon style={{ width: '60px', height: '60px' }} />
              </div>
              <h3 className="tc-card-title">UI/UX Design</h3>
              <p className="tc-body-text" style={{ fontSize: '14px' }}>We create intuitive designs that enhance usability and satisfaction.</p>
            </div>

            <div className="tc-public-card">
              <div style={{ marginBottom: '24px' }}>
                <ServiceLayersIcon style={{ width: '60px', height: '60px' }} />
              </div>
              <h3 className="tc-card-title">Product</h3>
              <p className="tc-body-text" style={{ fontSize: '14px' }}>We turn ideas into scalable digital products from concept to launch.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. OUR WORK PROCESS */}
      <section className="tc-section" style={{ marginTop: '50px', textAlign: 'center' }}>
        <div className="tc-section-inner">
          <h2 className="tc-section-title">
            Our Work <span className="tc-gold">Process</span>
          </h2>
          <p className="tc-body-text" style={{ maxWidth: '680px', margin: '0 auto 70px' }}>
            A simple and efficient approach to delivering high-quality digital solutions from start to finish.
          </p>

          {/* 4 Connected Circular Steps */}
          <div className="tc-process-row">
            {/* Step 1: Discover */}
            <div className="tc-process-step">
              <div style={{ position: 'relative', marginBottom: '24px' }}>
                <CircleSearchIcon style={{ width: '84px', height: '84px' }} />
                <span className="tc-step-number">01</span>
              </div>
              <h4 className="tc-card-title" style={{ fontSize: '20px' }}>Discover</h4>
              <p className="tc-body-text" style={{ fontSize: '14px', textAlign: 'center' }}>
                We understand your goals, requirements, and project vision.
              </p>
            </div>

            {/* Arrow 1 */}
            <div className="tc-process-arrow">
              <FlourishArrowIcon className="tc-process-arrow__svg" />
            </div>

            {/* Step 2: Design */}
            <div className="tc-process-step">
              <div style={{ position: 'relative', marginBottom: '24px' }}>
                <CirclePaletteIcon style={{ width: '84px', height: '84px' }} />
                <span className="tc-step-number">02</span>
              </div>
              <h4 className="tc-card-title" style={{ fontSize: '20px' }}>Design</h4>
              <p className="tc-body-text" style={{ fontSize: '14px', textAlign: 'center' }}>
                We craft intuitive and engaging user experiences.
              </p>
            </div>

            {/* Arrow 2 */}
            <div className="tc-process-arrow">
              <FlourishArrowIcon className="tc-process-arrow__svg" />
            </div>

            {/* Step 3: Develop */}
            <div className="tc-process-step">
              <div style={{ position: 'relative', marginBottom: '24px' }}>
                <CircleMonitorIcon style={{ width: '84px', height: '84px' }} />
                <span className="tc-step-number">03</span>
              </div>
              <h4 className="tc-card-title" style={{ fontSize: '20px' }}>Develop</h4>
              <p className="tc-body-text" style={{ fontSize: '14px', textAlign: 'center' }}>
                We build scalable and high-performance solutions.
              </p>
            </div>

            {/* Arrow 3 */}
            <div className="tc-process-arrow">
              <FlourishArrowIcon className="tc-process-arrow__svg" />
            </div>

            {/* Step 4: Deliver */}
            <div className="tc-process-step">
              <div style={{ position: 'relative', marginBottom: '24px' }}>
                <CircleVerifiedIcon style={{ width: '84px', height: '84px' }} />
                <span className="tc-step-number">04</span>
              </div>
              <h4 className="tc-card-title" style={{ fontSize: '20px' }}>Deliver</h4>
              <p className="tc-body-text" style={{ fontSize: '14px', textAlign: 'center' }}>
                We launch, test, and ensure everything runs smoothly.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. WHY CHOOSE US */}
      <section className="tc-section" style={{ marginTop: '60px' }}>
        <div className="tc-section-inner">
          <div className="tc-services-why-grid">
            {/* Left: Photos showcase */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div style={{ borderRadius: '16px', overflow: 'hidden', height: '340px', boxShadow: '0 12px 30px rgba(0,0,0,0.5)' }}>
                <img
                  src="/assets/services_1.jpg"
                  alt="Developer Workstation"
                  style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                />
              </div>
              <div style={{ borderRadius: '16px', overflow: 'hidden', height: '340px', marginTop: '28px', boxShadow: '0 12px 30px rgba(0,0,0,0.5)' }}>
                <img
                  src="/assets/services_2.jpg"
                  alt="Collaboration and Architecture"
                  style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                />
              </div>
            </div>

            {/* Right: Copy & Bullets */}
            <div>
              <h2 className="tc-section-title">
                Why Choose <span className="tc-gold">Us</span>
              </h2>
              <p className="tc-body-text" style={{ marginBottom: '36px' }}>
                We deliver reliable digital solutions with a focus on quality, scalability, and user experience.
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '26px', marginBottom: '40px' }}>
                {[
                  { label: 'User-Focused', copy: 'We design solutions that prioritize usability and real user needs.' },
                  { label: 'Scalable', copy: 'Our solutions are built to grow with your business over time.' },
                  { label: 'Modern', copy: 'We use modern technologies to build efficient and high-performing systems.' },
                  { label: 'Reliable', copy: 'We deliver consistent, high-quality results with attention to detail.' },
                ].map(({ label, copy }) => (
                  <div key={label} style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
                    <div style={{ marginTop: '2px' }}>
                      <CheckCircle size={22} fill="#dfae32" color="#0b0b0c" />
                    </div>
                    <div>
                      <h4 style={{ fontSize: '18px', fontWeight: '700', color: '#FFFFFF', marginBottom: '6px' }}>{label}</h4>
                      <p className="tc-body-text" style={{ fontSize: '14px' }}>{copy}</p>
                    </div>
                  </div>
                ))}
              </div>

              <button type="button" onClick={() => onNavigate('hire_us')} className="tc-btn-gold">
                Hire Us
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 5. BOTTOM CTA BANNER */}
      <section className="tc-section" style={{ marginTop: '60px' }}>
        <div className="tc-section-inner">
          <div className="tc-public-card tc-cta-banner">
            <h2 className="tc-section-title">
              Ready to Build Your <span className="tc-gold">Next Project?</span>
            </h2>
            <p className="tc-body-text" style={{ marginBottom: '36px' }}>
              Have a project or idea? Let's bring it to life with smart, scalable solutions.
            </p>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '20px', marginBottom: '40px' }}>
              <button type="button" onClick={() => onNavigate('hire_us')} className="tc-btn-gold">
                Hire Us
              </button>
              <button type="button" onClick={() => onNavigate('contact_us')} className="tc-btn-outline-gold" style={{ padding: '14px 34px', fontSize: '15px' }}>
                Contact Us
              </button>
            </div>

            <div className="tc-cta-contact-row">
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#9CA3AF', fontSize: '14px' }}>
                <Mail size={16} color="#DFAE32" />
                <span>Titancodetechnologies@gmail.com</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#9CA3AF', fontSize: '14px' }}>
                <Phone size={16} color="#DFAE32" />
                <span>+233(0)546606807</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
