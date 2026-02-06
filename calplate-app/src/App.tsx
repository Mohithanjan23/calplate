import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { supabase } from './lib/supabaseClient';
import Onboarding from './components/Onboarding/Onboarding';
import Dashboard from './components/Dashboard/Dashboard';
import FoodScanner from './components/Meals/FoodScanner';
import AddMeal from './components/Meals/AddMeal';
import MealPrepHub from './components/MealPrep/MealPrepHub';
import ShoppingList from './components/MealPrep/ShoppingList';
import { Loader2 } from 'lucide-react';

function App() {
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!supabase) {
      setLoading(false);
      return;
    }

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center text-indigo-600">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/onboarding" element={!session ? <Onboarding /> : <Navigate to="/dashboard" />} />
        <Route path="/dashboard" element={session ? <Dashboard /> : <Navigate to="/onboarding" />} />
        <Route path="/scanner" element={session ? <FoodScanner /> : <Navigate to="/onboarding" />} />
        <Route path="/add-meal" element={session ? <AddMeal /> : <Navigate to="/onboarding" />} />
        <Route path="/meal-prep" element={session ? <MealPrepHub /> : <Navigate to="/onboarding" />} />
        <Route path="/shopping-list" element={session ? <ShoppingList /> : <Navigate to="/onboarding" />} />
        <Route path="/" element={<Navigate to={session ? "/dashboard" : "/onboarding"} />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
