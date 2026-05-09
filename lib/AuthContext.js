'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { app } from './firebase';

const AuthContext = createContext();

/**
 * AuthProvider Component
 * 
 * WHY: We need a central place to store the user's session state so any Client Component
 * (like the top navigation bar or user management table) can instantly know who is logged in.
 * 
 * HOW: It wraps the CMS Layout. It receives `initialUser` as a prop from the Server Component
 * (`app/cms/layout.js`). This is called "Hydration".
 */
export default function AuthProvider({ children, initialUser }) {
  // `user` holds the enriched Firestore profile (role, permissions) fetched by the server.
  const [user, setUser] = useState(initialUser);
  
  // `authReady` tracks when the Firebase Client SDK has finished waking up.
  // WHY: The Next.js server renders the page instantly. But if the client fires a 
  // Firestore query (like fetchUsers) before Firebase Client Auth restores its IndexedDB session, 
  // the request goes out as anonymous and gets blocked by Firestore Security Rules.
  const [authReady, setAuthReady] = useState(false);
  
  const router = useRouter();

  useEffect(() => {
    const auth = getAuth(app);
    // onAuthStateChanged is a Firebase Client SDK method.
    // It fires automatically when the browser establishes its local auth state.
    const unsubscribe = onAuthStateChanged(auth, () => {
      setAuthReady(true); // Now safe to execute client-side Firestore reads/writes!
    });
    return () => unsubscribe();
  }, []);

  const logout = async () => {
    try {
      // 1. Destroy the server-side httpOnly cookie
      await fetch('/api/auth/logout', { method: 'POST' });
      
      // 2. Destroy the client-side Firebase session dynamically
      const { getAuth, signOut } = await import('firebase/auth');
      const { app } = await import('./firebase');
      const auth = getAuth(app);
      await signOut(auth);

      // 3. Clear local state and kick them back to login
      setUser(null);
      router.push('/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    // We expose `user` (data), `authReady` (safety flag), and `logout` (action) to children.
    <AuthContext.Provider value={{ user, authReady, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// Custom hook so child components can just call `const { user } = useAuth();`
export const useAuth = () => useContext(AuthContext);
