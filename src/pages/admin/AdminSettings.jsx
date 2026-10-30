import React, { useState, useEffect } from 'react';
import { Save, CheckCircle2, Shield, Eye, Clock, Phone, Mail, MapPin } from 'lucide-react';
import { subscribeToSiteSettings, updateSiteSettings } from '../../services/firebase/settingsService';

export default function AdminSettings() {
  const [settings, setSettings] = useState(null);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const unsub = subscribeToSiteSettings((data) => {
      setSettings(data);
    });
    return () => unsub();
  }, []);

  const handleToggleVisibility = (sectionKey) => {
    setSettings((prev) => ({
      ...prev,
      sectionVisibility: {
        ...(prev.sectionVisibility || {}),
        [sectionKey]: !prev.sectionVisibility?.[sectionKey],
      },
    }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setSavedSuccess(false);

    try {
      await updateSiteSettings(settings);
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    } catch (err) {
      alert("Error saving settings: " + err.message);
    } finally {
      setSaving(false);
    }
  };

  if (!settings) {
    return (
      <div className="flex items-center justify-center p-12">
        <div className="w-8 h-8 border-2 border-brand/30 border-t-brand rounded-full animate-spin" />
      </div>
    );
  }

  const visibility = settings.sectionVisibility || {};

  return (
    <div className="space-y-8 animate-fadeIn max-w-4xl">
      
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-text tracking-tight">
            Site Settings & Section Controls
          </h1>
          <p className="text-xs sm:text-sm text-text/70 mt-1">
            Toggle homepage sections visibility and adjust verified company contact details.
          </p>
        </div>

        {savedSuccess && (
          <div className="flex items-center gap-2 text-xs font-semibold text-green-400 bg-green-950/30 border border-green-500/30 px-3.5 py-2 rounded-xl animate-fadeIn">
            <CheckCircle2 className="w-4 h-4" />
            <span>Settings updated successfully!</span>
          </div>
        )}
      </div>

      <form onSubmit={handleSave} className="space-y-8">
        
        {/* Section Visibility Flags */}
        <div className="p-6 rounded-card border border-border bg-surface space-y-6">
          <div className="border-b border-border pb-3">
            <h2 className="text-base font-bold text-text flex items-center gap-2">
              <Eye className="w-4 h-4 text-brand" />
              <span>Section Visibility Flags</span>
            </h2>
            <p className="text-xs text-text/60 mt-0.5">
              Instantly enable or hide sections across the public website without code deployments.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { key: 'hero', label: 'Hero 3D Section' },
              { key: 'about', label: 'About Us & Pillars' },
              { key: 'services', label: '3 Services Cards' },
              { key: 'projects', label: 'Projects & Products Showcase' },
              { key: 'process', label: '4-Step Process Section' },
              { key: 'pricing', label: 'Pricing Plans (3 Plans)' },
              { key: 'whyUs', label: 'Why Us (6 Advantages)' },
              { key: 'whoWeServe', label: 'Who We Serve (5 Segments)' },
              { key: 'testimonials', label: 'Testimonials (Zero fabrication)' },
              { key: 'contact', label: 'Contact & Lead Capture Form' },
            ].map(({ key, label }) => {
              const isActive = Boolean(visibility[key]);
              return (
                <div
                  key={key}
                  onClick={() => handleToggleVisibility(key)}
                  className={`p-3.5 rounded-xl border cursor-pointer transition-all flex items-center justify-between select-none ${
                    isActive 
                      ? 'border-brand bg-brand/5 text-text' 
                      : 'border-border bg-elevated text-text/50'
                  }`}
                >
                  <span className="text-xs font-semibold">{label}</span>
                  <div className={`w-8 h-4 rounded-full p-0.5 transition-colors ${
                    isActive ? 'bg-brand' : 'bg-border'
                  }`}>
                    <div className={`w-3 h-3 rounded-full bg-white transition-transform ${
                      isActive ? 'translate-x-4' : 'translate-x-0'
                    }`} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Company Contact Details */}
        <div className="p-6 rounded-card border border-border bg-surface space-y-6">
          <div className="border-b border-border pb-3">
            <h2 className="text-base font-bold text-text flex items-center gap-2">
              <Phone className="w-4 h-4 text-brand" />
              <span>Verified Company Facts & Channels</span>
            </h2>
            <p className="text-xs text-text/60 mt-0.5">
              Strictly verified data for QUE SOLUTIONS.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-text">Company Name</label>
              <input
                type="text"
                value={settings.name || 'QUE SOLUTIONS'}
                onChange={(e) => setSettings({ ...settings, name: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-border bg-elevated text-xs font-medium"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-text">Tagline</label>
              <input
                type="text"
                value={settings.tagline || 'People Today. A Brighter Tomorrow.'}
                onChange={(e) => setSettings({ ...settings, tagline: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-border bg-elevated text-xs font-medium"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-text">Phone Number</label>
              <input
                type="text"
                value={settings.phone || '7092490337'}
                onChange={(e) => setSettings({ ...settings, phone: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-border bg-elevated text-xs font-medium"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-text">Display Phone</label>
              <input
                type="text"
                value={settings.displayPhone || '+91 70924 90337'}
                onChange={(e) => setSettings({ ...settings, displayPhone: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-border bg-elevated text-xs font-medium"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-text">Contact Email</label>
              <input
                type="email"
                value={settings.email || 'que.solutions.services@gmail.com'}
                onChange={(e) => setSettings({ ...settings, email: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-border bg-elevated text-xs font-medium"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-text">Operating Hub Location</label>
              <input
                type="text"
                value={settings.location || 'Erode, Tamil Nadu'}
                onChange={(e) => setSettings({ ...settings, location: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-border bg-elevated text-xs font-medium"
              />
            </div>

            <div className="sm:col-span-2 space-y-1">
              <label className="text-xs font-semibold text-text">Operating Model Schedule</label>
              <input
                type="text"
                value={settings.hours || '4 hrs/day, Mon to Sat (~104 hrs/month)'}
                onChange={(e) => setSettings({ ...settings, hours: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-border bg-elevated text-xs font-medium"
              />
            </div>
          </div>
        </div>

        {/* Save Bar */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="brand-inverse inline-flex items-center gap-2 px-6 py-3 rounded-xl text-xs font-bold shadow-md hover:bg-brand-deep active:scale-98 transition-all disabled:opacity-60"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? 'Saving Settings...' : 'Save All Settings'}</span>
          </button>
        </div>

      </form>

    </div>
  );
}
