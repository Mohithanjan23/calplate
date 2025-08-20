// D:\calplate\frontend\src\components\Dashboard\Stats.jsx
import React from "react";

const Stats = ({ todayMeals, todayCalories, meals }) => {
  return (
    <div className="grid grid-cols-3 gap-4">
      <div className="bg-white p-4 rounded-xl shadow-sm border text-center">
        <div className="text-xl font-bold text-blue-600">
          {todayMeals.length}
        </div>
        <div className="text-sm text-gray-600">Meals</div>
      </div>
      <div className="bg-white p-4 rounded-xl shadow-sm border text-center">
        <div className="text-xl font-bold text-green-600">
          {todayMeals.length > 0
            ? Math.round(todayCalories / todayMeals.length)
            : 0}
        </div>
        <div className="text-sm text-gray-600">Avg/Meal</div>
      </div>
      <div className="bg-white p-4 rounded-xl shadow-sm border text-center">
        <div className="text-xl font-bold text-purple-600">{meals.length}</div>
        <div className="text-sm text-gray-600">Total Logged</div>
      </div>
    </div>
  );
};

export default Stats;
