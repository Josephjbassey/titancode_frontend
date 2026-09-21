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
    <div style={{ backgroundColor: 'var(--tc-figma-black, #0B0B0C)', color: '#FFFFFF', padding: '90px 40px 140px' }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
        {/* Header matching Figma Testimonials.png */}
        <div style={{ textAlign: 'center', marginBottom: '80px' }}>
          <h2 style={{ fontSize: '46px', fontWeight: '800', marginBottom: '16px', color: '#FFFFFF', fontFamily: "'Inter', sans-serif" }}>
            What <span style={{ color: 'var(--tc-figma-gold, #DFAE32)' }}>people say</span>
          </h2>
          <p style={{ fontSize: '16px', color: '#9CA3AF', maxWidth: '720px', margin: '0 auto', lineHeight: '1.6', fontFamily: "'Poppins', sans-serif" }}>
            Discover what our satisfied customers have to say about their experiences with our products and services
          </p>
        </div>

        {/* 3 Review Cards Grid matching Figma */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '30px',
          }}
        >
          {testimonials.map((t) => (
            <div
              key={t.id}
              className="figma-card"
              style={{
                borderRadius: '20px',
                padding: '40px 32px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                minHeight: '340px',
                transition: 'border-color 0.2s, transform 0.2s',
              }}
            >
              <div>
                {/* 5 Stars on Top Left matching Figma */}
                <div style={{ display: 'flex', justifyContent: 'flex-start', gap: '5px', marginBottom: '24px' }}>
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
                <p
                  style={{
                    fontSize: '15px',
                    color: '#E5E7EB',
                    lineHeight: '1.7',
                    fontWeight: '400',
                    fontFamily: "'Poppins', sans-serif",
                  }}
                >
                  "{t.quote}"
                </p>
              </div>

              {/* User Avatar + Name & Role on Bottom */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginTop: '36px' }}>
                <img
                  src={t.avatar}
                  alt={t.name}
                  style={{
                    width: '52px',
                    height: '52px',
                    borderRadius: '50%',
                    objectFit: 'cover',
                    border: '2px solid rgba(223, 174, 50, 0.4)',
                  }}
                />
                <div>
                  <h4 style={{ fontSize: '16px', fontWeight: '700', color: '#FFFFFF', marginBottom: '4px' }}>
                    {t.name}
                  </h4>
                  <p style={{ fontSize: '13px', color: '#DFAE32' }}>
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
