import React, { useState, useEffect } from 'react';
import { Mail, Eye, EyeOff, ArrowLeft } from 'lucide-react';
import { AuthLayout } from '../components/AuthLayout';
import { OtpInput } from '../components/OtpInput';
import { NotificationModal } from '../components/NotificationModal';
import { api } from '../services/api';

interface ForgotPasswordWizardProps {
  initialStep?: 1 | 2 | 3 | 4;
  onDone: () => void;
  onBackToSignIn: () => void;
}

export const ForgotPasswordWizard: React.FC<ForgotPasswordWizardProps> = ({
  initialStep = 1,
  onDone,
  onBackToSignIn,
}) => {
  const [step, setStep] = useState<1 | 2 | 3 | 4>(initialStep);
  const [email, setEmail] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [resendTimer, setResendTimer] = useState(45);
  const [showErrorModal, setShowErrorModal] = useState(false);

  useEffect(() => {
    let interval: any = null;
    if (step === 2 && resendTimer > 0) {
      interval = setInterval(() => setResendTimer((prev) => prev - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [step, resendTimer]);

  const handleRequestOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage('');
    try {
      await api.requestPasswordResetOtp(email || 'user@gmail.com');
      setStep(2);
      setResendTimer(45);
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to send OTP code.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (otpCode.length < 4) {
      setErrorMessage('Please enter the full 4-digit code.');
      return;
    }

    setIsLoading(true);
    setErrorMessage('');
    try {
      if (otpCode === '0000') {
        throw new Error('Incorrect code.');
      }
      await api.verifyOtp(email || 'user@gmail.com', otpCode);
      setStep(3);
    } catch (err: any) {
      setShowErrorModal(true);
      setErrorMessage(err.message || 'Incorrect verification code.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 8) {
      setErrorMessage('The password must be at least 8 character');
      return;
    }
    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match.');
      return;
    }

    setIsLoading(true);
    setErrorMessage('');
    try {
      await api.resetPassword('mock_token', password);
      setStep(4);
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to reset password.');
    } finally {
      setIsLoading(false);
    }
  };

  // Helper for 3 step indicator dots matching Figma bottom-left placement Frame 171 (x=120, y=957)
  const renderStepIndicator = (activeStep: number) => {
    return (
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'flex-start',
          gap: '16px',
          marginTop: '40px',
        }}
      >
        {[1, 2, 3].map((num) => {
          const isActive = num === activeStep;
          return (
            <div
              key={num}
              style={{
                width: '44px',
                height: '44px',
                borderRadius: '50%',
                backgroundColor: isActive ? '#dfae32' : 'rgba(255, 255, 255, 0.08)',
                color: isActive ? '#000000' : 'rgba(255, 255, 255, 0.5)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '15px',
                fontWeight: '700',
                transition: 'all 0.3s ease',
              }}
            >
              {num}
            </div>
          );
        })}
      </div>
    );
  };

  // Step 1: Forgotten Password?
  if (step === 1) {
    return (
      <AuthLayout>
        <div style={{ marginBottom: '24px' }}>
          <h1 style={{
            fontSize: '26px',
            fontWeight: '700',
            color: '#FFFFFF',
            marginBottom: '6px',
            letterSpacing: '-0.3px',
          }}>
            Forgotten Password?
          </h1>
          <p style={{
            fontSize: '14px',
            color: '#9CA3AF',
            margin: 0,
            lineHeight: '1.5',
          }}>
            No worries, we'll send you a reset instructions
          </p>
        </div>

        <form onSubmit={handleRequestOtp} className="tc-fade-in">
          {errorMessage && (
            <div style={{
              padding: '10px 14px',
              borderRadius: '8px',
              backgroundColor: 'rgba(239, 68, 68, 0.15)',
              color: '#EF4444',
              fontSize: '13px',
              marginBottom: '16px',
            }}>
              {errorMessage}
            </div>
          )}

          <div style={{ marginBottom: '22px' }}>
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
                placeholder="Enter your email"
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
                }}
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

          {/* Reset Password Solid Gold Pill */}
          <button
            type="submit"
            disabled={isLoading}
            style={{
              width: '100%',
              height: '46px',
              borderRadius: '9999px',
              backgroundColor: '#dfae32',
              color: '#000000',
              fontSize: '15px',
              fontWeight: '700',
              border: 'none',
              cursor: 'pointer',
              marginBottom: '14px',
              boxShadow: '0 4px 14px rgba(223, 174, 50, 0.3)',
            }}
          >
            {isLoading ? 'Sending...' : 'Reset Password'}
          </button>

          {/* Back to Login Outline Pill */}
          <button
            type="button"
            onClick={onBackToSignIn}
            style={{
              width: '100%',
              height: '46px',
              borderRadius: '9999px',
              backgroundColor: 'transparent',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              color: '#FFFFFF',
              fontSize: '14px',
              fontWeight: '500',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
            }}
          >
            <ArrowLeft size={16} />
            Back to login
          </button>
        </form>
        {renderStepIndicator(1)}
      </AuthLayout>
    );
  }

  // Step 2: Verify OTP
  if (step === 2) {
    return (
      <AuthLayout>
        <div style={{ marginBottom: '24px' }}>
          <h1 style={{
            fontSize: '26px',
            fontWeight: '700',
            color: '#dfae32',
            marginBottom: '6px',
            letterSpacing: '-0.3px',
          }}>
            Verify OTP
          </h1>
          <p style={{
            fontSize: '14px',
            color: '#9CA3AF',
            margin: 0,
            lineHeight: '1.5',
          }}>
            Enter 4-digit code sent to your email
          </p>
        </div>

        <form onSubmit={handleVerifyOtp} className="tc-fade-in">
          {errorMessage && (
            <div style={{
              padding: '10px 14px',
              borderRadius: '8px',
              backgroundColor: 'rgba(239, 68, 68, 0.15)',
              color: '#EF4444',
              fontSize: '13px',
              marginBottom: '14px',
              textAlign: 'center',
            }}>
              {errorMessage}
            </div>
          )}

          <div style={{ margin: '20px 0' }}>
            <OtpInput
              length={4}
              value={otpCode}
              onChange={(val) => {
                setOtpCode(val);
                setErrorMessage('');
              }}
              hasError={Boolean(errorMessage)}
            />
          </div>

          {/* Continue Solid Gold Pill */}
          <button
            type="submit"
            disabled={isLoading || otpCode.length < 4}
            style={{
              width: '100%',
              height: '46px',
              borderRadius: '9999px',
              backgroundColor: '#dfae32',
              color: '#000000',
              fontSize: '15px',
              fontWeight: '700',
              border: 'none',
              cursor: 'pointer',
              marginBottom: '18px',
              boxShadow: '0 4px 14px rgba(223, 174, 50, 0.3)',
            }}
          >
            {isLoading ? 'Verifying...' : 'Continue'}
          </button>

          <div style={{
            textAlign: 'center',
            fontSize: '14px',
            color: '#9CA3AF',
            marginBottom: '20px',
          }}>
            Didn't get code?{' '}
            <button
              type="button"
              onClick={() => setResendTimer(45)}
              style={{
                background: 'none',
                border: 'none',
                color: '#dfae32',
                fontWeight: '600',
                cursor: 'pointer',
                padding: 0,
              }}
            >
              Resend code {resendTimer > 0 && `(${resendTimer}s)`}
            </button>
          </div>

          {/* Back to Login Outline Pill */}
          <button
            type="button"
            onClick={onBackToSignIn}
            style={{
              width: '100%',
              height: '46px',
              borderRadius: '9999px',
              backgroundColor: 'transparent',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              color: '#FFFFFF',
              fontSize: '14px',
              fontWeight: '500',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
            }}
          >
            <ArrowLeft size={16} />
            Back to login
          </button>
        </form>
        {renderStepIndicator(2)}

        <NotificationModal
          isOpen={showErrorModal}
          onClose={() => setShowErrorModal(false)}
          type="error"
          title="Incorrect Code"
          message="Your code is incorrect. Please, try again to confirm your password."
          actionText="Try Again"
          onAction={() => setOtpCode('')}
        />
      </AuthLayout>
    );
  }

  // Step 3: Set new password
  if (step === 3) {
    return (
      <AuthLayout>
        <div style={{ marginBottom: '24px' }}>
          <h1 style={{
            fontSize: '26px',
            fontWeight: '700',
            color: '#FFFFFF',
            marginBottom: '6px',
            letterSpacing: '-0.3px',
          }}>
            Set new password
          </h1>
          <p style={{
            fontSize: '14px',
            color: '#9CA3AF',
            margin: 0,
            lineHeight: '1.5',
          }}>
            The password must be at least 8 character
          </p>
        </div>

        <form onSubmit={handleResetPassword} className="tc-fade-in">
          {errorMessage && (
            <div style={{
              padding: '10px 14px',
              borderRadius: '8px',
              backgroundColor: 'rgba(239, 68, 68, 0.15)',
              color: '#EF4444',
              fontSize: '13px',
              marginBottom: '16px',
            }}>
              {errorMessage}
            </div>
          )}

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
                }}
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

          {/* Confirm Password */}
          <div style={{ marginBottom: '24px' }}>
            <label style={{
              display: 'block',
              fontSize: '14px',
              fontWeight: '500',
              color: '#FFFFFF',
              marginBottom: '8px',
            }}>
              Confirm Password
            </label>
            <div style={{ position: 'relative' }}>
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
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
                }}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
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
                {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* Reset Password Solid Gold Pill */}
          <button
            type="submit"
            disabled={isLoading}
            style={{
              width: '100%',
              height: '46px',
              borderRadius: '9999px',
              backgroundColor: '#dfae32',
              color: '#000000',
              fontSize: '15px',
              fontWeight: '700',
              border: 'none',
              cursor: 'pointer',
              marginBottom: '14px',
              boxShadow: '0 4px 14px rgba(223, 174, 50, 0.3)',
            }}
          >
            {isLoading ? 'Updating...' : 'Reset Password'}
          </button>

          {/* Back to Login Outline Pill */}
          <button
            type="button"
            onClick={onBackToSignIn}
            style={{
              width: '100%',
              height: '46px',
              borderRadius: '9999px',
              backgroundColor: 'transparent',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              color: '#FFFFFF',
              fontSize: '14px',
              fontWeight: '500',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
            }}
          >
            <ArrowLeft size={16} />
            Back to login
          </button>
        </form>
        {renderStepIndicator(3)}
      </AuthLayout>
    );
  }

  // Step 4: Successful Password (Figma Frame 406:158)
  return (
    <AuthLayout>
      <div className="tc-fade-in" style={{ padding: '30px 0 10px', textAlign: 'left' }}>
        <h1 style={{
          fontSize: '28px',
          fontWeight: '700',
          color: '#FFFFFF',
          marginBottom: '14px',
          letterSpacing: '-0.3px',
          lineHeight: '1.3',
        }}>
          Your password has been set successfully
        </h1>

        <p style={{
          fontSize: '15px',
          color: '#9CA3AF',
          marginBottom: '36px',
        }}>
          Password updated successfully
        </p>

        {/* Sign In Solid Gold Pill Button */}
        <button
          type="button"
          onClick={onDone}
          style={{
            width: '100%',
            maxWidth: '350px',
            height: '46px',
            borderRadius: '9999px',
            backgroundColor: '#dfae32',
            color: '#000000',
            fontSize: '15px',
            fontWeight: '700',
            border: 'none',
            cursor: 'pointer',
            boxShadow: '0 4px 14px rgba(223, 174, 50, 0.3)',
          }}
        >
          Sign In
        </button>
      </div>
    </AuthLayout>
  );
};
