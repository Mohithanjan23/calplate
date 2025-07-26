// src/components/ManualMealForm.jsx

import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '../services/supabaseClient';

const ManualMealForm = () => {
  const navigate = useNavigate();
  const location = useLocation(); // To get pre-filled data from AI scanner

  const [foodName, setFoodName] = useState('');
  const [calories, setCalories] = useState('');
  // ... other state variables (protein, carbs, fat) ...
  const [createdAt, setCreatedAt] = useState(new Date().toISOString().slice(0, 16));
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Check if the AI scanner passed any data to pre-fill the form
    if (location.state?.foodName) {
      setFoodName(location.state.foodName);
    }
  }, [location.state]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      alert("User not logged in.");
      setLoading(false);
      return;
    }

    const mealData = {
      user_id: user.id,
      food_name: foodName,
      calories: Number(calories),
      // ... map other fields ...
      created_at: new Date(createdAt).toISOString(),
    };

    const { error } = await supabase.from('meal_logs').insert(mealData);

    if (error) {
      alert("Error saving meal: " + error.message);
    } else {
      navigate('/'); // Redirect to home on success
    }
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4">
      {/* (Your themed input fields for foodName, calories, macros, etc. go here) */}
       <input
          type="text"
          placeholder="Meal Name (e.g., Scrambled Eggs)"
          value={foodName}
          onChange={(e) => setFoodName(e.target.value)}
          required
          className="w-full px-4 py-2 bg-black/20 rounded-lg border border-white/20 focus:outline-none focus:ring-2 focus:ring-primary"
        />
        {/* ... other inputs ... */}
        <button
          type="submit"
          disabled={loading}
          className={`w-full py-3 rounded-lg font-semibold text-white transition ${loading ? 'bg-primary/50' : 'bg-primary hover:bg-primary-dark'}`}
        >
          {loading ? 'Saving...' : 'Log This Meal'}
        </button>
    </form>
  );
};

export default ManualMealForm;
