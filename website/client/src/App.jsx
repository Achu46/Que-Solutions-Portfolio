import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';

// Public Pages
import HomePage from './pages/HomePage';
import PrivacyPage from './pages/PrivacyPage';
import TermsPage from './pages/TermsPage';
import NotFoundPage from './pages/NotFoundPage';

// Admin Pages (under /que)
import AdminLoginPage from './admin/AdminLoginPage';
import AdminLayout from './admin/AdminLayout';
import AdminDashboardPage from './admin/AdminDashboardPage';
import AdminLeadsPage from './admin/AdminLeadsPage';
import AdminVisitorsPage from './admin/AdminVisitorsPage';
import AdminEmailsPage from './admin/AdminEmailsPage';
import AdminCMSPage from './admin/AdminCMSPage';
import AdminSettingsPage from './admin/AdminSettingsPage';

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
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
      </AuthProvider>
    </ThemeProvider>
  );
}
