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
    <div className="tc-fade-in tc-error-page-container">
      {/* Background Ambient Glow & Grid Pattern */}
      <div className="tc-error-ambient-glow" />

      <div className="tc-error-card">
        {/* Animated Badge & Icon */}
        <div className="tc-error-icon-box">
          <Compass size={44} color="#DFAE32" strokeWidth={1.8} />
        </div>

        {/* Big 404 Display */}
        <div className="tc-error-code-hero">
          404
        </div>

        <h1 className="tc-error-title">
          Page Not Found
        </h1>

        <p className="tc-error-desc">
          The coordinates or resource you are looking for do not exist on TitanCode, have been moved, or are temporarily unavailable.
          {requestedPath && (
            <span className="tc-error-path-tag">
              {requestedPath}
            </span>
          )}
        </p>

        {/* Action Buttons */}
        <div className="tc-error-actions-stack">
          {isAuthenticated ? (
            <button
              type="button"
              onClick={() => onNavigate('dashboard')}
              className="tc-btn-error-primary"
            >
              <LayoutDashboard size={18} />
              Return to Workspace Dashboard
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

          <div className="tc-error-actions-grid">
            <button
              type="button"
              onClick={() => onNavigate('services')}
              className="tc-btn-error-secondary"
            >
              <ArrowLeft size={16} />
              View Services
            </button>

            <button
              type="button"
              onClick={() => onNavigate('contact_us')}
              className="tc-btn-error-secondary"
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
