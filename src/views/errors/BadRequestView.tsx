import React from 'react';
import { AlertCircle, ArrowLeft, Home, RotateCcw } from 'lucide-react';
import type { ScreenId } from '../../App';

interface BadRequestViewProps {
  message?: string;
  onNavigate: (view: ScreenId) => void;
  onBack?: () => void;
}

export const BadRequestView: React.FC<BadRequestViewProps> = ({
  message = 'The server could not understand the request due to invalid syntax or missing required parameters.',
  onNavigate,
  onBack,
}) => {
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
      {/* Background Ambient Glow */}
      <div
        style={{
          position: 'absolute',
          top: '25%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '560px',
          height: '560px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(245, 158, 11, 0.12) 0%, rgba(11, 11, 12, 0) 70%)',
          pointerEvents: 'none',
          filter: 'blur(50px)',
          zIndex: 0,
        }}
      />

      <div
        style={{
          position: 'relative',
          zIndex: 1,
          maxWidth: '540px',
          width: '100%',
          textAlign: 'center',
          backgroundColor: 'rgba(255, 255, 255, 0.03)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          borderRadius: '24px',
          padding: '48px 36px',
          backdropFilter: 'blur(16px)',
          boxShadow: '0 24px 60px rgba(0, 0, 0, 0.65)',
        }}
      >
        <div
          style={{
            width: '88px',
            height: '88px',
            borderRadius: '24px',
            backgroundColor: 'rgba(245, 158, 11, 0.12)',
            border: '1px solid rgba(245, 158, 11, 0.3)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 24px',
            boxShadow: '0 0 30px rgba(245, 158, 11, 0.2)',
          }}
        >
          <AlertCircle size={44} color="#F59E0B" strokeWidth={1.8} />
        </div>

        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            padding: '4px 14px',
            borderRadius: '9999px',
            backgroundColor: 'rgba(245, 158, 11, 0.12)',
            border: '1px solid rgba(245, 158, 11, 0.3)',
            fontSize: '12px',
            fontWeight: 700,
            color: '#F59E0B',
            marginBottom: '16px',
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
          }}
        >
          Error 400: Bad Request
        </div>

        <h1
          style={{
            fontSize: '24px',
            fontWeight: 700,
            color: '#FFFFFF',
            marginBottom: '12px',
            fontFamily: "'Inter', sans-serif",
            letterSpacing: '-0.3px',
          }}
        >
          Invalid Request
        </h1>

        <p
          style={{
            fontSize: '14px',
            color: '#9CA3AF',
            lineHeight: '1.6',
            marginBottom: '32px',
          }}
        >
          {message}
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {onBack ? (
            <button
              type="button"
              onClick={onBack}
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
              }}
            >
              <RotateCcw size={18} />
              Go Back & Correct Input
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
              }}
            >
              <Home size={18} />
              Return to Homepage
            </button>
          )}

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
              gap: '8px',
            }}
          >
            <ArrowLeft size={16} />
            Contact Support
          </button>
        </div>
      </div>
    </div>
  );
};
