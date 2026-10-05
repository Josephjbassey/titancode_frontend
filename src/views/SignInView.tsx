import React, { useState, useCallback, useRef, useEffect } from 'react';
import { Eye, EyeOff, Mail } from 'lucide-react';
import { AuthLayout } from '../components/AuthLayout';
import { api } from '../services/api';
import type { User } from '../types';

// Google Identity Services types
declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (config: {
            client_id: string;
            callback: (response: { credential: string }) => void;
            auto_select?: boolean;
          }) => void;
          prompt: () => void;
        };
      };
    };
  }
}

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || '';

interface SignInViewProps {
  onSuccess: (user: User) => void;
  onNavigateSignUp: () => void;
  onNavigateForgotPassword: () => void;
  onNavigateQualification?: () => void;
  onPendingApproval?: (email: string) => void;
}

export const SignInView: React.FC<SignInViewProps> = ({
  onSuccess,
  onNavigateSignUp,
  onNavigateForgotPassword,
  onNavigateQualification: _onNavigateQualification,
  onPendingApproval,
}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const googleInitialized = useRef(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setIsLoading(true);

    try {
      const response = await api.login(email, password);
      onSuccess(response.user);
    } catch (err: any) {
      const msg = err.message || 'Failed to sign in. Please check your credentials.';
      if (msg.toLowerCase().includes('pending approval') && onPendingApproval) {
        onPendingApproval(email);
        return;
      }
      setErrorMessage(msg);
    } finally {
      setIsLoading(false);
    }
  };

  // Google OAuth callback
  const handleGoogleCredential = useCallback(async (response: { credential: string }) => {
    setErrorMessage('');
    setIsGoogleLoading(true);
    try {
      const authResponse = await api.googleLogin(response.credential);
      onSuccess(authResponse.user);
    } catch (err: any) {
      const msg = err.message || 'Google sign-in failed. Please try again.';
      if (msg.toLowerCase().includes('pending approval') && onPendingApproval) {
        onPendingApproval('');
        return;
      }
      setErrorMessage(msg);
    } finally {
      setIsGoogleLoading(false);
    }
  }, [onSuccess, onPendingApproval]);

  // Initialize Google Identity Services
  useEffect(() => {
    if (!GOOGLE_CLIENT_ID || googleInitialized.current) return;

    const initGoogle = () => {
      if (window.google?.accounts?.id) {
        window.google.accounts.id.initialize({
          client_id: GOOGLE_CLIENT_ID,
          callback: handleGoogleCredential,
        });
        googleInitialized.current = true;
      }
    };

    // GIS script might already be loaded
    if (window.google?.accounts?.id) {
      initGoogle();
    } else {
      // Wait for the async script to load
      const checkInterval = setInterval(() => {
        if (window.google?.accounts?.id) {
          initGoogle();
          clearInterval(checkInterval);
        }
      }, 200);
      // Clean up after 10 seconds if it never loads
      const timeout = setTimeout(() => clearInterval(checkInterval), 10000);
      return () => {
        clearInterval(checkInterval);
        clearTimeout(timeout);
      };
    }
  }, [handleGoogleCredential]);

  const handleGoogleClick = () => {
    if (!GOOGLE_CLIENT_ID) {
      setErrorMessage('Google Sign-In is not configured. Please set VITE_GOOGLE_CLIENT_ID.');
      return;
    }
    if (window.google?.accounts?.id) {
      window.google.accounts.id.prompt();
    } else {
      setErrorMessage('Google Sign-In is still loading. Please try again in a moment.');
    }
  };

  return (
    <AuthLayout title="Sign In">
      <form onSubmit={handleSubmit} className="tc-fade-in">
        {errorMessage && (
          <div className="tc-form-error-banner">
            {errorMessage}
          </div>
        )}

        {/* Email Field */}
        <div className="tc-auth-input-group">
          <label className="tc-auth-label">
            Email
          </label>
          <div className="tc-relative">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="youremail@gmail.com"
              required
              className="tc-auth-input"
            />
            <span className="tc-auth-icon-end">
              <Mail size={18} />
            </span>
          </div>
        </div>

        {/* Password Field */}
        <div className="tc-auth-input-group">
          <label className="tc-auth-label">
            Password
          </label>
          <div className="tc-relative">
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              className="tc-auth-input"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="tc-auth-icon-btn-end"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>

        {/* Remember Me & Forgot Password Row */}
        <div className="tc-auth-checkbox-row">
          <label className="tc-auth-checkbox-label">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="tc-auth-checkbox-input"
            />
            Remember Me
          </label>

          <button
            type="button"
            onClick={onNavigateForgotPassword}
            className="tc-text-btn-gold"
          >
            Forgot Password?
          </button>
        </div>

        {/* Submit Solid Gold Button */}
        <button
          type="submit"
          disabled={isLoading}
          className="tc-auth-btn-primary"
        >
          {isLoading ? 'Signing In...' : 'Sign In'}
        </button>

        {/* Social Auth Divider */}
        <div className="tc-auth-divider">
          <div className="tc-auth-divider-line" />
          <span className="tc-auth-divider-text">Or continue with</span>
          <div className="tc-auth-divider-line" />
        </div>

        {/* Social Buttons: Google & Apple */}
        <div className="tc-auth-social-grid">
          <button
            type="button"
            onClick={handleGoogleClick}
            disabled={isGoogleLoading}
            className="tc-auth-social-btn"
          >
            <img
              src="/assets/google.png"
              alt="Google"
              className="tc-auth-social-icon"
            />
            {isGoogleLoading ? 'Signing in…' : 'Google'}
          </button>

          <button
            type="button"
            disabled
            title="Apple Sign-In — Coming Soon"
            className="tc-auth-social-btn"
          >
            <img
              src="/assets/apple.png"
              alt="Apple"
              className="tc-auth-social-icon"
            />
            Apple
          </button>
        </div>

        {/* Bottom Switch Link */}
        <div className="tc-auth-footer-prompt">
          Don't have an account?{' '}
          <button
            type="button"
            onClick={onNavigateSignUp}
            className="tc-text-btn-gold"
          >
            Sign Up
          </button>
        </div>

      </form>
    </AuthLayout>
  );
};
