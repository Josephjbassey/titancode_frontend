import React from 'react';
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
  ArrowRight,
  Sparkles,
} from 'lucide-react';

interface HomepageViewProps {
  onNavigate: (view: ScreenId) => void;
}

export const HomepageView: React.FC<HomepageViewProps> = ({ onNavigate }) => {
  return (
    <div style={{ backgroundColor: '#0B0E14', color: '#FFFFFF', minHeight: '100vh' }}>
      {/* 1. HERO SECTION */}
      <section
        style={{
          position: 'relative',
          padding: '110px 80px 140px',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          borderBottom: '1px solid rgba(229, 168, 59, 0.15)',
        }}
      >
        {/* Background glow & hero banner image */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage: 'url(/assets/homepage_hero_banner.png)',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            backgroundSize: 'cover',
            opacity: 0.28,
            pointerEvents: 'none',
          }}
        />
        <div
          style={{
            position: 'absolute',
            top: '20%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '600px',
            height: '400px',
            background: 'radial-gradient(circle, rgba(229, 168, 59, 0.18) 0%, rgba(11, 14, 20, 0) 70%)',
            pointerEvents: 'none',
            zIndex: 0,
          }}
        />

        <div style={{ position: 'relative', zIndex: 1, maxWidth: '980px' }}>
          {/* Badge */}
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '6px 18px',
              borderRadius: '999px',
              backgroundColor: 'rgba(229, 168, 59, 0.1)',
              border: '1px solid rgba(229, 168, 59, 0.3)',
              color: '#E5A83B',
              fontSize: '13px',
              fontWeight: '600',
              marginBottom: '28px',
              letterSpacing: '0.04em',
            }}
          >
            <Sparkles size={14} color="#E5A83B" />
            <span>CREATIVE DIGITAL ENGINEERING & PRODUCT STUDIO</span>
          </div>

          {/* Main Title */}
          <h1
            style={{
              fontSize: '56px',
              lineHeight: 1.18,
              fontWeight: 800,
              color: '#FFFFFF',
              letterSpacing: '-0.02em',
              marginBottom: '24px',
            }}
          >
            Empowering Your{' '}
            <span style={{ color: '#E5A83B' }}>Business Ideas</span> with{' '}
            <span style={{ color: '#E5A83B' }}>Innovative</span> Software Solutions
          </h1>

          {/* Subtitle */}
          <p
            style={{
              fontSize: '18px',
              color: '#9CA3AF',
              lineHeight: 1.65,
              maxWidth: '720px',
              margin: '0 auto 40px',
            }}
          >
            We design and develop websites, mobile apps, and software platforms that solve
            real-world problems and fuel sustainable market growth.
          </p>

          {/* CTA Buttons */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '20px',
              flexWrap: 'wrap',
            }}
          >
            <button
              type="button"
              onClick={() => onNavigate('hire_us')}
              style={{
                backgroundColor: '#E5A83B',
                color: '#0A0D14',
                fontWeight: 700,
                fontSize: '16px',
                padding: '16px 36px',
                borderRadius: '8px',
                border: 'none',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '10px',
                boxShadow: '0 8px 24px rgba(229, 168, 59, 0.35)',
                transition: 'all 0.2s ease',
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.backgroundColor = '#F4B333';
                e.currentTarget.style.transform = 'translateY(-2px)';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.backgroundColor = '#E5A83B';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              <span>Hire Us</span>
              <ArrowRight size={18} />
            </button>

            <button
              type="button"
              onClick={() => onNavigate('application_form')}
              style={{
                backgroundColor: 'transparent',
                color: '#FFFFFF',
                fontWeight: 600,
                fontSize: '16px',
                padding: '16px 36px',
                borderRadius: '8px',
                border: '1px solid #E5A83B',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '10px',
                transition: 'all 0.2s ease',
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(229, 168, 59, 0.12)';
                e.currentTarget.style.transform = 'translateY(-2px)';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              <span>Join Team</span>
            </button>
          </div>
        </div>
      </section>

      {/* 2. SECTION: WHAT WE DO */}
      <section style={{ padding: '100px 80px', maxWidth: '1360px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '60px' }}>
          <h2 style={{ fontSize: '38px', fontWeight: 800, marginBottom: '14px' }}>
            What We <span style={{ color: '#E5A83B' }}>Do</span>
          </h2>
          <p
            style={{
              color: '#9CA3AF',
              fontSize: '16px',
              maxWidth: '680px',
              margin: '0 auto',
              lineHeight: 1.6,
            }}
          >
            We design and develop websites, mobile apps, and software solutions that help businesses
            grow and solve realworld problems.
          </p>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '30px',
          }}
        >
          {/* Card 1 */}
          <div
            style={{
              backgroundColor: '#11151F',
              borderRadius: '16px',
              padding: '40px 32px',
              border: '1px solid rgba(255, 255, 255, 0.06)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-start',
              transition: 'all 0.25s ease',
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.borderColor = 'rgba(229, 168, 59, 0.4)';
              e.currentTarget.style.transform = 'translateY(-4px)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.06)';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            <div
              style={{
                width: '60px',
                height: '60px',
                borderRadius: '12px',
                backgroundColor: '#E5A83B',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#0A0D14',
                marginBottom: '26px',
              }}
            >
              <Globe size={30} strokeWidth={2.2} />
            </div>
            <h3 style={{ fontSize: '22px', fontWeight: 700, marginBottom: '14px', color: '#FFFFFF' }}>
              Web Development
            </h3>
            <p style={{ color: '#9CA3AF', fontSize: '15px', lineHeight: 1.65 }}>
              Modern, responsive websites built for performance and scalability.
            </p>
          </div>

          {/* Card 2 */}
          <div
            style={{
              backgroundColor: '#11151F',
              borderRadius: '16px',
              padding: '40px 32px',
              border: '1px solid rgba(255, 255, 255, 0.06)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-start',
              transition: 'all 0.25s ease',
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.borderColor = 'rgba(229, 168, 59, 0.4)';
              e.currentTarget.style.transform = 'translateY(-4px)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.06)';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            <div
              style={{
                width: '60px',
                height: '60px',
                borderRadius: '12px',
                backgroundColor: '#E5A83B',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#0A0D14',
                marginBottom: '26px',
              }}
            >
              <Smartphone size={30} strokeWidth={2.2} />
            </div>
            <h3 style={{ fontSize: '22px', fontWeight: 700, marginBottom: '14px', color: '#FFFFFF' }}>
              Mobile App Development
            </h3>
            <p style={{ color: '#9CA3AF', fontSize: '15px', lineHeight: 1.65 }}>
              High-quality mobile apps designed for seamless user experience.
            </p>
          </div>

          {/* Card 3 */}
          <div
            style={{
              backgroundColor: '#11151F',
              borderRadius: '16px',
              padding: '40px 32px',
              border: '1px solid rgba(255, 255, 255, 0.06)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-start',
              transition: 'all 0.25s ease',
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.borderColor = 'rgba(229, 168, 59, 0.4)';
              e.currentTarget.style.transform = 'translateY(-4px)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.06)';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            <div
              style={{
                width: '60px',
                height: '60px',
                borderRadius: '12px',
                backgroundColor: '#E5A83B',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#0A0D14',
                marginBottom: '26px',
              }}
            >
              <Palette size={30} strokeWidth={2.2} />
            </div>
            <h3 style={{ fontSize: '22px', fontWeight: 700, marginBottom: '14px', color: '#FFFFFF' }}>
              UI/UX Design
            </h3>
            <p style={{ color: '#9CA3AF', fontSize: '15px', lineHeight: 1.65 }}>
              User-focused designs that create intuitive and engaging experiences.
            </p>
          </div>
        </div>
      </section>

      {/* 3. SECTION: WHAT WE OFFER */}
      <section
        style={{
          padding: '100px 80px',
          backgroundColor: '#0E121B',
          borderTop: '1px solid rgba(255, 255, 255, 0.04)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.04)',
        }}
      >
        <div style={{ maxWidth: '1360px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '60px' }}>
            <h2 style={{ fontSize: '38px', fontWeight: 800, marginBottom: '14px' }}>
              What We <span style={{ color: '#E5A83B' }}>Offer</span>
            </h2>
            <p
              style={{
                color: '#9CA3AF',
                fontSize: '16px',
                maxWidth: '720px',
                margin: '0 auto',
                lineHeight: 1.6,
              }}
            >
              A range of digital solutions designed to support your business growth and long-term
              success across different platforms and industries.
            </p>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
              gap: '26px',
            }}
          >
            {[
              {
                icon: Globe,
                title: 'Custom Website Development',
                desc: 'Tailored web experiences built using high-performance frameworks and modern architectures for optimal conversion.',
              },
              {
                icon: Smartphone,
                title: 'Mobile App Solutions',
                desc: 'Native iOS and Android applications with fluid gesture control, offline support, and seamless cloud syncing.',
              },
              {
                icon: Palette,
                title: 'UI/UX Design Services',
                desc: 'Human-centric user journeys, high-fidelity prototypes, design tokens, and aesthetic micro-interactions.',
              },
              {
                icon: Layers,
                title: 'Digital Product Development',
                desc: 'Full-cycle SaaS and digital enterprise engineering from business requirement specs to production delivery.',
              },
              {
                icon: Zap,
                title: 'System Optimization',
                desc: 'Code refactoring, database indexing, infrastructure caching, and sub-second API latency tuning.',
              },
              {
                icon: Settings,
                title: 'Support & Maintenance',
                desc: 'Continuous uptime monitoring, dependency upgrades, automated backups, and 24/7 technical incident support.',
              },
            ].map((item, index) => {
              const IconComp = item.icon;
              return (
                <div
                  key={index}
                  style={{
                    backgroundColor: '#131824',
                    borderRadius: '14px',
                    padding: '36px 30px',
                    border: '1px solid rgba(255, 255, 255, 0.05)',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'flex-start',
                    transition: 'all 0.2s ease',
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.borderColor = 'rgba(229, 168, 59, 0.35)';
                    e.currentTarget.style.backgroundColor = '#161D2B';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.05)';
                    e.currentTarget.style.backgroundColor = '#131824';
                  }}
                >
                  <div
                    style={{
                      width: '52px',
                      height: '52px',
                      borderRadius: '10px',
                      backgroundColor: 'rgba(229, 168, 59, 0.15)',
                      border: '1px solid rgba(229, 168, 59, 0.3)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#E5A83B',
                      marginBottom: '22px',
                    }}
                  >
                    <IconComp size={26} />
                  </div>
                  <h3
                    style={{
                      fontSize: '20px',
                      fontWeight: 700,
                      marginBottom: '12px',
                      color: '#FFFFFF',
                    }}
                  >
                    {item.title}
                  </h3>
                  <p style={{ color: '#9CA3AF', fontSize: '14px', lineHeight: 1.65 }}>
                    {item.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 4. SECTION: WHY CHOOSE US */}
      <section style={{ padding: '110px 80px', maxWidth: '1360px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '60px' }}>
          <h2 style={{ fontSize: '38px', fontWeight: 800, marginBottom: '14px' }}>
            Why <span style={{ color: '#E5A83B' }}>Choose Us</span>
          </h2>
          <p
            style={{
              color: '#9CA3AF',
              fontSize: '16px',
              maxWidth: '720px',
              margin: '0 auto',
              lineHeight: 1.6,
            }}
          >
            A range of digital solutions designed to support your business growth and long-term
            success across different platforms and industries.
          </p>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '30px',
            alignItems: 'stretch',
          }}
        >
          {/* Card 1: User-Centered Design */}
          <div
            style={{
              backgroundColor: '#11151F',
              borderRadius: '16px',
              padding: '40px 32px',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-start',
            }}
          >
            <div
              style={{
                width: '56px',
                height: '56px',
                borderRadius: '12px',
                backgroundColor: 'rgba(229, 168, 59, 0.15)',
                border: '1px solid rgba(229, 168, 59, 0.3)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#E5A83B',
                marginBottom: '26px',
              }}
            >
              <Users size={28} />
            </div>
            <h3 style={{ fontSize: '22px', fontWeight: 700, marginBottom: '14px', color: '#FFFFFF' }}>
              User-Centered Design
            </h3>
            <p style={{ color: '#9CA3AF', fontSize: '15px', lineHeight: 1.65 }}>
              We design intuitive and engaging experiences tailored to meet real user needs.
            </p>
          </div>

          {/* Card 2: Scalable Solutions (SOLID GOLD CARD from Figma!) */}
          <div
            style={{
              backgroundColor: '#E5A83B',
              color: '#0A0D14',
              borderRadius: '16px',
              padding: '40px 32px',
              boxShadow: '0 12px 36px rgba(229, 168, 59, 0.35)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-start',
              transform: 'scale(1.02)',
              position: 'relative',
              zIndex: 2,
            }}
          >
            <div
              style={{
                width: '56px',
                height: '56px',
                borderRadius: '12px',
                backgroundColor: '#0A0D14',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#E5A83B',
                marginBottom: '26px',
              }}
            >
              <TrendingUp size={28} />
            </div>
            <h3 style={{ fontSize: '22px', fontWeight: 800, marginBottom: '14px', color: '#0A0D14' }}>
              Scalable Solutions
            </h3>
            <p style={{ color: '#1E232E', fontSize: '15px', lineHeight: 1.65, fontWeight: 500 }}>
              Our solutions are built to grow with your business and adapt over time.
            </p>
          </div>

          {/* Card 3: Reliable Delivery */}
          <div
            style={{
              backgroundColor: '#11151F',
              borderRadius: '16px',
              padding: '40px 32px',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-start',
            }}
          >
            <div
              style={{
                width: '56px',
                height: '56px',
                borderRadius: '12px',
                backgroundColor: 'rgba(229, 168, 59, 0.15)',
                border: '1px solid rgba(229, 168, 59, 0.3)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#E5A83B',
                marginBottom: '26px',
              }}
            >
              <ShieldCheck size={28} />
            </div>
            <h3 style={{ fontSize: '22px', fontWeight: 700, marginBottom: '14px', color: '#FFFFFF' }}>
              Reliable Delivery
            </h3>
            <p style={{ color: '#9CA3AF', fontSize: '15px', lineHeight: 1.65 }}>
              We deliver high-quality results on time with a strong focus on performance.
            </p>
          </div>
        </div>
      </section>

      {/* 5. BOTTOM CTA BANNER */}
      <section
        style={{
          padding: '80px',
          background: 'linear-gradient(180deg, #0B0E14 0%, #121824 100%)',
          textAlign: 'center',
          borderTop: '1px solid rgba(229, 168, 59, 0.2)',
        }}
      >
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '36px', fontWeight: 800, marginBottom: '16px' }}>
            Ready to Build Something <span style={{ color: '#E5A83B' }}>Extraordinary?</span>
          </h2>
          <p style={{ color: '#9CA3AF', fontSize: '16px', marginBottom: '32px', lineHeight: 1.6 }}>
            Partner with TitanCode to turn your product vision into high-impact digital reality.
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '16px' }}>
            <button
              type="button"
              onClick={() => onNavigate('hire_us')}
              style={{
                backgroundColor: '#E5A83B',
                color: '#0A0D14',
                fontWeight: 700,
                fontSize: '15px',
                padding: '14px 32px',
                borderRadius: '8px',
                border: 'none',
                cursor: 'pointer',
              }}
            >
              Start A Project
            </button>
            <button
              type="button"
              onClick={() => onNavigate('contact_us')}
              style={{
                backgroundColor: 'transparent',
                color: '#FFFFFF',
                fontWeight: 600,
                fontSize: '15px',
                padding: '14px 32px',
                borderRadius: '8px',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                cursor: 'pointer',
              }}
            >
              Contact Team
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
