import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, Mail, ArrowRight, ShieldCheck, CheckCircle2, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import Logo3D from '../components/common/Logo3D';

export default function AdminLoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isForgotMode, setIsForgotMode] = useState(false);
  const [error, setError] = useState('');
  const [infoMessage, setInfoMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const { login, resetPassword, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // If already authenticated, redirect immediately
  React.useEffect(() => {
    if (isAuthenticated) {
      navigate('/que/dashboard', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setInfoMessage('');
    setSubmitting(true);

    try {
      if (isForgotMode) {
        await resetPassword(email);
        setInfoMessage('Password reset email dispatched. Please check your inbox.');
      } else {
        await login(email, password);
        navigate('/que/dashboard', { replace: true });
      }
    } catch (err) {
      setError(err.message || 'Authentication failed. Please verify credentials.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-bg text-text flex items-center justify-center p-4 transition-colors duration-200">
      <div className="max-w-md w-full rounded-3xl border border-border bg-surface p-8 sm:p-10 shadow-soft space-y-6">
        
        {/* Top Brand Logo */}
        <div className="text-center space-y-3">
          <div className="inline-block">
            <Logo3D size="lg" variant="circle" />
          </div>
          <h1 className="text-2xl font-bold text-text">
            {isForgotMode ? 'Reset Admin Password' : 'Administrator Portal'}
          </h1>
          <p className="text-xs text-text opacity-70">
            {isForgotMode 
              ? 'Enter your administrator email to receive a password recovery link.'
              : 'Secure management access for authorized personnel only.'
            }
          </p>
        </div>

        {/* Feedback Alerts */}
        {error && (
          <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500 text-xs text-text flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {infoMessage && (
          <div className="p-3.5 rounded-xl bg-brand/10 border border-brand text-xs text-text flex items-start gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-brand shrink-0 mt-0.5" />
            <span>{infoMessage}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-text">Admin Email Address</label>
            <div className="relative">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@quesolutions.com"
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-border bg-elevated text-text text-sm focus:outline-none focus:border-brand transition-colors"
              />
              <Mail className="w-4 h-4 text-brand absolute left-3.5 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          {!isForgotMode && (
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-text">Password</label>
                <button
                  type="button"
                  onClick={() => { setIsForgotMode(true); setError(''); setInfoMessage(''); }}
                  className="text-[11px] font-semibold text-brand hover:underline"
                >
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-border bg-elevated text-text text-sm focus:outline-none focus:border-brand transition-colors"
                />
                <Lock className="w-4 h-4 text-brand absolute left-3.5 top-1/2 -translate-y-1/2" />
              </div>
            </div>
          )}

          <div className="pt-2">
            <button
              type="submit"
              disabled={submitting}
              className="brand-inverse w-full py-3.5 px-6 rounded-xl text-xs font-bold uppercase tracking-wider shadow-soft hover:opacity-95 active:scale-95 transition-all flex items-center justify-center gap-2"
            >
              {submitting ? (
                <span>Authenticating...</span>
              ) : (
                <>
                  <span>{isForgotMode ? 'Send Recovery Link' : 'Sign In to Console'}</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>

          {isForgotMode && (
            <div className="text-center pt-2">
              <button
                type="button"
                onClick={() => { setIsForgotMode(false); setError(''); setInfoMessage(''); }}
                className="text-xs font-semibold text-text opacity-80 hover:text-brand transition-colors"
              >
                Back to Sign In
              </button>
            </div>
          )}
        </form>

        <div className="flex items-center justify-center gap-2 text-[11px] text-text opacity-70 border-t border-border pt-4">
          <ShieldCheck className="w-3.5 h-3.5 text-brand" />
          <span>Protected by Firebase Enterprise Auth and App Check</span>
        </div>
      </div>
    </div>
  );
}
