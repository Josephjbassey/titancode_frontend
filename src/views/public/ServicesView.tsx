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
} from '../../components/FigmaIcons';

interface ServicesViewProps {
  onNavigate: (view: ScreenId) => void;
}

export const ServicesView: React.FC<ServicesViewProps> = ({ onNavigate }) => {
  return (
    <div style={{ backgroundColor: 'var(--tc-figma-black, #0B0B0C)', color: '#FFFFFF', paddingBottom: '100px' }}>
      {/* 1. HERO BANNER */}
      <section style={{ width: '100%', position: 'relative', overflow: 'hidden' }}>
        <img
          src="/assets/servicesHero_bg.jpg"
          alt="Our Services"
          style={{ width: '100%', maxHeight: '580px', objectFit: 'cover', display: 'block' }}
        />
      </section>

      {/* 2. SERVICES SECTION */}
      <section style={{ maxWidth: '1280px', margin: '90px auto 0', padding: '0 40px', textAlign: 'center' }}>
        <h2 style={{ fontSize: '38px', fontWeight: '800', color: 'var(--tc-figma-gold, #DFAE32)', marginBottom: '16px', fontFamily: "'Inter', sans-serif" }}>
          Services
        </h2>
        <p style={{ fontSize: '16px', color: '#9CA3AF', maxWidth: '680px', margin: '0 auto 50px', lineHeight: '1.6', fontFamily: "'Poppins', sans-serif" }}>
          We design and develop websites, mobile apps, and software solutions that help businesses grow and solve realworld problems.
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
          {/* Card 1: Web Development */}
          <div
            style={{
              backgroundColor: '#FFFFFF1A',
              border: '1px solid #FFFFFF26',
              borderRadius: '20px',
              padding: '36px 28px',
              transition: 'border-color 0.2s ease',
            }}
          >
            <div style={{ marginBottom: '24px' }}>
              <ServiceWebGlobeIcon style={{ width: '60px', height: '60px' }} />
            </div>
            <h3 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '14px', color: '#FFFFFF' }}>
              Web Development
            </h3>
            <p style={{ fontSize: '14px', color: '#9CA3AF', lineHeight: '1.6' }}>
              We build responsive, websites tailored to your business goals.
            </p>
          </div>

          {/* Card 2: Mobile App */}
          <div
            style={{
              backgroundColor: '#FFFFFF1A',
              border: '1px solid #FFFFFF26',
              borderRadius: '20px',
              padding: '36px 28px',
              transition: 'border-color 0.2s ease',
            }}
          >
            <div style={{ marginBottom: '24px' }}>
              <ServiceMobileIcon style={{ width: '60px', height: '60px' }} />
            </div>
            <h3 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '14px', color: '#FFFFFF' }}>
              Mobile App
            </h3>
            <p style={{ fontSize: '14px', color: '#9CA3AF', lineHeight: '1.6' }}>
              We develop mobile applications that deliver engaging experiences.
            </p>
          </div>

          {/* Card 3: UI/UX Design */}
          <div
            style={{
              backgroundColor: '#FFFFFF1A',
              border: '1px solid #FFFFFF26',
              borderRadius: '20px',
              padding: '36px 28px',
              transition: 'border-color 0.2s ease',
            }}
          >
            <div style={{ marginBottom: '24px' }}>
              <ServiceDesignIcon style={{ width: '60px', height: '60px' }} />
            </div>
            <h3 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '14px', color: '#FFFFFF' }}>
              UI/UX Design
            </h3>
            <p style={{ fontSize: '14px', color: '#9CA3AF', lineHeight: '1.6' }}>
              We create intuitive designs that enhance usability and satisfaction.
            </p>
          </div>

          {/* Card 4: Product */}
          <div
            style={{
              backgroundColor: '#FFFFFF1A',
              border: '1px solid #FFFFFF26',
              borderRadius: '20px',
              padding: '36px 28px',
              transition: 'border-color 0.2s ease',
            }}
          >
            <div style={{ marginBottom: '24px' }}>
              <ServiceLayersIcon style={{ width: '60px', height: '60px' }} />
            </div>
            <h3 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '14px', color: '#FFFFFF' }}>
              Product
            </h3>
            <p style={{ fontSize: '14px', color: '#9CA3AF', lineHeight: '1.6' }}>
              We turn ideas into scalable digital products from concept to launch.
            </p>
          </div>
        </div>
      </section>

      {/* 3. OUR WORK PROCESS */}
      <section style={{ maxWidth: '1280px', margin: '140px auto 0', padding: '0 40px', textAlign: 'center' }}>
        <h2 style={{ fontSize: '38px', fontWeight: '800', marginBottom: '16px' }}>
          Our Work <span style={{ color: '#DFAE32' }}>Process</span>
        </h2>
        <p style={{ fontSize: '16px', color: '#9CA3AF', maxWidth: '680px', margin: '0 auto 70px', lineHeight: '1.6' }}>
          A simple and efficient approach to delivering high-quality digital solutions from start to finish.
        </p>

        {/* 4 Connected Circular Steps */}
        <div
          style={{
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
            position: 'relative',
          }}
        >
          {/* Step 1: Discover */}
          <div style={{ flex: 1, maxWidth: '240px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={{ position: 'relative', marginBottom: '24px' }}>
              <CircleSearchIcon style={{ width: '84px', height: '84px' }} />
              <span
                style={{
                  position: 'absolute',
                  top: '0',
                  right: '-6px',
                  backgroundColor: '#0B0B0C',
                  border: '1px solid #DFAE32',
                  color: '#FFFFFF',
                  fontSize: '11px',
                  fontWeight: '700',
                  padding: '2px 7px',
                  borderRadius: '12px',
                }}
              >
                01
              </span>
            </div>
            <h4 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '12px', color: '#FFFFFF' }}>
              Discover
            </h4>
            <p style={{ fontSize: '14px', color: '#9CA3AF', lineHeight: '1.6', textAlign: 'center' }}>
              We understand your goals, requirements, and project vision.
            </p>
          </div>

          {/* Curved connector 1 */}
          <div style={{ flex: '0 0 70px', paddingTop: '35px' }}>
            <svg width="70" height="24" viewBox="0 0 70 24" fill="none">
              <path
                d="M 5 20 Q 35 -5 65 14"
                stroke="#DFAE32"
                strokeWidth="2"
                fill="none"
              />
              <polygon points="63,9 68,15 60,16" fill="#DFAE32" />
            </svg>
          </div>

          {/* Step 2: Design */}
          <div style={{ flex: 1, maxWidth: '240px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={{ position: 'relative', marginBottom: '24px' }}>
              <CirclePaletteIcon style={{ width: '84px', height: '84px' }} />
              <span
                style={{
                  position: 'absolute',
                  top: '0',
                  right: '-6px',
                  backgroundColor: '#0B0B0C',
                  border: '1px solid #DFAE32',
                  color: '#FFFFFF',
                  fontSize: '11px',
                  fontWeight: '700',
                  padding: '2px 7px',
                  borderRadius: '12px',
                }}
              >
                02
              </span>
            </div>
            <h4 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '12px', color: '#FFFFFF' }}>
              Design
            </h4>
            <p style={{ fontSize: '14px', color: '#9CA3AF', lineHeight: '1.6', textAlign: 'center' }}>
              We craft intuitive and engaging user experiences.
            </p>
          </div>

          {/* Curved connector 2 */}
          <div style={{ flex: '0 0 70px', paddingTop: '35px' }}>
            <svg width="70" height="24" viewBox="0 0 70 24" fill="none">
              <path
                d="M 5 20 Q 35 -5 65 14"
                stroke="#DFAE32"
                strokeWidth="2"
                fill="none"
              />
              <polygon points="63,9 68,15 60,16" fill="#DFAE32" />
            </svg>
          </div>

          {/* Step 3: Develop */}
          <div style={{ flex: 1, maxWidth: '240px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={{ position: 'relative', marginBottom: '24px' }}>
              <CircleMonitorIcon style={{ width: '84px', height: '84px' }} />
              <span
                style={{
                  position: 'absolute',
                  top: '0',
                  right: '-6px',
                  backgroundColor: '#0B0B0C',
                  border: '1px solid #DFAE32',
                  color: '#FFFFFF',
                  fontSize: '11px',
                  fontWeight: '700',
                  padding: '2px 7px',
                  borderRadius: '12px',
                }}
              >
                03
              </span>
            </div>
            <h4 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '12px', color: '#FFFFFF' }}>
              Develop
            </h4>
            <p style={{ fontSize: '14px', color: '#9CA3AF', lineHeight: '1.6', textAlign: 'center' }}>
              We build scalable and high-performance solutions.
            </p>
          </div>

          {/* Curved connector 3 */}
          <div style={{ flex: '0 0 70px', paddingTop: '35px' }}>
            <svg width="70" height="24" viewBox="0 0 70 24" fill="none">
              <path
                d="M 5 20 Q 35 -5 65 14"
                stroke="#DFAE32"
                strokeWidth="2"
                fill="none"
              />
              <polygon points="63,9 68,15 60,16" fill="#DFAE32" />
            </svg>
          </div>

          {/* Step 4: Deliver */}
          <div style={{ flex: 1, maxWidth: '240px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={{ position: 'relative', marginBottom: '24px' }}>
              <CircleVerifiedIcon style={{ width: '84px', height: '84px' }} />
              <span
                style={{
                  position: 'absolute',
                  top: '0',
                  right: '-6px',
                  backgroundColor: '#0B0B0C',
                  border: '1px solid #DFAE32',
                  color: '#FFFFFF',
                  fontSize: '11px',
                  fontWeight: '700',
                  padding: '2px 7px',
                  borderRadius: '12px',
                }}
              >
                04
              </span>
            </div>
            <h4 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '12px', color: '#FFFFFF' }}>
              Deliver
            </h4>
            <p style={{ fontSize: '14px', color: '#9CA3AF', lineHeight: '1.6', textAlign: 'center' }}>
              We launch, test, and ensure everything runs smoothly.
            </p>
          </div>
        </div>
      </section>

      {/* 4. WHY CHOOSE US */}
      <section style={{ maxWidth: '1280px', margin: '150px auto 0', padding: '0 40px' }}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '70px',
            alignItems: 'center',
          }}
        >
          {/* Left: Photos showcase using services_1.jpg & services_2.jpg */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div style={{ borderRadius: '16px', overflow: 'hidden', height: '340px', boxShadow: '0 12px 30px rgba(0,0,0,0.5)' }}>
              <img
                src="/assets/services_1.jpg"
                alt="Developer Workstation"
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  display: 'block',
                }}
              />
            </div>
            <div style={{ borderRadius: '16px', overflow: 'hidden', height: '340px', marginTop: '28px', boxShadow: '0 12px 30px rgba(0,0,0,0.5)' }}>
              <img
                src="/assets/services_2.jpg"
                alt="Collaboration and Architecture"
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  display: 'block',
                }}
              />
            </div>
          </div>

          {/* Right: Copy & Bullets */}
          <div>
            <h2 style={{ fontSize: '42px', fontWeight: '800', marginBottom: '16px' }}>
              Why Choose <span style={{ color: '#dfae32' }}>Us</span>
            </h2>
            <p style={{ fontSize: '16px', color: '#9CA3AF', lineHeight: '1.6', marginBottom: '36px' }}>
              We deliver reliable digital solutions with a focus on quality, scalability, and user experience.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '26px', marginBottom: '40px' }}>
              {/* Feature 1 */}
              <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
                <div style={{ color: '#dfae32', marginTop: '2px' }}>
                  <CheckCircle size={22} fill="#dfae32" color="#0b0b0c" />
                </div>
                <div>
                  <h4 style={{ fontSize: '18px', fontWeight: '700', color: '#FFFFFF', marginBottom: '6px' }}>
                    User-Focused
                  </h4>
                  <p style={{ fontSize: '14px', color: '#9CA3AF', lineHeight: '1.6' }}>
                    We design solutions that prioritize usability and real user needs.
                  </p>
                </div>
              </div>

              {/* Feature 2 */}
              <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
                <div style={{ color: '#dfae32', marginTop: '2px' }}>
                  <CheckCircle size={22} fill="#dfae32" color="#0b0b0c" />
                </div>
                <div>
                  <h4 style={{ fontSize: '18px', fontWeight: '700', color: '#FFFFFF', marginBottom: '6px' }}>
                    Scalable
                  </h4>
                  <p style={{ fontSize: '14px', color: '#9CA3AF', lineHeight: '1.6' }}>
                    Our solutions are built to grow with your business over time.
                  </p>
                </div>
              </div>

              {/* Feature 3 */}
              <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
                <div style={{ color: '#dfae32', marginTop: '2px' }}>
                  <CheckCircle size={22} fill="#dfae32" color="#0b0b0c" />
                </div>
                <div>
                  <h4 style={{ fontSize: '18px', fontWeight: '700', color: '#FFFFFF', marginBottom: '6px' }}>
                    Modern
                  </h4>
                  <p style={{ fontSize: '14px', color: '#9CA3AF', lineHeight: '1.6' }}>
                    We use modern technologies to build efficient and high-performing systems.
                  </p>
                </div>
              </div>

              {/* Feature 4 */}
              <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
                <div style={{ color: '#dfae32', marginTop: '2px' }}>
                  <CheckCircle size={22} fill="#dfae32" color="#0b0b0c" />
                </div>
                <div>
                  <h4 style={{ fontSize: '18px', fontWeight: '700', color: '#FFFFFF', marginBottom: '6px' }}>
                    Reliable
                  </h4>
                  <p style={{ fontSize: '14px', color: '#9CA3AF', lineHeight: '1.6' }}>
                    We deliver consistent, high-quality results with attention to detail.
                  </p>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => onNavigate('hire_us')}
              style={{
                backgroundColor: '#dfae32',
                color: '#0b0b0c',
                fontWeight: '700',
                fontSize: '15px',
                padding: '14px 36px',
                borderRadius: '8px',
                border: 'none',
                cursor: 'pointer',
                transition: 'background-color 0.2s ease',
              }}
              onMouseOver={(e) => (e.currentTarget.style.backgroundColor = '#eec147')}
              onMouseOut={(e) => (e.currentTarget.style.backgroundColor = '#dfae32')}
            >
              Hire Us
            </button>
          </div>
        </div>
      </section>

      {/* 5. BOTTOM CTA BANNER (matching Figma) */}
      <section style={{ maxWidth: '1280px', margin: '140px auto 0', padding: '0 40px' }}>
        <div
          style={{
            backgroundColor: '#FFFFFF1A',
            border: '1px solid #FFFFFF26',
            borderRadius: '24px',
            padding: '70px 40px',
            textAlign: 'center',
          }}
        >
          <h2 style={{ fontSize: '42px', fontWeight: '800', marginBottom: '16px' }}>
            Ready to Build Your <span style={{ color: '#DFAE32' }}>Next Project?</span>
          </h2>
          <p style={{ fontSize: '16px', color: '#9CA3AF', marginBottom: '36px' }}>
            Have a project or idea? Let’s bring it to life with smart, scalable solutions.
          </p>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '20px', marginBottom: '40px' }}>
            <button
              type="button"
              onClick={() => onNavigate('hire_us')}
              style={{
                backgroundColor: '#DFAE32',
                color: '#0B0B0C',
                fontWeight: '700',
                fontSize: '15px',
                padding: '14px 34px',
                borderRadius: '8px',
                border: 'none',
                cursor: 'pointer',
              }}
            >
              Hire Us
            </button>

            <button
              type="button"
              onClick={() => onNavigate('contact_us')}
              style={{
                backgroundColor: 'transparent',
                color: '#FFFFFF',
                fontWeight: '600',
                fontSize: '15px',
                padding: '14px 34px',
                borderRadius: '8px',
                border: '1px solid #DFAE32',
                cursor: 'pointer',
              }}
            >
              Contact Us
            </button>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '40px', color: '#9CA3AF', fontSize: '14px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Mail size={16} color="#DFAE32" />
              <span>Titancodetechnologies@gmail.com</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Phone size={16} color="#DFAE32" />
              <span>+233(0)546606807</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
