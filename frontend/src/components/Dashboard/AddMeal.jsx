// D:\calplate\frontend\src\components\Dashboard\AddMeal.jsx
import React, { useState } from "react";
import { useAppContext } from "../../context/AppContext";

const commonFoods = [
  { name: "Banana", calories: 105 },
  { name: "Apple", calories: 95 },
  { name: "Chicken Breast (100g)", calories: 165 },
  { name: "Rice (1 cup)", calories: 205 },
  { name: "Egg", calories: 70 },
  { name: "Bread Slice", calories: 80 },
  { name: "Milk (1 cup)", calories: 150 },
  { name: "Yogurt", calories: 100 },
];

const AddMeal = ({ setMeals, setShowAddMeal }) => {
  const { meals } = useAppContext();

  const [mealType, setMealType] = useState("Breakfast");
  const [foodItem, setFoodItem] = useState("");
  const [calories, setCalories] = useState("");

  const handleAdd = () => {
    if (!foodItem || !calories) return;

    const newMeal = {
      type: mealType,
      name: foodItem,
      calories: Number(calories),
      date: new Date().toISOString(),
    };

    setMeals([...meals, newMeal]);
    setShowAddMeal(false);
  };

  const quickAdd = (food) => {
    setFoodItem(food.name);
    setCalories(food.calories);
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
      <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-lg">
        {/* Title */}
        <h2 className="text-lg font-semibold mb-4">Add Meal</h2>

        {/* Meal Type */}
        <label className="block text-sm font-medium mb-1">Meal Type</label>
        <select
          value={mealType}
          onChange={(e) => setMealType(e.target.value)}
          className="w-full border rounded-lg px-3 py-2 mb-4"
        >
          <option>Breakfast</option>
          <option>Lunch</option>
          <option>Dinner</option>
          <option>Snack</option>
        </select>

        {/* Food Item */}
        <label className="block text-sm font-medium mb-1">Food Item</label>
        <input
          type="text"
          value={foodItem}
          onChange={(e) => setFoodItem(e.target.value)}
          placeholder="e.g., Grilled Chicken"
          className="w-full border rounded-lg px-3 py-2 mb-4"
        />

        {/* Calories */}
        <label className="block text-sm font-medium mb-1">Calories</label>
        <input
          type="number"
          value={calories}
          onChange={(e) => setCalories(e.target.value)}
          placeholder="250"
          className="w-full border rounded-lg px-3 py-2 mb-4"
        />

        {/* Quick Add */}
        <h3 className="text-sm font-medium mb-2">Quick Add (Common Foods)</h3>
        <div className="grid grid-cols-2 gap-2 mb-4">
          {commonFoods.map((food, idx) => (
            <button
              key={idx}
              type="button"
              className="border rounded-lg p-2 text-left hover:bg-gray-50"
              onClick={() => quickAdd(food)}
            >
              <div className="font-medium">{food.name}</div>
              <div className="text-xs text-gray-500">{food.calories} cal</div>
            </button>
          ))}
        </div>

        {/* Buttons */}
        <div className="flex justify-between gap-3">
          <button
            onClick={() => setShowAddMeal(false)}
            className="w-1/2 border rounded-lg py-2"
          >
            Cancel
          </button>
          <button
            onClick={handleAdd}
            className="w-1/2 bg-green-600 text-white rounded-lg py-2 hover:bg-green-700"
          >
            Add Meal
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddMeal;
