import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  sendPasswordResetEmail,
  updatePassword
} from 'firebase/auth';
import { auth } from '../lib/firebase';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          // Force refresh token to get latest custom claims
          const idTokenResult = await firebaseUser.getIdTokenResult(true);
          const hasAdminClaim = !!idTokenResult.claims.admin;
          
          setUser({
            uid: firebaseUser.uid,
            email: firebaseUser.email,
            displayName: firebaseUser.displayName || 'Admin',
            isAdmin: hasAdminClaim,
          });
          setIsAdmin(hasAdminClaim);
        } catch (err) {
          console.error('[Auth Error] Claim check failed:', err);
          setUser(null);
          setIsAdmin(false);
        }
      } else {
        setUser(null);
        setIsAdmin(false);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const login = async (email, password) => {
    try {
      const cred = await signInWithEmailAndPassword(auth, email, password);
      const tokenResult = await cred.user.getIdTokenResult(true);
      if (!tokenResult.claims.admin) {
        // Sign out if not an authorized admin
        await signOut(auth);
        throw new Error('Access denied: User does not have administrator privileges.');
      }
      return cred.user;
    } catch (err) {
      console.error('[Auth] Login error:', err.message);
      throw err;
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
    } catch (err) {
      console.error('[Auth] Sign out error:', err);
    }
  };

  const resetPassword = async (email) => {
    return sendPasswordResetEmail(auth, email);
  };

  const changeAdminPassword = async (newPassword) => {
    if (!auth.currentUser) throw new Error('Not authenticated');
    return updatePassword(auth.currentUser, newPassword);
  };

  return (
    <AuthContext.Provider value={{
      user,
      isAdmin,
      isAuthenticated: !!user && isAdmin,
      loading,
      login,
      logout,
      resetPassword,
      changeAdminPassword
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return ctx;
}
