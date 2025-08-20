// D:\calplate\frontend\src\components\Dashboard\Dashboard.jsx
import React from "react";
import { Target, Calendar } from "lucide-react";
import { useAppContext } from "../../context/AppContext";

const Dashboard = () => {
  const { user, todayCalories, todayMeals, meals } = useAppContext();
  const goal = user?.goalCalories || 3040; // default goal if not set

  const percentage = Math.min((todayCalories / goal) * 100, 100);
  const avgMeal = todayMeals.length > 0 ? Math.round(todayCalories / todayMeals.length) : 0;

  return (
    <div className="p-4 space-y-6">
      {/* Header */}
      <div className="bg-green-600 text-white p-5 rounded-2xl shadow-md">
        <h2 className="text-xl font-semibold">
          Hello, {user?.name || "Guest"}! 👋
        </h2>
        <p className="text-sm opacity-90">Let’s track your nutrition today</p>
      </div>

      {/* Progress Card */}
      <div className="card space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="font-semibold">Today's Progress</h3>
          <Target className="w-5 h-5 text-green-600" />
        </div>

        <div className="text-2xl font-bold">{todayCalories}</div>
        <div className="text-gray-600 text-sm">/ {goal} cal</div>

        {/* Progress Bar */}
        <div className="w-full bg-gray-200 h-2 rounded-full">
          <div
            className="bg-green-600 h-2 rounded-full"
            style={{ width: `${percentage}%` }}
          ></div>
        </div>

        <div className="flex justify-between text-sm text-gray-600">
          <span>{Math.round(percentage)}% of goal</span>
          <span>{goal - todayCalories} cal remaining</span>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-3 gap-4">
        <div className="card text-center">
          <div className="text-lg font-bold text-green-600">{todayMeals.length}</div>
          <div className="text-sm text-gray-600">Meals</div>
        </div>
        <div className="card text-center">
          <div className="text-lg font-bold text-blue-600">{avgMeal}</div>
          <div className="text-sm text-gray-600">Avg/Meal</div>
        </div>
        <div className="card text-center">
          <div className="text-lg font-bold text-purple-600">{meals.length}</div>
          <div className="text-sm text-gray-600">Total Logged</div>
        </div>
      </div>

      {/* Today's Meals */}
      <div className="card space-y-3">
        <div className="flex justify-between items-center">
          <h3 className="font-semibold">Today's Meals</h3>
          <Calendar className="w-5 h-5 text-green-600" />
        </div>
        {todayMeals.length === 0 ? (
          <div className="text-center text-gray-500 py-6">
            <p className="text-2xl mb-2">🍴</p>
            <p>No meals logged today</p>
            <p className="text-sm">Tap the + button to add your first meal</p>
          </div>
        ) : (
          <ul className="divide-y">
            {todayMeals.map((meal, idx) => (
              <li key={idx} className="py-2 flex justify-between">
                <span>{meal.name}</span>
                <span className="text-gray-600">{meal.calories} cal</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
