import React, { useRef, useState } from 'react';
import { ExternalLink, ArrowRight, Sparkles } from 'lucide-react';

export default function ProjectCard3D({ project, onSelect }) {
  const cardRef = useRef(null);
  const [tilt, setTilt] = useState({ rotateX: 0, rotateY: 0, sheenX: 50, sheenY: 50 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    // Max 8 deg tilt
    const rotateY = ((x - centerX) / centerX) * 8;
    const rotateX = -((y - centerY) / centerY) * 8;

    const sheenX = (x / rect.width) * 100;
    const sheenY = (y / rect.height) * 100;

    setTilt({ rotateX, rotateY, sheenX, sheenY });
  };

  const handleMouseEnter = () => setIsHovered(true);
  const handleMouseLeave = () => {
    setIsHovered(false);
    setTilt({ rotateX: 0, rotateY: 0, sheenX: 50, sheenY: 50 });
  };

  const isLive = project.status === 'live';

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={() => onSelect(project)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onSelect(project);
        }
      }}
      className="group relative rounded-card border border-border bg-surface p-6 sm:p-8 cursor-pointer transition-all duration-200 select-none overflow-hidden focus-visible:ring-2 focus-visible:ring-brand focus-visible:outline-none"
      style={{
        transform: `perspective(1000px) rotateX(${tilt.rotateX}deg) rotateY(${tilt.rotateY}deg) scale(${isHovered ? 1.02 : 1})`,
        transformStyle: 'preserve-3d',
      }}
    >
      {/* Dynamic Sheen Overlay */}
      <div
        className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{
          background: `radial-gradient(circle at ${tilt.sheenX}% ${tilt.sheenY}%, rgba(84, 112, 63, 0.15) 0%, transparent 60%)`,
        }}
      />

      <div className="relative z-10 flex flex-col justify-between h-full space-y-6">
        <div>
          {/* Header Badges */}
          <div className="flex items-center justify-between gap-2 mb-4">
            <span className="text-xs font-semibold px-3 py-1 rounded-full bg-elevated border border-border text-brand-sage">
              {project.category || 'Platform'}
            </span>
            <span className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full border ${
              isLive
                ? 'bg-brand-darker border-brand text-brand-sage'
                : 'bg-elevated border-border text-text/60'
            }`}>
              {isLive ? 'LIVE' : 'COMING SOON'}
            </span>
          </div>

          <h3 className="text-xl sm:text-2xl font-bold text-text group-hover:text-brand transition-colors">
            {project.title}
          </h3>

          <p className="mt-3 text-sm text-text/80 line-clamp-3 leading-relaxed">
            {project.summary}
          </p>
        </div>

        <div>
          {/* Tech stack pills */}
          {project.techStack && project.techStack.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-5">
              {project.techStack.slice(0, 3).map((tech) => (
                <span
                  key={tech}
                  className="px-2 py-0.5 text-[11px] font-medium rounded bg-elevated text-text/80 border border-border"
                >
                  {tech}
                </span>
              ))}
              {project.techStack.length > 3 && (
                <span className="px-2 py-0.5 text-[11px] font-medium rounded bg-elevated text-text/60 border border-border">
                  +{project.techStack.length - 3}
                </span>
              )}
            </div>
          )}

          {/* Action Row */}
          <div className="flex items-center justify-between pt-4 border-t border-border text-xs font-semibold text-brand">
            <span className="group-hover:translate-x-1 transition-transform inline-flex items-center gap-1">
              View Details
              <ArrowRight className="w-3.5 h-3.5" />
            </span>
            {isLive && project.liveUrl && (
              <span className="text-text/60 inline-flex items-center gap-1 group-hover:text-text">
                Live URL
                <ExternalLink className="w-3 h-3" />
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
