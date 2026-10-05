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
  const [resetToken, setResetToken] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [resendSuccessMessage, setResendSuccessMessage] = useState('');
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
    if (!email.trim()) {
      setErrorMessage('Please enter your email address.');
      return;
    }
    setIsLoading(true);
    setErrorMessage('');
    try {
      await api.requestPasswordResetOtp(email.trim());
      setStep(2);
      setResendTimer(45);
      setResendSuccessMessage('');
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to send OTP code.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOtp = async () => {
    if (resendTimer > 0 || isResending) return;
    setIsResending(true);
    setErrorMessage('');
    setResendSuccessMessage('');
    try {
      await api.requestPasswordResetOtp(email.trim());
      setResendTimer(45);
      setResendSuccessMessage('A fresh 6-digit code has been sent to your email.');
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to resend code.');
    } finally {
      setIsResending(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (otpCode.length < 6) {
      setErrorMessage('Please enter the full 6-digit code.');
      return;
    }

    setIsLoading(true);
    setErrorMessage('');
    try {
      const res = await api.verifyOtp(email.trim(), otpCode.trim());
      setResetToken(res.reset_token);
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
      await api.resetPassword(resetToken, password);
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
      <div className="tc-wizard-stepper-container">
        {[1, 2, 3].map((num) => {
          const isActive = num === activeStep;
          return (
            <div
              key={num}
              className={`tc-wizard-step-circle ${isActive ? 'tc-wizard-step-circle--active' : ''}`}
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
        <div className="tc-auth-header">
          <h1 className="tc-auth-title">
            Forgotten Password?
          </h1>
          <p className="tc-auth-subtitle">
            No worries, we'll send you a reset instructions
          </p>
        </div>

        <form onSubmit={handleRequestOtp} className="tc-fade-in">
          {errorMessage && (
            <div className="tc-form-error-banner">
              {errorMessage}
            </div>
          )}

          <div className="tc-auth-input-group">
            <label className="tc-auth-label">
              Email
            </label>
            <div className="tc-relative">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
                className="tc-auth-input"
              />
              <span className="tc-auth-icon-end">
                <Mail size={18} />
              </span>
            </div>
          </div>

          {/* Reset Password Solid Gold Pill */}
          <button
            type="submit"
            disabled={isLoading}
            className="tc-btn-submit-gold-full tc-mb-14"
          >
            {isLoading ? 'Sending...' : 'Reset Password'}
          </button>

          {/* Back to Login Outline Pill */}
          <button
            type="button"
            onClick={onBackToSignIn}
            className="tc-btn-pill-full-outline"
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
        <div className="tc-auth-header">
          <h1 className="tc-auth-title tc-auth-title--gold">
            Verify OTP
          </h1>
          <p className="tc-auth-subtitle">
            Enter 6-digit code sent to your email
          </p>
        </div>

        <form onSubmit={handleVerifyOtp} className="tc-fade-in">
          {errorMessage && (
            <div className="tc-form-error-banner tc-text-center">
              {errorMessage}
            </div>
          )}

          {resendSuccessMessage && (
            <div className="tc-auth-success-banner">
              {resendSuccessMessage}
            </div>
          )}

          <div className="tc-otp-wrapper">
            <OtpInput
              length={6}
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
            disabled={isLoading || otpCode.length < 6}
            className="tc-btn-submit-gold-full tc-mb-18"
          >
            {isLoading ? 'Verifying...' : 'Continue'}
          </button>

          <div className="tc-auth-resend-prompt">
            Didn't get code?{' '}
            <button
              type="button"
              onClick={handleResendOtp}
              disabled={resendTimer > 0 || isResending}
              className="tc-auth-resend-btn"
            >
              {isResending ? 'Sending…' : resendTimer > 0 ? `Resend code (${resendTimer}s)` : 'Resend code'}
            </button>
          </div>

          {/* Back to Login Outline Pill */}
          <button
            type="button"
            onClick={onBackToSignIn}
            className="tc-btn-pill-full-outline"
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
        <div className="tc-auth-header">
          <h1 className="tc-auth-title">
            Set new password
          </h1>
          <p className="tc-auth-subtitle">
            The password must be at least 8 character
          </p>
        </div>

        <form onSubmit={handleResetPassword} className="tc-fade-in">
          {errorMessage && (
            <div className="tc-form-error-banner">
              {errorMessage}
            </div>
          )}

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

          {/* Confirm Password */}
          <div className="tc-auth-input-group">
            <label className="tc-auth-label">
              Confirm Password
            </label>
            <div className="tc-relative">
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="tc-auth-input"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="tc-auth-icon-btn-end"
              >
                {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* Reset Password Solid Gold Pill */}
          <button
            type="submit"
            disabled={isLoading}
            className="tc-btn-submit-gold-full tc-mb-14"
          >
            {isLoading ? 'Updating...' : 'Reset Password'}
          </button>

          {/* Back to Login Outline Pill */}
          <button
            type="button"
            onClick={onBackToSignIn}
            className="tc-btn-pill-full-outline"
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
      <div className="tc-fade-in tc-wizard-success-view">
        <h1 className="tc-wizard-success-title">
          Your password has been set successfully
        </h1>

        <p className="tc-wizard-success-desc">
          Password updated successfully
        </p>

        {/* Sign In Solid Gold Pill Button */}
        <button
          type="button"
          onClick={onDone}
          className="tc-btn-pill-gold-sm"
        >
          Sign In
        </button>
      </div>
    </AuthLayout>
  );
};
