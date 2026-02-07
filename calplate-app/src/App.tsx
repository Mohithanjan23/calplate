
import React, { useState, useEffect } from 'react';
import { supabase } from './lib/supabaseClient';
import { AuthScreen } from './components/Auth/AuthScreen';
import { Onboarding } from './components/Auth/Onboarding';
import { BottomNav } from './components/Navigation/BottomNav';
import { FloatingActionButton } from './components/Navigation/FloatingActionButton';
import { Dashboard } from './components/Dashboard/Dashboard';
import { Profile } from './components/Profile/Profile';
import { AddMeal } from './components/Meals/AddMeal';
import { MealPrepHub } from './components/MealPrep/MealPrepHub';

function App() {
  const [session, setSession] = useState<any>(null);
  const [userProfile, setUserProfile] = useState<any>(null);
  const [meals, setMeals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentView, setCurrentView] = useState('dashboard');
  const [showAddMeal, setShowAddMeal] = useState(false);

  useEffect(() => {
    // Get initial session
    supabase!.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session?.user) {
        fetchUserProfile(session.user.id);
        fetchMeals(session.user.id);
      } else {
        setLoading(false);
      }
    });

    // Subscribe to auth changes
    const { data: { subscription } } = supabase!.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
        if (session?.user) {
          fetchUserProfile(session.user.id);
          fetchMeals(session.user.id);
        } else {
          setSession(null);
          setUserProfile(null);
          setMeals([]);
          setLoading(false);
        }
      }
    );

    return () => subscription?.unsubscribe();
  }, []);

  const fetchUserProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase!
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (data) setUserProfile(data);
    } catch (error) {
      console.error('Error in fetchUserProfile:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchMeals = async (userId: string) => {
    const { data, error } = await supabase!
      .from('meals')
      .select('*')
      .order('created_at', { ascending: false });

    if (data) setMeals(data);
  };

  const handleAddMealSuccess = () => {
    if (session?.user) {
      fetchMeals(session.user.id);
      setShowAddMeal(false);
    }
  };

  const handleDeleteMeal = async (id: number) => {
    const { error } = await supabase!
      .from('meals')
      .delete()
      .eq('id', id);

    if (!error) {
      setMeals(meals.filter(m => m.id !== id));
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading Calplate...</p>
        </div>
      </div>
    );
  }

  // Auth Flow
  if (!session) {
    return <AuthScreen onAuthSuccess={() => { }} />;
  }

  if (!userProfile) {
    return <Onboarding userId={session.user.id} onComplete={() => fetchUserProfile(session.user.id)} />;
  }

  // Main App
  const renderView = () => {
    switch (currentView) {
      case 'dashboard':
        return <Dashboard user={userProfile} meals={meals} onDeleteMeal={handleDeleteMeal} />;
      case 'meals':
        return <Dashboard user={userProfile} meals={meals} onDeleteMeal={handleDeleteMeal} />; // Re-using dashboard/meals list for now
      case 'meal-prep':
        return <MealPrepHub userId={userProfile.id} onMealAdded={() => fetchMeals(userProfile.id)} />;
      case 'profile':
        return <Profile user={userProfile} meals={meals} />;
      default:
        return <Dashboard user={userProfile} meals={meals} onDeleteMeal={handleDeleteMeal} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans pb-20">

      {renderView()}

      {currentView !== 'profile' && (
        <FloatingActionButton onClick={() => setShowAddMeal(true)} />
      )}

      <BottomNav currentView={currentView} onNavigate={setCurrentView} />

      {showAddMeal && (
        <AddMeal
          onClose={() => setShowAddMeal(false)}
          onAdd={handleAddMealSuccess}
          userId={session.user.id}
        />
      )}

    </div>
  );
}

export default App;
