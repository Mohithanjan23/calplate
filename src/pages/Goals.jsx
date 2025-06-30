import { useState, useEffect } from 'react';
import { supabase } from '../services/supabaseClient';

export default function Goals() {
  const [goals, setGoals] = useState({
    calories: '',
    protein: '',
    carbs: '',
    fat: '',
    workoutsPerWeek: ''
  });
  const [loading, setLoading] = useState(false);
  const [editMode, setEditMode] = useState(false);

  useEffect(() => {
    fetchGoals();
  }, []);

  const fetchGoals = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    const { data, error } = await supabase
      .from('goals')
      .select('*')
      .eq('user_id', user.id)
      .single();

    if (data) {
      setGoals(data);
      setEditMode(false);
    } else {
      setEditMode(true);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setGoals((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();

    const { error } = await supabase
      .from('goals')
      .upsert({ ...goals, user_id: user.id }, { onConflict: ['user_id'] });

    if (error) {
      alert('❌ Error saving goals: ' + error.message);
    } else {
      alert('✅ Goals saved!');
      setEditMode(false);
    }

    setLoading(false);
  };

  return (
    <div className="max-w-md mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4 text-center">Your Goals</h1>
      <form onSubmit={handleSubmit} className="space-y-3">
        <input
          name="calories"
          type="number"
          value={goals.calories}
          onChange={handleChange}
          placeholder="Daily Calorie Goal"
          className="w-full border px-3 py-2 rounded"
        />
        <div className="grid grid-cols-3 gap-2">
          <input
            name="protein"
            type="number"
            value={goals.protein}
            onChange={handleChange}
            placeholder="Protein (g)"
            className="border px-2 py-2 rounded"
          />
          <input
            name="carbs"
            type="number"
            value={goals.carbs}
            onChange={handleChange}
            placeholder="Carbs (g)"
            className="border px-2 py-2 rounded"
          />
          <input
            name="fat"
            type="number"
            value={goals.fat}
            onChange={handleChange}
            placeholder="Fat (g)"
            className="border px-2 py-2 rounded"
          />
        </div>
        <input
          name="workoutsPerWeek"
          type="number"
          value={goals.workoutsPerWeek}
          onChange={handleChange}
          placeholder="Workouts / week"
          className="w-full border px-3 py-2 rounded"
        />
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
        >
          {loading ? 'Saving...' : 'Save Goals'}
        </button>
      </form>
    </div>
  );
}
