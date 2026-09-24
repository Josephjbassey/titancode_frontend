import React from 'react';

export interface PublicHeroProps {
  bgImage: string;
  title: React.ReactNode;
  subtitle: string;
  badge?: string;
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
}

export const PublicHero: React.FC<PublicHeroProps> = ({
  bgImage,
  title,
  subtitle,
  badge,
  className = '',
  style,
  children,
}) => {
  return (
    <section
      className={`public-hero ${className}`}
      style={{
        position: 'relative',
        width: '100%',
        minHeight: '420px',
        padding: '40px 24px 60px',
        ...style,
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '100%',
          margin: '0 auto',
          position: 'relative',
          borderRadius: 0,
          overflow: 'hidden',
          minHeight: '420px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          padding: '60px 24px',
          boxShadow: '0 22px 34px -18px rgba(223, 174, 50, 0.55)',
        }}
      >
        {/* Background Image */}
        <img
          src={bgImage}
          alt="Hero Background"
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            zIndex: 1,
          }}
        />

        {/* Figma Dark Overlay */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(180deg, rgba(11, 11, 12, 0.72) 0%, rgba(11, 11, 12, 0.90) 100%)',
            zIndex: 2,
          }}
        />

        {/* Content */}
        <div style={{ position: 'relative', zIndex: 3, maxWidth: '840px', margin: '0 auto' }}>
          {badge && (
            <div
              style={{
                display: 'inline-block',
                padding: '6px 16px',
                borderRadius: '9999px',
                backgroundColor: 'rgba(223, 174, 50, 0.15)',
                border: '1px solid var(--tc-figma-gold, #DFAE32)',
                color: 'var(--tc-figma-gold, #DFAE32)',
                fontSize: '13px',
                fontWeight: '600',
                marginBottom: '20px',
                fontFamily: "'Poppins', sans-serif",
              }}
            >
              {badge}
            </div>
          )}

          <h1
            style={{
              fontSize: '44px',
              fontWeight: '800',
              color: '#FFFFFF',
              marginBottom: '16px',
              lineHeight: '1.2',
              letterSpacing: '-0.5px',
              fontFamily: "'Inter', sans-serif",
            }}
          >
            {title}
          </h1>

          <p
            style={{
              fontSize: '16px',
              color: '#D1D5DB',
              maxWidth: '680px',
              margin: '0 auto',
              lineHeight: '1.6',
              fontFamily: "'Poppins', sans-serif",
            }}
          >
            {subtitle}
          </p>

          {children && <div style={{ marginTop: '24px' }}>{children}</div>}
        </div>
      </div>
    </section>
  );
};
