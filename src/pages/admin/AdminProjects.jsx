import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Edit3, 
  Trash2, 
  ExternalLink, 
  Eye, 
  EyeOff, 
  Upload, 
  X, 
  Check, 
  Loader2 
} from 'lucide-react';
import { 
  subscribeToProjects, 
  saveProject, 
  deleteProject, 
  uploadProjectImage 
} from '../../services/firebase/projectsService';

export default function AdminProjects() {
  const [projects, setProjects] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [currentProject, setCurrentProject] = useState(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    const unsub = subscribeToProjects((data) => {
      setProjects(data || []);
    });
    return () => unsub();
  }, []);

  const handleOpenNew = () => {
    setCurrentProject({
      id: '',
      title: '',
      slug: '',
      category: 'SaaS Platform',
      status: 'live',
      order: projects.length + 1,
      isPublished: true,
      summary: '',
      description: '',
      techStack: 'React, Node.js, Tailwind CSS',
      features: '',
      liveUrl: '',
      images: [],
    });
    setIsEditing(true);
  };

  const handleOpenEdit = (proj) => {
    setCurrentProject({
      ...proj,
      techStack: Array.isArray(proj.techStack) ? proj.techStack.join(', ') : proj.techStack,
      features: Array.isArray(proj.features) ? proj.features.join('\n') : proj.features,
    });
    setIsEditing(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!currentProject.title) return;

    await saveProject({
      ...currentProject,
      slug: currentProject.slug || currentProject.title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
    });
    setIsEditing(false);
    setCurrentProject(null);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this project?")) {
      await deleteProject(id);
    }
  };

  const handleTogglePublish = async (proj) => {
    await saveProject({ ...proj, isPublished: !proj.isPublished });
  };

  const handleImageFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    try {
      const url = await uploadProjectImage(currentProject.id || 'draft', file);
      setCurrentProject(prev => ({
        ...prev,
        images: [...(prev.images || []), url],
      }));
    } catch (err) {
      alert(err.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-text tracking-tight">
            Projects & Products CMS
          </h1>
          <p className="text-xs sm:text-sm text-text/70 mt-1">
            Manage QueFlow CRM, company website platform, and upcoming HRMS / ERP products.
          </p>
        </div>

        <button
          type="button"
          onClick={handleOpenNew}
          className="brand-inverse inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold shadow-sm hover:bg-brand-deep transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Product</span>
        </button>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((proj) => (
          <div 
            key={proj.id}
            className="p-6 rounded-card border border-border bg-surface flex flex-col justify-between space-y-4"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between gap-2">
                <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-elevated border border-border text-brand-sage">
                  {proj.category}
                </span>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                  proj.status === 'live' 
                    ? 'bg-brand/10 border-brand text-brand' 
                    : 'bg-elevated border-border text-text/60'
                }`}>
                  {proj.status.toUpperCase()}
                </span>
              </div>

              <h2 className="text-lg font-bold text-text">
                {proj.title}
              </h2>

              <p className="text-xs text-text/80 line-clamp-2">
                {proj.summary}
              </p>

              {proj.liveUrl && (
                <a 
                  href={proj.liveUrl} 
                  target="_blank" 
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 text-[11px] text-brand hover:underline"
                >
                  <span>{proj.liveUrl}</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              )}
            </div>

            <div className="pt-4 border-t border-border flex items-center justify-between">
              <button
                type="button"
                onClick={() => handleTogglePublish(proj)}
                className={`p-1.5 rounded-lg border text-xs font-medium inline-flex items-center gap-1.5 ${
                  proj.isPublished
                    ? 'border-green-500/30 text-green-400 bg-green-950/20'
                    : 'border-border text-text/50 bg-elevated'
                }`}
              >
                {proj.isPublished ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                <span>{proj.isPublished ? 'Published' : 'Draft'}</span>
              </button>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleOpenEdit(proj)}
                  className="p-1.5 rounded-lg border border-border bg-elevated hover:bg-hover text-text"
                  title="Edit product"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(proj.id)}
                  className="p-1.5 rounded-lg border border-border bg-elevated hover:bg-red-500/10 hover:border-red-500/30 text-text hover:text-red-400"
                  title="Delete product"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Edit / Create Modal */}
      {isEditing && currentProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="max-w-2xl w-full bg-surface border border-border rounded-card p-6 sm:p-8 space-y-6 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-border pb-4">
              <h2 className="font-bold text-lg text-text">
                {currentProject.id ? 'Edit Product' : 'Create New Product'}
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
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-text">Product Title *</label>
                  <input
                    type="text"
                    required
                    value={currentProject.title}
                    onChange={(e) => setCurrentProject({ ...currentProject, title: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-border bg-elevated text-xs"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-text">Category</label>
                  <input
                    type="text"
                    value={currentProject.category}
                    onChange={(e) => setCurrentProject({ ...currentProject, category: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-border bg-elevated text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-text">Status</label>
                  <select
                    value={currentProject.status}
                    onChange={(e) => setCurrentProject({ ...currentProject, status: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-border bg-elevated text-xs"
                  >
                    <option value="live">Live</option>
                    <option value="building">Building</option>
                    <option value="coming-soon">Coming Soon</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-text">Display Order</label>
                  <input
                    type="number"
                    value={currentProject.order}
                    onChange={(e) => setCurrentProject({ ...currentProject, order: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl border border-border bg-elevated text-xs"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-text">Live URL</label>
                  <input
                    type="url"
                    value={currentProject.liveUrl}
                    onChange={(e) => setCurrentProject({ ...currentProject, liveUrl: e.target.value })}
                    placeholder="https://..."
                    className="w-full px-3 py-2 rounded-xl border border-border bg-elevated text-xs"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-text">Short Summary *</label>
                <input
                  type="text"
                  required
                  value={currentProject.summary}
                  onChange={(e) => setCurrentProject({ ...currentProject, summary: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-border bg-elevated text-xs"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-text">Full Description</label>
                <textarea
                  rows={3}
                  value={currentProject.description}
                  onChange={(e) => setCurrentProject({ ...currentProject, description: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-border bg-elevated text-xs"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-text">Tech Stack (comma separated)</label>
                <input
                  type="text"
                  value={currentProject.techStack}
                  onChange={(e) => setCurrentProject({ ...currentProject, techStack: e.target.value })}
                  placeholder="React, Node.js, PostgreSQL"
                  className="w-full px-3 py-2 rounded-xl border border-border bg-elevated text-xs"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-text">Features Checklist (one per line)</label>
                <textarea
                  rows={3}
                  value={currentProject.features}
                  onChange={(e) => setCurrentProject({ ...currentProject, features: e.target.value })}
                  placeholder="Feature 1&#10;Feature 2&#10;Feature 3"
                  className="w-full px-3 py-2 rounded-xl border border-border bg-elevated text-xs"
                />
              </div>

              {/* Image Upload Input */}
              <div className="space-y-2 pt-2 border-t border-border">
                <label className="text-xs font-semibold text-text flex items-center gap-1.5">
                  <Upload className="w-3.5 h-3.5 text-brand" />
                  <span>Upload Screenshot to Firebase Storage (image/*, &lt;= 5MB)</span>
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageFileChange}
                  className="block w-full text-xs text-text/80 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-elevated file:text-text hover:file:bg-hover"
                />
                {uploading && <div className="text-xs text-brand flex items-center gap-1"><Loader2 className="w-3 h-3 animate-spin" /> Uploading image...</div>}
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-border">
                <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-text">
                  <input
                    type="checkbox"
                    checked={currentProject.isPublished}
                    onChange={(e) => setCurrentProject({ ...currentProject, isPublished: e.target.checked })}
                    className="rounded border-border"
                  />
                  <span>Published to public website</span>
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
                    Save Changes
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
