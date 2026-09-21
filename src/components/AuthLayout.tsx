import React from 'react';

interface AuthLayoutProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
}

export const AuthLayout: React.FC<AuthLayoutProps> = ({ children, title, subtitle }) => {
  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      backgroundColor: 'var(--tc-bg-primary)',
      color: 'var(--tc-text-primary)',
      fontFamily: 'var(--tc-font-sans)',
    }}>
      {/* Left Form Column */}
      <div style={{
        flex: '1 1 50%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '40px 24px',
        minHeight: '100vh',
        overflowY: 'auto',
      }}>
        <div style={{
          width: '100%',
          maxWidth: '420px',
        }}>
          {/* Exact TitanCode Logo */}
          <div style={{ marginBottom: '28px' }}>
            <img
              src="/assets/logo.png"
              alt="TitanCode"
              style={{
                height: '34px',
                objectFit: 'contain',
              }}
            />
          </div>

          {/* Titles if provided */}
          {title && (
            <div style={{ marginBottom: '24px' }}>
              <h1 style={{
                fontSize: '28px',
                fontWeight: '700',
                color: '#FFFFFF',
                marginBottom: '6px',
                letterSpacing: '-0.4px',
              }}>
                {title}
              </h1>
              {subtitle && (
                <p style={{
                  fontSize: '14px',
                  color: 'var(--tc-text-secondary)',
                  lineHeight: '1.5',
                  margin: 0,
                }}>
                  {subtitle}
                </p>
              )}
            </div>
          )}

          {/* Form Content */}
          {children}
        </div>
      </div>

      {/* Right Hero Column (Matching Figma 100%) */}
      <div
        className="tc-auth-hero-column"
        style={{
          flex: '1 1 50%',
          display: 'none',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '28px',
          position: 'relative',
          backgroundColor: '#0b0b0c',
        }}
      >
        <div style={{
          position: 'relative',
          width: '100%',
          maxWidth: '620px',
          height: 'calc(100vh - 56px)',
          borderRadius: '24px',
          overflow: 'hidden',
          backgroundColor: '#232324',
          boxShadow: '0 20px 50px rgba(0, 0, 0, 0.6)',
        }}>
          {/* Full Bleed Rounded Hero Image */}
          <img
            src="/assets/authside_bg.jpg"
            alt="TitanCode"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              display: 'block',
            }}
          />

          {/* Carousel indicator pills centered at the bottom of hero */}
          <div style={{
            position: 'absolute',
            bottom: '24px',
            left: 0,
            right: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            zIndex: 10,
          }}>
            <span style={{
              width: '28px',
              height: '4px',
              borderRadius: '2px',
              backgroundColor: '#dfae32',
              transition: 'all 0.3s ease',
            }} />
            <span style={{
              width: '12px',
              height: '4px',
              borderRadius: '2px',
              backgroundColor: 'rgba(255, 255, 255, 0.3)',
            }} />
            <span style={{
              width: '12px',
              height: '4px',
              borderRadius: '2px',
              backgroundColor: 'rgba(255, 255, 255, 0.3)',
            }} />
          </div>
        </div>
      </div>

      <style>{`
        @media (min-width: 960px) {
          .tc-auth-hero-column {
            display: flex !important;
          }
        }
      `}</style>
    </div>
  );
};
