import React from 'react';

// 2D Static Poster Fallback for QueFlow
export default function ProductPosterFallback({ isDark }) {
  return (
    <div className="w-full h-full min-h-[340px] flex items-center justify-center p-4">
      <div className="relative w-full max-w-lg rounded-2xl border border-border bg-surface p-5 shadow-xl">
        <div className="flex items-center justify-between border-b border-border pb-3 mb-4">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-red-400 inline-block" />
            <span className="w-3 h-3 rounded-full bg-yellow-400 inline-block" />
            <span className="w-3 h-3 rounded-full bg-green-400 inline-block" />
            <span className="ml-2 text-xs font-bold text-text">QueFlow CRM</span>
          </div>
          <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-brand-50 text-brand-700 border border-brand-200">
            Live SaaS Product
          </span>
        </div>

        <div className="space-y-3">
          <div className="grid grid-cols-3 gap-2">
            <div className="p-2.5 rounded-lg bg-elevated border border-border">
              <div className="text-[10px] text-text opacity-70">Leads Active</div>
              <div className="text-base font-bold text-text">248</div>
            </div>
            <div className="p-2.5 rounded-lg bg-elevated border border-border">
              <div className="text-[10px] text-text opacity-70">Follow-ups Due</div>
              <div className="text-base font-bold text-text">18</div>
            </div>
            <div className="p-2.5 rounded-lg bg-elevated border border-border">
              <div className="text-[10px] text-text opacity-70">Pipeline Value</div>
              <div className="text-base font-bold text-text">₹8.4L</div>
            </div>
          </div>
          <div className="p-3 rounded-lg bg-elevated border border-border text-xs text-text space-y-1">
            <div className="font-semibold text-brand">Multi-Tenant Lead & Customer Tracking</div>
            <div className="text-[11px] opacity-80">Full contact histories, deal progression, and team activity analytics.</div>
          </div>
        </div>
      </div>
    </div>
  );
}
