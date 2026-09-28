import React, { useState } from 'react';
import { ServerCrash, RefreshCw, Home, ChevronDown, ChevronUp, AlertOctagon, Terminal } from 'lucide-react';
import type { ScreenId } from '../../App';

interface ServerErrorViewProps {
  error?: Error | null;
  errorMessage?: string;
  errorDetails?: string;
  onRetry?: () => void;
  onNavigate: (view: ScreenId) => void;
}

export const ServerErrorView: React.FC<ServerErrorViewProps> = ({
  error,
  errorMessage = 'Our backend services encountered an unexpected exception or the API cluster is temporarily unreachable.',
  errorDetails,
  onRetry,
  onNavigate,
}) => {
  const [isRetrying, setIsRetrying] = useState(false);
  const [showTechnical, setShowTechnical] = useState(false);

  const handleRetry = () => {
    setIsRetrying(true);
    if (onRetry) {
      onRetry();
      setTimeout(() => setIsRetrying(false), 800);
    } else {
      window.location.reload();
    }
  };

  const details = error?.stack || error?.message || errorDetails;

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
          top: '20%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '560px',
          height: '560px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(239, 68, 68, 0.12) 0%, rgba(11, 11, 12, 0) 70%)',
          pointerEvents: 'none',
          filter: 'blur(50px)',
          zIndex: 0,
        }}
      />

      <div
        style={{
          position: 'relative',
          zIndex: 1,
          maxWidth: '580px',
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
        {/* Animated Server Crash Icon */}
        <div
          style={{
            width: '90px',
            height: '90px',
            borderRadius: '24px',
            backgroundColor: 'rgba(239, 68, 68, 0.12)',
            border: '1px solid rgba(239, 68, 68, 0.3)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 24px',
            boxShadow: '0 0 35px rgba(239, 68, 68, 0.25)',
          }}
        >
          <ServerCrash size={44} color="#EF4444" strokeWidth={1.8} />
        </div>

        {/* 500 Status Badge */}
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            padding: '4px 14px',
            borderRadius: '9999px',
            backgroundColor: 'rgba(239, 68, 68, 0.12)',
            border: '1px solid rgba(239, 68, 68, 0.3)',
            fontSize: '12px',
            fontWeight: 700,
            color: '#EF4444',
            marginBottom: '16px',
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
          }}
        >
          <AlertOctagon size={14} />
          Error 500: Server Exception
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
          Internal System Error
        </h1>

        <p
          style={{
            fontSize: '14px',
            color: '#9CA3AF',
            lineHeight: '1.6',
            marginBottom: '28px',
          }}
        >
          {errorMessage}
        </p>

        {/* Technical Diagnostics Accordion */}
        {details && (
          <div
            style={{
              marginBottom: '28px',
              textAlign: 'left',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '12px',
              backgroundColor: 'rgba(0, 0, 0, 0.4)',
              overflow: 'hidden',
            }}
          >
            <button
              type="button"
              onClick={() => setShowTechnical(!showTechnical)}
              style={{
                width: '100%',
                padding: '12px 16px',
                background: 'none',
                border: 'none',
                color: '#DFAE32',
                fontSize: '13px',
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                cursor: 'pointer',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Terminal size={15} />
                Technical Diagnostics
              </div>
              {showTechnical ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </button>

            {showTechnical && (
              <div
                style={{
                  padding: '12px 16px',
                  borderTop: '1px solid rgba(255, 255, 255, 0.08)',
                  backgroundColor: '#070708',
                  maxHeight: '180px',
                  overflowY: 'auto',
                }}
              >
                <pre
                  style={{
                    margin: 0,
                    fontSize: '11px',
                    color: '#EF4444',
                    fontFamily: 'monospace',
                    whiteSpace: 'pre-wrap',
                    wordBreak: 'break-all',
                  }}
                >
                  {details}
                </pre>
              </div>
            )}
          </div>
        )}

        {/* Action Buttons */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <button
            type="button"
            onClick={handleRetry}
            disabled={isRetrying}
            style={{
              height: '48px',
              borderRadius: '9999px',
              backgroundColor: '#DFAE32',
              color: '#0B0B0C',
              fontSize: '15px',
              fontWeight: 700,
              border: 'none',
              cursor: isRetrying ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              boxShadow: '0 4px 16px rgba(223, 174, 50, 0.3)',
              opacity: isRetrying ? 0.75 : 1,
            }}
          >
            <RefreshCw size={18} className={isRetrying ? 'tc-spin' : ''} />
            {isRetrying ? 'Re-establishing Connection...' : 'Retry Connection'}
          </button>

          <button
            type="button"
            onClick={() => onNavigate('home')}
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
            <Home size={16} />
            Return to Homepage
          </button>
        </div>
      </div>
    </div>
  );
};
