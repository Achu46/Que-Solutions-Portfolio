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
import { fallbackPlans } from '../../data/fallbackData';

const COLLECTION = 'plans';
const LOCAL_KEY = 'que_plans';

function getLocalPlans() {
  try {
    const raw = localStorage.getItem(LOCAL_KEY);
    return raw ? JSON.parse(raw) : fallbackPlans;
  } catch (e) {
    return fallbackPlans;
  }
}

export async function getPlans() {
  if (!isFirebaseConfigured) return getLocalPlans();

  try {
    const q = query(collection(db, COLLECTION), orderBy('order', 'asc'));
    const snap = await getDocs(q);
    if (!snap.empty) {
      return snap.docs.map(d => ({ id: d.id, ...d.data() }));
    }
    return fallbackPlans;
  } catch (e) {
    console.warn("Using fallback plans:", e.message);
    return fallbackPlans;
  }
}

export function subscribeToPlans(callback) {
  if (!isFirebaseConfigured) {
    callback(getLocalPlans());
    const handler = (e) => {
      if (e.key === LOCAL_KEY) callback(getLocalPlans());
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
      callback(fallbackPlans);
    }
  }, (err) => {
    console.warn("Plans subscription error:", err.message);
    callback(fallbackPlans);
  });
}

export async function savePlan(plan) {
  const id = plan.id || `plan_${Date.now()}`;
  const payload = { 
    ...plan, 
    id,
    price: Number(plan.price) || 0,
    order: Number(plan.order) || 1,
    isActive: plan.isActive !== undefined ? plan.isActive : true,
    isRecommended: Boolean(plan.isRecommended),
  };

  if (!isFirebaseConfigured) {
    const list = getLocalPlans();
    const idx = list.findIndex(p => p.id === id);
    if (idx !== -1) list[idx] = payload;
    else list.push(payload);
    localStorage.setItem(LOCAL_KEY, JSON.stringify(list));
    return payload;
  }

  const docRef = doc(db, COLLECTION, id);
  await setDoc(docRef, payload, { merge: true });
  return payload;
}

export async function deletePlan(id) {
  if (!isFirebaseConfigured) {
    const list = getLocalPlans().filter(p => p.id !== id);
    localStorage.setItem(LOCAL_KEY, JSON.stringify(list));
    return;
  }

  await deleteDoc(doc(db, COLLECTION, id));
}
