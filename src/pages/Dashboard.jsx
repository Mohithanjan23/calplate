import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../services/supabaseClient';
import { getTodayMeals } from '../services/foodService';
import Card from '../components/Card.jsx';
import { ChevronRight, Plus } from 'lucide-react';

// A new component for the main calorie progress circle
const CalorieCircle = ({ remaining, goal }) => {
    const progress = goal > 0 ? ((goal - remaining) / goal) * 100 : 0;
    const strokeDashoffset = 283 * (1 - progress / 100); // 2 * pi * 45 (radius)

    return (
        <div className="relative w-40 h-40 mx-auto">
            <svg className="w-full h-full" viewBox="0 0 100 100">
                {/* Background circle */}
                <circle className="text-gray-700" strokeWidth="10" stroke="currentColor" fill="transparent" r="45" cx="50" cy="50" />
                {/* Progress circle */}
                <circle
                    className="text-primary"
                    strokeWidth="10"
                    strokeDasharray="283"
                    strokeDashoffset={strokeDashoffset}
                    strokeLinecap="round"
                    stroke="currentColor"
                    fill="transparent"
                    r="45"
                    cx="50"
                    cy="50"
                    style={{ transform: 'rotate(-90deg)', transformOrigin: '50% 50%' }}
                />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-3xl font-bold">{remaining}</span>
                <span className="text-sm text-text-secondary">Remaining</span>
            </div>
        </div>
    );
};

export default function Dashboard() {
  const { user } = useAuth();
  const [goals, setGoals] = useState({ calories: 2000, protein: 150, carbs: 250, fat: 70 });
  const [progress, setProgress] = useState({ calories: 0, exercise: 0 });

  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;
      
      const { data: goalData } = await supabase.from('goals').select('calories').eq('user_id', user.id).single();
      if (goalData) {
        setGoals(prev => ({ ...prev, calories: goalData.calories || 2000 }));
      }

      const todayMeals = await getTodayMeals();
      const totalCalories = todayMeals.reduce((acc, meal) => acc + (meal.calories || 0), 0);
      setProgress(prev => ({ ...prev, calories: totalCalories }));
    };

    fetchData();
  }, [user]);

  const caloriesRemaining = goals.calories - progress.calories + progress.exercise;

  return (
    <div className="p-4 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Today</h1>
        <button className="text-primary font-semibold">Edit</button>
      </div>

      {/* Calories Card */}
      <Card className="!p-4">
        <div className="flex justify-between items-start mb-4">
            <h2 className="text-xl font-bold">Calories</h2>
            <div className="text-right text-sm">
                <p><span className="text-text-secondary">Base Goal:</span> {goals.calories}</p>
                <p><span className="text-text-secondary">Food:</span> {progress.calories}</p>
                <p><span className="text-text-secondary">Exercise:</span> {progress.exercise}</p>
            </div>
        </div>
        <CalorieCircle remaining={caloriesRemaining} goal={goals.calories} />
      </Card>

      {/* Habit Card */}
      <Card>
        <h2 className="text-xl font-bold">Choose your next habit</h2>
        <p className="text-text-secondary">Big goals start with small habits.</p>
        <button className="mt-4 w-full py-2 bg-primary/20 text-primary font-semibold rounded-lg hover:bg-primary/30">
            Start a habit
        </button>
      </Card>
      
      {/* Other Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Card className="!p-4">
            <h3 className="font-bold mb-2">Steps</h3>
            <Link to="#" className="flex justify-between items-center text-primary">
                <span>Connect to track steps</span>
                <ChevronRight />
            </Link>
        </Card>
        <Card className="!p-4">
            <div className="flex justify-between items-center">
                <h3 className="font-bold">Exercise</h3>
                <button className="text-primary"><Plus size={24}/></button>
            </div>
            <p className="text-text-secondary mt-2">0 cal</p>
        </Card>
      </div>
    </div>
  );
}