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
        <div className="tc-error-page-container">
          {/* Ambient Glow */}
          <div className="tc-error-ambient-glow tc-error-ambient-glow--red" />

          <div className="tc-error-card">
            <div className="tc-error-icon-box tc-error-icon-box--red">
              <AlertTriangle size={38} color="#EF4444" strokeWidth={1.8} />
            </div>

            <div className="tc-error-badge tc-error-badge--red">
              Client Runtime Exception Intercepted
            </div>

            <h1 className="tc-error-title">
              Something Went Wrong
            </h1>

            <p className="tc-error-desc">
              An unexpected render error occurred in the user interface. Our error boundary safely prevented the screen from crashing.
            </p>

            {error?.message && (
              <div className="tc-error-callout-box">
                <div className="tc-error-callout-text">
                  {error.message}
                </div>
              </div>
            )}

            <div className="tc-error-actions-stack">
              <button
                type="button"
                onClick={this.handleReload}
                className="tc-btn-error-primary"
              >
                <RefreshCw size={16} />
                Reload Application
              </button>

              <div className="tc-error-actions-grid">
                <button
                  type="button"
                  onClick={this.handleReset}
                  className="tc-btn-error-secondary"
                >
                  <Home size={15} />
                  Safe Reset to Home
                </button>

                <button
                  type="button"
                  onClick={this.handleCopy}
                  className="tc-btn-error-secondary"
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
