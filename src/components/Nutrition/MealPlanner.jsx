import React, { useState, useEffect, useContext } from "react";
import { supabase } from "../../services/supabaseClient";
import { AppContext } from "../../context/AppContext";
import { Loader } from "../Shared/Loader";

const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

const MealPlanner = () => {
  const { user } = useContext(AppContext);
  const [plan, setPlan] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedDay, setSelectedDay] = useState(days[0]);
  const [mealInput, setMealInput] = useState("");

  const fetchPlan = async () => {
    if (!user) return;
    setLoading(true);

    const { data, error } = await supabase
      .from("meal_plan")
      .select("*")
      .eq("user_id", user.id)
      .order("day", { ascending: true });

    if (!error && data) setPlan(data);
    setLoading(false);
  };

  const handleAddMeal = async (e) => {
    e.preventDefault();
    if (!mealInput.trim()) return;

    setLoading(true);
    const { error } = await supabase.from("meal_plan").insert([
      { user_id: user.id, day: selectedDay, meal: mealInput },
    ]);

    if (error) {
      console.error(error);
      alert("⚠️ Failed to add meal.");
    } else {
      setMealInput("");
      fetchPlan();
    }
    setLoading(false);
  };

  const deleteMeal = async (id) => {
    const { error } = await supabase.from("meal_plan").delete().eq("id", id);
    if (!error) setPlan(plan.filter((m) => m.id !== id));
  };

  useEffect(() => {
    fetchPlan();
  }, [user]);

  if (loading && !plan.length) return <Loader />;

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-6">🍽️ Weekly Meal Planner</h1>

      {/* Add Meal */}
      <form onSubmit={handleAddMeal} className="grid gap-3 md:grid-cols-3 mb-6">
        <select
          value={selectedDay}
          onChange={(e) => setSelectedDay(e.target.value)}
          className="p-3 border rounded-lg"
        >
          {days.map((d) => (
            <option key={d} value={d}>{d}</option>
          ))}
        </select>
        <input
          type="text"
          value={mealInput}
          onChange={(e) => setMealInput(e.target.value)}
          placeholder="Enter meal..."
          className="p-3 border rounded-lg"
          required
        />
        <button
          type="submit"
          disabled={loading}
          className="bg-green-500 text-white py-2 rounded-lg hover:bg-green-600 disabled:opacity-50"
        >
          Add
        </button>
      </form>

      {/* Meal Plan Display */}
      {!plan.length ? (
        <p className="text-gray-500">No meal plan yet. Start adding meals!</p>
      ) : (
        <div className="space-y-6">
          {days.map((d) => (
            <div key={d} className="bg-white shadow rounded-xl p-4">
              <h2 className="font-semibold text-lg mb-3">{d}</h2>
              <div className="space-y-2">
                {plan
                  .filter((m) => m.day === d)
                  .map((m) => (
                    <div
                      key={m.id}
                      className="flex justify-between items-center bg-gray-50 p-2 rounded-lg"
                    >
                      <span>{m.meal}</span>
                      <button
                        onClick={() => deleteMeal(m.id)}
                        className="text-red-500 text-sm"
                      >
                        Delete
                      </button>
                    </div>
                  ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MealPlanner;
