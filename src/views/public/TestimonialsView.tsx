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
      avatar: '/assets/testimonial_olukayode.png',
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
    <div style={{ backgroundColor: '#0B0E14', color: '#FFFFFF', padding: '90px 40px 140px' }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
        {/* Header matching Figma Testimonials.png */}
        <div style={{ textAlign: 'center', marginBottom: '80px' }}>
          <h2 style={{ fontSize: '46px', fontWeight: '800', marginBottom: '16px' }}>
            What <span style={{ color: '#E5A83B' }}>people say</span>
          </h2>
          <p style={{ fontSize: '16px', color: '#9CA3AF', maxWidth: '720px', margin: '0 auto', lineHeight: '1.6' }}>
            Discover what our satisfied customers have to say about their experiences with our products and serices
          </p>
        </div>

        {/* 3 Review Cards Grid */}
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
              style={{
                backgroundColor: '#15181F',
                border: '1px solid #282C36',
                borderRadius: '20px',
                padding: '38px 32px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                minHeight: '340px',
                boxShadow: '0 12px 30px rgba(0, 0, 0, 0.4)',
                transition: 'border-color 0.2s, transform 0.2s',
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.borderColor = '#E5A83B';
                e.currentTarget.style.transform = 'translateY(-4px)';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.borderColor = '#282C36';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              <div>
                {/* 5 Stars on Top Right */}
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '4px', marginBottom: '28px' }}>
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={18}
                      fill="#E5A83B"
                      color="#E5A83B"
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
                  }}
                >
                  "{t.quote}"
                </p>
              </div>

              {/* User Avatar + Name & Role */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginTop: '36px' }}>
                <img
                  src={t.avatar}
                  alt={t.name}
                  style={{
                    width: '54px',
                    height: '54px',
                    borderRadius: '50%',
                    objectFit: 'cover',
                    border: '2px solid rgba(229, 168, 59, 0.4)',
                  }}
                />
                <div>
                  <h4 style={{ fontSize: '16px', fontWeight: '700', color: '#FFFFFF', marginBottom: '4px' }}>
                    {t.name}
                  </h4>
                  <p style={{ fontSize: '13px', color: '#9CA3AF' }}>
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
