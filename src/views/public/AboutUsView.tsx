import React from 'react';
import type { ScreenId } from '../../App';
import { Target, Eye } from 'lucide-react';

interface AboutUsViewProps {
  onNavigate: (view: ScreenId) => void;
}

export const AboutUsView: React.FC<AboutUsViewProps> = ({ onNavigate: _onNavigate }) => {
  return (
    <div style={{ backgroundColor: '#0B0B0C', color: '#FFFFFF', minHeight: '100vh' }}>
      {/* 1. HERO BANNER WITH FIGMA BACKGROUND */}
      <section
        style={{
          position: 'relative',
          padding: '120px 40px 110px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          backgroundImage: 'linear-gradient(rgba(11, 11, 12, 0.72), rgba(11, 11, 12, 0.88)), url(/assets/abouthero_bg.jpg)',
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
              fontWeight: 700,
              lineHeight: '100%',
              letterSpacing: '0%',
              color: '#FFFFFF',
              marginBottom: '20px',
            }}
          >
            About <span style={{ color: 'var(--tc-figma-gold, #DFAE32)' }}>Us</span>
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
            We build tools that help teams manage projects and grow faster.
          </p>
        </div>
      </section>

      {/* 2. SECTION: ABOUT US WITH SHOWCASE IMAGES & BADGE */}
      <section className="tc-public-content-shell" style={{ padding: '80px 60px 100px' }}>
        {/* Frame 2085660695: Badge ● ABOUT US ● (Gold background with black text and black dots) */}
        <div style={{ marginBottom: '40px' }}>
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'stretch',
              gap: '12px',
              padding: '10px 24px',
              borderRadius: '9999px',
              backgroundColor: '#DFAE32',
              color: '#0B0B0C',
              fontSize: '14px',
              fontWeight: 800,
              letterSpacing: '1.5px',
              fontFamily: "'Inter', sans-serif",
              boxShadow: '0 4px 18px rgba(223, 174, 50, 0.4)',
            }}
          >
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#0B0B0C' }} />
            ABOUT US
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#0B0B0C' }} />
          </span>
        </div>

        <div
          className="tc-about-intro-grid"
          style={{
            display: 'grid',
            gridTemplateColumns: '1.1fr 1fr',
            gap: '60px',
            alignItems: 'stretch',
          }}
        >
          {/* Left Column: Image Showcase aboutus_1.jpg & aboutus_2.jpg matching Figma x=60, 452 */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div style={{ borderRadius: '16px', overflow: 'hidden', height: '360px', boxShadow: '0 12px 30px rgba(0,0,0,0.5)' }}>
              <img
                src="/assets/aboutus_1.jpg"
                alt="TitanCode Team Work"
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  display: 'block',
                }}
              />
            </div>
            <div style={{ borderRadius: '16px', overflow: 'hidden', height: '360px', marginTop: '24px', boxShadow: '0 12px 30px rgba(0,0,0,0.5)' }}>
              <img
                src="/assets/aboutus_2.jpg"
                alt="TitanCode Workspace"
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  display: 'block',
                }}
              />
            </div>
          </div>

          {/* Right Column: Narrative Text matching Figma text id="259:10" */}
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <p
              style={{
                color: '#9CA3AF',
                fontSize: '18px',
                lineHeight: 1.85,
                fontFamily: "'Poppins', sans-serif",
              }}
            >
              TitanCode is a modern digital solutions platform built to help teams and businesses work smarter. We focus on creating tools that simplify project management, improve collaboration, and enhance productivity. Our approach combines clean design with powerful functionality, making it easy for users to manage tasks, track progress, and achieve better results without unnecessary complexity.
            </p>
          </div>
        </div>
      </section>

      {/* 3. SECTION: MISSION & VISION */}
      <section className="tc-public-content-shell" style={{ padding: '40px 60px 120px' }}>
        <div
          className="tc-about-mission-grid"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: '32px',
          }}
        >
          {/* Card 1: Our Mission */}
          <div
            className="tc-about-team-grid"
            style={{
              backgroundColor: '#FFFFFF1A',
              borderRadius: '18px',
              padding: '48px 40px',
              border: '1px solid #FFFFFF26',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <div
              style={{
                width: '56px',
                height: '56px',
                borderRadius: '12px',
                backgroundColor: '#DFAE32',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#0B0B0C',
                marginBottom: '26px',
              }}
            >
              <Target size={28} strokeWidth={2.4} />
            </div>
            <h3 style={{ fontSize: '26px', fontWeight: 800, marginBottom: '16px', color: '#FFFFFF' }}>
              Our Mission
            </h3>
            <p style={{ color: '#9CA3AF', fontSize: '15px', lineHeight: 1.75 }}>
              To help teams collaborate more efficiently by providing simple, reliable, and powerful
              tools that improve productivity, streamline workflows, and make everyday work easier
              and more organized across different environments.
            </p>
          </div>

          {/* Card 2: Our Vision */}
          <div
            style={{
              backgroundColor: '#FFFFFF1A',
              borderRadius: '18px',
              padding: '48px 40px',
              border: '1px solid #FFFFFF26',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <div
              style={{
                width: '56px',
                height: '56px',
                borderRadius: '12px',
                backgroundColor: '#DFAE32',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#0B0B0C',
                marginBottom: '26px',
              }}
            >
              <Eye size={28} strokeWidth={2.4} />
            </div>
            <h3 style={{ fontSize: '26px', fontWeight: 800, marginBottom: '16px', color: '#FFFFFF' }}>
              Our Vision
            </h3>
            <p style={{ color: '#9CA3AF', fontSize: '15px', lineHeight: 1.75 }}>
              To become a leading digital platform that empowers teams and businesses worldwide to
              achieve more through smart, innovative, and scalable solutions that support growth,
              efficiency, and long-term success across all industries and sectors.
            </p>
          </div>
        </div>
      </section>

      {/* 4. SECTION: OUR TEAM */}
      <section className="tc-public-content-shell" style={{ padding: '0 60px 140px' }}>
        <div style={{ textAlign: 'center', marginBottom: '50px' }}>
          <h2 style={{ fontSize: '40px', fontWeight: 800, marginBottom: '10px', color: '#FFFFFF' }}>
            Our <span style={{ color: 'var(--tc-figma-gold, #DFAE32)' }}>Team</span>
          </h2>
          <p style={{ color: '#9CA3AF', fontSize: '16px' }}>
            Meet our team
          </p>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: '24px',
          }}
        >
          {[
            {
              name: 'Munis Samuel',
              role: 'Chief Product Visionary',
              img: '/assets/munis.jpg',
            },
            {
              name: 'Olukayode Tioluwanimi Blessing',
              role: 'Lead, Product Manager',
              img: '/assets/blessing.jpg',
            },
            {
              name: 'Joseph John',
              role: 'Lead, Fullstack Developer',
              img: '/assets/joseph.jpg',
            },
            {
              name: 'Benedicta Atagamen',
              role: 'Lead, UI/UX Designer',
              img: '/assets/benedicta.png',
            },
          ].map((member, index) => (
            <div
              key={index}
              style={{
                backgroundColor: '#FFFFFF1A',
                borderRadius: '16px',
                overflow: 'hidden',
                border: '1px solid #FFFFFF26',
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              <div
                style={{
                  height: '290px',
                  backgroundColor: '#1b1b1c',
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
                    objectPosition: 'top center',
                  }}
                />
              </div>

              <div style={{ padding: '22px 18px', textAlign: 'center' }}>
                <h3
                  style={{
                    fontSize: '17px',
                    fontWeight: 700,
                    color: '#FFFFFF',
                    marginBottom: '6px',
                  }}
                >
                  {member.name}
                </h3>
                <p
                  style={{
                    color: '#DFAE32',
                    fontSize: '13px',
                    fontWeight: 500,
                  }}
                >
                  {member.role}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
