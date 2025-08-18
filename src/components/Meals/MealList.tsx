import React, { useContext, useEffect } from "react";
import { AppContext } from "../../context/AppContext";
import { Loader } from "../Shared/Loader";

const MealList = () => {
  const { user, meals, fetchMeals, loading } = useContext(AppContext);

  useEffect(() => {
    if (user) fetchMeals();
  }, [user]);

  if (loading) return <Loader />;

  if (!meals.length) {
    return (
      <div className="p-6 text-center">
        <h1 className="text-xl font-bold mb-4">🍽 Meal History</h1>
        <p className="text-gray-500">No meals logged yet.</p>
      </div>
    );
  }

  // Group meals by date
  const groupedMeals = meals.reduce((acc, meal) => {
    const date = new Date(meal.created_at).toDateString();
    if (!acc[date]) acc[date] = [];
    acc[date].push(meal);
    return acc;
  }, {});

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-6">🍽 Meal History</h1>

      {Object.keys(groupedMeals).map((date) => (
        <div key={date} className="mb-6">
          <h2 className="text-lg font-semibold mb-2">{date}</h2>
          <div className="space-y-2">
            {groupedMeals[date].map((meal) => (
              <div
                key={meal.id}
                className="bg-white shadow rounded-xl p-4 flex justify-between items-center"
              >
                <span className="font-medium">{meal.name}</span>
                <span className="text-gray-600 text-sm">{meal.calories} kcal</span>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default MealList;
