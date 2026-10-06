import React from 'react';
import type { ScreenId } from '../../App';
import { Star } from 'lucide-react';

interface TestimonialsViewProps {
  onNavigate: (view: ScreenId) => void;
}

export const TestimonialsView: React.FC<TestimonialsViewProps> = ({ onNavigate: _onNavigate }) => {
  const testimonials = [
    {
      id: 1,
      quote:
        'Titan Code handles complex workflows without feeling heavy. We spend less time managing tools and more time building',
      name: 'Joseph John',
      role: 'Fullstack Developer',
      avatar: '/assets/testimonial_joseph.png',
    },
    {
      id: 2,
      quote:
        'TitanCode brings structure and clarity to our workflow. The team stays aligned, and delivery is faster and more consistent.',
      name: 'Olukayode Tioluwanimi Blessing',
      role: 'Project Manager',
      avatar: '/assets/testimonial_blessing.jpg',
    },
    {
      id: 3,
      quote:
        'TitanCode makes collaboration seamless. It’s intuitive and, keeping the team focused on delivering exceptional user experience.',
      name: 'Benedicta Atagamen',
      role: 'UI/UX Designer',
      avatar: '/assets/testimonial_benedicta.png',
    },
  ];

  return (
    <div className="tc-page-root tc-testimonials-root">
      <div className="tc-section-inner">
        {/* Header matching Figma Testimonials.png */}
        <div className="tc-testimonials-header">
          <h2 className="tc-testimonials-title">
            What <span className="tc-gold">people say</span>
          </h2>
          <p className="tc-testimonials-subtitle">
            Discover what our satisfied customers have to say about their experiences with our products and services
          </p>
        </div>

        {/* 3 Review Cards Grid matching Figma */}
        <div className="tc-testimonials-grid">
          {testimonials.map((t) => (
            <div
              key={t.id}
              className="figma-card tc-testimonial-card"
            >
              <div>
                {/* 5 Stars on Top Right matching Figma */}
                <div className="tc-testimonial-stars">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={18}
                      fill="#DFAE32"
                      color="#DFAE32"
                    />
                  ))}
                </div>

                {/* Quote Text */}
                <p className="tc-testimonial-quote">
                  {t.quote}
                </p>
              </div>

              {/* User Avatar + Name & Role on Bottom */}
              <div className="tc-testimonial-author">
                <img
                  src={t.avatar}
                  alt={t.name}
                  className="tc-testimonial-avatar"
                />
                <div>
                  <h4 className="tc-testimonial-name">
                    {t.name}
                  </h4>
                  <p className="tc-testimonial-role">
                    {t.role}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
