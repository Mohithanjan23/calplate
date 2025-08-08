import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../services/supabaseClient';
import { getTodayMeals } from '../services/foodService';
import Card from '../components/Card.jsx';
import MealCard from '../components/MealCard.jsx';

// Reusable component for the main calorie progress bar
const CalorieProgress = ({ value, goal }) => {
    const percentage = goal > 0 ? Math.min((value / goal) * 100, 100) : 0;
    return (
        <div className="w-full bg-surface rounded-full h-4 border border-white/10">
            <div 
                className="bg-primary h-4 rounded-full" 
                style={{ width: `${percentage}%` }}
            ></div>
        </div>
    );
};

export default function Dashboard() {
  const { user } = useAuth();
  const [meals, setMeals] = useState([]);
  const [goals, setGoals] = useState({ calories: 2000 });
  const [progress, setProgress] = useState({ calories: 0 });

  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;

      const { data: goalData } = await supabase.from('goals').select('calories').eq('user_id', user.id).single();
      if (goalData) {
        setGoals({ calories: goalData.calories || 2000 });
      }

      const todayMeals = await getTodayMeals();
      setMeals(todayMeals);
      const totalCalories = todayMeals.reduce((acc, meal) => acc + (meal.calories || 0), 0);
      setProgress({ calories: totalCalories });
    };

    fetchData();
  }, [user]);

  return (
    <div className="p-4 space-y-6">
      <h2 className="text-3xl font-bold text-text-primary">Dashboard</h2>
      
      <Card>
        <div className="flex justify-between items-baseline mb-2">
            <p className="font-semibold">Daily Calories</p>
            <p className="text-sm text-text-secondary">
                <span className="font-bold text-white">{progress.calories}</span> / {goals.calories} kcal
            </p>
        </div>
        <CalorieProgress value={progress.calories} goal={goals.calories} />
      </Card>
      
      <div>
        <h3 className="text-xl font-bold mb-3">Today's Meals</h3>
        <div className="space-y-3">
          {meals.length > 0 ? (
            meals.map((meal) => <MealCard key={meal.id} meal={meal} />)
          ) : (
            <p className="text-text-secondary text-center py-4">No meals logged yet.</p>
          )}
          <Link to="/add" className="block w-full text-center py-3 bg-primary/20 text-primary font-bold rounded-lg border-2 border-dashed border-primary/50 hover:bg-primary/30 transition-colors">
            + Log a New Meal
          </Link>
        </div>
      </div>
    </div>
  );
}