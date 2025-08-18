import React, { createContext, useState, useEffect, useContext } from 'react';

// NOTE: Replace this with your actual Supabase client setup
const supabase = {
  auth: {
    signUp: async ({ email, password }) => ({ data: { user: { id: '1', email } }, error: null }),
    signInWithPassword: async ({ email, password }) => ({ data: { user: { id: '1', email }, session: { access_token: 'token' } }, error: null }),
    signOut: async () => ({ error: null }),
    getSession: async () => ({ data: { session: null }, error: null }),
    onAuthStateChange: (callback) => ({ data: { subscription: { unsubscribe: () => {} } } }),
  },
  from: (table) => ({
    select: () => ({ eq: () => Promise.resolve({ data: [], error: null }) }),
    insert: (data) => Promise.resolve({ data, error: null }),
    update: (data) => ({ eq: () => Promise.resolve({ data, error: null }) }),
  }),
};

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getInitialSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setSession(session);
      if (session?.user) {
        await fetchUserProfile(session.user.id);
      }
      setLoading(false);
    };

    getInitialSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setSession(session);
      if (session?.user) {
        await fetchUserProfile(session.user.id);
      } else {
        setUser(null);
      }
    });

    return () => subscription?.unsubscribe();
  }, []);

  const fetchUserProfile = async (userId) => {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (data) {
      setUser(data);
    }
    return data;
  };

  const value = {
    supabase,
    session,
    user,
    setUser,
    loading,
    signOut: () => supabase.auth.signOut(),
  };

  return <AuthContext.Provider value={value}>{!loading && children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};