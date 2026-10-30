import React from 'react';
import PublicLayout from '../layouts/PublicLayout';
import { Shield } from 'lucide-react';

export default function PrivacyPage() {
  return (
    <PublicLayout>
      <div className="pt-32 pb-24 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface border border-border text-xs font-bold text-brand uppercase tracking-wider">
            <Shield className="w-3.5 h-3.5" />
            <span>Legal Notice</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-text tracking-tight">
            Privacy Policy
          </h1>
          <p className="text-xs text-text opacity-70">
            Last Updated: October 2026 • QUE SOLUTIONS
          </p>
        </div>

        <div className="prose prose-neutral dark:prose-invert max-w-none text-sm text-text space-y-6 leading-relaxed">
          <section className="space-y-3">
            <h2 className="text-xl font-bold text-text">1. Overview</h2>
            <p className="opacity-80">
              QUE SOLUTIONS ("we", "our", or "us") provides dedicated outsourced customer care and call centre services for small and growing product businesses in Erode, Tamil Nadu. This Privacy Policy outlines our practices regarding information collected through our website and services.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-text">2. Information We Collect</h2>
            <p className="opacity-80">
              When submitting a consultation or quote request, we collect your name, business name, email address, phone number, and support requirement details. We do not sell, rent, or monetize your contact information.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-text">3. How Information is Used</h2>
            <p className="opacity-80">
              Your details are used solely to evaluate your service requirements, prepare customized onboarding proposals, and communicate regarding customer care subscriptions.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-text">4. Data Security</h2>
            <p className="opacity-80">
              All lead data is transmitted over encrypted SSL/TLS protocols and stored securely in Cloud Firestore with role-based access rules restricted to authorized management personnel.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-text">5. Contact Us</h2>
            <p className="opacity-80">
              For any questions regarding your data or this policy, reach out to us at{' '}
              <a href="mailto:que.solutions.services@gmail.com" className="text-brand font-semibold underline">
                que.solutions.services@gmail.com
              </a>{' '}
              or call +91 7092490337.
            </p>
          </section>
        </div>
      </div>
    </PublicLayout>
  );
}
