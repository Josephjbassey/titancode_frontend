import React from 'react';
import type { ScreenId } from '../../App';

interface AboutUsViewProps {
  onNavigate: (view: ScreenId) => void;
}

export const AboutUsView: React.FC<AboutUsViewProps> = ({ onNavigate: _onNavigate }) => {
  const teamMembers = [
    { name: 'Munis Samuel',                     role: 'Chief Product Visionary',    img: '/assets/munis.jpg' },
    { name: 'Olukayode Tioluwanimi Blessing',    role: 'Lead, Product Manager',      img: '/assets/blessing.jpg' },
    { name: 'Joseph John',                       role: 'Lead, Fullstack Developer',  img: '/assets/joseph.jpg' },
    { name: 'Benedicta Atagamen',               role: 'Lead, UI/UX Designer',       img: '/assets/benedicta.png' },
  ];

  return (
    <div className="tc-page-root">
      {/* 1. HERO — Figma: x:0, y:154, w:1440, h:463, sharp corners */}
      <section
        className="tc-subpage-hero tc-subpage-hero--about"
      >
        <div className="tc-subpage-hero__content">
          <h1 className="tc-hero-title">
            About <span className="tc-gold">Us</span>
          </h1>
          <p className="tc-hero-subtitle">
            We build tools that help teams manage projects and grow faster.
          </p>
        </div>
      </section>

      {/* 2. ABOUT US IMAGES + NARRATIVE */}
      <section className="tc-section tc-section-inner--full tc-about-intro-section">
        {/* ● ABOUT US ● badge */}
        <div className="tc-about-badge-wrap">
          <span className="tc-about-gold-badge">
            <span className="tc-about-black-dot" />
            ABOUT US
            <span className="tc-about-black-dot" />
          </span>
        </div>

        {/* Left images (overlapping) + right text, top-aligned — Figma: x:60,y:866 */}
        <div className="tc-about-intro-grid">
          <div className="tc-about-image-stack">
            {/* Primary: 530×370 at left:0, top:0 */}
            <img
              src="/assets/aboutus_1.jpg"
              alt="TitanCode Team Work"
              className="tc-about-img-primary"
            />
            {/* Accent: 384×316 offset right (x:452 − x:60 = 392px) */}
            <img
              src="/assets/aboutus_2.jpg"
              alt="TitanCode Workspace"
              className="tc-about-img-accent"
            />
          </div>

          {/* Right text — top-aligned flush with image (NOT vertically centred) */}
          <p className="tc-about-narrative-text">
            TitanCode is a modern digital solutions platform built to help teams and businesses work smarter.
            We focus on creating tools that simplify project management, improve collaboration, and enhance
            productivity. Our approach combines clean design with powerful functionality, making it easy for
            users to manage tasks, track progress, and achieve better results without unnecessary complexity.
          </p>
        </div>
      </section>

      {/* 3. MISSION & VISION */}
      <section className="tc-section-inner--full tc-about-mission-section">
        <div className="tc-about-mission-grid">
          {/* Mission card */}
          <div className="tc-dark-card">
            {/* ri:target-fill icon — gold circle 74×74, icon 35×35 */}
            <div className="tc-icon-badge--circle">
              <svg width="35" height="35" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                <path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm0 18a8 8 0 1 1 0-16 8 8 0 0 1 0 16zm0-14a6 6 0 1 0 0 12A6 6 0 0 0 12 6zm0 10a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm0-6a2 2 0 1 0 0 4 2 2 0 0 0 0-4z" fill="#0B0B0C"/>
              </svg>
            </div>
            <h3 className="tc-about-card-title">Our Mission</h3>
            <p className="tc-body-text tc-about-card-body">
              To help teams collaborate more efficiently by providing simple, reliable, and powerful
              tools that improve productivity, streamline workflows, and make everyday work easier
              and more organized across different environments.
            </p>
          </div>

          {/* Vision card */}
          <div className="tc-dark-card">
            {/* mdi:eye-outline icon — gold circle 74×74, icon 35×35 */}
            <div className="tc-icon-badge--circle">
              <svg width="35" height="35" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                <path d="M12 9a3 3 0 0 1 3 3 3 3 0 0 1-3 3 3 3 0 0 1-3-3 3 3 0 0 1 3-3m0-4.5c5 0 9.27 3.11 11 7.5-1.73 4.39-6 7.5-11 7.5S2.73 16.39 1 12c1.73-4.39 6-7.5 11-7.5M3.18 12a9.821 9.821 0 0 0 17.64 0 9.821 9.821 0 0 0-17.64 0z" fill="#0B0B0C"/>
              </svg>
            </div>
            <h3 className="tc-about-card-title">Our Vision</h3>
            <p className="tc-body-text tc-about-card-body">
              To become a leading digital platform that empowers teams and businesses worldwide to
              achieve more through smart, innovative, and scalable solutions that support growth,
              efficiency, and long-term success across all industries and sectors.
            </p>
          </div>
        </div>
      </section>

      {/* 4. OUR TEAM */}
      <section className="tc-section-inner--full tc-about-team-section">
        <div className="tc-section-header">
          <h2 className="tc-section-title">
            Our <span className="tc-gold">Team</span>
          </h2>
          <p className="tc-body-text">Meet our team</p>
        </div>

        <div className="tc-about-team-grid">
          {teamMembers.map((member, index) => (
            <div key={index} className="tc-team-card">
              <div className="tc-team-card__img-wrap">
                <img
                  src={member.img}
                  alt={member.name}
                  className="tc-team-card__img"
                />
              </div>
              <div className="tc-team-card__body">
                <h3 className="tc-team-card__name">
                  {member.name}
                </h3>
                <p className="tc-team-card__role">
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
