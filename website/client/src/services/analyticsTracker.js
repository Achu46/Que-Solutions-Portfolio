import { api } from './api';

function getOrCreateSessionId() {
  let sessionId = sessionStorage.getItem('que_session_id');
  if (!sessionId) {
    sessionId = 'qs_' + Math.random().toString(36).substring(2, 15) + Date.now().toString(36);
    sessionStorage.setItem('que_session_id', sessionId);
  }
  return sessionId;
}

export function trackCurrentPage() {
  // Respect Do Not Track
  if (navigator.doNotTrack === '1' || window.doNotTrack === '1') {
    return;
  }

  try {
    const sessionId = getOrCreateSessionId();
    const path = window.location.pathname + window.location.hash;
    const referrer = document.referrer || '';
    const userAgent = navigator.userAgent;

    // Do not track admin routes to keep analytics pure
    if (path.startsWith('/que')) {
      return;
    }

    api.trackPageView({
      sessionId,
      path,
      referrer,
      userAgent
    });
  } catch {
    // Non-blocking
  }
}
