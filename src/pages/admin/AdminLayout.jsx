import React, { useState } from 'react';
import { Outlet, Link, useNavigate, useLocation, Navigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  Briefcase, 
  Headphones, 
  CreditCard, 
  MessageSquareQuote, 
  Settings, 
  LogOut, 
  Menu, 
  X, 
  Shield, 
  ExternalLink 
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import ThemeToggle from '../../components/common/ThemeToggle';
import { COMPANY_NAME } from '../../config/constants';

const navItems = [
  { label: 'Dashboard', path: '/que/dashboard', icon: LayoutDashboard },
  { label: 'Leads & Inquiries', path: '/que/leads', icon: Users },
  { label: 'Projects & SaaS', path: '/que/projects', icon: Briefcase },
  { label: 'Services', path: '/que/services', icon: Headphones },
  { label: 'Plans & Pricing', path: '/que/plans', icon: CreditCard },
  { label: 'Testimonials', path: '/que/testimonials', icon: MessageSquareQuote },
  { label: 'Site Settings', path: '/que/settings', icon: Settings },
];

export default function AdminLayout() {
  const { user, isAdmin, loading, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  if (loading) {
    return (
      <div className="min-h-screen bg-bg flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-brand/30 border-t-brand rounded-full animate-spin" />
          <p className="text-xs text-text/60">Verifying administrator credentials...</p>
        </div>
      </div>
    );
  }

  // Protected route check: requires authenticated user with admin claim
  if (!user || !isAdmin) {
    return <Navigate to="/que/login" replace />;
  }

  const handleLogout = async () => {
    await logout();
    navigate('/que/login');
  };

  return (
    <div className="min-h-screen bg-bg text-text flex flex-col md:flex-row transition-colors">
      
      {/* Mobile Top Header */}
      <div className="md:hidden flex items-center justify-between p-4 border-b border-border bg-surface">
        <div className="flex items-center gap-2">
          <Shield className="w-5 h-5 text-brand" />
          <span className="font-bold text-sm tracking-wide">QUE Admin</span>
        </div>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <button
            type="button"
            onClick={() => setMobileOpen(!mobileOpen)}
            className="p-2 rounded-lg border border-border bg-elevated text-text"
            aria-label="Toggle admin navigation"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Sidebar Navigation */}
      <aside className={`fixed inset-y-0 left-0 z-40 w-64 border-r border-border bg-surface p-6 flex flex-col justify-between transform transition-transform duration-200 ease-in-out md:translate-x-0 md:static ${
        mobileOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="space-y-6">
          {/* Brand & Badge */}
          <div className="space-y-2">
            <Link to="/" className="flex items-center gap-2" target="_blank" title="View live website">
              <img src="/logo.png" alt={COMPANY_NAME} className="h-8 w-auto object-contain" />
              <ExternalLink className="w-3.5 h-3.5 text-text/60" />
            </Link>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-brand-darker border border-brand/30 text-[10px] font-bold text-brand-sage">
              <Shield className="w-3 h-3 text-brand" />
              ADMIN CONTROL PANEL
            </div>
          </div>

          {/* Links */}
          <nav className="space-y-1.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;

              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setMobileOpen(false)}
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-colors ${
                    isActive 
                      ? 'brand-inverse shadow-sm' 
                      : 'text-text/80 hover:bg-hover hover:text-text'
                  }`}
                >
                  <Icon className="w-4 h-4 flex-shrink-0" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Footer with user info & logout */}
        <div className="pt-6 border-t border-border space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-[11px] text-text/60">Theme:</span>
            <ThemeToggle />
          </div>

          <div className="text-xs">
            <div className="font-semibold text-text truncate">{user.email}</div>
            <div className="text-[10px] text-brand-sage font-medium">Verified Administrator</div>
          </div>

          <button
            type="button"
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl border border-border bg-elevated hover:bg-red-500/10 hover:text-red-400 hover:border-red-500/30 text-xs font-semibold text-text transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 min-w-0 p-6 sm:p-10 overflow-y-auto">
        <Outlet />
      </main>

    </div>
  );
}
