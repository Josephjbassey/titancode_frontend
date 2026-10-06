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
      className={`public-hero tc-hero-section ${className}`}
      style={style}
    >
      <div className="tc-hero-card">
        {/* Background Image */}
        <img
          src={bgImage}
          alt="Hero Background"
          className="tc-hero-bg-img"
        />

        {/* Figma Dark Overlay */}
        <div className="tc-hero-overlay" />

        {/* Content */}
        <div className="tc-hero-content-wrap">
          {badge && (
            <div className="tc-hero-badge-pill">
              {badge}
            </div>
          )}

          <h1 className="tc-hero-title-main">
            {title}
          </h1>

          <p className="tc-hero-subtitle-text">
            {subtitle}
          </p>

          {children && <div className="tc-hero-extra-actions">{children}</div>}
        </div>
      </div>
    </section>
  );
};
