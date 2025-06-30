import { useState } from 'react';
import { supabase } from '../services/supabaseClient';

export default function AddMeal() {
  const [meal, setMeal] = useState('');
  const [calories, setCalories] = useState('');
  const [protein, setProtein] = useState('');
  const [carbs, setCarbs] = useState('');
  const [fat, setFat] = useState('');
  const [date, setDate] = useState('');
  const [loading, setLoading] = useState(false);

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
      meal,
      calories: Number(calories),
      protein: Number(protein),
      carbs: Number(carbs),
      fat: Number(fat),
      date,
    };

    const { error } = await supabase.from('meals').insert(mealData);

    if (error) {
      alert("❌ Error saving meal: " + error.message);
    } else {
      alert("✅ Meal logged successfully!");
      setMeal('');
      setCalories('');
      setProtein('');
      setCarbs('');
      setFat('');
      setDate('');
    }

    setLoading(false);
  };

  return (
    <div className="max-w-md mx-auto mt-6 px-4">
      <h2 className="text-xl font-semibold mb-4 text-center">🍽️ Log Your Meal</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Meal Name (e.g. Breakfast, Lunch)"
          value={meal}
          onChange={(e) => setMeal(e.target.value)}
          required
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <input
          type="number"
          placeholder="Total Calories"
          value={calories}
          onChange={(e) => setCalories(e.target.value)}
          required
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <div className="grid grid-cols-3 gap-2">
          <input
            type="number"
            placeholder="Protein (g)"
            value={protein}
            onChange={(e) => setProtein(e.target.value)}
            className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <input
            type="number"
            placeholder="Carbs (g)"
            value={carbs}
            onChange={(e) => setCarbs(e.target.value)}
            className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <input
            type="number"
            placeholder="Fat (g)"
            value={fat}
            onChange={(e) => setFat(e.target.value)}
            className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>
        <input
          type="datetime-local"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          required
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <button
          type="submit"
          disabled={loading}
          className={`w-full py-2 rounded-lg font-semibold text-white transition ${
            loading
              ? 'bg-blue-300 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-700'
          }`}
        >
          {loading ? 'Saving...' : 'Add Meal'}
        </button>
      </form>
    </div>
  );
}
