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
    <div className="tc-fade-in tc-error-page-container">
      {/* Background Ambient Glow */}
      <div className="tc-error-ambient-glow tc-error-ambient-glow--amber" />

      <div className="tc-error-card tc-error-card--compact">
        <div className="tc-error-icon-box tc-error-icon-box--amber">
          <AlertCircle size={44} color="#F59E0B" strokeWidth={1.8} />
        </div>

        <div className="tc-error-badge tc-error-badge--amber">
          Error 400: Bad Request
        </div>

        <h1 className="tc-error-title">
          Invalid Request
        </h1>

        <p className="tc-error-desc">
          {message}
        </p>

        <div className="tc-error-actions-stack">
          {onBack ? (
            <button
              type="button"
              onClick={onBack}
              className="tc-btn-error-primary"
            >
              <RotateCcw size={18} />
              Go Back & Correct Input
            </button>
          ) : (
            <button
              type="button"
              onClick={() => onNavigate('home')}
              className="tc-btn-error-primary"
            >
              <Home size={18} />
              Return to Homepage
            </button>
          )}

          <button
            type="button"
            onClick={() => onNavigate('contact_us')}
            className="tc-btn-error-secondary"
          >
            <ArrowLeft size={16} />
            Contact Support
          </button>
        </div>
      </div>
    </div>
  );
};
