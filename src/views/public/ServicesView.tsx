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
    <div className="tc-page-root tc-services-root">
      {/* 1. HERO BANNER — Figma: x:0, y:154, w:1440, h:463, no border-radius */}
      <section
        className="tc-subpage-hero tc-subpage-hero--services"
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
      <section className="tc-section tc-section--center">
        <div className="tc-section-inner">
          <h2 className="tc-section-title tc-section-title--gold">Services</h2>
          <p className="tc-body-text tc-services-desc">
            We design and develop websites, mobile apps, and software solutions that help businesses grow and solve real‑world problems.
          </p>

          {/* 4 Cards Grid */}
          <div className="tc-services-cards-grid">
            <div className="tc-public-card">
              <div className="tc-services-icon-box">
                <ServiceWebGlobeIcon className="tc-service-icon-svg" />
              </div>
              <h3 className="tc-card-title">Web Development</h3>
              <p className="tc-body-text tc-body-text--sm">We build responsive, websites tailored to your business goals.</p>
            </div>

            <div className="tc-public-card">
              <div className="tc-services-icon-box">
                <ServiceMobileIcon className="tc-service-icon-svg" />
              </div>
              <h3 className="tc-card-title">Mobile App</h3>
              <p className="tc-body-text tc-body-text--sm">We develop mobile applications that deliver engaging experiences.</p>
            </div>

            <div className="tc-public-card">
              <div className="tc-services-icon-box">
                <ServiceDesignIcon className="tc-service-icon-svg" />
              </div>
              <h3 className="tc-card-title">UI/UX Design</h3>
              <p className="tc-body-text tc-body-text--sm">We create intuitive designs that enhance usability and satisfaction.</p>
            </div>

            <div className="tc-public-card">
              <div className="tc-services-icon-box">
                <ServiceLayersIcon className="tc-service-icon-svg" />
              </div>
              <h3 className="tc-card-title">Product</h3>
              <p className="tc-body-text tc-body-text--sm">We turn ideas into scalable digital products from concept to launch.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. OUR WORK PROCESS */}
      <section className="tc-section tc-section--process">
        <div className="tc-section-inner">
          <h2 className="tc-section-title">
            Our Work <span className="tc-gold">Process</span>
          </h2>
          <p className="tc-body-text tc-process-desc">
            A simple and efficient approach to delivering high-quality digital solutions from start to finish.
          </p>

          {/* 4 Connected Circular Steps */}
          <div className="tc-process-row">
            {/* Step 1: Discover */}
            <div className="tc-process-step">
              <div className="tc-step-icon-wrap">
                <CircleSearchIcon className="tc-step-icon-svg" />
                <span className="tc-step-number">01</span>
              </div>
              <h4 className="tc-card-title tc-step-title">Discover</h4>
              <p className="tc-body-text tc-step-body">
                We understand your goals, requirements, and project vision.
              </p>
            </div>

            {/* Arrow 1 */}
            <div className="tc-process-arrow">
              <FlourishArrowIcon className="tc-process-arrow__svg" />
            </div>

            {/* Step 2: Design */}
            <div className="tc-process-step">
              <div className="tc-step-icon-wrap">
                <CirclePaletteIcon className="tc-step-icon-svg" />
                <span className="tc-step-number">02</span>
              </div>
              <h4 className="tc-card-title tc-step-title">Design</h4>
              <p className="tc-body-text tc-step-body">
                We craft intuitive and engaging user experiences.
              </p>
            </div>

            {/* Arrow 2 */}
            <div className="tc-process-arrow">
              <FlourishArrowIcon className="tc-process-arrow__svg" />
            </div>

            {/* Step 3: Develop */}
            <div className="tc-process-step">
              <div className="tc-step-icon-wrap">
                <CircleMonitorIcon className="tc-step-icon-svg" />
                <span className="tc-step-number">03</span>
              </div>
              <h4 className="tc-card-title tc-step-title">Develop</h4>
              <p className="tc-body-text tc-step-body">
                We build scalable and high-performance solutions.
              </p>
            </div>

            {/* Arrow 3 */}
            <div className="tc-process-arrow">
              <FlourishArrowIcon className="tc-process-arrow__svg" />
            </div>

            {/* Step 4: Deliver */}
            <div className="tc-process-step">
              <div className="tc-step-icon-wrap">
                <CircleVerifiedIcon className="tc-step-icon-svg" />
                <span className="tc-step-number">04</span>
              </div>
              <h4 className="tc-card-title tc-step-title">Deliver</h4>
              <p className="tc-body-text tc-step-body">
                We launch, test, and ensure everything runs smoothly.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. WHY CHOOSE US */}
      <section className="tc-section tc-section--why">
        <div className="tc-section-inner">
          <div className="tc-services-why-grid">
            {/* Left: Photos showcase */}
            <div className="tc-why-photos-grid">
              <div className="tc-why-photo-wrap">
                <img
                  src="/assets/services_1.jpg"
                  alt="Developer Workstation"
                  className="tc-why-photo-img"
                />
              </div>
              <div className="tc-why-photo-wrap tc-why-photo-wrap--offset">
                <img
                  src="/assets/services_2.jpg"
                  alt="Collaboration and Architecture"
                  className="tc-why-photo-img"
                />
              </div>
            </div>

            {/* Right: Copy & Bullets */}
            <div>
              <h2 className="tc-section-title">
                Why Choose <span className="tc-gold">Us</span>
              </h2>
              <p className="tc-body-text tc-why-desc">
                We deliver reliable digital solutions with a focus on quality, scalability, and user experience.
              </p>

              <div className="tc-why-bullets-list">
                {[
                  { label: 'User-Focused', copy: 'We design solutions that prioritize usability and real user needs.' },
                  { label: 'Scalable', copy: 'Our solutions are built to grow with your business over time.' },
                  { label: 'Modern', copy: 'We use modern technologies to build efficient and high-performing systems.' },
                  { label: 'Reliable', copy: 'We deliver consistent, high-quality results with attention to detail.' },
                ].map(({ label, copy }) => (
                  <div key={label} className="tc-why-bullet-row">
                    <div className="tc-why-bullet-icon">
                      <CheckCircle size={22} fill="#dfae32" color="#0b0b0c" />
                    </div>
                    <div>
                      <h4 className="tc-why-bullet-title">{label}</h4>
                      <p className="tc-body-text tc-body-text--sm">{copy}</p>
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
      <section className="tc-section tc-section--cta">
        <div className="tc-section-inner">
          <div className="tc-public-card tc-cta-banner">
            <h2 className="tc-section-title">
              Ready to Build Your <span className="tc-gold">Next Project?</span>
            </h2>
            <p className="tc-body-text tc-cta-desc">
              Have a project or idea? Let's bring it to life with smart, scalable solutions.
            </p>

            <div className="tc-cta-buttons-wrap">
              <button type="button" onClick={() => onNavigate('hire_us')} className="tc-btn-gold">
                Hire Us
              </button>
              <button type="button" onClick={() => onNavigate('contact_us')} className="tc-btn-outline-gold tc-btn-outline-gold--cta">
                Contact Us
              </button>
            </div>

            <div className="tc-cta-contact-row">
              <div className="tc-cta-contact-item">
                <Mail size={16} color="#DFAE32" />
                <span>Titancodetechnologies@gmail.com</span>
              </div>
              <div className="tc-cta-contact-item">
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
