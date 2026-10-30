import { doc, getDoc, setDoc, onSnapshot } from 'firebase/firestore';
import { db, isFirebaseConfigured } from '../../config/firebase';
import { fallbackSiteSettings } from '../../data/fallbackData';

const SETTINGS_DOC = 'siteSettings/main';
const LOCAL_KEY = 'que_site_settings';

export async function getSiteSettings() {
  if (!isFirebaseConfigured) {
    try {
      const saved = localStorage.getItem(LOCAL_KEY);
      return saved ? JSON.parse(saved) : fallbackSiteSettings;
    } catch (e) {
      return fallbackSiteSettings;
    }
  }

  try {
    const docRef = doc(db, 'siteSettings', 'main');
    const snap = await getDoc(docRef);
    if (snap.exists()) {
      return snap.data();
    }
    return fallbackSiteSettings;
  } catch (err) {
    console.warn("Using fallback site settings:", err.message);
    return fallbackSiteSettings;
  }
}

export function subscribeToSiteSettings(callback) {
  if (!isFirebaseConfigured) {
    callback(getSiteSettings());
    const handler = (e) => {
      if (e.key === LOCAL_KEY) {
        callback(JSON.parse(e.newValue || '{}'));
      }
    };
    window.addEventListener('storage', handler);
    return () => window.removeEventListener('storage', handler);
  }

  const docRef = doc(db, 'siteSettings', 'main');
  return onSnapshot(docRef, (snap) => {
    if (snap.exists()) {
      callback(snap.data());
    } else {
      callback(fallbackSiteSettings);
    }
  }, (err) => {
    console.warn("Site settings listener fallback:", err.message);
    callback(fallbackSiteSettings);
  });
}

export async function updateSiteSettings(updates) {
  if (!isFirebaseConfigured) {
    const current = await getSiteSettings();
    const updated = { ...current, ...updates };
    localStorage.setItem(LOCAL_KEY, JSON.stringify(updated));
    return updated;
  }

  const docRef = doc(db, 'siteSettings', 'main');
  await setDoc(docRef, updates, { merge: true });
}
