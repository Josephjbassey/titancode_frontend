import React, { useState, useCallback, useRef, useEffect } from 'react';
import { Eye, EyeOff, Mail, User as UserIcon } from 'lucide-react';
import { AuthLayout } from '../components/AuthLayout';
import { api } from '../services/api';
import type { User } from '../types';

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || '';

interface SignUpViewProps {
  onSuccess: (user: User) => void;
  onNavigateSignIn: () => void;
  onNavigateQualification: () => void;
}

export const SignUpView: React.FC<SignUpViewProps> = ({
  onSuccess,
  onNavigateSignIn,
  onNavigateQualification: _onNavigateQualification,
}) => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [error, setError] = useState('');
  const googleInitialized = useRef(false);

  // Google OAuth callback
  const handleGoogleCredential = useCallback(async (response: { credential: string }) => {
    setError('');
    setIsGoogleLoading(true);
    try {
      const authResponse = await api.googleLogin(response.credential);
      onSuccess(authResponse.user);
    } catch (err: any) {
      setError(err.message || 'Google sign-up failed. Please try again.');
    } finally {
      setIsGoogleLoading(false);
    }
  }, [onSuccess]);

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

    if (window.google?.accounts?.id) {
      initGoogle();
    } else {
      const checkInterval = setInterval(() => {
        if (window.google?.accounts?.id) {
          initGoogle();
          clearInterval(checkInterval);
        }
      }, 200);
      const timeout = setTimeout(() => clearInterval(checkInterval), 10000);
      return () => {
        clearInterval(checkInterval);
        clearTimeout(timeout);
      };
    }
  }, [handleGoogleCredential]);

  const handleGoogleClick = () => {
    if (!GOOGLE_CLIENT_ID) {
      setError('Google Sign-In is not configured. Please set VITE_GOOGLE_CLIENT_ID.');
      return;
    }
    if (window.google?.accounts?.id) {
      window.google.accounts.id.prompt();
    } else {
      setError('Google Sign-In is still loading. Please try again in a moment.');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!agreeTerms) {
      setError('Please agree to TitanCode Terms and Privacy Policy.');
      return;
    }

    if (!fullName.trim()) {
      setError('Full name is required.');
      return;
    }

    setIsLoading(true);
    try {
      // Register the account
      await api.register({ full_name: fullName.trim(), email, password });
      try {
        // Authenticate immediately so the qualification step has an active session
        const auth = await api.login(email, password);
        onSuccess(auth.user);
      } catch {
        const pendingUser: User = {
          id: 0,
          full_name: fullName.trim(),
          email,
          role: 'Member',
          status: 'pending',
          created_at: new Date().toISOString(),
        };
        onSuccess(pendingUser);
      }
    } catch (err: any) {
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout title="Create an account">
      <form onSubmit={handleSubmit} className="tc-fade-in">
        {error && (
          <div className="tc-form-error-banner">
            {error}
          </div>
        )}

        {/* Full Name */}
        <div className="tc-auth-input-group">
          <label className="tc-auth-label">
            Full Name
          </label>
          <div className="tc-relative">
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="enter name"
              required
              className="tc-auth-input"
            />
            <span className="tc-auth-icon-end">
              <UserIcon size={18} />
            </span>
          </div>
        </div>

        {/* Email */}
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

        {/* Password */}
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

        {/* Checkbox: I agree to TitanCode Terms and Privacy Policy */}
        <div className="tc-auth-input-group">
          <label className="tc-auth-checkbox-label">
            <input
              type="checkbox"
              checked={agreeTerms}
              onChange={(e) => setAgreeTerms(e.target.checked)}
              className="tc-auth-checkbox-input"
            />
            <span>
              I agree to <span className="tc-text-gold">TitanCode Terms</span> and <span className="tc-text-gold">Privacy Policy</span>
            </span>
          </label>
        </div>

        {/* Submit Solid Gold Button */}
        <button
          type="submit"
          disabled={isLoading}
          className="tc-auth-btn-primary"
        >
          {isLoading ? 'Creating Account...' : 'Create Account'}
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
          Already have an account?{' '}
          <button
            type="button"
            onClick={onNavigateSignIn}
            className="tc-text-btn-gold"
          >
            Login
          </button>
        </div>
      </form>
    </AuthLayout>
  );
};
