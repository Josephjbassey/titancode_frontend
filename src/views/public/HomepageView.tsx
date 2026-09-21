import React from 'react';
import type { ScreenId } from '../../App';
import {
  Globe,
  Smartphone,
  Palette,
  Layers,
  Zap,
  Settings,
  Users,
  TrendingUp,
  ShieldCheck,
  Mail,
  Phone,
  Music2,
} from 'lucide-react';

interface HomepageViewProps {
  onNavigate: (view: ScreenId) => void;
}

export const HomepageView: React.FC<HomepageViewProps> = ({ onNavigate }) => {
  const whatWeDo = [
    {
      icon: Globe,
      title: 'Web Development',
      description: 'Modern, responsive websites built for performance and scalability.',
    },
    {
      icon: Smartphone,
      title: 'Mobile App Development',
      description: 'High-quality mobile apps designed for seamless user experience.',
    },
    {
      icon: Palette,
      title: 'UI/UX Design',
      description: 'User-focused designs that create intuitive and engaging experiences.',
    },
  ];

  const whatWeOffer = [
    {
      icon: Globe,
      title: 'Custom Website Development',
      description: 'We create modern, responsive websites tailored to your business needs and goals.',
    },
    {
      icon: Smartphone,
      title: 'Mobile App Solutions',
      description: 'We build high-performance mobile applications designed for seamless user experience.',
    },
    {
      icon: Palette,
      title: 'UI/UX Design Services',
      description: 'We design intuitive and user-friendly interfaces that enhance digital experiences.',
    },
    {
      icon: Layers,
      title: 'Digital Product Development',
      description: 'We turn ideas into scalable digital products from concept to launch.',
    },
    {
      icon: Zap,
      title: 'System Optimization',
      description: 'We improve performance and efficiency of existing digital platforms and systems.',
    },
    {
      icon: Settings,
      title: 'Support & Maintenance',
      description: 'We provide ongoing support to ensure your digital solutions run smoothly.',
    },
  ];

  const whyChooseUs = [
    {
      icon: Users,
      title: 'User-Centered Design',
      description: 'We design intuitive and engaging experiences tailored to meet real user needs.',
      theme: 'light',
    },
    {
      icon: TrendingUp,
      title: 'Scalable Solutions',
      description: 'Our solutions are built to grow with your business and adapt over time.',
      theme: 'gold',
    },
    {
      icon: ShieldCheck,
      title: 'Reliable Delivery',
      description: 'We deliver high-quality results on time with a strong focus on performance.',
      theme: 'dark',
    },
  ];

  return (
    <div className="tc-homepage" style={{ backgroundColor: '#0B0B0C', color: '#FFFFFF', minHeight: '100vh' }}>
      <header
        className="tc-homepage-header"
        style={{
          width: '100%',
          maxWidth: '1440px',
          margin: '0 auto',
          padding: '28px 60px 0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          position: 'relative',
          zIndex: 2,
          gap: '16px',
          flexWrap: 'wrap',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <img src="/assets/logo.png" alt="TitanCode logo" style={{ width: 136, height: 28, objectFit: 'contain' }} />
        </div>

        <nav className="tc-homepage-nav" style={{ display: 'flex', alignItems: 'center', gap: 32, fontSize: 18, flexWrap: 'wrap', justifyContent: 'center' }}>
          <a href="#" style={{ color: '#FFFFFF', fontWeight: 700 }}>Home</a>
          <a href="#" style={{ color: '#BCAFAF', fontWeight: 500 }}>About Us</a>
          <a href="#" style={{ color: '#BCAFAF', fontWeight: 500 }}>Services</a>
          <a href="#" style={{ color: '#BCAFAF', fontWeight: 500 }}>Contact Us</a>
        </nav>

        <button
          type="button"
          onClick={() => onNavigate('hire_us')}
          style={{
            backgroundColor: '#DFAE32',
            color: '#0B0B0C',
            borderRadius: 6,
            fontSize: 18,
            fontWeight: 700,
            padding: '10px 24px',
            border: 'none',
            cursor: 'pointer',
          }}
        >
          Hire Us
        </button>
      </header>

      <main style={{ position: 'relative' }}>
        <section
          style={{
            width: '100%',
            maxWidth: '1440px',
            margin: '0 auto',
            padding: '44px 60px 0',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              position: 'absolute',
              left: 11,
              top: 176,
              width: 1440,
              height: 631,
              background: 'radial-gradient(circle, rgba(223,174,50,0.42) 0%, rgba(223,174,50,0.12) 25%, rgba(223,174,50,0.02) 60%, transparent 100%)',
              filter: 'blur(52px)',
              opacity: 0.9,
              borderRadius: 24,
              pointerEvents: 'none',
            }}
          />

          <div
            style={{
              position: 'absolute',
              inset: '140px 0 auto 0',
              height: 1038,
              background: 'linear-gradient(180deg, rgba(11,11,12,0.08), rgba(11,11,12,0.68) 42%, rgba(11,11,12,0.88))',
              pointerEvents: 'none',
            }}
          />

          <div
            style={{
              position: 'relative',
              height: 742,
              borderRadius: 20,
              overflow: 'hidden',
              background: 'linear-gradient(180deg, rgba(12,12,13,0.22), rgba(12,12,13,0.72))',
              boxShadow: '0 26px 60px rgba(0, 0, 0, 0.42)',
            }}
          >
            <div
              style={{
                position: 'absolute',
                inset: 0,
                background: 'linear-gradient(90deg, rgba(0,0,0,0.38), rgba(0,0,0,0.08) 35%, rgba(0,0,0,0.24)), linear-gradient(180deg, rgba(0,0,0,0.08), rgba(0,0,0,0.28))',
                pointerEvents: 'none',
              }}
            />
            <img
              src="/assets/landingpage1.jpg"
              alt="TitanCode product interface"
              style={{
                display: 'block',
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                filter: 'saturate(0.9) contrast(1.08) brightness(0.75)',
              }}
            />
          </div>

          <div
            style={{
              position: 'absolute',
              inset: '0 0 auto 0',
              padding: '100px 0 0',
              textAlign: 'center',
              zIndex: 2,
            }}
          >
            <h1
              style={{
                margin: '0 auto',
                maxWidth: 1040,
                fontSize: 66,
                lineHeight: 1.08,
                letterSpacing: '-0.04em',
                fontWeight: 800,
                color: '#FFFFFF',
                textAlign: 'center',
              }}
            >
              Empowering Your <span style={{ color: '#DFAE32' }}>Business Ideas</span>
              <br />
              with <span style={{ color: '#DFAE32' }}>Innovative</span> Software
              <br />
              Solutions
            </h1>

            <p
              style={{
                margin: '30px auto 36px',
                maxWidth: 730,
                fontSize: 22,
                lineHeight: 1.5,
                color: 'rgba(255,255,255,0.96)',
                fontWeight: 400,
              }}
            >
              We design and develop websites, mobile apps, and software platforms
              <br />
              that solve real-world problems.
            </p>

            <div style={{ display: 'flex', justifyContent: 'center', gap: 18, marginBottom: 30 }}>
              <button
                type="button"
                onClick={() => onNavigate('hire_us')}
                style={{
                  backgroundColor: '#DFAE32',
                  color: '#0B0B0C',
                  borderRadius: 8,
                  padding: '17px 30px',
                  fontSize: 23,
                  fontWeight: 700,
                  cursor: 'pointer',
                  border: 'none',
                }}
              >
                Hire Us
              </button>
              <button
                type="button"
                onClick={() => onNavigate('hire_us')}
                style={{
                  backgroundColor: 'rgba(11, 11, 12, 0.1)',
                  color: '#FFFFFF',
                  border: '1px solid rgba(223, 174, 50, 0.9)',
                  borderRadius: 8,
                  padding: '17px 30px',
                  fontSize: 20,
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                Join Team
              </button>
            </div>
          </div>
        </section>

        <section style={{ maxWidth: '1440px', margin: '0 auto', padding: '118px 60px 0' }}>
          <div style={{ textAlign: 'center', marginBottom: 44 }}>
            <h2 style={{ fontSize: 55, lineHeight: 1.2, fontWeight: 700, margin: 0 }}>
              What We <span style={{ color: '#DFAE32' }}>Do</span>
            </h2>
            <p
              style={{
                margin: '18px auto 0',
                maxWidth: 680,
                color: 'rgba(255,255,255,0.82)',
                fontSize: 18,
                lineHeight: 1.6,
              }}
            >
              We design and develop websites, mobile apps, and software solutions that help businesses
              grow and solve real-world problems.
            </p>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, minmax(180px, 1fr))',
              gap: 28,
            }}
          >
            {whatWeDo.map(({ icon: Icon, title, description }) => (
              <div
                key={title}
                style={{
                  borderRadius: 30,
                  background: 'rgba(255,255,255,0.04)',
                  border: '1px solid rgba(255,255,255,0.28)',
                  minHeight: 306,
                  padding: '34px 28px 26px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'flex-start',
                }}
              >
                <div
                  style={{
                    width: 78,
                    height: 78,
                    borderRadius: 18,
                    backgroundColor: '#DFAE32',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#0B0B0C',
                    marginBottom: 20,
                  }}
                >
                  <Icon size={38} strokeWidth={2.2} />
                </div>
                <h3 style={{ fontSize: 26, fontWeight: 700, marginBottom: 12 }}>{title}</h3>
                <p style={{ fontSize: 17, lineHeight: 1.6, color: 'rgba(255,255,255,0.8)' }}>{description}</p>
              </div>
            ))}
          </div>
        </section>

        <section style={{ maxWidth: '1440px', margin: '0 auto', padding: '116px 60px 0' }}>
          <div style={{ textAlign: 'center', marginBottom: 44 }}>
            <h2 style={{ fontSize: 55, lineHeight: 1.2, fontWeight: 700, margin: 0 }}>
              What We <span style={{ color: '#DFAE32' }}>Offer</span>
            </h2>
            <p
              style={{
                margin: '18px auto 0',
                maxWidth: 690,
                color: 'rgba(255,255,255,0.82)',
                fontSize: 18,
                lineHeight: 1.6,
              }}
            >
              A range of digital solutions designed to support your business growth and long-term success
              across different platforms and industries.
            </p>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, minmax(180px, 1fr))',
              gap: 28,
            }}
          >
            {whatWeOffer.map(({ icon: Icon, title, description }) => (
              <div
                key={title}
                style={{
                  borderRadius: 30,
                  background: 'rgba(255,255,255,0.04)',
                  border: '1px solid rgba(255,255,255,0.28)',
                  minHeight: 296,
                  padding: '34px 28px 26px',
                  display: 'flex',
                  flexDirection: 'column',
                }}
              >
                <div
                  style={{
                    width: 78,
                    height: 78,
                    borderRadius: 18,
                    backgroundColor: '#DFAE32',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: 20,
                    color: '#0B0B0C',
                  }}
                >
                  <Icon size={38} strokeWidth={2.2} />
                </div>
                <h3 style={{ fontSize: 22, fontWeight: 700, marginBottom: 10 }}>{title}</h3>
                <p style={{ fontSize: 16, lineHeight: 1.6, color: 'rgba(255,255,255,0.8)' }}>{description}</p>
              </div>
            ))}
          </div>
        </section>

        <section style={{ maxWidth: '1440px', margin: '0 auto', padding: '116px 60px 0' }}>
          <div style={{ textAlign: 'center', marginBottom: 44 }}>
            <h2 style={{ fontSize: 55, lineHeight: 1.2, fontWeight: 700, margin: 0 }}>
              Why <span style={{ color: '#DFAE32' }}>Choose Us</span>
            </h2>
            <p
              style={{
                margin: '18px auto 0',
                maxWidth: 690,
                color: 'rgba(255,255,255,0.82)',
                fontSize: 18,
                lineHeight: 1.6,
              }}
            >
              A range of digital solutions designed to support your business growth and long-term success
              across different platforms and industries.
            </p>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, minmax(180px, 1fr))',
              gap: 28,
            }}
          >
            {whyChooseUs.map(({ icon: Icon, title, description, theme }) => {
              const isLight = theme === 'light';
              const isGold = theme === 'gold';

              return (
                <div
                  key={title}
                  style={{
                    borderRadius: 30,
                    minHeight: 286,
                    padding: '34px 28px 26px',
                    display: 'flex',
                    flexDirection: 'column',
                    border: isLight ? '1px solid rgba(0,0,0,0.08)' : '1px solid rgba(255,255,255,0.2)',
                    background: isLight ? '#FFFFFF' : isGold ? '#DFAE32' : '#191A1C',
                    color: isLight ? '#0B0B0C' : '#FFFFFF',
                  }}
                >
                  <div
                    style={{
                      width: 68,
                      height: 68,
                      borderRadius: 18,
                      background: isLight ? '#F3F4F6' : isGold ? '#0B0B0C' : 'rgba(223, 174, 50, 0.14)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginBottom: 20,
                      color: isLight ? '#0B0B0C' : isGold ? '#DFAE32' : '#DFAE32',
                    }}
                  >
                    <Icon size={34} strokeWidth={2.2} />
                  </div>
                  <h3 style={{ fontSize: 22, fontWeight: 700, marginBottom: 12, color: isLight ? '#0B0B0C' : '#FFFFFF' }}>
                    {title}
                  </h3>
                  <p
                    style={{
                      fontSize: 16,
                      lineHeight: 1.6,
                      color: isLight ? '#3f3f46' : isGold ? '#171717' : 'rgba(255,255,255,0.8)',
                    }}
                  >
                    {description}
                  </p>
                </div>
              );
            })}
          </div>
        </section>

        <footer
          style={{
            marginTop: 120,
            background: '#0B0B0C',
            borderTop: '1px solid rgba(255,255,255,0.08)',
            width: '100%',
          }}
        >
          <div
            style={{
              maxWidth: '1440px',
              margin: '0 auto',
              padding: '44px 60px 20px',
              display: 'grid',
              gridTemplateColumns: '1.5fr 0.7fr 0.9fr',
              gap: 40,
              alignItems: 'start',
            }}
          >
            <div>
              <img src="/assets/logo.png" alt="TitanCode logo" style={{ width: 148, height: 26, objectFit: 'contain', marginBottom: 18 }} />
              <p style={{ maxWidth: 400, color: 'rgba(255,255,255,0.8)', fontSize: 18, lineHeight: 1.7 }}>
                We design and develop modern digital solutions that help businesses grow and stand out in
                today’s competitive world.
              </p>
              <div style={{ display: 'flex', gap: 14, marginTop: 24 }}>
                <span style={{ width: 30, height: 30, borderRadius: 999, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(255,255,255,0.04)' }}>
                  <Music2 size={16} />
                </span>
                <span style={{ width: 30, height: 30, borderRadius: 999, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(255,255,255,0.04)', color: '#FFFFFF', fontSize: 12, fontWeight: 800 }}>
                  in
                </span>
                <span style={{ width: 30, height: 30, borderRadius: 999, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(255,255,255,0.04)', color: '#FFFFFF', fontSize: 12, fontWeight: 800 }}>
                  X
                </span>
                <span style={{ width: 30, height: 30, borderRadius: 999, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(255,255,255,0.04)', color: '#FFFFFF', fontSize: 12, fontWeight: 800 }}>
                  ◎
                </span>
              </div>
            </div>

            <div>
              <h3 style={{ fontSize: 20, fontWeight: 700, marginBottom: 18 }}>Quick Links</h3>
              <ul style={{ listStyle: 'none', display: 'grid', gap: 10, padding: 0, margin: 0, color: 'rgba(255,255,255,0.85)' }}>
                <li>Home</li>
                <li>About</li>
                <li>Services</li>
                <li>FAQs</li>
                <li>Testimonials</li>
              </ul>
            </div>

            <div>
              <h3 style={{ fontSize: 20, fontWeight: 700, marginBottom: 18 }}>Contact</h3>
              <div style={{ display: 'grid', gap: 12 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <Phone size={18} color="#FFFFFF" />
                  <span>+233(0)546606807</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <Mail size={18} color="#FFFFFF" />
                  <span>Titancode@gmail.com</span>
                </div>
              </div>
            </div>
          </div>

          <div style={{ maxWidth: '1440px', margin: '0 auto', padding: '18px 60px 26px' }}>
            <div style={{ height: 1, background: 'rgba(255,255,255,0.12)', marginBottom: 26 }} />
            <p style={{ textAlign: 'center', color: 'rgba(255,255,255,0.7)', fontSize: 16 }}>
              © Copyright2026TitanCode. All right reserved
            </p>
          </div>
        </footer>
      </main>
    </div>
  );
};
