import React from 'react';
import { Compass, Home, LayoutDashboard, ArrowLeft, LifeBuoy } from 'lucide-react';
import type { ScreenId } from '../../App';
import { api } from '../../services/api';

interface NotFoundViewProps {
  onNavigate: (view: ScreenId) => void;
  requestedPath?: string;
}

export const NotFoundView: React.FC<NotFoundViewProps> = ({ onNavigate, requestedPath }) => {
  const isAuthenticated = api.isAuthenticated();

  return (
    <div
      className="tc-fade-in"
      style={{
        minHeight: '100vh',
        width: '100%',
        backgroundColor: '#0B0B0C',
        color: '#FFFFFF',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '40px 24px',
        position: 'relative',
        overflow: 'hidden',
        fontFamily: "'Poppins', sans-serif",
      }}
    >
      {/* Background Ambient Glow & Grid Pattern */}
      <div
        style={{
          position: 'absolute',
          top: '20%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '560px',
          height: '560px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(223, 174, 50, 0.12) 0%, rgba(11, 11, 12, 0) 70%)',
          pointerEvents: 'none',
          filter: 'blur(40px)',
          zIndex: 0,
        }}
      />

      <div
        style={{
          position: 'relative',
          zIndex: 1,
          maxWidth: '560px',
          width: '100%',
          textAlign: 'center',
          backgroundColor: 'rgba(255, 255, 255, 0.03)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          borderRadius: '24px',
          padding: '52px 36px',
          backdropFilter: 'blur(16px)',
          boxShadow: '0 20px 50px rgba(0, 0, 0, 0.6)',
        }}
      >
        {/* Animated Badge & Icon */}
        <div
          style={{
            width: '90px',
            height: '90px',
            borderRadius: '24px',
            backgroundColor: 'rgba(223, 174, 50, 0.12)',
            border: '1px solid rgba(223, 174, 50, 0.3)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 24px',
            boxShadow: '0 0 30px rgba(223, 174, 50, 0.2)',
          }}
        >
          <Compass size={44} color="#DFAE32" strokeWidth={1.8} />
        </div>

        {/* Big 404 Display */}
        <div
          style={{
            fontSize: '76px',
            fontWeight: 900,
            letterSpacing: '-2px',
            lineHeight: 1,
            background: 'linear-gradient(180deg, #FFFFFF 30%, #DFAE32 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            marginBottom: '12px',
            fontFamily: "'Inter', sans-serif",
          }}
        >
          404
        </div>

        <h1
          style={{
            fontSize: '22px',
            fontWeight: 700,
            color: '#FFFFFF',
            marginBottom: '12px',
            fontFamily: "'Inter', sans-serif",
          }}
        >
          Page Not Found
        </h1>

        <p
          style={{
            fontSize: '14px',
            color: '#9CA3AF',
            lineHeight: '1.6',
            marginBottom: '32px',
          }}
        >
          The coordinates or resource you are looking for do not exist on TitanCode, have been moved, or are temporarily unavailable.
          {requestedPath && (
            <span
              style={{
                display: 'block',
                marginTop: '8px',
                fontFamily: 'monospace',
                fontSize: '12px',
                color: '#DFAE32',
                backgroundColor: 'rgba(223, 174, 50, 0.08)',
                padding: '4px 10px',
                borderRadius: '6px',
                width: 'fit-content',
                margin: '8px auto 0',
              }}
            >
              {requestedPath}
            </span>
          )}
        </p>

        {/* Action Buttons */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
          }}
        >
          {isAuthenticated ? (
            <button
              type="button"
              onClick={() => onNavigate('dashboard')}
              style={{
                height: '48px',
                borderRadius: '9999px',
                backgroundColor: '#DFAE32',
                color: '#0B0B0C',
                fontSize: '15px',
                fontWeight: 700,
                border: 'none',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                boxShadow: '0 4px 16px rgba(223, 174, 50, 0.3)',
                transition: 'transform 0.15s ease, opacity 0.15s ease',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.opacity = '0.92')}
              onMouseLeave={(e) => (e.currentTarget.style.opacity = '1')}
            >
              <LayoutDashboard size={18} />
              Return to Workspace Dashboard
            </button>
          ) : (
            <button
              type="button"
              onClick={() => onNavigate('home')}
              style={{
                height: '48px',
                borderRadius: '9999px',
                backgroundColor: '#DFAE32',
                color: '#0B0B0C',
                fontSize: '15px',
                fontWeight: 700,
                border: 'none',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                boxShadow: '0 4px 16px rgba(223, 174, 50, 0.3)',
                transition: 'transform 0.15s ease, opacity 0.15s ease',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.opacity = '0.92')}
              onMouseLeave={(e) => (e.currentTarget.style.opacity = '1')}
            >
              <Home size={18} />
              Return to Homepage
            </button>
          )}

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <button
              type="button"
              onClick={() => onNavigate('services')}
              style={{
                height: '44px',
                borderRadius: '9999px',
                backgroundColor: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                color: '#FFFFFF',
                fontSize: '14px',
                fontWeight: 600,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
                transition: 'background-color 0.2s',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)')}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.05)')}
            >
              <ArrowLeft size={16} />
              View Services
            </button>

            <button
              type="button"
              onClick={() => onNavigate('contact_us')}
              style={{
                height: '44px',
                borderRadius: '9999px',
                backgroundColor: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                color: '#FFFFFF',
                fontSize: '14px',
                fontWeight: 600,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
                transition: 'background-color 0.2s',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)')}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.05)')}
            >
              <LifeBuoy size={16} color="#DFAE32" />
              Contact Support
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
