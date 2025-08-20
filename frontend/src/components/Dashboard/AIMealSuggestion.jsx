// D:\calplate\frontend\src\components\Dashboard\AIMealSuggestion.jsx
import React, { useState } from "react";

const AIMealSuggestion = ({ user, setMeals }) => {
  const [showMealPlan, setShowMealPlan] = useState(false);

  const suggestions = [
    { name: "Greek Yogurt Parfait", calories: 320, type: "breakfast" },
    { name: "Chicken & Veggie Stir-Fry", calories: 450, type: "lunch" },
    { name: "Salmon & Sweet Potato", calories: 520, type: "dinner" }
  ];

  const addMeal = (meal) => {
    const newMeal = {
      id: Date.now(),
      name: meal.name,
      calories: meal.calories,
      type: meal.type,
      date: new Date().toISOString()
    };
    setMeals((prev) => [...prev, newMeal]);
    setShowMealPlan(false);
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">🍽️ AI Meal Suggestions</h2>
        <button
          onClick={() => setShowMealPlan(true)}
          className="text-green-600 hover:text-green-700 text-sm font-medium"
        >
          View All →
        </button>
      </div>

      {showMealPlan && (
        <div className="space-y-3">
          {suggestions.map((meal, index) => (
            <div
              key={index}
              className="p-3 bg-gray-50 rounded-lg flex justify-between items-center"
            >
              <div>
                <div className="font-medium">{meal.name}</div>
                <div className="text-sm text-gray-600">
                  {meal.calories} cal • {meal.type}
                </div>
              </div>
              <button
                onClick={() => addMeal(meal)}
                className="bg-green-600 text-white px-3 py-1 rounded-lg text-sm hover:bg-green-700"
              >
                Add
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AIMealSuggestion;
