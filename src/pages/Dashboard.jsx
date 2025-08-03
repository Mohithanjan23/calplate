import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../services/supabaseClient';
import Card from '../components/Card.jsx';
import { getTodayMeals } from '../services/foodService';
import MealCard from '../components/MealCard.jsx';

const MacroBar = ({ label, value, goal, color }) => (
  <div>
    <div className="flex justify-between items-baseline mb-1">
      <span className="text-sm font-medium text-text-secondary">{label}</span>
      <span className="text-sm">{value} / {goal}g</span>
    </div>
    <div className="w-full bg-black/20 rounded-full h-2">
      <div className={`${color} h-2 rounded-full`} style={{ width: `${Math.min((value / goal) * 100, 100)}%` }}></div>
    </div>
  </div>
);

export default function Dashboard() {
  const { user } = useAuth();
  const [meals, setMeals] = useState([]);
  const [goals, setGoals] = useState({ calories: 2000, protein: 150, carbs: 250, fat: 70 });
  const [progress, setProgress] = useState({ calories: 0, protein: 0, carbs: 0, fat: 0 });

  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;

      // Fetch user goals
      const { data: goalData } = await supabase.from('goals').select('*').eq('user_id', user.id).single();
      if (goalData) {
        setGoals({
          calories: goalData.calories || 2000,
          protein: goalData.protein || 150,
          carbs: goalData.carbs || 250,
          fat: goalData.fat || 70,
        });
      }

      // Fetch today's meals and calculate progress
      const todayMeals = await getTodayMeals();
      setMeals(todayMeals);
      const totalProgress = todayMeals.reduce((acc, meal) => {
        acc.calories += meal.calories || 0;
        acc.protein += meal.protein_g || 0;
        acc.carbs += meal.carbs_g || 0;
        acc.fat += meal.fat_g || 0;
        return acc;
      }, { calories: 0, protein: 0, carbs: 0, fat: 0 });
      setProgress(totalProgress);
    };

    fetchData();
  }, [user]);

  const caloriesRemaining = goals.calories - progress.calories;

  return (
    <div className="p-4 space-y-6">
      <h2 className="text-3xl font-bold">Welcome back!</h2>
      <Card>
        <div className="flex justify-between items-center">
          <div>
            <p className="text-sm text-text-secondary">Calories Remaining</p>
            <p className="text-4xl font-bold">{caloriesRemaining}</p>
          </div>
          <div className="text-right">
            <p className="font-bold text-lg text-primary">{progress.calories}</p>
            <p className="text-sm text-text-secondary">Eaten</p>
          </div>
        </div>
        <div className="space-y-3 mt-4">
          <MacroBar label="Protein" value={progress.protein} goal={goals.protein} color="bg-sky-400" />
          <MacroBar label="Carbs" value={progress.carbs} goal={goals.carbs} color="bg-orange-400" />
          <MacroBar label="Fat" value={progress.fat} goal={goals.fat} color="bg-yellow-400" />
        </div>
      </Card>
      
      <div>
        <h3 className="text-xl font-bold mb-3">Today's Meals</h3>
        <div className="space-y-3">
          {meals.length > 0 ? (
            meals.map((meal) => <MealCard key={meal.id} meal={meal} />)
          ) : (
            <p className="text-text-secondary">No meals logged yet.</p>
          )}
          <Link to="/add" className="block w-full text-center py-3 bg-primary/20 text-primary font-bold rounded-lg border-2 border-dashed border-primary/50 hover:bg-primary/30 transition-colors">
            + Log a New Meal
          </Link>
        </div>
      </div>
    </div>
  );
}