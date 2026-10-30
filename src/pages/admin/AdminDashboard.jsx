import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Users, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  ArrowRight, 
  Sparkles, 
  TrendingUp, 
  CreditCard,
  PhoneCall,
  Calendar
} from 'lucide-react';
import { subscribeToLeads } from '../../services/firebase/leadsService';
import { COMPANY_NAME } from '../../config/constants';

export default function AdminDashboard() {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = subscribeToLeads((data) => {
      setLeads(data || []);
      setLoading(false);
    });
    return () => unsub();
  }, []);

  // Compute metrics
  const totalLeads = leads.length;
  const newLeads = leads.filter(l => l.status === 'new').length;
  const contactedLeads = leads.filter(l => l.status === 'contacted').length;
  const wonLeads = leads.filter(l => l.status === 'won').length;
  const lostLeads = leads.filter(l => l.status === 'lost').length;

  // Breakdown by plan
  const planCounts = leads.reduce((acc, lead) => {
    const plan = lead.selectedPlan || 'Other';
    acc[plan] = (acc[plan] || 0) + 1;
    return acc;
  }, {});

  const recentLeads = leads.slice(0, 5);

  return (
    <div className="space-y-8 animate-fadeIn">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-text tracking-tight">
            Executive Operations Dashboard
          </h1>
          <p className="text-xs sm:text-sm text-text/70 mt-1">
            Real-time client lead pipeline & customer support inquiries.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/que/leads"
            className="brand-inverse inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold shadow-sm hover:bg-brand-deep transition-all"
          >
            <span>Manage All Inquiries</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* Metric Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* Total Inquiries */}
        <div className="p-6 rounded-card border border-border bg-surface flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs text-text/70 font-medium uppercase tracking-wider">Total Leads</span>
            <div className="text-3xl font-black text-text">{loading ? '-' : totalLeads}</div>
            <div className="text-[11px] text-brand-sage font-medium">All recorded inquiries</div>
          </div>
          <div className="w-12 h-12 rounded-xl bg-elevated border border-border flex items-center justify-center text-brand">
            <Users className="w-6 h-6 text-brand" />
          </div>
        </div>

        {/* New / Action Required */}
        <div className="p-6 rounded-card border border-border bg-surface flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs text-text/70 font-medium uppercase tracking-wider">New Inquiries</span>
            <div className="text-3xl font-black text-brand">{loading ? '-' : newLeads}</div>
            <div className="text-[11px] text-text/60">Awaiting callback / reply</div>
          </div>
          <div className="w-12 h-12 rounded-xl bg-brand-darker border border-brand/30 flex items-center justify-center text-brand-sage">
            <Clock className="w-6 h-6 text-brand" />
          </div>
        </div>

        {/* Contacted */}
        <div className="p-6 rounded-card border border-border bg-surface flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs text-text/70 font-medium uppercase tracking-wider">In Discussion</span>
            <div className="text-3xl font-black text-text">{loading ? '-' : contactedLeads}</div>
            <div className="text-[11px] text-text/60">Proposal or shift scoping</div>
          </div>
          <div className="w-12 h-12 rounded-xl bg-elevated border border-border flex items-center justify-center text-text/70">
            <PhoneCall className="w-6 h-6 text-brand" />
          </div>
        </div>

        {/* Won Clients */}
        <div className="p-6 rounded-card border border-border bg-surface flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs text-text/70 font-medium uppercase tracking-wider">Won Retainers</span>
            <div className="text-3xl font-black text-green-500">{loading ? '-' : wonLeads}</div>
            <div className="text-[11px] text-text/60">Active support contracts</div>
          </div>
          <div className="w-12 h-12 rounded-xl bg-green-950/30 border border-green-500/30 flex items-center justify-center text-green-400">
            <CheckCircle2 className="w-6 h-6" />
          </div>
        </div>

      </div>

      {/* Plan Breakdown & Pipeline Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Breakdown by Plan Card */}
        <div className="p-6 rounded-card border border-border bg-surface space-y-4">
          <div className="flex items-center justify-between border-b border-border pb-3">
            <h2 className="text-base font-bold text-text flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-brand" />
              <span>Inquiries by Plan</span>
            </h2>
            <span className="text-xs text-text/60">{Object.keys(planCounts).length} Plan types</span>
          </div>

          <div className="space-y-3">
            {Object.keys(planCounts).length === 0 ? (
              <p className="text-xs text-text/60 py-4 text-center">No leads recorded yet.</p>
            ) : (
              Object.entries(planCounts).map(([plan, count]) => (
                <div key={plan} className="space-y-1">
                  <div className="flex justify-between text-xs font-semibold text-text">
                    <span>{plan}</span>
                    <span className="text-brand">{count} ({Math.round((count / (totalLeads || 1)) * 100)}%)</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-elevated overflow-hidden">
                    <div 
                      className="h-full bg-brand rounded-full transition-all duration-500"
                      style={{ width: `${(count / (totalLeads || 1)) * 100}%` }}
                    />
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Operating Model Summary */}
        <div className="lg:col-span-2 p-6 rounded-card border border-border bg-surface space-y-4">
          <div className="flex items-center justify-between border-b border-border pb-3">
            <h2 className="text-base font-bold text-text flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-brand" />
              <span>QUE SOLUTIONS Operational Summary</span>
            </h2>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-brand-darker border border-brand/30 text-brand-sage font-semibold">
              Live Architecture
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="p-4 rounded-xl bg-elevated border border-border space-y-1.5">
              <span className="font-semibold text-brand">Operating Shift:</span>
              <p className="text-text/80">4 hrs/day, Mon to Sat (~104 hrs/month) structured non-24/7 outsourced coverage.</p>
            </div>
            <div className="p-4 rounded-xl bg-elevated border border-border space-y-1.5">
              <span className="font-semibold text-brand">Client Target:</span>
              <p className="text-text/80">Small D2C brands, Instagram sellers, e-commerce stores, and Amazon sellers.</p>
            </div>
            <div className="p-4 rounded-xl bg-elevated border border-border space-y-1.5">
              <span className="font-semibold text-brand">Supported Channels:</span>
              <p className="text-text/80">Inbound Call Support, Outbound Verification (COD callbacks), and Omnichannel Chat.</p>
            </div>
            <div className="p-4 rounded-xl bg-elevated border border-border space-y-1.5">
              <span className="font-semibold text-brand">Proprietary Software:</span>
              <p className="text-text/80">QueFlow CRM (queflow.in), Company Website CMS, Que HRMS, and Arabic ERP.</p>
            </div>
          </div>
        </div>

      </div>

      {/* Recent Leads Table */}
      <div className="p-6 rounded-card border border-border bg-surface space-y-4">
        <div className="flex items-center justify-between border-b border-border pb-3">
          <h2 className="text-base font-bold text-text">
            Recent Inquiries
          </h2>
          <Link to="/que/leads" className="text-xs text-brand font-semibold hover:underline">
            View All →
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-border text-text/60">
                <th className="py-2.5 px-3 font-semibold">Contact</th>
                <th className="py-2.5 px-3 font-semibold">Brand / Type</th>
                <th className="py-2.5 px-3 font-semibold">Plan</th>
                <th className="py-2.5 px-3 font-semibold">Status</th>
                <th className="py-2.5 px-3 font-semibold">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {recentLeads.length === 0 ? (
                <tr>
                  <td colSpan="5" className="py-8 text-center text-text/60">
                    No inquiries recorded yet. Submissions from the contact form appear here in real time.
                  </td>
                </tr>
              ) : (
                recentLeads.map((lead) => (
                  <tr key={lead.id} className="hover:bg-hover transition-colors">
                    <td className="py-3 px-3">
                      <div className="font-semibold text-text">{lead.name}</div>
                      <div className="text-[11px] text-text/60">{lead.phone} • {lead.email}</div>
                    </td>
                    <td className="py-3 px-3">
                      <div className="font-medium text-text">{lead.company || 'Not Specified'}</div>
                      <div className="text-[10px] text-brand">{lead.businessType}</div>
                    </td>
                    <td className="py-3 px-3 font-medium text-text">
                      {lead.selectedPlan}
                    </td>
                    <td className="py-3 px-3">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
                        lead.status === 'new'
                          ? 'bg-amber-950/40 border-amber-500/50 text-amber-400'
                          : lead.status === 'won'
                          ? 'bg-green-950/40 border-green-500/50 text-green-400'
                          : lead.status === 'contacted'
                          ? 'bg-blue-950/40 border-blue-500/50 text-blue-400'
                          : 'bg-elevated border-border text-text/60'
                      }`}>
                        {lead.status}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-text/60">
                      {lead.createdAt ? new Date(lead.createdAt).toLocaleDateString() : 'Just now'}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
