// src/components/ManualMealForm.jsx - Your form as a separate component

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../services/supabaseClient';

const ManualMealForm = () => {
  const [foodName, setFoodName] = useState('');
  const [calories, setCalories] = useState('');
  const [protein, setProtein] = useState('');
  const [carbs, setCarbs] = useState('');
  const [fat, setFat] = useState('');
  const [createdAt, setCreatedAt] = useState(new Date().toISOString().slice(0, 16));
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      alert("⚠️ User not logged in.");
      setLoading(false);
      return;
    }

    const mealData = {
      user_id: user.id,
      food_name: foodName,
      calories: Number(calories),
      protein_g: Number(protein),
      carbs_g: Number(carbs),
      fat_g: Number(fat),
      created_at: new Date(createdAt).toISOString(),
    };

    const { error } = await supabase.from('meal_logs').insert(mealData);

    if (error) {
      alert("❌ Error saving meal: " + error.message);
    } else {
      alert("✅ Meal logged successfully!");
      navigate('/');
    }
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4">
        <input
          type="text"
          placeholder="Meal Name (e.g., Scrambled Eggs)"
          value={foodName}
          onChange={(e) => setFoodName(e.target.value)}
          required
          className="w-full px-4 py-2 bg-black/20 rounded-lg border border-white/20 focus:outline-none focus:ring-2 focus:ring-primary"
        />
        <input
          type="number"
          placeholder="Total Calories"
          value={calories}
          onChange={(e) => setCalories(e.target.value)}
          required
          className="w-full px-4 py-2 bg-black/20 rounded-lg border border-white/20 focus:outline-none focus:ring-2 focus:ring-primary"
        />
        <div className="grid grid-cols-3 gap-2">
          <input type="number" placeholder="Protein (g)" value={protein} onChange={(e) => setProtein(e.target.value)} className="w-full px-4 py-2 bg-black/20 rounded-lg border border-white/20 focus:outline-none focus:ring-2 focus:ring-primary" />
          <input type="number" placeholder="Carbs (g)" value={carbs} onChange={(e) => setCarbs(e.target.value)} className="w-full px-4 py-2 bg-black/20 rounded-lg border border-white/20 focus:outline-none focus:ring-2 focus:ring-primary" />
          <input type="number" placeholder="Fat (g)" value={fat} onChange={(e) => setFat(e.target.value)} className="w-full px-4 py-2 bg-black/20 rounded-lg border border-white/20 focus:outline-none focus:ring-2 focus:ring-primary" />
        </div>
        <input
          type="datetime-local"
          value={createdAt}
          onChange={(e) => setCreatedAt(e.target.value)}
          required
          className="w-full px-4 py-2 bg-black/20 rounded-lg border border-white/20 focus:outline-none focus:ring-2 focus:ring-primary"
        />
        <button
          type="submit"
          disabled={loading}
          className={`w-full py-3 rounded-lg font-semibold text-white transition ${loading ? 'bg-primary/50 cursor-not-allowed' : 'bg-primary hover:bg-primary-dark'}`}
        >
          {loading ? 'Saving...' : 'Add Meal'}
        </button>
      </form>
  );
};

export default ManualMealForm;