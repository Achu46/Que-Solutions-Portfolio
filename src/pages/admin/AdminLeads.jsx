import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Download, 
  Trash2, 
  Edit3, 
  Phone, 
  Mail, 
  ExternalLink, 
  Check, 
  X, 
  AlertTriangle,
  MessageSquare
} from 'lucide-react';
import { 
  subscribeToLeads, 
  updateLead, 
  deleteLead, 
  exportLeadsToCSV 
} from '../../services/firebase/leadsService';

export default function AdminLeads() {
  const [leads, setLeads] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [planFilter, setPlanFilter] = useState('all');

  // Notes Modal state
  const [activeNoteLead, setActiveNoteLead] = useState(null);
  const [noteText, setNoteText] = useState('');

  // Delete Confirmation state
  const [leadToDelete, setLeadToDelete] = useState(null);

  useEffect(() => {
    const unsub = subscribeToLeads((data) => {
      setLeads(data || []);
    });
    return () => unsub();
  }, []);

  const handleStatusChange = async (leadId, nextStatus) => {
    await updateLead(leadId, { status: nextStatus });
  };

  const handleOpenNote = (lead) => {
    setActiveNoteLead(lead);
    setNoteText(lead.notes || '');
  };

  const handleSaveNote = async () => {
    if (!activeNoteLead) return;
    await updateLead(activeNoteLead.id, { notes: noteText });
    setActiveNoteLead(null);
  };

  const handleDeleteConfirm = async () => {
    if (!leadToDelete) return;
    await deleteLead(leadToDelete.id);
    setLeadToDelete(null);
  };

  // Filter leads
  const filteredLeads = leads.filter((lead) => {
    const matchesSearch = 
      (lead.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (lead.email || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (lead.phone || '').includes(searchTerm) ||
      (lead.company || '').toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'all' || lead.status === statusFilter;
    const matchesPlan = planFilter === 'all' || lead.selectedPlan === planFilter;

    return matchesSearch && matchesStatus && matchesPlan;
  });

  return (
    <div className="space-y-6 animate-fadeIn">
      
      {/* Header & Export Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-text tracking-tight">
            Client Inquiries & Leads Pipeline
          </h1>
          <p className="text-xs sm:text-sm text-text/70 mt-1">
            Real-time contact submissions. Filter by status, update interaction notes, or export to CSV.
          </p>
        </div>

        <button
          type="button"
          onClick={() => exportLeadsToCSV(filteredLeads)}
          className="brand-inverse inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold shadow-sm hover:bg-brand-deep transition-all"
        >
          <Download className="w-4 h-4" />
          <span>Export {filteredLeads.length} Leads to CSV</span>
        </button>
      </div>

      {/* Filters Bar */}
      <div className="p-4 rounded-card border border-border bg-surface flex flex-col md:flex-row items-center gap-4">
        
        {/* Search Input */}
        <div className="relative w-full md:flex-1">
          <input
            type="text"
            placeholder="Search by name, phone, email, or brand..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl border border-border bg-elevated text-xs transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
          />
          <Search className="w-4 h-4 text-text/50 absolute left-3 top-1/2 -translate-y-1/2" />
        </div>

        {/* Status Dropdown */}
        <div className="flex items-center gap-2 w-full md:w-auto">
          <span className="text-xs text-text/60 whitespace-nowrap">Status:</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full md:w-auto px-3 py-2 rounded-xl border border-border bg-elevated text-xs transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
          >
            <option value="all">All Statuses ({leads.length})</option>
            <option value="new">New ({leads.filter(l => l.status === 'new').length})</option>
            <option value="contacted">Contacted ({leads.filter(l => l.status === 'contacted').length})</option>
            <option value="won">Won ({leads.filter(l => l.status === 'won').length})</option>
            <option value="lost">Lost ({leads.filter(l => l.status === 'lost').length})</option>
          </select>
        </div>

        {/* Plan Dropdown */}
        <div className="flex items-center gap-2 w-full md:w-auto">
          <span className="text-xs text-text/60 whitespace-nowrap">Plan:</span>
          <select
            value={planFilter}
            onChange={(e) => setPlanFilter(e.target.value)}
            className="w-full md:w-auto px-3 py-2 rounded-xl border border-border bg-elevated text-xs transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
          >
            <option value="all">All Plans</option>
            <option value="Starter">Starter</option>
            <option value="Growth">Growth</option>
            <option value="Business">Business</option>
          </select>
        </div>

      </div>

      {/* Main Leads Table */}
      <div className="rounded-card border border-border bg-surface overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-border bg-elevated/50 text-text/70 uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-3 px-4 font-semibold">Contact Info</th>
                <th className="py-3 px-4 font-semibold">Business / Brand</th>
                <th className="py-3 px-4 font-semibold">Selected Plan</th>
                <th className="py-3 px-4 font-semibold">Requirement Message</th>
                <th className="py-3 px-4 font-semibold">Status</th>
                <th className="py-3 px-4 font-semibold">Date</th>
                <th className="py-3 px-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredLeads.length === 0 ? (
                <tr>
                  <td colSpan="7" className="py-12 text-center text-text/60">
                    No leads found matching current search criteria.
                  </td>
                </tr>
              ) : (
                filteredLeads.map((lead) => (
                  <tr key={lead.id} className="hover:bg-hover transition-colors">
                    
                    {/* Contact Info */}
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-text text-sm">{lead.name}</div>
                      <div className="flex items-center gap-3 mt-1 text-[11px] text-text/70">
                        <a 
                          href={`tel:${lead.phone}`}
                          className="hover:text-brand inline-flex items-center gap-1 font-mono"
                        >
                          <Phone className="w-3 h-3 text-brand" />
                          <span>{lead.phone}</span>
                        </a>
                        <a 
                          href={`mailto:${lead.email}`}
                          className="hover:text-brand inline-flex items-center gap-1"
                        >
                          <Mail className="w-3 h-3 text-brand" />
                          <span>{lead.email}</span>
                        </a>
                      </div>
                    </td>

                    {/* Business Details */}
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-text">{lead.company || 'Direct Founder'}</div>
                      <div className="text-[10px] text-brand-sage font-medium mt-0.5">{lead.businessType}</div>
                    </td>

                    {/* Plan */}
                    <td className="py-3.5 px-4 font-medium text-text">
                      <span className="px-2.5 py-1 rounded-lg bg-elevated border border-border">
                        {lead.selectedPlan}
                      </span>
                    </td>

                    {/* Message & Notes preview */}
                    <td className="py-3.5 px-4 max-w-xs">
                      <p className="text-text/80 truncate text-[11px]" title={lead.message}>
                        {lead.message || <span className="italic text-text/40">No message provided</span>}
                      </p>
                      {lead.notes && (
                        <div className="text-[10px] text-brand font-medium truncate mt-0.5" title={lead.notes}>
                          Note: {lead.notes}
                        </div>
                      )}
                    </td>

                    {/* Status Dropdown */}
                    <td className="py-3.5 px-4">
                      <select
                        value={lead.status || 'new'}
                        onChange={(e) => handleStatusChange(lead.id, e.target.value)}
                        className={`text-[11px] font-bold uppercase tracking-wider px-2 py-1 rounded-lg border focus-visible:outline-none ${
                          lead.status === 'new'
                            ? 'bg-amber-950/40 border-amber-500/50 text-amber-400'
                            : lead.status === 'won'
                            ? 'bg-green-950/40 border-green-500/50 text-green-400'
                            : lead.status === 'contacted'
                            ? 'bg-blue-950/40 border-blue-500/50 text-blue-400'
                            : 'bg-elevated border-border text-text/60'
                        }`}
                      >
                        <option value="new">New</option>
                        <option value="contacted">Contacted</option>
                        <option value="won">Won</option>
                        <option value="lost">Lost</option>
                      </select>
                    </td>

                    {/* Date */}
                    <td className="py-3.5 px-4 text-text/60 whitespace-nowrap">
                      {lead.createdAt ? new Date(lead.createdAt).toLocaleDateString() : 'Recent'}
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => handleOpenNote(lead)}
                          className="p-1.5 rounded-lg border border-border bg-elevated hover:bg-hover text-text"
                          title="Add / Edit interaction notes"
                          aria-label="Add or edit notes"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setLeadToDelete(lead)}
                          className="p-1.5 rounded-lg border border-border bg-elevated hover:bg-red-500/10 hover:border-red-500/30 text-text hover:text-red-400"
                          title="Delete inquiry"
                          aria-label="Delete inquiry"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>

                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Note Editor Modal */}
      {activeNoteLead && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="max-w-md w-full bg-surface border border-border rounded-card p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <h3 className="font-bold text-sm text-text">
                Interaction Notes: {activeNoteLead.name}
              </h3>
              <button 
                type="button" 
                onClick={() => setActiveNoteLead(null)}
                className="p-1 rounded text-text/60 hover:text-text"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <textarea
              rows={4}
              value={noteText}
              onChange={(e) => setNoteText(e.target.value)}
              placeholder="Record call discussion, agreed pricing shift, or next follow-up date..."
              className="w-full px-3 py-2 rounded-xl border border-border bg-elevated text-xs transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
            />

            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setActiveNoteLead(null)}
                className="px-3 py-1.5 rounded-xl border border-border text-xs text-text hover:bg-hover"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveNote}
                className="brand-inverse px-4 py-1.5 rounded-xl text-xs font-semibold shadow-sm hover:bg-brand-deep"
              >
                Save Notes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {leadToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="max-w-sm w-full bg-surface border border-border rounded-card p-6 space-y-4 shadow-2xl text-center">
            <div className="w-12 h-12 rounded-full bg-red-950/40 border border-red-500/30 text-red-400 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-base text-text">
              Confirm Deletion
            </h3>
            <p className="text-xs text-text/80 leading-relaxed">
              Are you sure you want to permanently delete the inquiry from <strong>{leadToDelete.name}</strong>? This action cannot be undone.
            </p>

            <div className="flex justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setLeadToDelete(null)}
                className="px-4 py-2 rounded-xl border border-border text-xs font-medium text-text hover:bg-hover"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDeleteConfirm}
                className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-semibold shadow-sm"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
