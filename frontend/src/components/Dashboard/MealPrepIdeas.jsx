// D:\calplate\frontend\src\components\Dashboard\MealPrepIdeas.jsx
import React from "react";
import { Bolt, Package, Salad } from "lucide-react";
import { useNavigate } from "react-router-dom";

const MealPrepIdeas = () => {
  const navigate = useNavigate();

  return (
    <div className="card p-4 space-y-3">
      {/* Header */}
      <div className="flex justify-between items-center mb-2">
        <h3 className="font-semibold flex items-center gap-2">
          🍴 Meal Prep Ideas
        </h3>
        <button
          onClick={() => navigate("/meal-ideas")}
          className="text-sm text-green-600 hover:underline"
        >
          View All →
        </button>
      </div>

      {/* Quick Meal Ideas */}
      <div className="bg-blue-50 rounded-lg p-3 flex justify-between items-center cursor-pointer hover:bg-blue-100 transition">
        <div>
          <p className="font-medium text-blue-700">Quick Meal Ideas</p>
          <p className="text-sm text-gray-600">15–30 min recipes</p>
        </div>
        <Bolt className="text-orange-500" size={20} />
      </div>

      {/* Batch Cooking */}
      <div className="bg-purple-50 rounded-lg p-3 flex justify-between items-center cursor-pointer hover:bg-purple-100 transition">
        <div>
          <p className="font-medium text-purple-700">Batch Cooking</p>
          <p className="text-sm text-gray-600">Weekend prep ideas</p>
        </div>
        <Package className="text-purple-600" size={20} />
      </div>

      {/* Healthy Options */}
      <div className="bg-green-50 rounded-lg p-3 flex justify-between items-center cursor-pointer hover:bg-green-100 transition">
        <div>
          <p className="font-medium text-green-700">Healthy Options</p>
          <p className="text-sm text-gray-600">Nutrient-dense meals</p>
        </div>
        <Salad className="text-green-600" size={20} />
      </div>
    </div>
  );
};

export default MealPrepIdeas;
