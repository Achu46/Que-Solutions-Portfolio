import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, Eye, EyeOff, Lock, Mail, ArrowRight, Loader2, AlertCircle, CheckCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import ThemeToggle from '../../components/common/ThemeToggle';
import { COMPANY_NAME } from '../../config/constants';

export default function AdminLogin() {
  const { login, resetPassword, user, isAdmin } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [resetSent, setResetSent] = useState(false);
  const [showForgot, setShowForgot] = useState(false);

  // If already logged in as admin, redirect to dashboard
  if (user && isAdmin) {
    navigate('/que/dashboard', { replace: true });
  }

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please provide both email and password.');
      return;
    }

    setLoading(true);
    setError('');
    try {
      await login(email, password);
      navigate('/que/dashboard');
    } catch (err) {
      setError(err.message || 'Invalid email or password.');
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (!email) {
      setError('Please enter your administrator email first.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      await resetPassword(email);
      setResetSent(true);
    } catch (err) {
      setError('Failed to send reset link. Please check the email.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-bg text-text flex flex-col justify-between p-4 sm:p-6 transition-colors">
      
      {/* Top Bar with theme toggle */}
      <div className="max-w-md w-full mx-auto flex items-center justify-between">
        <div className="flex items-center gap-2">
          <img src="/logo.png" alt={COMPANY_NAME} className="h-8 w-auto object-contain" />
        </div>
        <ThemeToggle />
      </div>

      {/* Main Login Box */}
      <div className="max-w-md w-full mx-auto p-8 rounded-card border border-border bg-surface shadow-2xl space-y-6">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-brand-darker border border-brand/30 text-brand-sage flex items-center justify-center mx-auto">
            <Shield className="w-6 h-6 text-brand" />
          </div>
          <h1 className="text-2xl font-bold text-text">
            Admin Authentication
          </h1>
          <p className="text-xs text-text/60">
            Protected management portal for QUE SOLUTIONS.
          </p>
        </div>

        {error && (
          <div className="p-3.5 rounded-xl bg-red-950/40 border border-red-500/50 flex items-center gap-2.5 text-red-400 text-xs font-medium animate-fadeIn">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {resetSent ? (
          <div className="p-4 rounded-xl bg-green-950/40 border border-green-500/50 text-center space-y-2 animate-fadeIn">
            <CheckCircle className="w-6 h-6 text-green-400 mx-auto" />
            <p className="text-xs text-green-300 font-medium">
              If an administrator account matches {email}, a password reset link has been dispatched.
            </p>
            <button
              type="button"
              onClick={() => { setResetSent(false); setShowForgot(false); }}
              className="text-xs text-brand font-semibold hover:underline pt-2 inline-block"
            >
              Return to Login
            </button>
          </div>
        ) : showForgot ? (
          <form onSubmit={handleResetPassword} className="space-y-4">
            <div className="space-y-1.5">
              <label htmlFor="reset-email" className="block text-xs font-semibold text-text">
                Administrator Email
              </label>
              <div className="relative">
                <input
                  id="reset-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@quesolutions.in"
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-border bg-elevated text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
                  required
                />
                <Mail className="w-4 h-4 text-text/50 absolute left-3.5 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="brand-inverse w-full py-3.5 rounded-xl text-xs font-bold shadow-md hover:bg-brand-deep transition-all flex items-center justify-center gap-2"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <span>Send Password Reset Link</span>}
            </button>

            <div className="text-center">
              <button
                type="button"
                onClick={() => setShowForgot(false)}
                className="text-xs text-text/60 hover:text-brand transition-colors"
              >
                Cancel and return to login
              </button>
            </div>
          </form>
        ) : (
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-1.5">
              <label htmlFor="login-email" className="block text-xs font-semibold text-text">
                Admin Email
              </label>
              <div className="relative">
                <input
                  id="login-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@quesolutions.in"
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-border bg-elevated text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
                  required
                />
                <Mail className="w-4 h-4 text-text/50 absolute left-3.5 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label htmlFor="login-password" className="block text-xs font-semibold text-text">
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => setShowForgot(true)}
                  className="text-[11px] text-brand hover:underline font-medium"
                >
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <input
                  id="login-password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-10 pr-10 py-3 rounded-xl border border-border bg-elevated text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
                  required
                />
                <Lock className="w-4 h-4 text-text/50 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-text/50 hover:text-text focus-visible:ring-1 focus-visible:ring-brand"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="brand-inverse w-full py-3.5 rounded-xl text-xs font-bold shadow-md hover:bg-brand-deep transition-all flex items-center justify-center gap-2 mt-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Verifying Credentials...</span>
                </>
              ) : (
                <>
                  <span>Sign In as Admin</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>

            {/* Quick Demo Credentials Tip */}
            <div className="mt-4 p-3 rounded-lg bg-elevated border border-border text-[11px] text-text/70 space-y-1">
              <p className="font-semibold text-brand">Demo / Initial Testing:</p>
              <p>Email: <code className="text-text font-mono">admin@quesolutions.in</code></p>
              <p>Password: <code className="text-text font-mono">admin123</code></p>
            </div>
          </form>
        )}
      </div>

      {/* Footer link */}
      <div className="text-center text-xs text-text/60">
        <p>© 2026 {COMPANY_NAME}. All unauthorized attempts logged.</p>
      </div>

    </div>
  );
}
