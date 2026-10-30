import React, { useState } from 'react';
import { Sparkles, Layers, ChevronLeft, ChevronRight } from 'lucide-react';
import { useData } from '../../context/DataContext';
import ProjectCard3D from '../3d/ProjectCard3D';
import ProjectDrawer from '../common/ProjectDrawer';
import { trackEvent } from '../../services/firebase/analyticsService';

export default function ProjectsSection() {
  const { projects } = useData();
  const [selectedProject, setSelectedProject] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [carouselIndex, setCarouselIndex] = useState(0);

  const handleSelectProject = (project) => {
    trackEvent('project_opened', { project: project.title });
    setSelectedProject(project);
    setDrawerOpen(true);
  };

  const handleCloseDrawer = () => {
    setDrawerOpen(false);
  };

  const handlePrev = () => {
    setCarouselIndex((prev) => (prev > 0 ? prev - 1 : Math.max(0, projects.length - 1)));
  };

  const handleNext = () => {
    setCarouselIndex((prev) => (prev < projects.length - 1 ? prev + 1 : 0));
  };

  return (
    <section 
      id="projects" 
      aria-label="Products and Engineering Projects"
      className="relative w-full py-24 px-4 sm:px-6 lg:px-8 border-t border-border bg-bg transition-colors"
    >
      <div className="max-w-7xl mx-auto space-y-16">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-4 max-w-2xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface border border-border text-xs font-semibold text-brand tracking-wider uppercase">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Technology & Products</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-extrabold text-text tracking-tight">
              SaaS Solutions & Platforms
            </h2>
            <p className="text-base sm:text-lg text-text/80 leading-relaxed">
              In addition to dedicated customer care operations, QUE SOLUTIONS builds proprietary software designed to streamline enterprise lead management, HR operations, and international ERP workflows.
            </p>
          </div>

          {/* Carousel Arrows on Mobile/Tablet */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handlePrev}
              className="p-3 rounded-full border border-border bg-surface hover:bg-hover text-text transition-colors focus-visible:ring-2 focus-visible:ring-brand"
              aria-label="Previous project"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              type="button"
              onClick={handleNext}
              className="p-3 rounded-full border border-border bg-surface hover:bg-hover text-text transition-colors focus-visible:ring-2 focus-visible:ring-brand"
              aria-label="Next project"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* 3D Interactive Project Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {projects.map((project) => (
            <ProjectCard3D 
              key={project.id || project.slug}
              project={project}
              onSelect={handleSelectProject}
            />
          ))}
        </div>

        {/* Detail Slide-over Drawer */}
        <ProjectDrawer 
          project={selectedProject}
          isOpen={drawerOpen}
          onClose={handleCloseDrawer}
        />

      </div>
    </section>
  );
}
