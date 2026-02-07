
import React from 'react';
import { supabase } from '../../lib/supabaseClient';
import { LogOut, User, Activity, Target, Mail } from 'lucide-react';

interface ProfileProps {
    user: any;
    meals: any[];
}

export const Profile: React.FC<ProfileProps> = ({ user, meals }) => {
    const handleSignOut = async () => {
        await supabase!.auth.signOut();
        // App.tsx auth listener will handle redirect
    };

    const uniqueDays = new Set(meals.map(m => new Date(m.created_at).toDateString())).size;
    const totalCalories = meals.reduce((sum, m) => sum + m.calories, 0);
    const avgCalories = uniqueDays > 0 ? Math.round(totalCalories / uniqueDays) : 0;

    return (
        <div className="p-6 pb-24 max-w-md mx-auto">
            <h1 className="text-2xl font-bold text-gray-900 mb-6">Profile</h1>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6 flex items-center gap-4">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center text-green-600">
                    <span className="text-2xl font-bold">{user.name?.charAt(0).toUpperCase()}</span>
                </div>
                <div>
                    <h2 className="text-xl font-bold text-gray-900">{user.name}</h2>
                    <div className="flex items-center gap-1 text-sm text-gray-500">
                        <Mail className="w-3 h-3" />
                        {user.email}
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                    <div className="flex items-center gap-2 mb-2 text-gray-600">
                        <Activity className="w-4 h-4" />
                        <span className="text-sm font-medium">Activity</span>
                    </div>
                    <div className="font-bold text-lg capitalize">{user.activity}</div>
                </div>
                <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                    <div className="flex items-center gap-2 mb-2 text-gray-600">
                        <Target className="w-4 h-4" />
                        <span className="text-sm font-medium">Goal</span>
                    </div>
                    <div className="font-bold text-lg capitalize">{user.goal}</div>
                    <div className="text-xs text-green-600 font-medium mt-1">{user.calorie_goal} cal/day</div>
                </div>
            </div>

            <h3 className="font-bold text-gray-800 mb-4">Statistics</h3>
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden mb-8">
                <div className="p-4 border-b border-gray-50 flex justify-between items-center">
                    <span className="text-gray-600 text-sm">Total Meals Logged</span>
                    <span className="font-bold text-gray-900">{meals.length}</span>
                </div>
                <div className="p-4 border-b border-gray-50 flex justify-between items-center">
                    <span className="text-gray-600 text-sm">Days Active</span>
                    <span className="font-bold text-gray-900">{uniqueDays}</span>
                </div>
                <div className="p-4 flex justify-between items-center">
                    <span className="text-gray-600 text-sm">Avg. Daily Calories</span>
                    <span className="font-bold text-gray-900">{avgCalories}</span>
                </div>
            </div>

            <button
                onClick={handleSignOut}
                className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl border border-red-100 bg-red-50 text-red-600 font-medium hover:bg-red-100 transition-colors"
            >
                <LogOut className="w-4 h-4" />
                Sign Out
            </button>

            <div className="text-center mt-8 text-xs text-gray-400">
                Calplate v1.0.0
            </div>

        </div>
    );
};
