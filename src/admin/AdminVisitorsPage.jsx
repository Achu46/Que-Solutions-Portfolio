import React, { useState, useEffect } from 'react';
import { Eye, Shield, Globe, TrendingUp, Users } from 'lucide-react';
import { api } from '../services/api';

export default function AdminVisitorsPage() {
  const [overview, setOverview] = useState({ total: 0, newCount: 0, contacted: 0, won: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const data = await api.getOverview();
        setOverview(data);
      } catch (err) {
        console.warn('[Analytics Load Error]:', err.message);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  return (
    <div className="space-y-8 animate-fadeIn max-w-4xl">
      <div>
        <h1 className="text-2xl font-bold text-text tracking-tight">Visitor & Funnel Analytics</h1>
        <p className="text-xs text-text opacity-70 mt-1">
          Aggregated counters and conversion metrics adhering to privacy-first guidelines.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="p-6 rounded-2xl border border-border bg-surface space-y-2 shadow-soft">
          <div className="text-xs font-semibold text-text opacity-70">Total Captured Leads</div>
          <div className="text-3xl font-extrabold text-text">{overview.total}</div>
          <div className="text-[11px] text-brand font-medium">Inbound consultation requests</div>
        </div>

        <div className="p-6 rounded-2xl border border-border bg-surface space-y-2 shadow-soft">
          <div className="text-xs font-semibold text-text opacity-70">Qualified / In Discussion</div>
          <div className="text-3xl font-extrabold text-text">{overview.contacted}</div>
          <div className="text-[11px] text-brand font-medium">Active prospect dialogues</div>
        </div>

        <div className="p-6 rounded-2xl border border-border bg-surface space-y-2 shadow-soft">
          <div className="text-xs font-semibold text-text opacity-70">Onboarded Clients</div>
          <div className="text-3xl font-extrabold text-text">{overview.won}</div>
          <div className="text-[11px] text-brand font-medium">Active subscriptions</div>
        </div>
      </div>

      <div className="rounded-3xl border border-border bg-surface p-8 shadow-soft space-y-4">
        <div className="flex items-center gap-2 font-bold text-brand text-sm">
          <Shield className="w-4 h-4" />
          <span>Privacy-First Analytics Protocol</span>
        </div>
        <p className="text-xs text-text opacity-80 leading-relaxed">
          In strict compliance with privacy standards, visitor logging captures aggregate operational counts without storing personally identifiable IP addresses or cookies without user consent.
        </p>
      </div>
    </div>
  );
}
