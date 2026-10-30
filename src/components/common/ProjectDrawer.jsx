import React, { useEffect, useRef } from 'react';
import { X, ExternalLink, CheckCircle2, Layers, Tag, ShieldCheck } from 'lucide-react';

export default function ProjectDrawer({ project, isOpen, onClose }) {
  const drawerRef = useRef(null);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  if (!isOpen || !project) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex justify-end"
      role="dialog"
      aria-modal="true"
      aria-labelledby="project-drawer-title"
    >
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity animate-fadeIn"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer Container */}
      <div 
        ref={drawerRef}
        className="relative z-10 w-full max-w-xl bg-surface border-l border-border h-full shadow-2xl overflow-y-auto p-6 sm:p-8 flex flex-col justify-between animate-slideInRight"
      >
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-border pb-4">
            <div className="flex items-center gap-2.5">
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-brand-darker text-brand-sage border border-brand/30">
                {project.category || 'Platform'}
              </span>
              <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-medium border ${
                project.status === 'live'
                  ? 'bg-brand/10 border-brand text-brand'
                  : 'bg-elevated border-border text-text/70'
              }`}>
                {project.status === 'live' ? 'Live System' : 'Coming Soon'}
              </span>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-full border border-border bg-elevated text-text hover:bg-hover focus-visible:ring-2 focus-visible:ring-brand"
              aria-label="Close project drawer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Title & Summary */}
          <div>
            <h2 id="project-drawer-title" className="text-2xl sm:text-3xl font-bold text-text tracking-tight">
              {project.title}
            </h2>
            <p className="mt-2 text-base text-brand font-medium">
              {project.summary}
            </p>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <h3 className="text-xs uppercase tracking-wider font-semibold text-text/70">
              Overview
            </h3>
            <p className="text-sm text-text/90 leading-relaxed">
              {project.description}
            </p>
          </div>

          {/* Tech Stack */}
          {project.techStack && project.techStack.length > 0 && (
            <div className="space-y-2.5">
              <h3 className="text-xs uppercase tracking-wider font-semibold text-text/70 flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-brand" />
                <span>Architecture & Technologies</span>
              </h3>
              <div className="flex flex-wrap gap-2">
                {project.techStack.map((tech) => (
                  <span 
                    key={tech} 
                    className="px-3 py-1 rounded-lg text-xs font-medium bg-elevated border border-border text-text"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Key Features */}
          {project.features && project.features.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-xs uppercase tracking-wider font-semibold text-text/70 flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-brand" />
                <span>Core Capabilities</span>
              </h3>
              <ul className="space-y-2">
                {project.features.map((feat, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-sm text-text">
                    <CheckCircle2 className="w-4 h-4 text-brand flex-shrink-0 mt-0.5" />
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="pt-8 mt-6 border-t border-border flex items-center justify-between gap-4">
          {project.liveUrl ? (
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="brand-inverse inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold shadow-md hover:bg-brand-deep transition-all w-full sm:w-auto"
            >
              <span>Visit Live Project</span>
              <ExternalLink className="w-4 h-4" />
            </a>
          ) : (
            <div className="text-xs text-text/60 italic">
              Project in private active engineering.
            </div>
          )}

          <button
            type="button"
            onClick={onClose}
            className="px-5 py-3 rounded-xl border border-border bg-elevated hover:bg-hover text-sm font-medium text-text transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
