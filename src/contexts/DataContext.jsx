import React, { createContext, useState, useEffect, useContext } from 'react';
import { useAuth } from './AuthContext.jsx';

const DataContext = createContext();

export const DataProvider = ({ children }) => {
  const { supabase, session } = useAuth();
  const [meals, setMeals] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchMeals = async (userId) => {
    setLoading(true);
    const { data, error } = await supabase
      .from('meals')
      .select('*')
      .eq('user_id', userId);

    if (data) {
      setMeals(data);
    }
    setLoading(false);
  };
  
  const addMeal = async (mealData) => {
    const newMeal = {
      ...mealData,
      user_id: session.user.id,
      created_at: new Date().toISOString()
    };
    
    const { data, error } = await supabase
      .from('meals')
      .insert([newMeal])
      .select();

    if (data) {
      setMeals(prev => [...prev, data[0]]);
      return data[0];
    }
    return null;
  };

  useEffect(() => {
    if (session?.user) {
      fetchMeals(session.user.id);
    } else {
      setMeals([]);
    }
  }, [session]);

  const value = {
    meals,
    setMeals,
    loading,
    addMeal,
  };

  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};
