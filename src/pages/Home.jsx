import { useEffect, useState } from 'react';
import { supabase } from '../services/supabaseClient';

export default function Home() {
  const [meals, setMeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({
    meal: '',
    calories: '',
    protein: '',
    carbs: '',
    fat: '',
  });

  useEffect(() => {
    fetchMeals();
  }, []);

  const fetchMeals = async () => {
    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      alert('User not logged in');
      setLoading(false);
      return;
    }

    const { data, error } = await supabase
      .from('meals')
      .select('*')
      .eq('user_id', user.id)
      .order('date', { ascending: false });

    if (error) {
      console.error('Error fetching meals:', error.message);
    } else {
      setMeals(data);
    }

    setLoading(false);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.reload();
  };

  const handleDelete = async (id) => {
    if (confirm('Are you sure you want to delete this meal?')) {
      const { error } = await supabase.from('meals').delete().eq('id', id);
      if (error) {
        alert('Error deleting meal');
      } else {
        setMeals((prev) => prev.filter((m) => m.id !== id));
      }
    }
  };

  const handleEditClick = (meal) => {
    setEditingId(meal.id);
    setEditForm({
      meal: meal.meal,
      calories: meal.calories,
      protein: meal.protein,
      carbs: meal.carbs,
      fat: meal.fat,
    });
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpdate = async (id) => {
    const { meal, calories, protein, carbs, fat } = editForm;

    if (!meal.trim() || !calories || !protein || !carbs || !fat) {
      alert("All fields are required.");
      return;
    }

    const { error } = await supabase
      .from('meals')
      .update({
        meal: meal.trim(),
        calories: Number(calories),
        protein: Number(protein),
        carbs: Number(carbs),
        fat: Number(fat),
      })
      .eq('id', id);

    if (error) {
      alert('Update failed: ' + error.message);
    } else {
      setMeals((prev) =>
        prev.map((m) => (m.id === id ? { ...m, ...editForm } : m))
      );
      setEditingId(null);
    }
  };

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold text-center">Your Meals</h1>
        <button onClick={handleLogout} className="text-sm text-red-600 underline">
          Logout
        </button>
      </div>

      {loading ? (
        <p className="text-center">Loading meals...</p>
      ) : meals.length === 0 ? (
        <p className="text-center">No meals logged yet. Go add one!</p>
      ) : (
        <div className="flex flex-col gap-4">
          {meals.map((meal) => (
            <div key={meal.id} className="border rounded-md p-4 shadow-sm">
              {editingId === meal.id ? (
                <div className="space-y-2">
                  <input
                    name="meal"
                    value={editForm.meal}
                    onChange={handleEditChange}
                    className="border px-2 py-1 rounded w-full"
                    required
                  />
                  <div className="grid grid-cols-3 gap-2">
                    <input
                      name="calories"
                      type="number"
                      value={editForm.calories}
                      onChange={handleEditChange}
                      className="border px-2 py-1 rounded"
                      placeholder="Calories"
                      required
                    />
                    <input
                      name="protein"
                      type="number"
                      value={editForm.protein}
                      onChange={handleEditChange}
                      className="border px-2 py-1 rounded"
                      placeholder="Protein"
                      required
                    />
                    <input
                      name="carbs"
                      type="number"
                      value={editForm.carbs}
                      onChange={handleEditChange}
                      className="border px-2 py-1 rounded"
                      placeholder="Carbs"
                      required
                    />
                    <input
                      name="fat"
                      type="number"
                      value={editForm.fat}
                      onChange={handleEditChange}
                      className="border px-2 py-1 rounded"
                      placeholder="Fat"
                      required
                    />
                  </div>
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() => setEditingId(null)}
                      className="text-sm text-gray-600"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => handleUpdate(meal.id)}
                      className="text-sm text-blue-600 font-medium"
                    >
                      Update
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="flex justify-between items-center mb-1">
                    <h3 className="text-lg font-semibold">{meal.meal}</h3>
                    <p className="text-sm text-gray-500">
                      {meal.date ? new Date(meal.date).toLocaleString() : 'N/A'}
                    </p>
                  </div>
                  <div className="flex justify-between text-sm text-gray-700">
                    <p>Calories: {meal.calories}</p>
                    <p>P: {meal.protein}g | C: {meal.carbs}g | F: {meal.fat}g</p>
                  </div>
                  <div className="text-right mt-2 space-x-2">
                    <button
                      onClick={() => handleEditClick(meal)}
                      className="text-xs text-blue-500 underline hover:text-blue-700"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(meal.id)}
                      className="text-xs text-red-500 underline hover:text-red-700"
                    >
                      Delete
                    </button>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
