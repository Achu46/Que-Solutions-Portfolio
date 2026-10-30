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
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage, isFirebaseConfigured } from '../../config/firebase';
import { fallbackProjects } from '../../data/fallbackData';

const COLLECTION = 'projects';
const LOCAL_KEY = 'que_projects';

function getLocalProjects() {
  try {
    const raw = localStorage.getItem(LOCAL_KEY);
    return raw ? JSON.parse(raw) : fallbackProjects;
  } catch (e) {
    return fallbackProjects;
  }
}

export async function getProjects() {
  if (!isFirebaseConfigured) return getLocalProjects();

  try {
    const q = query(collection(db, COLLECTION), orderBy('order', 'asc'));
    const snap = await getDocs(q);
    if (!snap.empty) {
      return snap.docs.map(d => ({ id: d.id, ...d.data() }));
    }
    return fallbackProjects;
  } catch (e) {
    console.warn("Using fallback projects:", e.message);
    return fallbackProjects;
  }
}

export function subscribeToProjects(callback) {
  if (!isFirebaseConfigured) {
    callback(getLocalProjects());
    const handler = (e) => {
      if (e.key === LOCAL_KEY) callback(getLocalProjects());
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
      callback(fallbackProjects);
    }
  }, (err) => {
    console.warn("Projects subscription error:", err.message);
    callback(fallbackProjects);
  });
}

export async function saveProject(project) {
  const id = project.id || `proj_${Date.now()}`;
  const payload = {
    ...project,
    id,
    order: Number(project.order) || 1,
    isPublished: project.isPublished !== undefined ? project.isPublished : true,
    techStack: Array.isArray(project.techStack) ? project.techStack : (project.techStack || '').split(',').map(s => s.trim()).filter(Boolean),
    features: Array.isArray(project.features) ? project.features : (project.features || '').split('\n').map(s => s.trim()).filter(Boolean),
    images: Array.isArray(project.images) ? project.images : [],
  };

  if (!isFirebaseConfigured) {
    const list = getLocalProjects();
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

export async function deleteProject(id) {
  if (!isFirebaseConfigured) {
    const list = getLocalProjects().filter(p => p.id !== id);
    localStorage.setItem(LOCAL_KEY, JSON.stringify(list));
    return;
  }

  await deleteDoc(doc(db, COLLECTION, id));
}

export async function uploadProjectImage(projectId, file) {
  if (!file) throw new Error("No file provided");
  if (!file.type.startsWith('image/')) throw new Error("Only image files are allowed");
  if (file.size > 5 * 1024 * 1024) throw new Error("Image must be smaller than 5 MB");

  if (!isFirebaseConfigured) {
    // Generate object URL for preview in offline/local mode
    return URL.createObjectURL(file);
  }

  const storageRef = ref(storage, `projects/${projectId}/${Date.now()}_${file.name}`);
  const snapshot = await uploadBytes(storageRef, file);
  return await getDownloadURL(snapshot.ref);
}
