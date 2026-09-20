import React, { useState } from 'react';
import { Eye, EyeOff, Mail, User as UserIcon } from 'lucide-react';
import { AuthLayout } from '../components/AuthLayout';
import { api } from '../services/api';
import type { User } from '../types';

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
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!agreeTerms) {
      setError('Please agree to TitanCode Terms and Privacy Policy.');
      return;
    }

    setIsLoading(true);
    try {
      const user: User = {
        id: Date.now(),
        full_name: fullName || 'Benedicta Eguavoen',
        email,
        role: 'Member',
        status: 'active',
        created_at: new Date().toISOString(),
        avatar_url: '/assets/benedicta_avatar_sm.png',
      };
      api.setToken('mock_signup_token_' + Date.now());
      onSuccess(user);
    } catch (err: any) {
      setError(err.message || 'Registration failed.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout title="Create an account">
      <form onSubmit={handleSubmit} className="tc-fade-in">
        {error && (
          <div style={{
            padding: '10px 14px',
            borderRadius: '8px',
            backgroundColor: 'rgba(239, 68, 68, 0.15)',
            border: '1px solid rgba(239, 68, 68, 0.3)',
            color: '#EF4444',
            fontSize: '13px',
            marginBottom: '18px',
          }}>
            {error}
          </div>
        )}

        {/* Full Name */}
        <div style={{ marginBottom: '18px' }}>
          <label style={{
            display: 'block',
            fontSize: '14px',
            fontWeight: '500',
            color: '#FFFFFF',
            marginBottom: '8px',
          }}>
            Full Name
          </label>
          <div style={{ position: 'relative' }}>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="enter name"
              required
              style={{
                width: '100%',
                height: '46px',
                borderRadius: '8px',
                backgroundColor: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                color: '#FFFFFF',
                padding: '0 44px 0 16px',
                fontSize: '14px',
                outline: 'none',
                transition: 'border-color 0.2s',
              }}
              onFocus={(e) => e.target.style.borderColor = '#E5A83B'}
              onBlur={(e) => e.target.style.borderColor = 'rgba(255, 255, 255, 0.12)'}
            />
            <span style={{
              position: 'absolute',
              right: '14px',
              top: '50%',
              transform: 'translateY(-50%)',
              color: 'rgba(255, 255, 255, 0.4)',
              pointerEvents: 'none',
              display: 'flex',
            }}>
              <UserIcon size={18} />
            </span>
          </div>
        </div>

        {/* Email */}
        <div style={{ marginBottom: '18px' }}>
          <label style={{
            display: 'block',
            fontSize: '14px',
            fontWeight: '500',
            color: '#FFFFFF',
            marginBottom: '8px',
          }}>
            Email
          </label>
          <div style={{ position: 'relative' }}>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="youremail@gmail.com"
              required
              style={{
                width: '100%',
                height: '46px',
                borderRadius: '8px',
                backgroundColor: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                color: '#FFFFFF',
                padding: '0 44px 0 16px',
                fontSize: '14px',
                outline: 'none',
                transition: 'border-color 0.2s',
              }}
              onFocus={(e) => e.target.style.borderColor = '#E5A83B'}
              onBlur={(e) => e.target.style.borderColor = 'rgba(255, 255, 255, 0.12)'}
            />
            <span style={{
              position: 'absolute',
              right: '14px',
              top: '50%',
              transform: 'translateY(-50%)',
              color: 'rgba(255, 255, 255, 0.4)',
              pointerEvents: 'none',
              display: 'flex',
            }}>
              <Mail size={18} />
            </span>
          </div>
        </div>

        {/* Password */}
        <div style={{ marginBottom: '18px' }}>
          <label style={{
            display: 'block',
            fontSize: '14px',
            fontWeight: '500',
            color: '#FFFFFF',
            marginBottom: '8px',
          }}>
            Password
          </label>
          <div style={{ position: 'relative' }}>
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              style={{
                width: '100%',
                height: '46px',
                borderRadius: '8px',
                backgroundColor: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                color: '#FFFFFF',
                padding: '0 44px 0 16px',
                fontSize: '14px',
                outline: 'none',
                transition: 'border-color 0.2s',
              }}
              onFocus={(e) => e.target.style.borderColor = '#E5A83B'}
              onBlur={(e) => e.target.style.borderColor = 'rgba(255, 255, 255, 0.12)'}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              style={{
                position: 'absolute',
                right: '14px',
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'none',
                border: 'none',
                color: 'rgba(255, 255, 255, 0.4)',
                cursor: 'pointer',
                display: 'flex',
                padding: 0,
              }}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>

        {/* Checkbox: I agree to TitanCode Terms and Privacy Policy */}
        <div style={{ marginBottom: '22px' }}>
          <label style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            cursor: 'pointer',
            fontSize: '13px',
            color: '#9CA3AF',
          }}>
            <input
              type="checkbox"
              checked={agreeTerms}
              onChange={(e) => setAgreeTerms(e.target.checked)}
              style={{
                accentColor: '#E5A83B',
                width: '15px',
                height: '15px',
                cursor: 'pointer',
              }}
            />
            <span>
              I agree to <span style={{ color: '#E5A83B' }}>TitanCode Terms</span> and <span style={{ color: '#E5A83B' }}>Privacy Policy</span>
            </span>
          </label>
        </div>

        {/* Submit Solid Gold Pill Button */}
        <button
          type="submit"
          disabled={isLoading}
          style={{
            width: '100%',
            height: '46px',
            borderRadius: '9999px',
            backgroundColor: '#E5A83B',
            color: '#000000',
            fontSize: '15px',
            fontWeight: '700',
            border: 'none',
            cursor: 'pointer',
            boxShadow: '0 4px 14px rgba(229, 168, 59, 0.3)',
            transition: 'opacity 0.2s, transform 0.1s',
          }}
          onMouseDown={(e) => e.currentTarget.style.transform = 'scale(0.99)'}
          onMouseUp={(e) => e.currentTarget.style.transform = 'scale(1)'}
        >
          {isLoading ? 'Creating Account...' : 'Create Account'}
        </button>

        {/* Social Auth Divider */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          margin: '24px 0 20px',
          color: '#6B7280',
          fontSize: '13px',
        }}>
          <div style={{ flex: 1, height: '1px', backgroundColor: 'rgba(255, 255, 255, 0.1)' }} />
          <span style={{ padding: '0 14px', whiteSpace: 'nowrap' }}>Or continue with</span>
          <div style={{ flex: 1, height: '1px', backgroundColor: 'rgba(255, 255, 255, 0.1)' }} />
        </div>

        {/* Social Buttons: Google & iphone */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '24px' }}>
          <button
            type="button"
            style={{
              height: '44px',
              borderRadius: '9999px',
              backgroundColor: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              color: '#FFFFFF',
              fontSize: '14px',
              fontWeight: '500',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              cursor: 'pointer',
            }}
          >
            <span style={{
              width: '18px',
              height: '18px',
              borderRadius: '50%',
              backgroundColor: '#FFFFFF',
              color: '#000000',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: '700',
              fontSize: '11px',
            }}>
              G
            </span>
            Google
          </button>

          <button
            type="button"
            style={{
              height: '44px',
              borderRadius: '9999px',
              backgroundColor: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              color: '#FFFFFF',
              fontSize: '14px',
              fontWeight: '500',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              cursor: 'pointer',
            }}
          >
            <span style={{ fontSize: '16px', lineHeight: 1 }}></span>
            iphone
          </button>
        </div>

        {/* Bottom Switch Link */}
        <div style={{
          textAlign: 'center',
          fontSize: '14px',
          color: '#9CA3AF',
        }}>
          Already have an account?{' '}
          <button
            type="button"
            onClick={onNavigateSignIn}
            style={{
              background: 'none',
              border: 'none',
              color: '#E5A83B',
              fontWeight: '600',
              cursor: 'pointer',
              padding: 0,
            }}
          >
            Login
          </button>
        </div>
      </form>
    </AuthLayout>
  );
};
