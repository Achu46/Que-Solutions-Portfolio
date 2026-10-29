import React, { useState, useEffect } from 'react';
import { 
  FileEdit, 
  Sparkles, 
  DollarSign, 
  HelpCircle, 
  Users, 
  Package, 
  FolderGit2, 
  MessageSquareQuote, 
  Save, 
  CheckCircle2, 
  AlertCircle,
  Plus,
  Trash2
} from 'lucide-react';
import { api, FALLBACK_SITE_DATA } from '../services/api';

export default function AdminCMSPage() {
  const [activeTab, setActiveTab] = useState('hero');
  const [siteData, setSiteData] = useState(FALLBACK_SITE_DATA);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // CMS state models
  const [heroForm, setHeroForm] = useState(FALLBACK_SITE_DATA.hero);
  const [aboutForm, setAboutForm] = useState(FALLBACK_SITE_DATA.about);
  const [servicesList, setServicesList] = useState(FALLBACK_SITE_DATA.services);
  const [pricingList, setPricingList] = useState(FALLBACK_SITE_DATA.pricing);
  const [productsList, setProductsList] = useState(FALLBACK_SITE_DATA.products);

  useEffect(() => {
    async function loadCMS() {
      try {
        const data = await api.getSiteData();
        if (data) {
          setSiteData(data);
          if (data.hero) setHeroForm(data.hero);
          if (data.about) setAboutForm(data.about);
          if (data.services) setServicesList(data.services);
          if (data.pricing) setPricingList(data.pricing);
          if (data.products) setProductsList(data.products);
        }
      } catch (err) {
        console.warn('[CMS Load Error]:', err.message);
      } finally {
        setLoading(false);
      }
    }
    loadCMS();
  }, []);

  const handleSaveHero = async (e) => {
    e.preventDefault();
    setSaving(true);
    setStatusMessage('');
    try {
      await api.updateHero(heroForm);
      setStatusMessage('Hero section updated in Firestore');
      setTimeout(() => setStatusMessage(''), 3000);
    } catch (err) {
      setErrorMessage(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleSaveAbout = async (e) => {
    e.preventDefault();
    setSaving(true);
    setStatusMessage('');
    try {
      await api.updateAbout(aboutForm);
      setStatusMessage('About section updated in Firestore');
      setTimeout(() => setStatusMessage(''), 3000);
    } catch (err) {
      setErrorMessage(err.message);
    } finally {
      setSaving(false);
    }
  };

  const tabs = [
    { id: 'hero', label: 'Hero Content', icon: Sparkles },
    { id: 'about', label: 'About & Scope', icon: FileEdit },
    { id: 'services', label: 'Services (3)', icon: Users },
    { id: 'pricing', label: 'Pricing Plans (3)', icon: DollarSign },
    { id: 'products', label: 'Products & CRM', icon: Package },
  ];

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-text tracking-tight">Website CMS Management</h1>
        <p className="text-xs text-text opacity-70 mt-1">
          Manage live content and product details stored in Cloud Firestore.
        </p>
      </div>

      {statusMessage && (
        <div className="p-3.5 rounded-xl bg-brand/10 border border-brand text-xs text-text flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-brand" />
          <span>{statusMessage}</span>
        </div>
      )}

      {errorMessage && (
        <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500 text-xs text-text flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-red-500" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-border pb-3">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => { setActiveTab(tab.id); setErrorMessage(''); setStatusMessage(''); }}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
                isActive
                  ? 'brand-inverse shadow-sm'
                  : 'bg-surface hover:bg-hover border border-border text-text'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab Panels */}
      <div className="rounded-3xl border border-border bg-surface p-8 shadow-soft">
        
        {/* HERO TAB */}
        {activeTab === 'hero' && (
          <form onSubmit={handleSaveHero} className="space-y-6 max-w-3xl">
            <h2 className="text-lg font-bold text-text">Edit Hero Section</h2>
            
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-text">Top Badge Slogan</label>
              <input
                type="text"
                value={heroForm.badge_text || ''}
                onChange={(e) => setHeroForm(p => ({ ...p, badge_text: e.target.value }))}
                className="w-full px-4 py-3 rounded-xl border border-border bg-elevated text-text text-sm focus:outline-none focus:border-brand"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-text">Main Headline</label>
              <input
                type="text"
                value={heroForm.headline || ''}
                onChange={(e) => setHeroForm(p => ({ ...p, headline: e.target.value }))}
                className="w-full px-4 py-3 rounded-xl border border-border bg-elevated text-text text-sm focus:outline-none focus:border-brand"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-text">Subheadline Description</label>
              <textarea
                rows={3}
                value={heroForm.subheadline || ''}
                onChange={(e) => setHeroForm(p => ({ ...p, subheadline: e.target.value }))}
                className="w-full px-4 py-3 rounded-xl border border-border bg-elevated text-text text-sm focus:outline-none focus:border-brand resize-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-text">Primary CTA Text</label>
                <input
                  type="text"
                  value={heroForm.primary_cta_text || ''}
                  onChange={(e) => setHeroForm(p => ({ ...p, primary_cta_text: e.target.value }))}
                  className="w-full px-4 py-3 rounded-xl border border-border bg-elevated text-text text-sm focus:outline-none focus:border-brand"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-text">Secondary CTA Text</label>
                <input
                  type="text"
                  value={heroForm.secondary_cta_text || ''}
                  onChange={(e) => setHeroForm(p => ({ ...p, secondary_cta_text: e.target.value }))}
                  className="w-full px-4 py-3 rounded-xl border border-border bg-elevated text-text text-sm focus:outline-none focus:border-brand"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={saving}
              className="brand-inverse inline-flex items-center gap-2 px-6 py-3 rounded-xl text-xs font-bold uppercase tracking-wider shadow-sm hover:opacity-95"
            >
              <Save className="w-4 h-4" />
              <span>{saving ? 'Saving...' : 'Save Hero Changes'}</span>
            </button>
          </form>
        )}

        {/* ABOUT TAB */}
        {activeTab === 'about' && (
          <form onSubmit={handleSaveAbout} className="space-y-6 max-w-3xl">
            <h2 className="text-lg font-bold text-text">Edit About & Vision</h2>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-text">Headline</label>
              <input
                type="text"
                value={aboutForm.headline || ''}
                onChange={(e) => setAboutForm(p => ({ ...p, headline: e.target.value }))}
                className="w-full px-4 py-3 rounded-xl border border-border bg-elevated text-text text-sm focus:outline-none focus:border-brand"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-text">Company Overview Description</label>
              <textarea
                rows={3}
                value={aboutForm.description || ''}
                onChange={(e) => setAboutForm(p => ({ ...p, description: e.target.value }))}
                className="w-full px-4 py-3 rounded-xl border border-border bg-elevated text-text text-sm focus:outline-none focus:border-brand resize-none"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-text">Strategic Vision Statement</label>
              <textarea
                rows={3}
                value={aboutForm.vision || ''}
                onChange={(e) => setAboutForm(p => ({ ...p, vision: e.target.value }))}
                className="w-full px-4 py-3 rounded-xl border border-border bg-elevated text-text text-sm focus:outline-none focus:border-brand resize-none"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-text">Future Scope & Technology Capability</label>
              <textarea
                rows={3}
                value={aboutForm.future_scope || ''}
                onChange={(e) => setAboutForm(p => ({ ...p, future_scope: e.target.value }))}
                className="w-full px-4 py-3 rounded-xl border border-border bg-elevated text-text text-sm focus:outline-none focus:border-brand resize-none"
              />
            </div>

            <button
              type="submit"
              disabled={saving}
              className="brand-inverse inline-flex items-center gap-2 px-6 py-3 rounded-xl text-xs font-bold uppercase tracking-wider shadow-sm hover:opacity-95"
            >
              <Save className="w-4 h-4" />
              <span>{saving ? 'Saving...' : 'Save About Changes'}</span>
            </button>
          </form>
        )}

        {/* SERVICES TAB */}
        {activeTab === 'services' && (
          <div className="space-y-6">
            <h2 className="text-lg font-bold text-text">Managed Support Services</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {servicesList.map((srv) => (
                <div key={srv.id} className="p-6 rounded-2xl border border-border bg-elevated space-y-3">
                  <div className="text-xs font-mono text-brand font-bold uppercase">Service #{srv.order || srv.id}</div>
                  <h3 className="text-base font-bold text-text">{srv.title}</h3>
                  <p className="text-xs text-text opacity-80">{srv.description}</p>
                  <div className="text-[11px] text-brand font-semibold pt-2">Active on public site</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* PRICING TAB */}
        {activeTab === 'pricing' && (
          <div className="space-y-6">
            <h2 className="text-lg font-bold text-text">Managed Subscription Retainers</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {pricingList.map((plan) => (
                <div key={plan.id} className="p-6 rounded-2xl border border-border bg-elevated space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-text">{plan.name}</span>
                    <span className="text-sm font-extrabold text-brand">{plan.price}</span>
                  </div>
                  <p className="text-xs text-text opacity-80">{plan.hours_desc}</p>
                  <p className="text-xs text-text opacity-70">{plan.includes_summary}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* PRODUCTS TAB */}
        {activeTab === 'products' && (
          <div className="space-y-6">
            <h2 className="text-lg font-bold text-text">Products & SaaS Showcase</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {productsList.map((prod) => (
                <div key={prod.id} className="p-6 rounded-2xl border border-border bg-elevated space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-text">{prod.name}</span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      prod.status === 'live' ? 'bg-brand/10 text-brand border border-brand/30' : 'bg-surface text-text border border-border'
                    }`}>
                      {prod.status}
                    </span>
                  </div>
                  <p className="text-xs text-brand font-medium">{prod.tagline}</p>
                  <p className="text-xs text-text opacity-80">{prod.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
