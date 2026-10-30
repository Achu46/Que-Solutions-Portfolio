import React, { useState, useEffect } from 'react';
import { Plus, Edit3, Trash2, Star, Eye, EyeOff, X, ShieldAlert } from 'lucide-react';
import { subscribeToTestimonials, saveTestimonial, deleteTestimonial } from '../../services/firebase/testimonialsService';

export default function AdminTestimonials() {
  const [testimonials, setTestimonials] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [currentTestimonial, setCurrentTestimonial] = useState(null);

  useEffect(() => {
    const unsub = subscribeToTestimonials((data) => {
      setTestimonials(data || []);
    });
    return () => unsub();
  }, []);

  const handleOpenNew = () => {
    setCurrentTestimonial({
      id: '',
      name: '',
      company: '',
      quote: '',
      rating: 5,
      isPublished: true,
    });
    setIsEditing(true);
  };

  const handleOpenEdit = (t) => {
    setCurrentTestimonial({ ...t });
    setIsEditing(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!currentTestimonial.name || !currentTestimonial.quote) return;

    await saveTestimonial(currentTestimonial);
    setIsEditing(false);
    setCurrentTestimonial(null);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this testimonial?")) {
      await deleteTestimonial(id);
    }
  };

  const handleTogglePublish = async (t) => {
    await saveTestimonial({ ...t, isPublished: !t.isPublished });
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-text tracking-tight">
            Client Testimonials Management
          </h1>
          <p className="text-xs sm:text-sm text-text/70 mt-1">
            Publish authentic client reviews and partner feedback. (Zero fabricated reviews allowed).
          </p>
        </div>

        <button
          type="button"
          onClick={handleOpenNew}
          className="brand-inverse inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold shadow-sm hover:bg-brand-deep transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Add Real Testimonial</span>
        </button>
      </div>

      {/* Anti-fabrication compliance reminder */}
      <div className="p-4 rounded-card border border-brand/30 bg-surface flex items-start gap-3 text-xs">
        <ShieldAlert className="w-5 h-5 text-brand flex-shrink-0 mt-0.5" />
        <div className="space-y-1">
          <span className="font-bold text-text">Company Integrity Compliance:</span>
          <p className="text-text/80">
            Per company guidelines, the public testimonial section is automatically hidden on the website until real client testimonials are added here and published.
          </p>
        </div>
      </div>

      {testimonials.length === 0 ? (
        <div className="p-12 text-center rounded-card border border-border bg-surface space-y-3">
          <p className="text-sm font-semibold text-text">No Client Reviews Yet</p>
          <p className="text-xs text-text/60 max-w-md mx-auto">
            Once you receive verified feedback from D2C and e-commerce partners, add them here to display them on the homepage.
          </p>
          <button
            type="button"
            onClick={handleOpenNew}
            className="brand-inverse px-4 py-2 rounded-xl text-xs font-semibold mt-2"
          >
            Add First Review
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((t) => (
            <div
              key={t.id}
              className="p-6 rounded-card border border-border bg-surface flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1 text-amber-500">
                    {Array.from({ length: t.rating || 5 }).map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-current" />
                    ))}
                  </div>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                    t.isPublished 
                      ? 'border-green-500/30 text-green-400 bg-green-950/20' 
                      : 'border-border text-text/60 bg-elevated'
                  }`}>
                    {t.isPublished ? 'PUBLISHED' : 'DRAFT'}
                  </span>
                </div>

                <p className="text-xs text-text/90 italic leading-relaxed">
                  "{t.quote}"
                </p>

                <div className="pt-2">
                  <div className="font-bold text-xs text-text">{t.name}</div>
                  <div className="text-[11px] text-brand">{t.company}</div>
                </div>
              </div>

              <div className="pt-4 border-t border-border flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => handleTogglePublish(t)}
                  className="text-xs text-text/70 hover:text-text font-medium"
                >
                  {t.isPublished ? 'Unpublish' : 'Publish'}
                </button>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleOpenEdit(t)}
                    className="p-1.5 rounded-lg border border-border bg-elevated hover:bg-hover text-text"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(t.id)}
                    className="p-1.5 rounded-lg border border-border bg-elevated hover:bg-red-500/10 hover:border-red-500/30 text-text hover:text-red-400"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {isEditing && currentTestimonial && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="max-w-lg w-full bg-surface border border-border rounded-card p-6 sm:p-8 space-y-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-border pb-4">
              <h2 className="font-bold text-lg text-text">
                {currentTestimonial.id ? 'Edit Testimonial' : 'Add Authentic Testimonial'}
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
                  <label className="text-xs font-semibold text-text">Client Contact Name *</label>
                  <input
                    type="text"
                    required
                    value={currentTestimonial.name}
                    onChange={(e) => setCurrentTestimonial({ ...currentTestimonial, name: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-border bg-elevated text-xs"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-text">Company / Brand *</label>
                  <input
                    type="text"
                    required
                    value={currentTestimonial.company}
                    onChange={(e) => setCurrentTestimonial({ ...currentTestimonial, company: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-border bg-elevated text-xs"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-text">Rating (1 to 5 Stars)</label>
                <select
                  value={currentTestimonial.rating}
                  onChange={(e) => setCurrentTestimonial({ ...currentTestimonial, rating: Number(e.target.value) })}
                  className="w-full px-3 py-2 rounded-xl border border-border bg-elevated text-xs"
                >
                  <option value={5}>⭐⭐⭐⭐⭐ (5 Stars)</option>
                  <option value={4}>⭐⭐⭐⭐ (4 Stars)</option>
                  <option value={3}>⭐⭐⭐ (3 Stars)</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-text">Review Quote *</label>
                <textarea
                  rows={4}
                  required
                  value={currentTestimonial.quote}
                  onChange={(e) => setCurrentTestimonial({ ...currentTestimonial, quote: e.target.value })}
                  placeholder="Enter the authentic feedback received from the client..."
                  className="w-full px-3 py-2 rounded-xl border border-border bg-elevated text-xs"
                />
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-border">
                <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-text">
                  <input
                    type="checkbox"
                    checked={currentTestimonial.isPublished}
                    onChange={(e) => setCurrentTestimonial({ ...currentTestimonial, isPublished: e.target.checked })}
                    className="rounded border-border"
                  />
                  <span>Published to website</span>
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
                    Save Review
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
