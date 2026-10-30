import { 
  collection, 
  getDocs, 
  onSnapshot, 
  doc, 
  setDoc, 
  deleteDoc, 
  query, 
  orderBy 
} from 'firebase/firestore';
import { db, isFirebaseConfigured } from '../../config/firebase';
import { fallbackServices } from '../../data/fallbackData';

const COLLECTION = 'services';
const LOCAL_KEY = 'que_services';

function getLocalServices() {
  try {
    const raw = localStorage.getItem(LOCAL_KEY);
    return raw ? JSON.parse(raw) : fallbackServices;
  } catch (e) {
    return fallbackServices;
  }
}

export async function getServices() {
  if (!isFirebaseConfigured) return getLocalServices();

  try {
    const q = query(collection(db, COLLECTION), orderBy('order', 'asc'));
    const snap = await getDocs(q);
    if (!snap.empty) {
      return snap.docs.map(d => ({ id: d.id, ...d.data() }));
    }
    return fallbackServices;
  } catch (e) {
    console.warn("Using fallback services:", e.message);
    return fallbackServices;
  }
}

export function subscribeToServices(callback) {
  if (!isFirebaseConfigured) {
    callback(getLocalServices());
    const handler = (e) => {
      if (e.key === LOCAL_KEY) callback(getLocalServices());
    };
    window.addEventListener('storage', handler);
    return () => window.removeEventListener('storage', handler);
  }

  const q = query(collection(db, COLLECTION), orderBy('order', 'asc'));
  return onSnapshot(q, (snap) => {
    if (!snap.empty) {
      const items = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      callback(items);
    } else {
      callback(fallbackServices);
    }
  }, (err) => {
    console.warn("Services subscription error:", err.message);
    callback(fallbackServices);
  });
}

export async function saveService(service) {
  const id = service.id || `service_${Date.now()}`;
  const payload = { ...service, id };

  if (!isFirebaseConfigured) {
    const list = getLocalServices();
    const idx = list.findIndex(s => s.id === id);
    if (idx !== -1) list[idx] = payload;
    else list.push(payload);
    localStorage.setItem(LOCAL_KEY, JSON.stringify(list));
    return payload;
  }

  const docRef = doc(db, COLLECTION, id);
  await setDoc(docRef, payload, { merge: true });
  return payload;
}

export async function deleteService(id) {
  if (!isFirebaseConfigured) {
    const list = getLocalServices().filter(s => s.id !== id);
    localStorage.setItem(LOCAL_KEY, JSON.stringify(list));
    return;
  }

  await deleteDoc(doc(db, COLLECTION, id));
}
