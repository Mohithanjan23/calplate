
import React from 'react';
import { Target, Flame, TrendingUp } from 'lucide-react';

interface ProgressCardProps {
    currentCalories: number;
    goalCalories: number;
}

export const ProgressCard: React.FC<ProgressCardProps> = ({ currentCalories, goalCalories }) => {
    const percentage = Math.min(100, Math.round((currentCalories / goalCalories) * 100));
    const remaining = Math.max(0, goalCalories - currentCalories);

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                    <div className="bg-green-100 p-2 rounded-lg">
                        <Target className="w-5 h-5 text-green-600" />
                    </div>
                    <h3 className="font-semibold text-gray-800">Today's Progress</h3>
                </div>
                <span className="text-sm font-medium text-gray-500">
                    {percentage}% of goal
                </span>
            </div>

            <div className="flex items-end gap-2 mb-2">
                <span className="text-4xl font-bold text-gray-900">{currentCalories}</span>
                <span className="text-gray-500 mb-1.5 font-medium">/ {goalCalories} cal</span>
            </div>

            <div className="w-full bg-gray-100 rounded-full h-3 mb-4 overflow-hidden">
                <div
                    className="bg-gradient-to-r from-green-500 to-green-600 h-full rounded-full transition-all duration-500 ease-out"
                    style={{ width: `${percentage}%` }}
                />
            </div>

            <div className="flex justify-between items-center text-sm">
                <div className="flex items-center gap-1.5 text-gray-600">
                    <Flame className="w-4 h-4 text-orange-500" />
                    <span>{remaining} cal remaining</span>
                </div>
                <div className="flex items-center gap-1.5 text-blue-600 font-medium">
                    <TrendingUp className="w-4 h-4" />
                    <span>Keep going!</span>
                </div>
            </div>
        </div>
    );
};
