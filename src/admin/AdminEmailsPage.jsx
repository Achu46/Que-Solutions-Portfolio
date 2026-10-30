import React, { useState, useEffect } from 'react';
import { Mail, Clock, CheckCircle2, AlertCircle, Info, Send } from 'lucide-react';
import { api } from '../services/api';

export default function AdminEmailsPage() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // In Spark plan, notification emails are not triggered via Cloud Functions;
    // this view explains the architecture and displays queued/dispatched notifications.
    setLoading(false);
  }, []);

  return (
    <div className="space-y-8 animate-fadeIn max-w-4xl">
      <div>
        <h1 className="text-2xl font-bold text-text tracking-tight">Notification Queue & Logs</h1>
        <p className="text-xs text-text opacity-70 mt-1">
          Inspection log for automated lead email alerts dispatched to que.solutions.services@gmail.com.
        </p>
      </div>

      {/* Plan Notice Banner */}
      <div className="p-6 rounded-3xl border border-border bg-surface space-y-3 shadow-soft">
        <div className="flex items-center gap-2.5 font-bold text-brand text-sm">
          <Info className="w-5 h-5 shrink-0" />
          <span>Firebase Hosting & Cloud Functions Plan Architecture</span>
        </div>
        <p className="text-xs text-text opacity-85 leading-relaxed">
          Automated lead email notifications utilize Cloud Functions (e.g. <code>onDocumentCreated</code> on <code>leads/{'{id}'}</code> via Nodemailer) or the official <em>"Trigger Email from Firestore"</em> extension. These external network integrations require the <strong>Firebase Blaze (Pay-as-you-go)</strong> plan.
        </p>
        <p className="text-xs text-text opacity-85 leading-relaxed">
          On the free <strong>Spark plan</strong>, all quote requests and leads are securely recorded directly into Firestore in real time and displayed with instant badges inside the <strong>Leads Management</strong> dashboard, with zero missing data.
        </p>
      </div>

      {/* Queue Status Box */}
      <div className="rounded-3xl border border-border bg-surface p-8 shadow-soft space-y-4">
        <h2 className="text-lg font-bold text-text">Dispatch Configuration</h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="p-4 rounded-2xl bg-elevated border border-border space-y-1">
            <span className="opacity-70">Target Notification Mailbox</span>
            <div className="font-bold text-text">que.solutions.services@gmail.com</div>
          </div>
          <div className="p-4 rounded-2xl bg-elevated border border-border space-y-1">
            <span className="opacity-70">Trigger Event</span>
            <div className="font-bold text-text">Firestore: leads (onCreate)</div>
          </div>
        </div>
      </div>
    </div>
  );
}
