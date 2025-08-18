import React, { createContext, useState, useEffect } from "react";
import { supabase } from "../services/supabaseClient";

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [session, setSession] = useState(null);
  const [user, setUser] = useState(null);
  const [meals, setMeals] = useState([]);
  const [goals, setGoals] = useState(null);
  const [loading, setLoading] = useState(true);

  // --- Check session on mount ---
  useEffect(() => {
    const getSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      setSession(session);
      setUser(session?.user || null);
      setLoading(false);
    };

    getSession();

    // Listen for auth changes
    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
        setUser(session?.user || null);
      }
    );

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  // --- Example: Fetch meals from Supabase (optional now, used later) ---
  const fetchMeals = async () => {
    if (!user) return;
    const { data, error } = await supabase
      .from("meals")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (!error) setMeals(data);
  };

  // --- Example: Save meal ---
  const addMeal = async (meal) => {
    if (!user) return;
    const { data, error } = await supabase
      .from("meals")
      .insert([{ ...meal, user_id: user.id }])
      .select();

    if (!error && data) {
      setMeals((prev) => [data[0], ...prev]);
    }
  };

  return (
    <AppContext.Provider
      value={{
        session,
        user,
        meals,
        goals,
        loading,
        fetchMeals,
        addMeal,
        setGoals,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
