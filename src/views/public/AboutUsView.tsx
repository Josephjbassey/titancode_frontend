import React from 'react';
import type { ScreenId } from '../../App';
import { Target, Eye, Sparkles, ArrowRight } from 'lucide-react';

interface AboutUsViewProps {
  onNavigate: (view: ScreenId) => void;
}

export const AboutUsView: React.FC<AboutUsViewProps> = ({ onNavigate }) => {
  return (
    <div style={{ backgroundColor: '#0B0E14', color: '#FFFFFF', minHeight: '100vh' }}>
      {/* 1. HERO BANNER */}
      <section
        style={{
          position: 'relative',
          padding: '110px 80px 130px',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          borderBottom: '1px solid rgba(229, 168, 59, 0.15)',
        }}
      >
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage: 'url(/assets/about_hero_banner.png)',
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
            top: '25%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '600px',
            height: '350px',
            background: 'radial-gradient(circle, rgba(229, 168, 59, 0.18) 0%, rgba(11, 14, 20, 0) 70%)',
            pointerEvents: 'none',
            zIndex: 0,
          }}
        />

        <div style={{ position: 'relative', zIndex: 1, maxWidth: '900px' }}>
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
            <span>WHO WE ARE</span>
          </div>

          <h1
            style={{
              fontSize: '56px',
              lineHeight: 1.18,
              fontWeight: 800,
              color: '#FFFFFF',
              letterSpacing: '-0.02em',
              marginBottom: '20px',
            }}
          >
            About <span style={{ color: '#E5A83B' }}>Us</span>
          </h1>

          <p
            style={{
              fontSize: '18px',
              color: '#9CA3AF',
              lineHeight: 1.65,
              maxWidth: '640px',
              margin: '0 auto',
            }}
          >
            We build tools that help teams manage projects and grow faster.
          </p>
        </div>
      </section>

      {/* 2. SECTION: OVERVIEW WITH COLLAGE */}
      <section style={{ padding: '100px 80px', maxWidth: '1360px', margin: '0 auto' }}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(460px, 1fr))',
            gap: '70px',
            alignItems: 'center',
          }}
        >
          {/* Left Collage Image */}
          <div style={{ position: 'relative' }}>
            <div
              style={{
                position: 'absolute',
                inset: '-10px',
                borderRadius: '24px',
                background: 'radial-gradient(circle, rgba(229, 168, 59, 0.2) 0%, transparent 70%)',
                zIndex: 0,
                pointerEvents: 'none',
              }}
            />
            <img
              src="/assets/about_collage.png"
              alt="TitanCode Collaboration and Digital Experience"
              style={{
                width: '100%',
                maxHeight: '520px',
                objectFit: 'cover',
                borderRadius: '20px',
                border: '1px solid rgba(229, 168, 59, 0.25)',
                position: 'relative',
                zIndex: 1,
                boxShadow: '0 20px 40px rgba(0, 0, 0, 0.6)',
              }}
            />
          </div>

          {/* Right Text Description */}
          <div>
            <div
              style={{
                display: 'inline-block',
                padding: '6px 14px',
                borderRadius: '6px',
                backgroundColor: 'rgba(229, 168, 59, 0.1)',
                border: '1px solid rgba(229, 168, 59, 0.25)',
                color: '#E5A83B',
                fontSize: '12px',
                fontWeight: 700,
                letterSpacing: '0.08em',
                marginBottom: '18px',
              }}
            >
              ● ABOUT US ●
            </div>

            <h2
              style={{
                fontSize: '38px',
                fontWeight: 800,
                color: '#FFFFFF',
                marginBottom: '24px',
                lineHeight: 1.25,
              }}
            >
              Smart Solutions For Modern Business
            </h2>

            <p
              style={{
                color: '#9CA3AF',
                fontSize: '16px',
                lineHeight: 1.75,
                marginBottom: '20px',
              }}
            >
              TitanCode is a modern digital solutions platform built to help teams and businesses
              work smarter. We focus on creating tools that simplify project management, improve
              collaboration, and enhance productivity.
            </p>

            <p
              style={{
                color: '#9CA3AF',
                fontSize: '16px',
                lineHeight: 1.75,
                marginBottom: '36px',
              }}
            >
              Our approach combines clean design with powerful functionality, making it easy for
              users to manage tasks, track progress, and achieve better results without unnecessary
              complexity.
            </p>

            <button
              type="button"
              onClick={() => onNavigate('services')}
              style={{
                backgroundColor: '#E5A83B',
                color: '#0A0D14',
                fontWeight: 700,
                fontSize: '15px',
                padding: '14px 30px',
                borderRadius: '8px',
                border: 'none',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                boxShadow: '0 6px 20px rgba(229, 168, 59, 0.3)',
                transition: 'all 0.2s',
              }}
              onMouseOver={(e) => (e.currentTarget.style.backgroundColor = '#F4B333')}
              onMouseOut={(e) => (e.currentTarget.style.backgroundColor = '#E5A83B')}
            >
              <span>Explore Services</span>
              <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </section>

      {/* 3. SECTION: MISSION & VISION */}
      <section
        style={{
          padding: '100px 80px',
          backgroundColor: '#0E121B',
          borderTop: '1px solid rgba(255, 255, 255, 0.04)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.04)',
        }}
      >
        <div style={{ maxWidth: '1360px', margin: '0 auto' }}>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(440px, 1fr))',
              gap: '40px',
            }}
          >
            {/* Card 1: Our Mission */}
            <div
              style={{
                backgroundColor: '#11151F',
                borderRadius: '20px',
                padding: '48px 40px',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                display: 'flex',
                flexDirection: 'column',
                position: 'relative',
              }}
            >
              <div
                style={{
                  width: '64px',
                  height: '64px',
                  borderRadius: '50%',
                  backgroundColor: 'rgba(229, 168, 59, 0.15)',
                  border: '1px solid rgba(229, 168, 59, 0.3)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#E5A83B',
                  marginBottom: '26px',
                }}
              >
                <Target size={32} />
              </div>
              <h3 style={{ fontSize: '26px', fontWeight: 800, marginBottom: '16px', color: '#FFFFFF' }}>
                Our Mission
              </h3>
              <p style={{ color: '#9CA3AF', fontSize: '16px', lineHeight: 1.75 }}>
                To help teams collaborate more efficiently by providing simple, reliable, and powerful
                tools that improve productivity, streamline workflows, and make everyday work easier
                and more organized across different environments.
              </p>
            </div>

            {/* Card 2: Our Vision */}
            <div
              style={{
                backgroundColor: '#11151F',
                borderRadius: '20px',
                padding: '48px 40px',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                display: 'flex',
                flexDirection: 'column',
                position: 'relative',
              }}
            >
              <div
                style={{
                  width: '64px',
                  height: '64px',
                  borderRadius: '50%',
                  backgroundColor: 'rgba(229, 168, 59, 0.15)',
                  border: '1px solid rgba(229, 168, 59, 0.3)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#E5A83B',
                  marginBottom: '26px',
                }}
              >
                <Eye size={32} />
              </div>
              <h3 style={{ fontSize: '26px', fontWeight: 800, marginBottom: '16px', color: '#FFFFFF' }}>
                Our Vision
              </h3>
              <p style={{ color: '#9CA3AF', fontSize: '16px', lineHeight: 1.75 }}>
                To become a leading digital platform that empowers teams and businesses worldwide to
                achieve more through smart, innovative, and scalable solutions that support growth,
                efficiency, and long-term success across all industries and sectors.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. SECTION: OUR TEAM */}
      <section style={{ padding: '110px 80px', maxWidth: '1360px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '60px' }}>
          <h2 style={{ fontSize: '38px', fontWeight: 800, marginBottom: '14px' }}>
            Our <span style={{ color: '#E5A83B' }}>Team</span>
          </h2>
          <p style={{ color: '#9CA3AF', fontSize: '16px' }}>Meet our leadership and core team</p>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            gap: '30px',
          }}
        >
          {[
            {
              name: 'Munis Samuel',
              role: 'Chief Product Visionary',
              img: '/assets/team_munis.png',
            },
            {
              name: 'Olukayode Tioluwanimi Blessing',
              role: 'Lead, Product Manager',
              img: '/assets/team_olukayode.png',
            },
            {
              name: 'Joseph John',
              role: 'Lead, Fullstack Developer',
              img: '/assets/team_joseph.png',
            },
            {
              name: 'Benedicta Atagamen',
              role: 'Lead, UI/UX Designer',
              img: '/assets/team_benedicta.png',
            },
          ].map((member, index) => (
            <div
              key={index}
              style={{
                backgroundColor: '#11151F',
                borderRadius: '16px',
                overflow: 'hidden',
                border: '1px solid rgba(255, 255, 255, 0.06)',
                transition: 'all 0.25s ease',
                display: 'flex',
                flexDirection: 'column',
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.borderColor = 'rgba(229, 168, 59, 0.4)';
                e.currentTarget.style.transform = 'translateY(-6px)';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.06)';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              <div
                style={{
                  height: '300px',
                  backgroundColor: '#181E2B',
                  overflow: 'hidden',
                }}
              >
                <img
                  src={member.img}
                  alt={member.name}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    objectPosition: 'top',
                  }}
                />
              </div>

              <div style={{ padding: '24px 20px', textAlign: 'center' }}>
                <h3
                  style={{
                    fontSize: '18px',
                    fontWeight: 700,
                    color: '#FFFFFF',
                    marginBottom: '8px',
                  }}
                >
                  {member.name}
                </h3>
                <p
                  style={{
                    color: '#E5A83B',
                    fontSize: '13px',
                    fontWeight: 600,
                  }}
                >
                  {member.role}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 5. JOIN TEAM CTA */}
      <section
        style={{
          padding: '80px',
          background: 'linear-gradient(180deg, #0B0E14 0%, #121824 100%)',
          textAlign: 'center',
          borderTop: '1px solid rgba(229, 168, 59, 0.2)',
        }}
      >
        <div style={{ maxWidth: '750px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '36px', fontWeight: 800, marginBottom: '16px' }}>
            Want to Join <span style={{ color: '#E5A83B' }}>Our Team?</span>
          </h2>
          <p style={{ color: '#9CA3AF', fontSize: '16px', marginBottom: '32px', lineHeight: 1.6 }}>
            We're always looking for talented engineers, designers, and visionaries to shape the
            future of digital software solutions.
          </p>
          <button
            type="button"
            onClick={() => onNavigate('application_form')}
            style={{
              backgroundColor: '#E5A83B',
              color: '#0A0D14',
              fontWeight: 700,
              fontSize: '15px',
              padding: '14px 34px',
              borderRadius: '8px',
              border: 'none',
              cursor: 'pointer',
            }}
          >
            Apply to Join TitanCode
          </button>
        </div>
      </section>
    </div>
  );
};
