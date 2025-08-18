import React, { useState, useEffect, useContext } from "react";
import { AppContext } from "../../context/AppContext";
import { supabase } from "../../services/supabaseClient";
import { Loader } from "../Shared/Loader";

const WorkoutLog = () => {
  const { user } = useContext(AppContext);
  const [workouts, setWorkouts] = useState([]);
  const [form, setForm] = useState({
    type: "",
    duration: "",
    calories_burned: "",
  });
  const [loading, setLoading] = useState(false);

  const fetchWorkouts = async () => {
    if (!user) return;
    setLoading(true);

    const { data, error } = await supabase
      .from("workouts")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (!error && data) setWorkouts(data);
    setLoading(false);
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);
    const { data, error } = await supabase
      .from("workouts")
      .insert([
        {
          user_id: user.id,
          type: form.type,
          duration: form.duration,
          calories_burned: form.calories_burned,
        },
      ])
      .select();

    if (!error && data) {
      setWorkouts([data[0], ...workouts]);
      setForm({ type: "", duration: "", calories_burned: "" });
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchWorkouts();
  }, [user]);

  if (loading) return <Loader />;

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-6">💪 Workout Log</h1>

      {/* --- Add Workout Form --- */}
      <form onSubmit={handleSubmit} className="bg-white shadow rounded-2xl p-6 mb-6 space-y-4">
        <input
          type="text"
          name="type"
          placeholder="Workout Type (e.g. Running)"
          value={form.type}
          onChange={handleChange}
          className="w-full p-3 border rounded-lg"
          required
        />
        <input
          type="number"
          name="duration"
          placeholder="Duration (minutes)"
          value={form.duration}
          onChange={handleChange}
          className="w-full p-3 border rounded-lg"
          required
        />
        <input
          type="number"
          name="calories_burned"
          placeholder="Calories Burned"
          value={form.calories_burned}
          onChange={handleChange}
          className="w-full p-3 border rounded-lg"
          required
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600 disabled:opacity-50"
        >
          {loading ? "Adding..." : "Add Workout"}
        </button>
      </form>

      {/* --- Workout List --- */}
      {!workouts.length ? (
        <p className="text-gray-500">No workouts logged yet.</p>
      ) : (
        <div className="space-y-4">
          {workouts.map((w) => (
            <div
              key={w.id}
              className="bg-white shadow rounded-xl p-4 flex justify-between items-center"
            >
              <div>
                <p className="font-semibold">{w.type}</p>
                <p className="text-sm text-gray-600">
                  {w.duration} min • {w.calories_burned} kcal
                </p>
              </div>
              <span className="text-gray-400 text-xs">
                {new Date(w.created_at).toLocaleDateString()}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default WorkoutLog;
