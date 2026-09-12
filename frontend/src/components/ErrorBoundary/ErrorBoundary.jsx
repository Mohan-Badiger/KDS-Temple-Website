import React from 'react';
import om from '../../assets/om.png';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({ errorInfo });
    console.error("ErrorBoundary caught an unhandled error:", error, errorInfo);
  }

  handleReload = () => {
    window.location.reload();
  };

  handleHome = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-gradient-to-br from-yellow-50 via-stone-100 to-amber-50 font-primary">
          <div className="max-w-md w-full bg-white/80 backdrop-blur-md rounded-2xl shadow-xl p-8 text-center border border-amber-200/60 transition-all">
            
            {/* Devotional Emblem */}
            <div className="w-16 h-16 mx-auto mb-6 bg-amber-100/60 rounded-full flex items-center justify-center p-3 shadow-inner">
              <img src={om} alt="Temple Sacred Om" className="w-full h-full object-contain animate-pulse" />
            </div>

            <p className="text-[11px] uppercase tracking-[0.3em] font-bold text-orange-600 mb-2">
              Kadasiddeshwar Temple Portal
            </p>
            
            <h1 className="text-2xl font-cinzel font-semibold text-stone-900 mb-3 tracking-wide">
              Something Went Wrong
            </h1>
            
            <p className="text-stone-600 text-sm leading-relaxed mb-6 font-light">
              An unexpected hiccup occurred while rendering this sacred page. Please refresh or return to the main portal.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 justify-center mb-6">
              <button
                onClick={this.handleReload}
                className="px-6 py-3 bg-gradient-to-r from-orange-500 to-amber-600 text-white text-xs uppercase tracking-widest font-bold rounded-lg shadow-md hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
              >
                Reload Page
              </button>
              <button
                onClick={this.handleHome}
                className="px-6 py-3 bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs uppercase tracking-widest font-semibold rounded-lg border border-stone-300 transition-all cursor-pointer"
              >
                Return Home
              </button>
            </div>

            {/* Developer Details in Development */}
            {import.meta.env.DEV && this.state.error && (
              <details className="text-left mt-6 pt-4 border-t border-stone-200 text-xs text-red-700 overflow-auto max-h-40 bg-red-50/70 p-3 rounded-md">
                <summary className="cursor-pointer font-mono font-bold text-red-800 mb-1">
                  Debug Stack Details
                </summary>
                <p className="font-mono break-all">{this.state.error?.toString()}</p>
                {this.state.errorInfo?.componentStack && (
                  <pre className="font-mono text-[10px] mt-2 whitespace-pre-wrap">
                    {this.state.errorInfo.componentStack}
                  </pre>
                )}
              </details>
            )}

            <div className="mt-6 pt-4 border-t border-amber-100 text-[11px] text-stone-400 font-light">
              ಓಂ ನಮಃ ಶಿವಾಯ • Shri Kadasiddheshwar Temples Trust
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
