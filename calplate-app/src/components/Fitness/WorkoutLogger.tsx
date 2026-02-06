import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, Activity, Dumbbell, Timer } from 'lucide-react';

export default function WorkoutLogger() {
    const navigate = useNavigate();
    const [type, setType] = useState<'cardio' | 'strength'>('cardio');
    const [duration, setDuration] = useState('');
    const [calories, setCalories] = useState('');

    // Strength specific
    const [sets, setSets] = useState('');
    const [weight, setWeight] = useState('');

    const handleSave = () => {
        // TODO: Save to Supabase (daily_logs with exercise_calories)
        console.log("Saving workout:", { type, duration, calories, sets, weight });
        alert(`Logged ${type === 'cardio' ? calories : 'Strength'} workout!`);
        navigate('/fitness-hub');
    };

    return (
        <div className="min-h-screen bg-slate-50 p-4">
            <div className="flex items-center gap-4 mb-6">
                <button onClick={() => navigate(-1)} className="p-2 bg-white rounded-full border border-slate-200">
                    <ArrowLeft className="w-5 h-5" />
                </button>
                <h1 className="text-xl font-bold">Log Workout</h1>
            </div>

            <div className="bg-white p-6 rounded-3xl shadow-sm space-y-6">

                {/* Type Toggle */}
                <div className="flex gap-2 p-1 bg-slate-100 rounded-xl">
                    <button
                        onClick={() => setType('cardio')}
                        className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-lg font-bold transition-all ${type === 'cardio' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-400'}`}
                    >
                        <Activity className="w-4 h-4" /> Cardio
                    </button>
                    <button
                        onClick={() => setType('strength')}
                        className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-lg font-bold transition-all ${type === 'strength' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-400'}`}
                    >
                        <Dumbbell className="w-4 h-4" /> Strength
                    </button>
                </div>

                <div className="space-y-4">
                    <div>
                        <label className="text-sm font-medium text-slate-700">Exercise Name</label>
                        <input
                            className="w-full p-3 mt-1 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none font-medium"
                            placeholder={type === 'cardio' ? "e.g. Running, Cycling" : "e.g. Bench Press, Squats"}
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="text-sm font-medium text-slate-700 flex items-center gap-1">
                                <Timer className="w-4 h-4 text-slate-400" /> Duration (min)
                            </label>
                            <input
                                type="number"
                                value={duration}
                                onChange={(e) => setDuration(e.target.value)}
                                className="w-full p-3 mt-1 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none"
                                placeholder="30"
                            />
                        </div>

                        {type === 'cardio' ? (
                            <div>
                                <label className="text-sm font-medium text-slate-700 flex items-center gap-1">
                                    <Activity className="w-4 h-4 text-slate-400" /> Calories
                                </label>
                                <input
                                    type="number"
                                    value={calories}
                                    onChange={(e) => setCalories(e.target.value)}
                                    className="w-full p-3 mt-1 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none"
                                    placeholder="250"
                                />
                            </div>
                        ) : (
                            <div>
                                <label className="text-sm font-medium text-slate-700 flex items-center gap-1">
                                    <Dumbbell className="w-4 h-4 text-slate-400" /> Weight (kg)
                                </label>
                                <input
                                    type="number"
                                    value={weight}
                                    onChange={(e) => setWeight(e.target.value)}
                                    className="w-full p-3 mt-1 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none"
                                    placeholder="20"
                                />
                            </div>
                        )}
                    </div>

                    {type === 'strength' && (
                        <div>
                            <label className="text-sm font-medium text-slate-700">Sets x Reps</label>
                            <input
                                value={sets}
                                onChange={(e) => setSets(e.target.value)}
                                className="w-full p-3 mt-1 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none"
                                placeholder="3 x 12"
                            />
                        </div>
                    )}
                </div>

                <div className="pt-4">
                    <button onClick={handleSave} className="w-full bg-indigo-600 text-white p-4 rounded-xl font-semibold flex items-center justify-center gap-2 shadow-lg shadow-indigo-200">
                        <Save className="w-5 h-5" /> Save Workout
                    </button>
                </div>
            </div>
        </div>
    );
}
