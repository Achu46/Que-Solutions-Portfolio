import React, { useState } from 'react';
import { NavLink, useNavigate, Outlet } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  Eye,
  Mail,
  FileEdit,
  Settings,
  LogOut,
  ExternalLink,
  Menu,
  X,
  Sun,
  Moon
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

export default function AdminLayout() {
  const { user, logout, isAuthenticated, loading } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();

  if (loading) {
    return (
      <div className="min-h-screen bg-bg text-text flex items-center justify-center">
        <div className="text-center space-y-3">
          <div className="w-8 h-8 border-2 border-brand border-t-transparent rounded-full animate-spin mx-auto" />
          <div className="text-xs">Verifying Administrator Access...</div>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    navigate('/que', { replace: true });
    return null;
  }

  const handleLogout = async () => {
    await logout();
    navigate('/que');
  };

  const navItems = [
    { name: 'Dashboard', path: '/que/dashboard', icon: LayoutDashboard },
    { name: 'Leads Management', path: '/que/leads', icon: Users },
    { name: 'Visitor Analytics', path: '/que/visitors', icon: Eye },
    { name: 'Notification Logs', path: '/que/emails', icon: Mail },
    { name: 'Website CMS', path: '/que/cms', icon: FileEdit },
    { name: 'Settings & Security', path: '/que/settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-bg text-text flex transition-colors duration-200">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex flex-col w-64 bg-surface border-r border-border shrink-0">
        {/* Sidebar Header with Brand Logo */}
        <div className="p-5 border-b border-border flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-surface border border-border flex items-center justify-center p-1.5 shadow-sm overflow-hidden flex-shrink-0">
            <img
              src="/logo.png"
              alt="QUE SOLUTIONS"
              className="w-full h-full object-contain"
            />
          </div>
          <div>
            <span className="text-xs font-bold tracking-wider text-text block">QUE SOLUTIONS</span>
            <span className="text-[9px] px-1.5 py-0.5 rounded bg-brand/10 text-brand font-bold border border-brand/20">
              ADMIN OS
            </span>
          </div>
        </div>

        {/* Nav Links */}
        <nav className="flex-1 p-4 space-y-1.5 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.name}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                    isActive
                      ? 'brand-inverse shadow-sm'
                      : 'text-text hover:bg-hover'
                  }`
                }
              >
                <Icon className="w-4 h-4" />
                <span>{item.name}</span>
              </NavLink>
            );
          })}
        </nav>

        {/* User Profile & Logout Bottom Box */}
        <div className="p-4 border-t border-border space-y-3">
          <div className="flex items-center gap-3 px-2 py-1">
            <div className="w-9 h-9 rounded-xl bg-elevated border border-border text-brand flex items-center justify-center font-bold text-xs">
              {user?.displayName ? user.displayName.charAt(0).toUpperCase() : 'A'}
            </div>
            <div className="truncate">
              <div className="text-xs font-bold text-text truncate">{user?.displayName || 'Admin'}</div>
              <div className="text-[10px] text-text opacity-70 truncate">{user?.email}</div>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-elevated hover:bg-hover border border-border text-xs font-semibold transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Topbar */}
        <header className="h-16 bg-surface/90 backdrop-blur-md border-b border-border px-4 sm:px-6 flex items-center justify-between sticky top-0 z-30">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 text-text rounded-lg lg:hidden"
              aria-label="Toggle navigation menu"
            >
              {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
            <div className="text-xs text-text opacity-80">
              Que Support OS <span className="text-brand">/</span> <span className="font-semibold text-text">Admin Console</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Theme Toggle in Admin Header */}
            <button
              onClick={toggleTheme}
              type="button"
              className="p-2 rounded-full border border-border bg-surface hover:bg-hover text-text transition-colors"
              aria-label={isDark ? "Switch to light theme" : "Switch to dark theme"}
              title={isDark ? "Switch to light theme" : "Switch to dark theme"}
            >
              {isDark ? <Sun className="w-4 h-4 text-brand" /> : <Moon className="w-4 h-4 text-brand" />}
            </button>

            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-elevated border border-border text-text hover:text-brand text-xs font-medium transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Preview Website</span>
            </a>
          </div>
        </header>

        {/* Mobile Sidebar Overlay Drawer */}
        {sidebarOpen && (
          <div className="fixed inset-0 z-40 lg:hidden flex">
            <div
              className="fixed inset-0 bg-black/60 backdrop-blur-sm"
              onClick={() => setSidebarOpen(false)}
            />
            <div className="relative w-64 max-w-[80%] bg-surface border-r border-border p-5 flex flex-col justify-between z-50">
              <div>
                <div className="flex items-center justify-between pb-4 border-b border-border">
                  <div className="w-9 h-9 rounded-full bg-surface border border-border flex items-center justify-center p-1 shadow-sm overflow-hidden flex-shrink-0">
                    <img src="/logo.png" alt="QUE" className="w-full h-full object-contain" />
                  </div>
                  <button onClick={() => setSidebarOpen(false)} className="text-text">
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <nav className="mt-4 space-y-1">
                  {navItems.map((item) => (
                    <NavLink
                      key={item.name}
                      to={item.path}
                      onClick={() => setSidebarOpen(false)}
                      className={({ isActive }) =>
                        `flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold ${
                          isActive
                            ? 'brand-inverse'
                            : 'text-text hover:bg-hover'
                        }`
                      }
                    >
                      <item.icon className="w-4 h-4" />
                      <span>{item.name}</span>
                    </NavLink>
                  ))}
                </nav>
              </div>

              <button
                onClick={handleLogout}
                className="w-full py-2.5 rounded-xl bg-elevated text-text text-xs font-semibold flex items-center justify-center gap-2 border border-border"
              >
                <LogOut className="w-4 h-4" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        )}

        {/* Page View Body */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto bg-bg text-text">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
