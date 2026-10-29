import React, { useState, useEffect } from 'react';
import { 
  Settings, 
  Lock, 
  ToggleLeft, 
  ToggleRight, 
  Save, 
  CheckCircle2, 
  AlertCircle, 
  Phone, 
  Mail, 
  MapPin, 
  Clock 
} from 'lucide-react';
import { api, FALLBACK_SITE_DATA } from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState(FALLBACK_SITE_DATA.settings);
  const [loading, setLoading] = useState(true);
  const [savingSettings, setSavingSettings] = useState(false);
  const [settingsSuccess, setSettingsSuccess] = useState('');
  
  // Password change state
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [changingPass, setChangingPass] = useState(false);
  const [passSuccess, setPassSuccess] = useState('');
  const [passError, setPassError] = useState('');

  const { changeAdminPassword } = useAuth();

  useEffect(() => {
    async function load() {
      try {
        const data = await api.getSiteData();
        if (data?.settings) {
          setSettings(data.settings);
        }
      } catch (err) {
        console.warn('[Settings Load Error]:', err.message);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const handleSaveSettings = async (e) => {
    e.preventDefault();
    setSavingSettings(true);
    setSettingsSuccess('');
    try {
      await api.updateSettings(settings);
      setSettingsSuccess('Site settings saved to Firestore successfully');
      setTimeout(() => setSettingsSuccess(''), 3000);
    } catch (err) {
      alert('Error saving settings: ' + err.message);
    } finally {
      setSavingSettings(false);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setPassError('');
    setPassSuccess('');

    if (newPassword.length < 8) {
      setPassError('Password must be at least 8 characters long.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setPassError('Passwords do not match.');
      return;
    }

    setChangingPass(true);
    try {
      await changeAdminPassword(newPassword);
      setPassSuccess('Administrator password updated successfully via Firebase Auth.');
      setNewPassword('');
      setConfirmPassword('');
      setTimeout(() => setPassSuccess(''), 4000);
    } catch (err) {
      setPassError(err.message);
    } finally {
      setChangingPass(false);
    }
  };

  return (
    <div className="space-y-8 animate-fadeIn max-w-4xl">
      <div>
        <h1 className="text-2xl font-bold text-text tracking-tight">System & Security Settings</h1>
        <p className="text-xs text-text opacity-70 mt-1">
          Configure company contact information, feature cards, and administrator security.
        </p>
      </div>

      {/* Section 1: Official Company Contact Settings */}
      <div className="rounded-3xl border border-border bg-surface p-8 shadow-soft space-y-6">
        <div className="flex items-center justify-between border-b border-border pb-4">
          <h2 className="text-lg font-bold text-text">Company Information</h2>
          {settingsSuccess && (
            <span className="text-xs text-brand font-semibold flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4" />
              <span>{settingsSuccess}</span>
            </span>
          )}
        </div>

        <form onSubmit={handleSaveSettings} className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-text">Company Name</label>
              <input
                type="text"
                value={settings.site_name || 'QUE SOLUTIONS'}
                onChange={(e) => setSettings(p => ({ ...p, site_name: e.target.value }))}
                className="w-full px-4 py-3 rounded-xl border border-border bg-elevated text-text text-sm focus:outline-none focus:border-brand"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-text">Tagline</label>
              <input
                type="text"
                value={settings.tagline || 'Customer Care & Call Centre Services'}
                onChange={(e) => setSettings(p => ({ ...p, tagline: e.target.value }))}
                className="w-full px-4 py-3 rounded-xl border border-border bg-elevated text-text text-sm focus:outline-none focus:border-brand"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-text">Official Phone Number</label>
              <input
                type="text"
                value={settings.phone || '7092490337'}
                onChange={(e) => setSettings(p => ({ ...p, phone: e.target.value }))}
                className="w-full px-4 py-3 rounded-xl border border-border bg-elevated text-text text-sm focus:outline-none focus:border-brand"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-text">Official Support Email</label>
              <input
                type="email"
                value={settings.email || 'que.solutions.services@gmail.com'}
                onChange={(e) => setSettings(p => ({ ...p, email: e.target.value }))}
                className="w-full px-4 py-3 rounded-xl border border-border bg-elevated text-text text-sm focus:outline-none focus:border-brand"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-text">Operating Location</label>
              <input
                type="text"
                value={settings.location || 'Erode, Tamil Nadu'}
                onChange={(e) => setSettings(p => ({ ...p, location: e.target.value }))}
                className="w-full px-4 py-3 rounded-xl border border-border bg-elevated text-text text-sm focus:outline-none focus:border-brand"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-text">Support Operating Schedule</label>
              <input
                type="text"
                value={settings.working_hours || 'Mon – Sat: 4 hrs/day (~104 hrs/mo)'}
                onChange={(e) => setSettings(p => ({ ...p, working_hours: e.target.value }))}
                className="w-full px-4 py-3 rounded-xl border border-border bg-elevated text-text text-sm focus:outline-none focus:border-brand"
              />
            </div>
          </div>

          {/* Product Feature Toggles */}
          <div className="pt-4 border-t border-border space-y-4">
            <h3 className="text-sm font-bold text-text">Feature Visibility Toggles</h3>
            
            <div className="flex items-center justify-between p-4 rounded-xl bg-elevated border border-border">
              <div>
                <div className="text-xs font-bold text-text">Show HRMS Coming Soon Card</div>
                <div className="text-[11px] text-text opacity-70">Displays planned HRMS platform card in product section</div>
              </div>
              <button
                type="button"
                onClick={() => setSettings(p => ({ ...p, show_hrms_card: !p.show_hrms_card }))}
                className="text-brand p-1"
              >
                {settings.show_hrms_card !== false ? (
                  <ToggleRight className="w-8 h-8 text-brand" />
                ) : (
                  <ToggleLeft className="w-8 h-8 opacity-40 text-text" />
                )}
              </button>
            </div>

            <div className="flex items-center justify-between p-4 rounded-xl bg-elevated border border-border">
              <div>
                <div className="text-xs font-bold text-text">Show Arabic ERP Coming Soon Card</div>
                <div className="text-[11px] text-text opacity-70">Displays bilingual regional ERP platform card in product section</div>
              </div>
              <button
                type="button"
                onClick={() => setSettings(p => ({ ...p, show_arabic_erp_card: !p.show_arabic_erp_card }))}
                className="text-brand p-1"
              >
                {settings.show_arabic_erp_card !== false ? (
                  <ToggleRight className="w-8 h-8 text-brand" />
                ) : (
                  <ToggleLeft className="w-8 h-8 opacity-40 text-text" />
                )}
              </button>
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={savingSettings}
              className="brand-inverse inline-flex items-center gap-2 px-6 py-3 rounded-xl text-xs font-bold uppercase tracking-wider shadow-sm hover:opacity-95"
            >
              <Save className="w-4 h-4" />
              <span>{savingSettings ? 'Saving Settings...' : 'Save Site Settings'}</span>
            </button>
          </div>
        </form>
      </div>

      {/* Section 2: Administrator Password Update */}
      <div className="rounded-3xl border border-border bg-surface p-8 shadow-soft space-y-6">
        <div className="border-b border-border pb-4">
          <h2 className="text-lg font-bold text-text">Change Administrator Password</h2>
          <p className="text-xs text-text opacity-70 mt-0.5">
            Update your Firebase Authentication administrator credentials.
          </p>
        </div>

        {passSuccess && (
          <div className="p-3.5 rounded-xl bg-brand/10 border border-brand text-xs text-text flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-brand" />
            <span>{passSuccess}</span>
          </div>
        )}

        {passError && (
          <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500 text-xs text-text flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-500" />
            <span>{passError}</span>
          </div>
        )}

        <form onSubmit={handlePasswordChange} className="space-y-4 max-w-md">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-text">New Secure Password</label>
            <input
              type="password"
              required
              minLength={8}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Minimum 8 characters"
              className="w-full px-4 py-3 rounded-xl border border-border bg-elevated text-text text-sm focus:outline-none focus:border-brand"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-text">Confirm New Password</label>
            <input
              type="password"
              required
              minLength={8}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Re-enter password"
              className="w-full px-4 py-3 rounded-xl border border-border bg-elevated text-text text-sm focus:outline-none focus:border-brand"
            />
          </div>

          <button
            type="submit"
            disabled={changingPass}
            className="brand-inverse inline-flex items-center gap-2 px-6 py-3 rounded-xl text-xs font-bold uppercase tracking-wider shadow-sm hover:opacity-95"
          >
            <Lock className="w-4 h-4" />
            <span>{changingPass ? 'Updating...' : 'Update Password'}</span>
          </button>
        </form>
      </div>
    </div>
  );
}
