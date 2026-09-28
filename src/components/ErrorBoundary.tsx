import { Component, type ErrorInfo, type ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Home, Copy, Check } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
  copied: boolean;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null,
    copied: false,
  };

  public static getDerivedStateFromError(error: Error): Partial<State> {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('TitanCode ErrorBoundary caught an unhandled exception:', error, errorInfo);
    this.setState({ errorInfo });
  }

  private handleReload = () => {
    window.location.reload();
  };

  private handleReset = () => {
    try {
      localStorage.removeItem('titancode_access_token');
    } catch {
      // ignore storage errors
    }
    window.location.href = '/';
  };

  private handleCopy = () => {
    const { error, errorInfo } = this.state;
    const diagnostics = `TitanCode Runtime Crash Report
Timestamp: ${new Date().toISOString()}
Error: ${error?.message || 'Unknown error'}
Stack: ${error?.stack || 'No stack trace'}
Component Stack: ${errorInfo?.componentStack || 'No component stack'}`;

    navigator.clipboard.writeText(diagnostics);
    this.setState({ copied: true });
    setTimeout(() => this.setState({ copied: false }), 2000);
  };

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      const { error, copied } = this.state;

      return (
        <div
          style={{
            minHeight: '100vh',
            width: '100%',
            backgroundColor: '#0B0B0C',
            color: '#FFFFFF',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '32px 20px',
            fontFamily: "'Poppins', sans-serif",
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          {/* Ambient Glow */}
          <div
            style={{
              position: 'absolute',
              top: '20%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: '520px',
              height: '520px',
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(239, 68, 68, 0.12) 0%, rgba(11, 11, 12, 0) 70%)',
              pointerEvents: 'none',
              filter: 'blur(50px)',
            }}
          />

          <div
            style={{
              position: 'relative',
              zIndex: 1,
              maxWidth: '560px',
              width: '100%',
              backgroundColor: 'rgba(255, 255, 255, 0.03)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: '24px',
              padding: '44px 32px',
              backdropFilter: 'blur(16px)',
              boxShadow: '0 24px 60px rgba(0, 0, 0, 0.7)',
              textAlign: 'center',
            }}
          >
            <div
              style={{
                width: '80px',
                height: '80px',
                borderRadius: '22px',
                backgroundColor: 'rgba(239, 68, 68, 0.12)',
                border: '1px solid rgba(239, 68, 68, 0.3)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 20px',
                boxShadow: '0 0 30px rgba(239, 68, 68, 0.25)',
              }}
            >
              <AlertTriangle size={38} color="#EF4444" strokeWidth={1.8} />
            </div>

            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '4px 12px',
                borderRadius: '9999px',
                backgroundColor: 'rgba(239, 68, 68, 0.1)',
                border: '1px solid rgba(239, 68, 68, 0.25)',
                fontSize: '11px',
                fontWeight: 700,
                color: '#EF4444',
                marginBottom: '14px',
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
              }}
            >
              Client Runtime Exception Intercepted
            </div>

            <h1
              style={{
                fontSize: '22px',
                fontWeight: 700,
                color: '#FFFFFF',
                marginBottom: '10px',
                fontFamily: "'Inter', sans-serif",
              }}
            >
              Something Went Wrong
            </h1>

            <p
              style={{
                fontSize: '13px',
                color: '#9CA3AF',
                lineHeight: '1.6',
                marginBottom: '24px',
              }}
            >
              An unexpected render error occurred in the user interface. Our error boundary safely prevented the screen from crashing.
            </p>

            {error?.message && (
              <div
                style={{
                  backgroundColor: '#070708',
                  border: '1px solid rgba(239, 68, 68, 0.2)',
                  borderRadius: '10px',
                  padding: '12px 16px',
                  textAlign: 'left',
                  marginBottom: '24px',
                  maxHeight: '120px',
                  overflowY: 'auto',
                }}
              >
                <div style={{ fontSize: '11px', color: '#EF4444', fontFamily: 'monospace', wordBreak: 'break-word' }}>
                  {error.message}
                </div>
              </div>
            )}

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <button
                type="button"
                onClick={this.handleReload}
                style={{
                  height: '46px',
                  borderRadius: '9999px',
                  backgroundColor: '#DFAE32',
                  color: '#0B0B0C',
                  fontSize: '14px',
                  fontWeight: 700,
                  border: 'none',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  boxShadow: '0 4px 14px rgba(223, 174, 50, 0.25)',
                }}
              >
                <RefreshCw size={16} />
                Reload Application
              </button>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <button
                  type="button"
                  onClick={this.handleReset}
                  style={{
                    height: '42px',
                    borderRadius: '9999px',
                    backgroundColor: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(255, 255, 255, 0.12)',
                    color: '#FFFFFF',
                    fontSize: '13px',
                    fontWeight: 600,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px',
                  }}
                >
                  <Home size={15} />
                  Safe Reset to Home
                </button>

                <button
                  type="button"
                  onClick={this.handleCopy}
                  style={{
                    height: '42px',
                    borderRadius: '9999px',
                    backgroundColor: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(255, 255, 255, 0.12)',
                    color: '#FFFFFF',
                    fontSize: '13px',
                    fontWeight: 600,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px',
                  }}
                >
                  {copied ? <Check size={15} color="#10B981" /> : <Copy size={15} />}
                  {copied ? 'Copied Report' : 'Copy Diagnostics'}
                </button>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
