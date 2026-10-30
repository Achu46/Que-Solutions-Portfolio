import React from 'react';
import PublicLayout from '../layouts/PublicLayout';
import { FileText } from 'lucide-react';

export default function TermsPage() {
  return (
    <PublicLayout>
      <div className="pt-32 pb-24 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface border border-border text-xs font-bold text-brand uppercase tracking-wider">
            <FileText className="w-3.5 h-3.5" />
            <span>Service Agreement</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-text tracking-tight">
            Terms of Service
          </h1>
          <p className="text-xs text-text opacity-70">
            Last Updated: October 2026 • QUE SOLUTIONS
          </p>
        </div>

        <div className="prose prose-neutral dark:prose-invert max-w-none text-sm text-text space-y-6 leading-relaxed">
          <section className="space-y-3">
            <h2 className="text-xl font-bold text-text">1. Scope of Services</h2>
            <p className="opacity-80">
              QUE SOLUTIONS provides outsourced customer care and call centre services operating on a structured schedule of <strong>4 hours per day, Monday through Saturday (~104 hours per month)</strong>. Services do not operate on a 24/7 basis.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-text">2. Outbound Calling Policy</h2>
            <p className="opacity-80">
              Outbound call services are strictly restricted to existing buyer inquiries, order confirmations, pre-dispatch verifications, and customer feedback. QUE SOLUTIONS does not engage in unsolicited cold calling or telemarketing.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-text">3. Retainers & SLA</h2>
            <p className="opacity-80">
              Monthly subscriptions (Starter ₹11,999, Growth ₹15,999, Business ₹21,999) are billed on a recurring monthly basis. Inquiry volume thresholds and service levels are formally established and agreed upon during onboarding.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-text">4. Inquiries</h2>
            <p className="opacity-80">
              For subscription questions or custom enterprise arrangements, contact{' '}
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
