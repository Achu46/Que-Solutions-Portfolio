import React, { useState, useEffect } from 'react';
import { isConsentBannerNeeded, setAnalyticsConsent } from '../../services/firebase/analyticsService';

export default function ConsentBanner() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    setShow(isConsentBannerNeeded());
  }, []);

  if (!show) return null;

  const handleAccept = () => {
    setAnalyticsConsent(true);
    setShow(false);
  };

  const handleDecline = () => {
    setAnalyticsConsent(false);
    setShow(false);
  };

  return (
    <div 
      role="alert" 
      aria-live="polite"
      className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-4 sm:max-w-md z-50 p-4 rounded-xl border border-border bg-surface shadow-2xl transition-all"
    >
      <div className="flex flex-col gap-3">
        <p className="text-xs text-text leading-relaxed">
          We use minimal, privacy-conscious analytics to measure site performance and visitor interest. No personal data is sold.
        </p>
        <div className="flex items-center gap-2 justify-end">
          <button
            type="button"
            onClick={handleDecline}
            className="px-3 py-1.5 rounded-lg border border-border text-xs font-medium text-text hover:bg-hover transition-colors"
          >
            Decline
          </button>
          <button
            type="button"
            onClick={handleAccept}
            className="brand-inverse px-4 py-1.5 rounded-lg text-xs font-semibold shadow-sm hover:bg-brand-deep transition-colors"
          >
            Accept
          </button>
        </div>
      </div>
    </div>
  );
}
