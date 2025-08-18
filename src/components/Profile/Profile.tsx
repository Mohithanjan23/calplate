import React, { useContext, useState } from "react";
import { AppContext } from "../../context/AppContext";
import { supabase } from "../../services/supabaseClient";

const Profile = () => {
  const { user, goals, setGoals } = useContext(AppContext);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState(goals || {});
  const [loading, setLoading] = useState(false);

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);

    const { data, error } = await supabase
      .from("goals")
      .update({
        weight: form.weight,
        target_weight: form.target_weight,
        calories: form.calories,
        protein: form.protein,
        carbs: form.carbs,
        fat: form.fat,
        workouts_per_week: form.workouts_per_week,
      })
      .eq("user_id", user.id)
      .select();

    if (!error && data) {
      setGoals(data[0]);
      setEditing(false);
    }

    setLoading(false);
  };

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-6">👤 Profile</h1>

      <div className="bg-white shadow rounded-2xl p-6 mb-6">
        <h2 className="text-lg font-semibold mb-2">Account</h2>
        <p className="text-gray-600">Email: {user?.email}</p>
      </div>

      <div className="bg-white shadow rounded-2xl p-6 mb-6">
        <h2 className="text-lg font-semibold mb-4">Goals</h2>

        {!editing ? (
          goals ? (
            <div>
              <p className="text-gray-700">Weight: {goals.weight} kg</p>
              <p className="text-gray-700">Target Weight: {goals.target_weight} kg</p>
              <p className="text-gray-700">Calories: {goals.calories} kcal</p>
              <p className="text-gray-700">
                Macros → P: {goals.protein}g | C: {goals.carbs}g | F: {goals.fat}g
              </p>
              <p className="text-gray-700">Workouts/Week: {goals.workouts_per_week}</p>

              <button
                onClick={() => setEditing(true)}
                className="mt-3 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
              >
                Edit Goals
              </button>
            </div>
          ) : (
            <p className="text-gray-500">No goals set yet. Complete onboarding.</p>
          )
        ) : (
          <form onSubmit={handleSave} className="grid grid-cols-2 gap-4">
            <input
              type="number"
              name="weight"
              placeholder="Weight"
              value={form.weight || ""}
              onChange={handleChange}
              className="p-2 border rounded-lg col-span-1"
            />
            <input
              type="number"
              name="target_weight"
              placeholder="Target Weight"
              value={form.target_weight || ""}
              onChange={handleChange}
              className="p-2 border rounded-lg col-span-1"
            />
            <input
              type="number"
              name="calories"
              placeholder="Calories"
              value={form.calories || ""}
              onChange={handleChange}
              className="p-2 border rounded-lg col-span-2"
            />
            <input
              type="number"
              name="protein"
              placeholder="Protein"
              value={form.protein || ""}
              onChange={handleChange}
              className="p-2 border rounded-lg col-span-1"
            />
            <input
              type="number"
              name="carbs"
              placeholder="Carbs"
              value={form.carbs || ""}
              onChange={handleChange}
              className="p-2 border rounded-lg col-span-1"
            />
            <input
              type="number"
              name="fat"
              placeholder="Fat"
              value={form.fat || ""}
              onChange={handleChange}
              className="p-2 border rounded-lg col-span-1"
            />
            <input
              type="number"
              name="workouts_per_week"
              placeholder="Workouts/Week"
              value={form.workouts_per_week || ""}
              onChange={handleChange}
              className="p-2 border rounded-lg col-span-1"
            />

            <div className="col-span-2 flex gap-2">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-green-500 text-white py-2 rounded-lg"
              >
                {loading ? "Saving..." : "Save"}
              </button>
              <button
                type="button"
                className="flex-1 bg-gray-300 py-2 rounded-lg"
                onClick={() => setEditing(false)}
              >
                Cancel
              </button>
            </div>
          </form>
        )}
      </div>

      <button
        onClick={handleLogout}
        className="w-full bg-red-500 text-white py-3 rounded-lg hover:bg-red-600"
      >
        Logout
      </button>
    </div>
  );
};

export default Profile;
