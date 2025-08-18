import { useState, useRef } from 'react';
import { supabase } from '../services/supabaseClient.js';
import toast from 'react-hot-toast';
import { Camera } from 'lucide-react';
import FoodScanner from './components/FoodScanner.jsx'; // Import the scanner component

export default function AddMeal({ onClose }) {
  const [mealData, setMealData] = useState({ name: '', calories: '', type: 'breakfast' });
  const [showScanner, setShowScanner] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!mealData.name || !mealData.calories) return;

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
        toast.error("You must be logged in to add a meal.");
        return;
    }

    const newMeal = {
      user_id: user.id,
      food_name: mealData.name,
      calories: parseInt(mealData.calories),
      created_at: new Date().toISOString()
    };

    const { error } = await supabase.from('meal_logs').insert(newMeal);

    if (error) {
      toast.error(error.message);
    } else {
      toast.success("Meal added successfully!");
      onClose(); // Close the modal
    }
  };

  const handleFoodDetected = (foods) => {
    // For simplicity, we'll take the first detected food
    if (foods.length > 0) {
        const firstFood = foods[0];
        setMealData(prev => ({...prev, name: firstFood.name, calories: firstFood.calories.toString()}));
    }
    setShowScanner(false);
  };
  
  const inputStyles = "w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500";

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl p-6 max-w-md w-full">
        <h2 className="text-2xl font-bold mb-6">Add Meal</h2>
        
        <button
          onClick={() => setShowScanner(true)}
          className="w-full mb-4 py-3 bg-black text-white font-semibold rounded-lg flex items-center justify-center gap-2"
        >
          <Camera size={20} />
          Scan Food with AI
        </button>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input type="text" value={mealData.name} onChange={(e) => setMealData({...mealData, name: e.target.value})} placeholder="Food Item" className={inputStyles} />
          <input type="number" value={mealData.calories} onChange={(e) => setMealData({...mealData, calories: e.target.value})} placeholder="Calories" className={inputStyles} />
          
          <div className="flex gap-4 pt-4">
            <button type="button" onClick={onClose} className="w-full py-3 border border-gray-300 font-semibold rounded-lg">Cancel</button>
            <button type="submit" className="w-full py-3 bg-black text-white font-semibold rounded-lg">Add Meal</button>
          </div>
        </form>
      </div>
      {showScanner && <FoodScanner onFoodDetected={handleFoodDetected} onClose={() => setShowScanner(false)} />}
    </div>
  );
}