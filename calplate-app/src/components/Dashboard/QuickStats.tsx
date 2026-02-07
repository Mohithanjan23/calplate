
import React from 'react';
import { Utensils, Zap, Calendar } from 'lucide-react';

interface QuickStatsProps {
    todayMealsCount: number;
    avgCalories: number;
    streak?: number;
}

export const QuickStats: React.FC<QuickStatsProps> = ({ todayMealsCount, avgCalories, streak = 0 }) => {
    return (
        <div className="grid grid-cols-3 gap-3 mb-6">
            <div className="bg-blue-50 p-3 rounded-xl border border-blue-100 flex flex-col items-center text-center">
                <Utensils className="w-5 h-5 text-blue-600 mb-1" />
                <span className="text-xl font-bold text-gray-800">{todayMealsCount}</span>
                <span className="text-[10px] uppercase tracking-wide font-medium text-blue-600">Meals</span>
            </div>
            <div className="bg-green-50 p-3 rounded-xl border border-green-100 flex flex-col items-center text-center">
                <Zap className="w-5 h-5 text-green-600 mb-1" />
                <span className="text-xl font-bold text-gray-800">{avgCalories}</span>
                <span className="text-[10px] uppercase tracking-wide font-medium text-green-600">Avg Cal</span>
            </div>
            <div className="bg-purple-50 p-3 rounded-xl border border-purple-100 flex flex-col items-center text-center">
                <Calendar className="w-5 h-5 text-purple-600 mb-1" />
                <span className="text-xl font-bold text-gray-800">{streak}</span>
                <span className="text-[10px] uppercase tracking-wide font-medium text-purple-600">Day Streak</span>
            </div>
        </div>
    );
};
