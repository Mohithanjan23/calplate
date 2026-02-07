
import React from 'react';
import { ProgressCard } from './ProgressCard';
import { QuickStats } from './QuickStats';
import { MealsList } from './MealsList';

interface DashboardProps {
    user: any;
    meals: any[];
    onDeleteMeal: (id: number) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ user, meals, onDeleteMeal }) => {
    // Calculate stats
    const today = new Date().toDateString();
    const todayMeals = meals.filter(m =>
        new Date(m.created_at).toDateString() === today
    );

    const todayCalories = todayMeals.reduce((sum, m) => sum + m.calories, 0);
    const avgCalories = Math.round(todayCalories / Math.max(1, todayMeals.length));

    // Calculate streak (Mock logic for now, or based on unique dates in meals if we had full history loaded)
    // For MVP, simplistic streak of days active can be calculated in parent or passed down.
    // Using a placeholder or simple logic here.
    const uniqueDates = new Set(meals.map(m => new Date(m.created_at).toDateString()));
    const streak = uniqueDates.size;

    return (
        <div className="p-6 pb-24 max-w-md mx-auto">
            {/* Header */}
            <div className="mb-6 pt-2">
                <h1 className="text-2xl font-bold text-gray-900">
                    Hello, {user?.name?.split(' ')[0] || 'Friend'}! 👋
                </h1>
                <p className="text-gray-500 text-sm">Track your nutrition with AI assistance</p>
            </div>

            {/* Progress Card */}
            <ProgressCard
                currentCalories={todayCalories}
                goalCalories={user?.calorie_goal || 2000}
            />

            {/* Quick Stats */}
            <QuickStats
                todayMealsCount={todayMeals.length}
                avgCalories={avgCalories}
                streak={streak}
            />

            {/* Meals List */}
            <MealsList meals={todayMeals} onDelete={onDeleteMeal} />

        </div>
    );
};
