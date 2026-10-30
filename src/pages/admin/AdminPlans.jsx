import React, { useState, useEffect } from 'react';
import { Plus, Edit3, Trash2, Star, Check, X } from 'lucide-react';
import { subscribeToPlans, savePlan, deletePlan } from '../../services/firebase/plansService';
import { formatINR } from '../../config/constants';

export default function AdminPlans() {
  const [plans, setPlans] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [currentPlan, setCurrentPlan] = useState(null);

  useEffect(() => {
    const unsub = subscribeToPlans((data) => {
      setPlans(data || []);
    });
    return () => unsub();
  }, []);

  const handleOpenNew = () => {
    setCurrentPlan({
      id: '',
      name: '',
      price: 15999,
      billingPeriod: '/ month',
      hoursDesc: '4 hrs/day, Mon to Sat (~104 hrs/mo)',
      includesSummary: '',
      features: '',
      isRecommended: false,
      order: plans.length + 1,
      isActive: true,
    });
    setIsEditing(true);
  };

  const handleOpenEdit = (plan) => {
    setCurrentPlan({
      ...plan,
      features: Array.isArray(plan.features) ? plan.features.join('\n') : plan.features,
    });
    setIsEditing(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!currentPlan.name) return;

    await savePlan({
      ...currentPlan,
      features: (currentPlan.features || '').split('\n').map(s => s.trim()).filter(Boolean),
    });
    setIsEditing(false);
    setCurrentPlan(null);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this pricing plan?")) {
      await deletePlan(id);
    }
  };

  const handleToggleRecommended = async (plan) => {
    await savePlan({ ...plan, isRecommended: !plan.isRecommended });
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-text tracking-tight">
            Pricing Plans CMS
          </h1>
          <p className="text-xs sm:text-sm text-text/70 mt-1">
            Edit monthly pricing rates, coverage summaries, and recommended badges in real-time.
          </p>
        </div>

        <button
          type="button"
          onClick={handleOpenNew}
          className="brand-inverse inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold shadow-sm hover:bg-brand-deep transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Plan</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {plans.map((plan) => (
          <div
            key={plan.id}
            className={`p-6 rounded-card border bg-surface flex flex-col justify-between space-y-4 ${
              plan.isRecommended ? 'border-brand shadow-lg' : 'border-border'
            }`}
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-brand">
                  Order: #{plan.order || 1}
                </span>
                {plan.isRecommended && (
                  <span className="brand-inverse px-2.5 py-0.5 rounded-full text-[10px] font-bold flex items-center gap-1">
                    <Star className="w-3 h-3 fill-current" />
                    RECOMMENDED
                  </span>
                )}
              </div>

              <div>
                <h2 className="text-xl font-bold text-text">
                  {plan.name}
                </h2>
                <p className="text-xs font-medium text-brand mt-0.5">
                  {plan.includesSummary}
                </p>
              </div>

              <div className="border-y border-border py-3">
                <div className="text-2xl font-black text-text">
                  {formatINR(plan.price)} <span className="text-xs font-normal text-text/60">{plan.billingPeriod}</span>
                </div>
                <div className="text-[11px] text-text/70 mt-1">
                  {plan.hoursDesc}
                </div>
              </div>

              <ul className="text-xs text-text/80 space-y-1.5">
                {plan.features?.slice(0, 4).map((f, i) => (
                  <li key={i} className="flex items-start gap-1.5">
                    <Check className="w-3.5 h-3.5 text-brand flex-shrink-0 mt-0.5" />
                    <span className="truncate">{f}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="pt-4 border-t border-border flex items-center justify-between">
              <button
                type="button"
                onClick={() => handleToggleRecommended(plan)}
                className="text-xs text-text/70 hover:text-brand font-medium"
              >
                {plan.isRecommended ? 'Remove Badge' : 'Make Recommended'}
              </button>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleOpenEdit(plan)}
                  className="p-1.5 rounded-lg border border-border bg-elevated hover:bg-hover text-text"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(plan.id)}
                  className="p-1.5 rounded-lg border border-border bg-elevated hover:bg-red-500/10 hover:border-red-500/30 text-text hover:text-red-400"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {isEditing && currentPlan && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="max-w-xl w-full bg-surface border border-border rounded-card p-6 sm:p-8 space-y-6 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-border pb-4">
              <h2 className="font-bold text-lg text-text">
                {currentPlan.id ? 'Edit Plan' : 'Add Pricing Plan'}
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
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-text">Plan Name *</label>
                  <input
                    type="text"
                    required
                    value={currentPlan.name}
                    onChange={(e) => setCurrentPlan({ ...currentPlan, name: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-border bg-elevated text-xs"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-text">Monthly Price (INR) *</label>
                  <input
                    type="number"
                    required
                    value={currentPlan.price}
                    onChange={(e) => setCurrentPlan({ ...currentPlan, price: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl border border-border bg-elevated text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-text">Includes Summary</label>
                  <input
                    type="text"
                    value={currentPlan.includesSummary}
                    onChange={(e) => setCurrentPlan({ ...currentPlan, includesSummary: e.target.value })}
                    placeholder="e.g. Chat + Inbound"
                    className="w-full px-3 py-2 rounded-xl border border-border bg-elevated text-xs"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-text">Hours Description</label>
                  <input
                    type="text"
                    value={currentPlan.hoursDesc}
                    onChange={(e) => setCurrentPlan({ ...currentPlan, hoursDesc: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-border bg-elevated text-xs"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-text">Features Checklist (one per line)</label>
                <textarea
                  rows={4}
                  value={currentPlan.features}
                  onChange={(e) => setCurrentPlan({ ...currentPlan, features: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-border bg-elevated text-xs"
                />
              </div>

              <div className="flex items-center gap-6 pt-2">
                <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-text">
                  <input
                    type="checkbox"
                    checked={currentPlan.isRecommended}
                    onChange={(e) => setCurrentPlan({ ...currentPlan, isRecommended: e.target.checked })}
                    className="rounded border-border"
                  />
                  <span>Highlight as Recommended (Growth)</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-text">
                  <input
                    type="checkbox"
                    checked={currentPlan.isActive}
                    onChange={(e) => setCurrentPlan({ ...currentPlan, isActive: e.target.checked })}
                    className="rounded border-border"
                  />
                  <span>Active & visible</span>
                </label>
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-border">
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
                  Save Plan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
