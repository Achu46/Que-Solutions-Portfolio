import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Users,
  Eye,
  Mail,
  TrendingUp,
  Clock,
  ArrowUpRight,
  CheckCircle2,
  PhoneIncoming,
  MessageSquare,
  Activity,
  Layers
} from 'lucide-react';
import { api } from '../services/api';

export default function AdminDashboardPage() {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);

  // Set up real-time listener for Firestore leads
  useEffect(() => {
    const unsubscribe = api.subscribeToLeads((updatedLeads) => {
      setLeads(updatedLeads);
      setLoading(false);
    });

    return () => {
      if (typeof unsubscribe === 'function') unsubscribe();
    };
  }, []);

  const totalLeads = leads.length;
  const newLeads = leads.filter(l => l.status === 'new').length;
  const contactedLeads = leads.filter(l => l.status === 'contacted').length;
  const wonLeads = leads.filter(l => l.status === 'won').length;

  const recentLeads = leads.slice(0, 5);

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-text tracking-tight">Executive Dashboard</h1>
          <p className="text-xs text-text opacity-70 mt-1">
            Real-time Firestore overview of inbound leads, quote requests, and customer care inquiries.
          </p>
        </div>
        <Link
          to="/que/leads"
          className="brand-inverse inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider shadow-sm hover:opacity-95 transition-all w-fit"
        >
          <span>Manage All Leads</span>
          <ArrowUpRight className="w-4 h-4" />
        </Link>
      </div>

      {/* Metric Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="p-6 rounded-2xl border border-border bg-surface space-y-3 shadow-soft">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-text opacity-70">Total Quote Requests</span>
            <div className="w-8 h-8 rounded-lg bg-elevated border border-border flex items-center justify-center text-brand">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-text">{totalLeads}</div>
          <div className="text-[11px] text-brand font-medium">Real-time Firestore sync</div>
        </div>

        <div className="p-6 rounded-2xl border border-border bg-surface space-y-3 shadow-soft">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-text opacity-70">New / Uncontacted</span>
            <div className="w-8 h-8 rounded-lg bg-elevated border border-border flex items-center justify-center text-brand">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-text">{newLeads}</div>
          <div className="text-[11px] text-text opacity-70">Awaiting initial outreach</div>
        </div>

        <div className="p-6 rounded-2xl border border-border bg-surface space-y-3 shadow-soft">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-text opacity-70">In Conversation</span>
            <div className="w-8 h-8 rounded-lg bg-elevated border border-border flex items-center justify-center text-brand">
              <Activity className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-text">{contactedLeads}</div>
          <div className="text-[11px] text-text opacity-70">Proposal in progress</div>
        </div>

        <div className="p-6 rounded-2xl border border-border bg-surface space-y-3 shadow-soft">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-text opacity-70">Active Subscriptions</span>
            <div className="w-8 h-8 rounded-lg bg-elevated border border-border flex items-center justify-center text-brand">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-text">{wonLeads}</div>
          <div className="text-[11px] text-brand font-medium">Won client accounts</div>
        </div>
      </div>

      {/* Recent Leads Table */}
      <div className="rounded-3xl border border-border bg-surface p-6 sm:p-8 space-y-6 shadow-soft">
        <div className="flex items-center justify-between border-b border-border pb-4">
          <div>
            <h2 className="text-lg font-bold text-text">Recent Lead Submissions</h2>
            <p className="text-xs text-text opacity-70">Latest requests captured directly through the public consultation form.</p>
          </div>
          <Link to="/que/leads" className="text-xs font-semibold text-brand hover:underline">
            View full log →
          </Link>
        </div>

        {loading ? (
          <div className="py-12 text-center text-xs text-text opacity-70">
            <div className="w-6 h-6 border-2 border-brand border-t-transparent rounded-full animate-spin mx-auto mb-2" />
            Loading real-time submissions...
          </div>
        ) : recentLeads.length === 0 ? (
          <div className="py-12 text-center text-xs text-text opacity-70">
            No leads received yet. Test by submitting a quote request on the homepage.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-border text-text opacity-70 uppercase tracking-wider text-[10px]">
                  <th className="pb-3 font-bold">Reference</th>
                  <th className="pb-3 font-bold">Contact</th>
                  <th className="pb-3 font-bold">Service</th>
                  <th className="pb-3 font-bold">Plan</th>
                  <th className="pb-3 font-bold">Status</th>
                  <th className="pb-3 font-bold">Time</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {recentLeads.map((lead) => (
                  <tr key={lead.id} className="hover:bg-hover transition-colors">
                    <td className="py-3.5 font-mono text-[11px] text-brand font-bold">
                      {lead.leadCode || lead.id.slice(0, 8)}
                    </td>
                    <td className="py-3.5">
                      <div className="font-bold text-text">{lead.name}</div>
                      <div className="text-[11px] opacity-70">{lead.email} • {lead.phone}</div>
                    </td>
                    <td className="py-3.5 text-text">{lead.serviceInterested || 'General'}</td>
                    <td className="py-3.5 text-text">{lead.monthlyRequirement || 'Default'}</td>
                    <td className="py-3.5">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        lead.status === 'new'
                          ? 'bg-amber-500/10 text-amber-600 border border-amber-500/30'
                          : lead.status === 'won'
                          ? 'bg-brand/10 text-brand border border-brand/30'
                          : 'bg-elevated text-text border border-border'
                      }`}>
                        {lead.status}
                      </span>
                    </td>
                    <td className="py-3.5 text-text opacity-70">
                      {new Date(lead.createdAt).toLocaleDateString('en-IN', {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
