import React, { useContext, useEffect, useState } from "react";
import { AppContext } from "../../context/AppContext";
import { Loader } from "../Shared/Loader";

const MealPrepRecommendations = () => {
  const { goals, meals, loading } = useContext(AppContext);
  const [recommendations, setRecommendations] = useState([]);

  useEffect(() => {
    if (!goals) return;

    // --- Basic Recommendation Logic ---
    const remainingCalories =
      goals.calories -
      meals.reduce((sum, m) => sum + (m.calories || 0), 0);

    const recs = [];

    if (remainingCalories > 500) {
      recs.push({
        name: "Grilled Chicken with Quinoa",
        calories: 450,
        protein: 40,
        carbs: 35,
        fat: 10,
      });
    }

    if (remainingCalories > 200) {
      recs.push({
        name: "Greek Yogurt with Berries",
        calories: 180,
        protein: 15,
        carbs: 20,
        fat: 5,
      });
    }

    if (remainingCalories > 0) {
      recs.push({
        name: "Veggie Salad with Olive Oil",
        calories: 150,
        protein: 5,
        carbs: 10,
        fat: 8,
      });
    }

    if (remainingCalories <= 0) {
      recs.push({
        name: "You’ve hit your calorie target 🎯",
        calories: 0,
        protein: 0,
        carbs: 0,
        fat: 0,
      });
    }

    setRecommendations(recs);
  }, [goals, meals]);

  if (loading) return <Loader />;

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">🍴 Meal Prep Suggestions</h1>

      {!goals ? (
        <p className="text-gray-500">
          Please set your goals in Onboarding before viewing recommendations.
        </p>
      ) : (
        <div className="space-y-4">
          {recommendations.map((meal, idx) => (
            <div
              key={idx}
              className="bg-white shadow rounded-2xl p-4 flex justify-between items-center"
            >
              <div>
                <h2 className="font-semibold">{meal.name}</h2>
                {meal.calories > 0 && (
                  <p className="text-gray-600 text-sm">
                    {meal.calories} kcal | P: {meal.protein}g C: {meal.carbs}g F: {meal.fat}g
                  </p>
                )}
              </div>
              {meal.calories > 0 ? (
                <button className="bg-blue-500 text-white px-3 py-1 rounded-lg hover:bg-blue-600">
                  Add
                </button>
              ) : null}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MealPrepRecommendations;
