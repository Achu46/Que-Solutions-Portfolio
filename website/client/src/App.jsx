import React, { Suspense, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';

// Primary Public Home Page (loaded directly for instant first paint)
import HomePage from './pages/HomePage';

// Code-Split Secondary Public Pages
const PrivacyPage = lazy(() => import('./pages/PrivacyPage'));
const TermsPage = lazy(() => import('./pages/TermsPage'));
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'));

// Code-Split Admin Console & Sub-Routes (completely excluded from public bundle)
const AdminLoginPage = lazy(() => import('./admin/AdminLoginPage'));
const AdminLayout = lazy(() => import('./admin/AdminLayout'));
const AdminDashboardPage = lazy(() => import('./admin/AdminDashboardPage'));
const AdminLeadsPage = lazy(() => import('./admin/AdminLeadsPage'));
const AdminVisitorsPage = lazy(() => import('./admin/AdminVisitorsPage'));
const AdminEmailsPage = lazy(() => import('./admin/AdminEmailsPage'));
const AdminCMSPage = lazy(() => import('./admin/AdminCMSPage'));
const AdminSettingsPage = lazy(() => import('./admin/AdminSettingsPage'));

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Suspense fallback={<div className="min-h-screen bg-bg" />}>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<HomePage />} />
            <Route path="/privacy" element={<PrivacyPage />} />
            <Route path="/terms" element={<TermsPage />} />

            {/* Admin Login Route */}
            <Route path="/que" element={<AdminLoginPage />} />

            {/* Protected Admin Console */}
            <Route path="/que" element={<AdminLayout />}>
              <Route index element={<Navigate to="/que/dashboard" replace />} />
              <Route path="dashboard" element={<AdminDashboardPage />} />
              <Route path="leads" element={<AdminLeadsPage />} />
              <Route path="visitors" element={<AdminVisitorsPage />} />
              <Route path="emails" element={<AdminEmailsPage />} />
              <Route path="cms" element={<AdminCMSPage />} />
              <Route path="settings" element={<AdminSettingsPage />} />
            </Route>

            {/* Fallback */}
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </Suspense>
      </AuthProvider>
    </ThemeProvider>
  );
}
