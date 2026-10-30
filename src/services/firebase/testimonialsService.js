import { 
  collection, 
  getDocs, 
  onSnapshot, 
  doc, 
  setDoc, 
  deleteDoc, 
  query, 
  where 
} from 'firebase/firestore';
import { db, isFirebaseConfigured } from '../../config/firebase';
import { fallbackTestimonials } from '../../data/fallbackData';

const COLLECTION = 'testimonials';
const LOCAL_KEY = 'que_testimonials';

function getLocalTestimonials() {
  try {
    const raw = localStorage.getItem(LOCAL_KEY);
    return raw ? JSON.parse(raw) : fallbackTestimonials;
  } catch (e) {
    return fallbackTestimonials;
  }
}

export async function getTestimonials() {
  if (!isFirebaseConfigured) return getLocalTestimonials();

  try {
    const q = query(collection(db, COLLECTION), where('isPublished', '==', true));
    const snap = await getDocs(q);
    if (!snap.empty) {
      return snap.docs.map(d => ({ id: d.id, ...d.data() }));
    }
    return fallbackTestimonials;
  } catch (e) {
    console.warn("Using fallback testimonials:", e.message);
    return fallbackTestimonials;
  }
}

export function subscribeToTestimonials(callback) {
  if (!isFirebaseConfigured) {
    callback(getLocalTestimonials());
    const handler = (e) => {
      if (e.key === LOCAL_KEY) callback(getLocalTestimonials());
    };
    window.addEventListener('storage', handler);
    return () => window.removeEventListener('storage', handler);
  }

  const q = collection(db, COLLECTION);
  return onSnapshot(q, (snap) => {
    if (!snap.empty) {
      const items = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      callback(items);
    } else {
      callback(fallbackTestimonials);
    }
  }, (err) => {
    console.warn("Testimonials subscription error:", err.message);
    callback(fallbackTestimonials);
  });
}

export async function saveTestimonial(testimonial) {
  const id = testimonial.id || `testi_${Date.now()}`;
  const payload = {
    ...testimonial,
    id,
    rating: Number(testimonial.rating) || 5,
    isPublished: Boolean(testimonial.isPublished),
  };

  if (!isFirebaseConfigured) {
    const list = getLocalTestimonials();
    const idx = list.findIndex(t => t.id === id);
    if (idx !== -1) list[idx] = payload;
    else list.push(payload);
    localStorage.setItem(LOCAL_KEY, JSON.stringify(list));
    return payload;
  }

  const docRef = doc(db, COLLECTION, id);
  await setDoc(docRef, payload, { merge: true });
  return payload;
}

export async function deleteTestimonial(id) {
  if (!isFirebaseConfigured) {
    const list = getLocalTestimonials().filter(t => t.id !== id);
    localStorage.setItem(LOCAL_KEY, JSON.stringify(list));
    return;
  }

  await deleteDoc(doc(db, COLLECTION, id));
}
