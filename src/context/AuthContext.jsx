// This is the new content for `src/context/AuthContext.jsx`
// This version connects to Supabase for real-time session management.

import { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../services/supabaseClient'; // Make sure you've completed Step 1

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for an active session when the component mounts
    const getSession = async () => {
        const { data: { session } } = await supabase.auth.getSession();
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
    };
    getSession();

    // Listen for changes in authentication state (e.g., login, logout)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
      }
    );

    // Clean up the subscription when the component unmounts
    return () => {
      subscription?.unsubscribe();
    };
  }, []);

  const value = {
    session,
    user,
    isAuthenticated: !!user, // This is now reactive to Supabase auth state
    signOut: () => supabase.auth.signOut(),
  };

  // Render children only after the initial session check is complete
  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

// Custom hook to easily access the auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
