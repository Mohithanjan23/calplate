// D:\calplate\frontend\src\components\Dashboard\Goals.jsx
import React from "react";

const Goals = ({ user }) => {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border">
      <h2 className="text-lg font-semibold mb-4">Your Goal</h2>
      {user ? (
        <div>
          <p className="text-gray-700 mb-2">🎯 {user.goal} weight</p>
          <p className="text-gray-700">🔥 {user.calorie_goal} cal/day</p>
        </div>
      ) : (
        <p className="text-gray-500">No goal set yet.</p>
      )}
    </div>
  );
};

export default Goals;
