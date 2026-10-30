import React, { useState, useEffect } from 'react';
import { Plus, Edit3, Trash2, CheckCircle2, XCircle, X } from 'lucide-react';
import { subscribeToServices, saveService, deleteService } from '../../services/firebase/servicesService';

export default function AdminServices() {
  const [services, setServices] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [currentService, setCurrentService] = useState(null);

  useEffect(() => {
    const unsub = subscribeToServices((data) => {
      setServices(data || []);
    });
    return () => unsub();
  }, []);

  const handleOpenNew = () => {
    setCurrentService({
      id: '',
      title: '',
      slug: '',
      icon: 'MessageSquare',
      shortDesc: '',
      features: '',
      order: services.length + 1,
      isActive: true,
    });
    setIsEditing(true);
  };

  const handleOpenEdit = (serv) => {
    setCurrentService({
      ...serv,
      features: Array.isArray(serv.features) ? serv.features.join('\n') : serv.features,
    });
    setIsEditing(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!currentService.title) return;

    await saveService({
      ...currentService,
      slug: currentService.slug || currentService.title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      features: (currentService.features || '').split('\n').map(s => s.trim()).filter(Boolean),
    });
    setIsEditing(false);
    setCurrentService(null);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this service?")) {
      await deleteService(id);
    }
  };

  const handleToggleActive = async (serv) => {
    await saveService({ ...serv, isActive: !serv.isActive });
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-text tracking-tight">
            Customer Care Services CMS
          </h1>
          <p className="text-xs sm:text-sm text-text/70 mt-1">
            Real-time management for Inbound, Outbound, and Omnichannel Chat services.
          </p>
        </div>

        <button
          type="button"
          onClick={handleOpenNew}
          className="brand-inverse inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold shadow-sm hover:bg-brand-deep transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Service</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {services.map((serv) => (
          <div
            key={serv.id}
            className="p-6 rounded-card border border-border bg-surface flex flex-col justify-between space-y-4"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-brand">
                  Order: #{serv.order || 1}
                </span>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                  serv.isActive 
                    ? 'border-green-500/30 text-green-400 bg-green-950/20' 
                    : 'border-border text-text/60 bg-elevated'
                }`}>
                  {serv.isActive ? 'ACTIVE' : 'INACTIVE'}
                </span>
              </div>

              <h2 className="text-xl font-bold text-text">
                {serv.title}
              </h2>

              <p className="text-xs text-text/80 line-clamp-3">
                {serv.shortDesc}
              </p>

              <div className="space-y-1 pt-2">
                <span className="text-[11px] font-semibold text-brand uppercase tracking-wider">Features ({serv.features?.length || 0}):</span>
                <ul className="text-xs text-text/70 space-y-1 list-disc list-inside">
                  {serv.features?.slice(0, 3).map((f, i) => (
                    <li key={i} className="truncate">{f}</li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="pt-4 border-t border-border flex items-center justify-between">
              <button
                type="button"
                onClick={() => handleToggleActive(serv)}
                className="text-xs text-text/70 hover:text-text font-medium"
              >
                {serv.isActive ? 'Deactivate' : 'Activate'}
              </button>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleOpenEdit(serv)}
                  className="p-1.5 rounded-lg border border-border bg-elevated hover:bg-hover text-text"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(serv.id)}
                  className="p-1.5 rounded-lg border border-border bg-elevated hover:bg-red-500/10 hover:border-red-500/30 text-text hover:text-red-400"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {isEditing && currentService && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="max-w-xl w-full bg-surface border border-border rounded-card p-6 sm:p-8 space-y-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-border pb-4">
              <h2 className="font-bold text-lg text-text">
                {currentService.id ? 'Edit Service' : 'Add Service'}
              </h2>
              <button 
                type="button" 
                onClick={() => setIsEditing(false)}
                className="p-1.5 rounded text-text/60 hover:text-text"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-text">Service Title *</label>
                <input
                  type="text"
                  required
                  value={currentService.title}
                  onChange={(e) => setCurrentService({ ...currentService, title: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-border bg-elevated text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-text">Icon Name</label>
                  <select
                    value={currentService.icon}
                    onChange={(e) => setCurrentService({ ...currentService, icon: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-border bg-elevated text-xs"
                  >
                    <option value="MessageSquare">MessageSquare (Chat)</option>
                    <option value="PhoneIncoming">PhoneIncoming (Inbound)</option>
                    <option value="PhoneOutgoing">PhoneOutgoing (Outbound)</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-text">Display Order</label>
                  <input
                    type="number"
                    value={currentService.order}
                    onChange={(e) => setCurrentService({ ...currentService, order: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl border border-border bg-elevated text-xs"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-text">Short Summary Description</label>
                <textarea
                  rows={2}
                  value={currentService.shortDesc}
                  onChange={(e) => setCurrentService({ ...currentService, shortDesc: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-border bg-elevated text-xs"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-text">Features Checklist (one per line)</label>
                <textarea
                  rows={4}
                  value={currentService.features}
                  onChange={(e) => setCurrentService({ ...currentService, features: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-border bg-elevated text-xs"
                />
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-border">
                <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-text">
                  <input
                    type="checkbox"
                    checked={currentService.isActive}
                    onChange={(e) => setCurrentService({ ...currentService, isActive: e.target.checked })}
                    className="rounded border-border"
                  />
                  <span>Active & visible on public website</span>
                </label>

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="px-4 py-2 rounded-xl border border-border text-xs text-text hover:bg-hover"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="brand-inverse px-5 py-2 rounded-xl text-xs font-semibold shadow-sm hover:bg-brand-deep"
                  >
                    Save Service
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
