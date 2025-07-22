import { useEffect, useState } from 'react';
import { getTodayMeals } from '../services/foodService';
import MealCard from '../components/MealCard';
import { Link } from 'react-router-dom';
import { BarChart3 } from 'lucide-react';

export default function Home() {
  const [meals, setMeals] = useState([]);
  const [calories, setCalories] = useState(0);

  useEffect(() => {
    const fetchMeals = async () => {
      const todayMeals = await getTodayMeals();
      setMeals(todayMeals);
      const totalCalories = todayMeals.reduce((acc, meal) => acc + (meal.calories || 0), 0);
      setCalories(totalCalories);
    };

    fetchMeals();
  }, []);

  return (
    <div className="px-4 py-4 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold">Today</h1>
        <Link
          to="/stats"
          className="flex items-center text-blue-600 hover:underline gap-1"
        >
          <BarChart3 size={16} /> Stats
        </Link>
      </div>

      <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-md">
        <h2 className="text-lg font-semibold mb-2">Calories Consumed</h2>
        <p className="text-3xl font-bold text-blue-600">{calories} kcal</p>
      </div>

      <div className="space-y-2">
        <h2 className="text-lg font-semibold">Meal Log</h2>
        {meals.length === 0 ? (
          <p className="text-gray-500">No meals logged yet.</p>
        ) : (
          meals.map((meal, idx) => <MealCard key={idx} meal={meal} />)
        )}
      </div>

      <Link
        to="/add"
        className="block w-full text-center bg-blue-600 text-white py-2 rounded-xl font-semibold mt-4 hover:bg-blue-700"
      >
        + Add New Meal
      </Link>
    </div>
  );
}
