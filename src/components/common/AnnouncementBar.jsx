import React from 'react';
import { Clock, Phone, Sparkles } from 'lucide-react';
import { CONTACT_INFO } from '../../config/constants';
import { useData } from '../../context/DataContext';

export default function AnnouncementBar() {
  const { siteSettings } = useData();
  const phone = siteSettings?.displayPhone || CONTACT_INFO.displayPhone;
  const hours = siteSettings?.hours || CONTACT_INFO.operatingHours;

  return (
    <div 
      role="region" 
      aria-label="Announcement" 
      className="w-full bg-surface border-b border-border py-2 px-4 text-xs font-medium transition-colors"
    >
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3 text-center sm:text-left">
        <div className="flex items-center gap-2 mx-auto sm:mx-0">
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-brand-darker text-brand-sage text-[11px] font-semibold tracking-wide border border-brand/30">
            <Sparkles className="w-3 h-3 text-brand-sage" />
            OPERATING MODEL
          </span>
          <span className="flex items-center gap-1 text-text">
            <Clock className="w-3.5 h-3.5 text-brand" />
            {hours}
          </span>
        </div>

        <div className="flex items-center gap-4 mx-auto sm:mx-0">
          <span className="hidden md:inline text-text/80">
            Erode, Tamil Nadu
          </span>
          <a
            href={`tel:${siteSettings?.phone || CONTACT_INFO.phone}`}
            className="flex items-center gap-1.5 text-text hover:text-brand transition-colors font-medium"
            aria-label={`Call us at ${phone}`}
          >
            <Phone className="w-3.5 h-3.5 text-brand" />
            <span>{phone}</span>
          </a>
        </div>
      </div>
    </div>
  );
}
