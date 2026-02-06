import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Dumbbell, Timer, ArrowLeft, Play, Plus, Activity } from 'lucide-react';

export default function FitnessHub() {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState<'plans' | 'log'>('plans');

    const WORKOUT_PLANS = [
        { id: 1, name: 'Full Body HIIT', duration: '20 min', intensity: 'High', calories: 250, image: '🔥' },
        { id: 2, name: 'Morning Yoga', duration: '15 min', intensity: 'Low', calories: 80, image: '🧘' },
        { id: 3, name: 'Core Crusher', duration: '10 min', intensity: 'Medium', calories: 120, image: '💪' },
    ];

    return (
        <div className="min-h-screen bg-slate-50 p-4 pb-24">
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                    <button onClick={() => navigate('/dashboard')} className="p-2 bg-white rounded-full border border-slate-200">
                        <ArrowLeft className="w-5 h-5" />
                    </button>
                    <h1 className="text-xl font-bold">Fitness Hub</h1>
                </div>
                <button
                    onClick={() => navigate('/log-workout')}
                    className="p-2 bg-indigo-600 text-white rounded-full shadow-lg"
                >
                    <Plus className="w-6 h-6" />
                </button>
            </div>

            {/* Quick Stats */}
            <div className="bg-indigo-600 rounded-3xl p-6 text-white mb-8 shadow-xl shadow-indigo-200">
                <div className="flex items-center gap-3 mb-4 opacity-90">
                    <Activity className="w-5 h-5" />
                    <span className="font-semibold tracking-wider text-sm uppercase">Active Calories</span>
                </div>
                <div className="flex items-end gap-2">
                    <span className="text-5xl font-bold">0</span>
                    <span className="text-lg font-medium opacity-80 mb-2">kcal</span>
                </div>
                <p className="text-indigo-200 text-sm mt-2">No workouts logged today</p>
            </div>

            <div className="flex gap-2 mb-6 bg-white p-1 rounded-xl border border-slate-100">
                <button
                    onClick={() => setActiveTab('plans')}
                    className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'plans' ? 'bg-indigo-50 text-indigo-600' : 'text-slate-400'}`}
                >
                    AI Plans
                </button>
                <button
                    onClick={() => setActiveTab('log')}
                    className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'log' ? 'bg-indigo-50 text-indigo-600' : 'text-slate-400'}`}
                >
                    History
                </button>
            </div>

            {activeTab === 'plans' ? (
                <div className="space-y-4">
                    <h3 className="font-bold text-slate-900 px-1">Recommended for You</h3>
                    {WORKOUT_PLANS.map(plan => (
                        <div key={plan.id} className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex items-center justify-between group cursor-pointer hover:border-indigo-200 transition-colors">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-2xl">
                                    {plan.image}
                                </div>
                                <div>
                                    <h4 className="font-bold text-slate-900">{plan.name}</h4>
                                    <div className="flex items-center gap-3 text-xs text-slate-500 mt-1">
                                        <span className="flex items-center gap-1"><Timer className="w-3 h-3" /> {plan.duration}</span>
                                        <span className="flex items-center gap-1"><Dumbbell className="w-3 h-3" /> {plan.intensity}</span>
                                    </div>
                                </div>
                            </div>
                            <button className="p-2 bg-indigo-50 text-indigo-600 rounded-full">
                                <Play className="w-4 h-4 fill-current" />
                            </button>
                        </div>
                    ))}
                    <button onClick={() => navigate('/ai-coach')} className="w-full py-4 mt-2 text-indigo-600 font-bold text-sm bg-indigo-50/50 rounded-xl border border-dashed border-indigo-200 hover:bg-indigo-50 transition-colors">
                        + Generate New AI Plan
                    </button>
                </div>
            ) : (
                <div className="text-center py-10 text-slate-400">
                    <Dumbbell className="w-12 h-12 mx-auto mb-3 opacity-20" />
                    <p>No workout history yet.</p>
                </div>
            )}
        </div>
    );
}
