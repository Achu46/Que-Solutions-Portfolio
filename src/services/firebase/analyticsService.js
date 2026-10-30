import { logEvent } from 'firebase/analytics';
import { analytics } from '../../config/firebase';

const CONSENT_KEY = 'que_analytics_consent';

export function hasAnalyticsConsent() {
  if (typeof window === 'undefined') return false;
  // Respect Do Not Track
  if (navigator.doNotTrack === '1' || window.doNotTrack === '1') {
    return false;
  }
  return localStorage.getItem(CONSENT_KEY) === 'granted';
}

export function setAnalyticsConsent(granted) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(CONSENT_KEY, granted ? 'granted' : 'denied');
}

export function isConsentBannerNeeded() {
  if (typeof window === 'undefined') return false;
  if (navigator.doNotTrack === '1' || window.doNotTrack === '1') return false;
  return localStorage.getItem(CONSENT_KEY) === null;
}

export function trackEvent(eventName, params = {}) {
  if (!hasAnalyticsConsent()) return;
  try {
    if (analytics) {
      logEvent(analytics, eventName, params);
    } else {
      // In development or when measurement id not set
      if (import.meta.env.DEV) {
        console.debug(`[Analytics Event] ${eventName}:`, params);
      }
    }
  } catch (e) {
    // Analytics should never throw to user
  }
}
