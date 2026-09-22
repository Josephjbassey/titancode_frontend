import React from 'react';

interface AuthLayoutProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
}

export const AuthLayout: React.FC<AuthLayoutProps> = ({ children, title, subtitle }) => {
  return (
    <div className="tc-auth-shell">
      <div className="tc-auth-split-container">
        {/* CARD 1: FORM CARD (Matching Figma Frame 406:171 Rectangle 180 x=60 y=70 width=660 height=987) */}
        <div className="tc-auth-form-card">
          {/* Exact TitanCode Logo Centered */}
          <div style={{ textAlign: 'center', marginBottom: '24px' }}>
            <img
              src="/assets/logo.png"
              alt="TitanCode Technologies"
              style={{
                height: '38px',
                objectFit: 'contain',
                margin: '0 auto',
                display: 'block',
              }}
            />
          </div>

          {/* Centered Titles */}
          {title && (
            <div style={{ textAlign: 'center', marginBottom: '28px' }}>
              <h1
                style={{
                  fontSize: '28px',
                  fontWeight: 800,
                  color: '#FFFFFF',
                  marginBottom: '8px',
                  letterSpacing: '-0.4px',
                }}
              >
                {title}
              </h1>
              {subtitle && (
                <p
                  style={{
                    fontSize: '14px',
                    color: '#9CA3AF',
                    lineHeight: '1.5',
                    margin: 0,
                  }}
                >
                  {subtitle}
                </p>
              )}
            </div>
          )}

          {/* Form Content */}
          <div style={{ width: '100%' }}>{children}</div>
        </div>

        {/* CARD 2: HERO CARD (Matching Figma Frame 406:171 Rectangle 176 x=720 y=70 width=660 height=987) */}
        <div className="tc-auth-hero-card">
          {/* Full Bleed Hero Image */}
          <img
            src="/assets/authside_bg.jpg"
            alt="TitanCode Architecture"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              display: 'block',
            }}
          />

          {/* Subtle bottom gradient overlay */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: 'linear-gradient(180deg, rgba(0,0,0,0.05) 40%, rgba(0,0,0,0.65) 100%)',
              pointerEvents: 'none',
            }}
          />

          {/* Carousel indicator pills (Matching Figma Frame 158 x=986 y=1007: 70px gold pill + two 25px pills) */}
          <div
            style={{
              position: 'absolute',
              bottom: '28px',
              left: 0,
              right: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              zIndex: 10,
            }}
          >
            {/* Active Gold Pill (Rectangle 178: width=70 height=10) */}
            <span
              style={{
                width: '70px',
                height: '10px',
                borderRadius: '9999px',
                backgroundColor: '#dfae32',
                boxShadow: '0 0 12px rgba(223, 174, 50, 0.4)',
                transition: 'all 0.3s ease',
              }}
            />
            {/* Inactive Pill 1 (Rectangle 179: width=25 height=10) */}
            <span
              style={{
                width: '25px',
                height: '10px',
                borderRadius: '9999px',
                backgroundColor: 'rgba(255, 255, 255, 0.35)',
              }}
            />
            {/* Inactive Pill 2 (Rectangle 180: width=25 height=10) */}
            <span
              style={{
                width: '25px',
                height: '10px',
                borderRadius: '9999px',
                backgroundColor: 'rgba(255, 255, 255, 0.35)',
              }}
            />
          </div>
        </div>
      </div>

      <style>{`
        .tc-auth-shell {
          min-height: 100vh;
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 40px 24px;
          background-color: #0b0b0c;
          color: #FFFFFF;
          font-family: var(--tc-font-sans, system-ui, -apple-system, sans-serif);
        }

        .tc-auth-split-container {
          display: flex;
          align-items: stretch;
          justify-content: center;
          gap: 28px;
          width: 100%;
          max-width: 1360px;
        }

        /* Two distinct cards side-by-side (Figma 660px x 987px each) */
        .tc-auth-form-card {
          flex: 1 1 50%;
          max-width: 650px;
          min-height: 800px;
          background-color: #121214;
          border: 1px solid rgba(255, 255, 255, 0.12);
          border-radius: 24px;
          padding: 56px 48px;
          display: flex;
          flex-direction: column;
          justifyContent: center;
          align-items: center;
          box-shadow: 0 20px 50px rgba(0, 0, 0, 0.5);
        }

        .tc-auth-hero-card {
          flex: 1 1 50%;
          max-width: 650px;
          min-height: 800px;
          background-color: #161618;
          border: 1px solid rgba(255, 255, 255, 0.12);
          border-radius: 24px;
          overflow: hidden;
          position: relative;
          display: flex;
          box-shadow: 0 20px 50px rgba(0, 0, 0, 0.5);
        }

        @media (max-width: 1024px) {
          .tc-auth-shell {
            padding: 24px 16px;
          }
          .tc-auth-split-container {
            flex-direction: column;
            align-items: center;
            gap: 20px;
          }
          .tc-auth-hero-card {
            display: none;
          }
          .tc-auth-form-card {
            max-width: 520px;
            width: 100%;
            min-height: auto;
            padding: 40px 24px;
          }
        }
      `}</style>
    </div>
  );
};
