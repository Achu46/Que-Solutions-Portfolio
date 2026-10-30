import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Search, 
  Download, 
  Filter, 
  Phone, 
  Mail, 
  Building2, 
  Clock, 
  MessageSquare, 
  Plus, 
  Trash2,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { api } from '../services/api';

export default function AdminLeadsPage() {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedLead, setSelectedLead] = useState(null);
  const [newNote, setNewNote] = useState('');
  const [actionMessage, setActionMessage] = useState('');

  const fetchLeads = async () => {
    setLoading(true);
    try {
      const data = await api.getLeads();
      setLeads(data);
    } catch (err) {
      console.error('[Leads Fetch Error]:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeads();
  }, []);

  const handleStatusChange = async (leadId, newStatus) => {
    try {
      await api.updateLeadStatus(leadId, newStatus);
      setLeads(prev => prev.map(l => l.id === leadId ? { ...l, status: newStatus } : l));
      if (selectedLead?.id === leadId) {
        setSelectedLead(prev => ({ ...prev, status: newStatus }));
      }
      setActionMessage('Status updated successfully');
      setTimeout(() => setActionMessage(''), 3000);
    } catch (err) {
      alert('Failed to update status: ' + err.message);
    }
  };

  const handleAddNote = async (e) => {
    e.preventDefault();
    if (!newNote.trim() || !selectedLead) return;
    try {
      await api.addLeadNote(selectedLead.id, newNote.trim());
      setNewNote('');
      setActionMessage('Internal note recorded');
      setTimeout(() => setActionMessage(''), 3000);
    } catch (err) {
      alert('Failed to add note: ' + err.message);
    }
  };

  const handleDeleteLead = async (leadId) => {
    if (!window.confirm('Are you sure you want to delete this lead? This action cannot be undone.')) return;
    try {
      await api.deleteLead(leadId);
      setLeads(prev => prev.filter(l => l.id !== leadId));
      if (selectedLead?.id === leadId) setSelectedLead(null);
      setActionMessage('Lead deleted');
      setTimeout(() => setActionMessage(''), 3000);
    } catch (err) {
      alert('Failed to delete lead: ' + err.message);
    }
  };

  // CSV Export
  const handleExportCSV = () => {
    if (leads.length === 0) return;
    const headers = ['LeadCode', 'Name', 'Company', 'Email', 'Phone', 'Service', 'Plan', 'Status', 'CreatedAt', 'Message'];
    const rows = leads.map(l => [
      `"${l.leadCode || l.id}"`,
      `"${(l.name || '').replace(/"/g, '""')}"`,
      `"${(l.company || '').replace(/"/g, '""')}"`,
      `"${l.email || ''}"`,
      `"${l.phone || ''}"`,
      `"${l.serviceInterested || ''}"`,
      `"${l.monthlyRequirement || ''}"`,
      `"${l.status || ''}"`,
      `"${l.createdAt || ''}"`,
      `"${(l.message || '').replace(/"/g, '""')}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `que_leads_export_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Filtered Leads
  const filteredLeads = leads.filter(l => {
    const matchesSearch = 
      (l.name || '').toLowerCase().includes(search.toLowerCase()) ||
      (l.email || '').toLowerCase().includes(search.toLowerCase()) ||
      (l.phone || '').includes(search) ||
      (l.company || '').toLowerCase().includes(search.toLowerCase()) ||
      (l.leadCode || '').toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'all' || l.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-text tracking-tight">Leads Management</h1>
          <p className="text-xs text-text opacity-70 mt-1">
            Browse, qualify, and track customer care inquiries captured through Firestore.
          </p>
        </div>
        <button
          onClick={handleExportCSV}
          disabled={leads.length === 0}
          className="brand-inverse inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider shadow-sm hover:opacity-95 transition-all w-fit"
        >
          <Download className="w-4 h-4" />
          <span>Export to CSV</span>
        </button>
      </div>

      {actionMessage && (
        <div className="p-3 rounded-xl bg-brand/10 border border-brand text-xs text-text flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-brand" />
          <span>{actionMessage}</span>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-12 gap-4">
        <div className="sm:col-span-8 relative">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, email, phone, company, or lead code..."
            className="w-full pl-10 pr-4 py-3 rounded-xl border border-border bg-surface text-text text-xs focus:outline-none focus:border-brand transition-colors"
          />
          <Search className="w-4 h-4 text-brand absolute left-3.5 top-1/2 -translate-y-1/2" />
        </div>

        <div className="sm:col-span-4">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-border bg-surface text-text text-xs focus:outline-none focus:border-brand transition-colors"
          >
            <option value="all">All Statuses ({leads.length})</option>
            <option value="new">New ({leads.filter(l => l.status === 'new').length})</option>
            <option value="contacted">Contacted ({leads.filter(l => l.status === 'contacted').length})</option>
            <option value="qualified">Qualified ({leads.filter(l => l.status === 'qualified').length})</option>
            <option value="won">Won ({leads.filter(l => l.status === 'won').length})</option>
            <option value="lost">Lost ({leads.filter(l => l.status === 'lost').length})</option>
          </select>
        </div>
      </div>

      {/* Content Layout: Table & Detail Pane */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Leads Table */}
        <div className="lg:col-span-8 rounded-3xl border border-border bg-surface p-6 shadow-soft">
          {loading ? (
            <div className="py-16 text-center text-xs text-text opacity-70">
              <div className="w-6 h-6 border-2 border-brand border-t-transparent rounded-full animate-spin mx-auto mb-2" />
              Loading inquiries...
            </div>
          ) : filteredLeads.length === 0 ? (
            <div className="py-16 text-center text-xs text-text opacity-70">
              No matching leads found.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-border text-text opacity-70 uppercase tracking-wider text-[10px]">
                    <th className="pb-3 font-bold">Ref Code</th>
                    <th className="pb-3 font-bold">Contact</th>
                    <th className="pb-3 font-bold">Service / Plan</th>
                    <th className="pb-3 font-bold">Status</th>
                    <th className="pb-3 font-bold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {filteredLeads.map((lead) => (
                    <tr
                      key={lead.id}
                      onClick={() => setSelectedLead(lead)}
                      className={`cursor-pointer transition-colors ${
                        selectedLead?.id === lead.id ? 'bg-elevated' : 'hover:bg-hover'
                      }`}
                    >
                      <td className="py-3.5 font-mono text-[11px] font-bold text-brand">
                        {lead.leadCode || lead.id.slice(0, 8)}
                      </td>
                      <td className="py-3.5">
                        <div className="font-bold text-text">{lead.name}</div>
                        {lead.company && <div className="text-[11px] opacity-75">{lead.company}</div>}
                        <div className="text-[11px] opacity-70">{lead.phone}</div>
                      </td>
                      <td className="py-3.5">
                        <div className="text-text font-medium">{lead.serviceInterested || 'General'}</div>
                        <div className="text-[11px] opacity-70">{lead.monthlyRequirement}</div>
                      </td>
                      <td className="py-3.5">
                        <select
                          value={lead.status}
                          onClick={(e) => e.stopPropagation()}
                          onChange={(e) => handleStatusChange(lead.id, e.target.value)}
                          className="px-2 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider border border-border bg-elevated text-text"
                        >
                          <option value="new">New</option>
                          <option value="contacted">Contacted</option>
                          <option value="qualified">Qualified</option>
                          <option value="won">Won</option>
                          <option value="lost">Lost</option>
                        </select>
                      </td>
                      <td className="py-3.5 text-right">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteLead(lead.id);
                          }}
                          className="p-1.5 rounded-lg text-text opacity-60 hover:opacity-100 hover:text-red-500 transition-colors"
                          title="Delete Lead"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Lead Detail / Inspection Drawer */}
        <div className="lg:col-span-4 rounded-3xl border border-border bg-surface p-6 space-y-6 shadow-soft">
          {selectedLead ? (
            <div className="space-y-6">
              <div className="border-b border-border pb-4">
                <span className="text-[10px] font-mono text-brand font-bold uppercase">
                  {selectedLead.leadCode || selectedLead.id}
                </span>
                <h3 className="text-xl font-bold text-text mt-1">{selectedLead.name}</h3>
                {selectedLead.company && (
                  <p className="text-xs text-text opacity-80">{selectedLead.company}</p>
                )}
              </div>

              <div className="space-y-3 text-xs">
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-brand shrink-0" />
                  <a href={`tel:${selectedLead.phone}`} className="hover:underline font-medium text-text">
                    {selectedLead.phone}
                  </a>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-brand shrink-0" />
                  <a href={`mailto:${selectedLead.email}`} className="hover:underline font-medium text-text break-all">
                    {selectedLead.email}
                  </a>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-brand shrink-0" />
                  <span className="opacity-80">
                    {new Date(selectedLead.createdAt).toLocaleString('en-IN')}
                  </span>
                </div>
              </div>

              {/* Inquired Message */}
              <div className="p-4 rounded-2xl bg-elevated border border-border space-y-1.5 text-xs">
                <div className="font-bold text-brand uppercase text-[10px]">Client Inquiry Note:</div>
                <p className="opacity-90 leading-relaxed text-text">
                  {selectedLead.message || 'No additional message provided.'}
                </p>
              </div>

              {/* Add Note */}
              <form onSubmit={handleAddNote} className="space-y-2 pt-2 border-t border-border">
                <label className="text-xs font-bold text-text">Add Internal Staff Note</label>
                <textarea
                  rows={3}
                  value={newNote}
                  onChange={(e) => setNewNote(e.target.value)}
                  placeholder="Record call summary, pricing discussion, or onboarding SLA..."
                  className="w-full p-3 rounded-xl border border-border bg-elevated text-text text-xs focus:outline-none focus:border-brand transition-colors resize-none"
                />
                <button
                  type="submit"
                  disabled={!newNote.trim()}
                  className="w-full py-2.5 px-4 rounded-xl brand-inverse text-xs font-bold uppercase tracking-wider disabled:opacity-50"
                >
                  Save Note
                </button>
              </form>
            </div>
          ) : (
            <div className="py-16 text-center text-xs text-text opacity-70 space-y-2">
              <Users className="w-8 h-8 mx-auto text-brand opacity-60" />
              <p>Select a lead from the list to view complete contact information and log updates.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
