import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../services/supabaseClient';
import { Target, Calendar, Utensils } from 'lucide-react';

export default function Dashboard() {
    const { user } = useAuth();
    const [profile, setProfile] = useState(null);
    const [meals, setMeals] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            if (!user) return;

            const { data: profileData } = await supabase.from('profiles').select('*').eq('id', user.id).single();
            if (profileData) setProfile(profileData);

            const today = new Date().toISOString().slice(0, 10);
            const { data: mealData } = await supabase.from('meal_logs').select('*').eq('user_id', user.id).gte('created_at', `${today}T00:00:00Z`).lte('created_at', `${today}T23:59:59Z`);
            if (mealData) setMeals(mealData);
        };
        fetchData();
    }, [user]);

    const todayCalories = meals.reduce((sum, meal) => sum + meal.calories, 0);
    const calorieGoal = profile?.calorie_goal || 2000;
    const progress = (todayCalories / calorieGoal) * 100;
    const remaining = Math.max(0, calorieGoal - todayCalories);

    return (
        <div className="space-y-6">
            <div className="bg-gradient-to-r from-green-600 to-green-700 text-white p-6 rounded-2xl">
                <h1 className="text-2xl font-bold">Hello, {profile?.name || user?.email}! 👋</h1>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm border">
                <h2 className="text-lg font-semibold mb-4">Today's Progress</h2>
                <div className="flex justify-between items-center text-2xl font-bold">
                    <span>{todayCalories}</span>
                    <span className="text-gray-500">/ {calorieGoal} cal</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3 mt-4">
                    <div className="bg-gradient-to-r from-green-500 to-green-600 h-3 rounded-full" style={{ width: `${Math.min(progress, 100)}%` }} />
                </div>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm border">
                <h2 className="text-lg font-semibold mb-4">Today's Meals</h2>
                {meals.length > 0 ? (
                    <div className="space-y-3">
                        {meals.map(meal => (
                            <div key={meal.id} className="flex justify-between p-3 bg-gray-50 rounded-lg">
                                <p className="font-medium capitalize">{meal.food_name}</p>
                                <p className="font-semibold">{meal.calories} cal</p>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-8 text-gray-500">
                        <Utensils className="w-12 h-12 mx-auto mb-3 opacity-30" />
                        <p>No meals logged today.</p>
                    </div>
                )}
            </div>
        </div>
    );
}