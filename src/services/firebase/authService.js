import { 
  signInWithEmailAndPassword, 
  signOut, 
  sendPasswordResetEmail,
  onAuthStateChanged,
} from 'firebase/auth';
import { auth, isFirebaseConfigured } from '../../config/firebase';

/**
 * Signs in the admin user using Firebase Auth.
 * Generic error messaging protects against account enumeration.
 */
export async function loginAdmin(email, password) {
  if (!isFirebaseConfigured) {
    // Development demo mode when Firebase credentials are not yet set
    if (email === 'admin@quesolutions.in' && password === 'admin123') {
      const demoUser = {
        uid: 'demo-admin-uid',
        email: 'admin@quesolutions.in',
        displayName: 'QUE Administrator (Demo)',
      };
      localStorage.setItem('que_demo_admin', JSON.stringify(demoUser));
      return { user: demoUser, isAdmin: true };
    }
    throw new Error('Invalid email or password.');
  }

  try {
    const cred = await signInWithEmailAndPassword(auth, email, password);
    const idTokenResult = await cred.user.getIdTokenResult(true);
    const isAdmin = Boolean(idTokenResult.claims.admin);
    if (!isAdmin) {
      await signOut(auth);
      throw new Error('Access denied. Administrator privileges required.');
    }
    return { user: cred.user, isAdmin: true };
  } catch (error) {
    if (error.message.includes('Administrator privileges')) {
      throw error;
    }
    // Generic error message for security
    throw new Error('Invalid email or password.');
  }
}

/**
 * Signs out the current user.
 */
export async function logoutAdmin() {
  localStorage.removeItem('que_demo_admin');
  if (isFirebaseConfigured) {
    await signOut(auth);
  }
}

/**
 * Sends a password reset email.
 */
export async function resetAdminPassword(email) {
  if (!isFirebaseConfigured) {
    return true;
  }
  try {
    await sendPasswordResetEmail(auth, email);
    return true;
  } catch (error) {
    // Keep generic for security
    return true;
  }
}

/**
 * Observes auth state and verifies custom claim admin: true.
 */
export function subscribeToAuthState(callback) {
  if (!isFirebaseConfigured) {
    const saved = localStorage.getItem('que_demo_admin');
    if (saved) {
      try {
        const user = JSON.parse(saved);
        callback({ user, isAdmin: true, loading: false });
        return () => {};
      } catch (e) {}
    }
    callback({ user: null, isAdmin: false, loading: false });
    return () => {};
  }

  return onAuthStateChanged(auth, async (user) => {
    if (!user) {
      callback({ user: null, isAdmin: false, loading: false });
      return;
    }
    try {
      const tokenResult = await user.getIdTokenResult();
      const isAdmin = Boolean(tokenResult.claims.admin);
      callback({ user, isAdmin, loading: false });
    } catch (e) {
      callback({ user, isAdmin: false, loading: false });
    }
  });
}
