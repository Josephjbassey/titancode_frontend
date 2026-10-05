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
    <div className="tc-fade-in tc-error-page-container">
      {/* Background Ambient Glow */}
      <div className="tc-error-ambient-glow tc-error-ambient-glow--red" />

      <div className="tc-error-card tc-error-card--wide">
        {/* Animated Server Crash Icon */}
        <div className="tc-error-icon-box tc-error-icon-box--red">
          <ServerCrash size={44} color="#EF4444" strokeWidth={1.8} />
        </div>

        {/* 500 Status Badge */}
        <div className="tc-error-badge tc-error-badge--red">
          <AlertOctagon size={14} />
          Error 500: Server Exception
        </div>

        <h1 className="tc-error-title">
          Internal System Error
        </h1>

        <p className="tc-error-desc tc-error-desc--compact">
          {errorMessage}
        </p>

        {/* Technical Diagnostics Accordion */}
        {details && (
          <div className="tc-diagnostics-box">
            <button
              type="button"
              onClick={() => setShowTechnical(!showTechnical)}
              className="tc-diagnostics-header"
            >
              <div className="tc-flex-center-gap8">
                <Terminal size={15} />
                Technical Diagnostics
              </div>
              {showTechnical ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </button>

            {showTechnical && (
              <pre className="tc-diagnostics-pre">
                {details}
              </pre>
            )}
          </div>
        )}

        {/* Action Buttons */}
        <div className="tc-error-actions-stack">
          <button
            type="button"
            onClick={handleRetry}
            disabled={isRetrying}
            className="tc-btn-error-primary"
          >
            <RefreshCw size={18} className={isRetrying ? 'tc-spin' : ''} />
            {isRetrying ? 'Re-establishing Connection...' : 'Retry Connection'}
          </button>

          <button
            type="button"
            onClick={() => onNavigate('home')}
            className="tc-btn-error-secondary"
          >
            <Home size={16} />
            Return to Homepage
          </button>
        </div>
      </div>
    </div>
  );
};
