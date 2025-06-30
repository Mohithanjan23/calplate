import { useState, useEffect } from 'react';
import { supabase } from '../services/supabaseClient';

export default function Workouts() {
  const [workouts, setWorkouts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    type: 'Strength',
    name: '',
    sets: '',
    reps: '',
    weight: '',
    duration: '',
    notes: '',
    date: '',
  });

  useEffect(() => {
    fetchWorkouts();
  }, []);

  const fetchWorkouts = async () => {
    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    const { data, error } = await supabase
      .from('workouts')
      .select('*')
      .eq('user_id', user.id)
      .order('date', { ascending: false });

    if (error) console.error('Error:', error.message);
    else setWorkouts(data);
    setLoading(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { data: { user } } = await supabase.auth.getUser();
    const workoutData = { ...form, user_id: user.id };

    const { error } = await supabase.from('workouts').insert(workoutData);
    if (error) {
      alert('❌ Error logging workout');
    } else {
      alert('✅ Workout logged!');
      setForm({
        type: 'Strength',
        name: '',
        sets: '',
        reps: '',
        weight: '',
        duration: '',
        notes: '',
        date: '',
      });
      fetchWorkouts();
    }
  };

  const handleDelete = async (id) => {
    const confirmDelete = confirm('Delete this workout?');
    if (!confirmDelete) return;
    const { error } = await supabase.from('workouts').delete().eq('id', id);
    if (!error) setWorkouts(workouts.filter((w) => w.id !== id));
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-2xl font-bold text-center mb-4">Workout Log</h1>

      <form onSubmit={handleSubmit} className="space-y-3 mb-6">
        <select
          name="type"
          value={form.type}
          onChange={handleChange}
          className="w-full px-3 py-2 border rounded"
        >
          <option>Strength</option>
          <option>Cardio</option>
          <option>Sports</option>
        </select>

        <input
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="Exercise Name"
          required
          className="w-full px-3 py-2 border rounded"
        />

        {form.type === 'Strength' && (
          <div className="grid grid-cols-3 gap-2">
            <input name="sets" value={form.sets} onChange={handleChange} placeholder="Sets" className="px-2 py-2 border rounded" />
            <input name="reps" value={form.reps} onChange={handleChange} placeholder="Reps" className="px-2 py-2 border rounded" />
            <input name="weight" value={form.weight} onChange={handleChange} placeholder="Weight (kg)" className="px-2 py-2 border rounded" />
          </div>
        )}

        {form.type !== 'Strength' && (
          <input
            name="duration"
            value={form.duration}
            onChange={handleChange}
            placeholder="Duration (min)"
            className="w-full px-3 py-2 border rounded"
          />
        )}

        <textarea
          name="notes"
          value={form.notes}
          onChange={handleChange}
          placeholder="Notes (optional)"
          className="w-full px-3 py-2 border rounded"
        />

        <input
          type="datetime-local"
          name="date"
          value={form.date}
          onChange={handleChange}
          required
          className="w-full px-3 py-2 border rounded"
        />

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
        >
          Add Workout
        </button>
      </form>

      {loading ? (
        <p className="text-center">Loading...</p>
      ) : (
        workouts.map((w) => (
          <div key={w.id} className="border p-3 rounded mb-3 shadow-sm">
            <div className="flex justify-between">
              <h2 className="font-semibold">{w.name}</h2>
              <p className="text-sm text-gray-500">{new Date(w.date).toLocaleString()}</p>
            </div>
            <p className="text-sm text-gray-700">
              {w.type === 'Strength'
                ? `Sets: ${w.sets}, Reps: ${w.reps}, Weight: ${w.weight}kg`
                : `Duration: ${w.duration} min`}
            </p>
            {w.notes && <p className="text-xs text-gray-600 italic mt-1">"{w.notes}"</p>}
            <div className="text-right">
              <button
                onClick={() => handleDelete(w.id)}
                className="text-xs text-red-500 underline"
              >
                Delete
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
}
