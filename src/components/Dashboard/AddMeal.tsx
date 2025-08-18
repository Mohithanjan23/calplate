import React, { useState, useContext } from "react";
import { AppContext } from "../../context/AppContext";

const AddMeal = () => {
  const { addMeal } = useContext(AppContext);
  const [showForm, setShowForm] = useState(false);
  const [meal, setMeal] = useState({ name: "", calories: "", protein: "", carbs: "", fat: "" });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!meal.name || !meal.calories) return;

    addMeal({
      name: meal.name,
      calories: Number(meal.calories),
      protein: Number(meal.protein),
      carbs: Number(meal.carbs),
      fat: Number(meal.fat),
    });

    setMeal({ name: "", calories: "", protein: "", carbs: "", fat: "" });
    setShowForm(false);
  };

  return (
    <div className="fixed bottom-6 right-6">
      {!showForm ? (
        <button
          onClick={() => setShowForm(true)}
          className="bg-blue-500 text-white rounded-full w-14 h-14 text-2xl shadow-lg hover:bg-blue-600"
        >
          +
        </button>
      ) : (
        <div className="bg-white shadow-xl rounded-2xl p-6 w-80">
          <h3 className="text-lg font-semibold mb-3">Add Meal</h3>
          <form onSubmit={handleSubmit} className="space-y-3">
            <input
              type="text"
              placeholder="Meal Name"
              className="w-full p-2 border rounded-lg"
              value={meal.name}
              onChange={(e) => setMeal({ ...meal, name: e.target.value })}
              required
            />
            <input
              type="number"
              placeholder="Calories"
              className="w-full p-2 border rounded-lg"
              value={meal.calories}
              onChange={(e) => setMeal({ ...meal, calories: e.target.value })}
              required
            />
            <input
              type="number"
              placeholder="Protein (g)"
              className="w-full p-2 border rounded-lg"
              value={meal.protein}
              onChange={(e) => setMeal({ ...meal, protein: e.target.value })}
            />
            <input
              type="number"
              placeholder="Carbs (g)"
              className="w-full p-2 border rounded-lg"
              value={meal.carbs}
              onChange={(e) => setMeal({ ...meal, carbs: e.target.value })}
            />
            <input
              type="number"
              placeholder="Fat (g)"
              className="w-full p-2 border rounded-lg"
              value={meal.fat}
              onChange={(e) => setMeal({ ...meal, fat: e.target.value })}
            />

            <div className="flex gap-2">
              <button
                type="submit"
                className="flex-1 bg-blue-500 text-white py-2 rounded-lg"
              >
                Save
              </button>
              <button
                type="button"
                className="flex-1 bg-gray-300 py-2 rounded-lg"
                onClick={() => setShowForm(false)}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default AddMeal;
