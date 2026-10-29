import React from 'react';
import { Link } from 'react-router-dom';
import { Home } from 'lucide-react';

export default function NotFoundPage() {
  return (
    <div className="min-h-screen bg-bg text-text flex items-center justify-center p-4 text-center select-none">
      <div className="max-w-md w-full rounded-3xl border border-border bg-surface p-10 space-y-5 shadow-soft">
        <div className="text-6xl font-black text-brand tracking-widest font-mono">404</div>
        <h1 className="text-2xl font-bold text-text">Page Not Found</h1>
        <p className="text-xs text-text opacity-75 leading-relaxed">
          The page you requested does not exist or has been relocated.
        </p>
        <div className="pt-2">
          <Link
            to="/"
            className="brand-inverse inline-flex items-center gap-2 px-6 py-3.5 rounded-full text-xs font-bold uppercase tracking-wider shadow-soft hover:opacity-95 transition-all"
          >
            <Home className="w-4 h-4" />
            <span>Return to Homepage</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
