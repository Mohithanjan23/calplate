import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, Star, Minus, Plus } from 'lucide-react';

export default function AddMeal() {
    const location = useLocation();
    const navigate = useNavigate();
    const initialData = location.state?.scannedData || {};

    const [baseMeal, setBaseMeal] = useState({
        name: initialData.name || '',
        calories: Number(initialData.calories) || 0,
        protein: Number(initialData.protein) || 0,
        carbs: Number(initialData.carbs) || 0,
        fat: Number(initialData.fat) || 0,
    });

    const [portion, setPortion] = useState(1);

    // Derived state for display
    const displayedStats = {
        calories: Math.round(baseMeal.calories * portion),
        protein: Math.round(baseMeal.protein * portion),
        carbs: Math.round(baseMeal.carbs * portion),
        fat: Math.round(baseMeal.fat * portion),
    };

    const handleSave = async () => {
        // TODO: Save to database with displayedStats
        console.log("Saving meal:", { ...baseMeal, ...displayedStats, portion });
        navigate('/dashboard');
    };

    const QUICK_LOGS = [
        { name: 'Oatmeal', calories: 150, protein: 5, carbs: 27, fat: 3 },
        { name: 'Banana', calories: 105, protein: 1, carbs: 27, fat: 0 },
        { name: 'Protein Shake', calories: 120, protein: 25, carbs: 2, fat: 1 },
    ];

    const loadQuickLog = (item: any) => {
        setBaseMeal({
            name: item.name,
            calories: item.calories,
            protein: item.protein,
            carbs: item.carbs,
            fat: item.fat
        });
        setPortion(1);
    };

    return (
        <div className="min-h-screen bg-slate-50 p-4 pb-20">
            <div className="flex items-center gap-4 mb-6">
                <button onClick={() => navigate(-1)} className="p-2 bg-white rounded-full border border-slate-200">
                    <ArrowLeft className="w-5 h-5" />
                </button>
                <h1 className="text-xl font-bold">Add Meal</h1>
            </div>

            <div className="space-y-6">
                {/* Manual Input Card */}
                <div className="bg-white p-6 rounded-3xl shadow-sm space-y-4">
                    <div>
                        <label className="text-sm font-medium text-slate-700">Meal Name</label>
                        <input
                            value={baseMeal.name}
                            onChange={e => setBaseMeal({ ...baseMeal, name: e.target.value })}
                            className="w-full p-3 mt-1 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none font-medium"
                            placeholder="e.g. Grilled Chicken Salad"
                        />
                    </div>

                    <div className="p-4 bg-slate-50 rounded-2xl">
                        <div className="flex justify-between items-center mb-4">
                            <span className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Portion Size</span>
                            <span className="text-lg font-bold text-indigo-600">{portion}x</span>
                        </div>
                        <div className="flex items-center gap-4">
                            <button onClick={() => setPortion(p => Math.max(0.5, p - 0.5))} className="p-2 bg-white rounded-full shadow-sm text-slate-400 hover:text-indigo-600">
                                <Minus className="w-4 h-4" />
                            </button>
                            <input
                                type="range"
                                min="0.5"
                                max="3"
                                step="0.5"
                                value={portion}
                                onChange={(e) => setPortion(parseFloat(e.target.value))}
                                className="flex-1 accent-indigo-600 h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer"
                            />
                            <button onClick={() => setPortion(p => Math.min(3, p + 0.5))} className="p-2 bg-white rounded-full shadow-sm text-slate-400 hover:text-indigo-600">
                                <Plus className="w-4 h-4" />
                            </button>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="bg-indigo-50 p-3 rounded-2xl border border-indigo-100">
                            <label className="text-xs font-bold text-indigo-400 uppercase">Calories</label>
                            <div className="text-2xl font-bold text-indigo-900">{displayedStats.calories}</div>
                        </div>
                        <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100">
                            <label className="text-xs font-bold text-slate-400 uppercase">Protein</label>
                            <div className="text-2xl font-bold text-slate-700">{displayedStats.protein}g</div>
                        </div>
                    </div>

                    <button onClick={handleSave} className="w-full bg-indigo-600 text-white p-4 rounded-xl font-semibold flex items-center justify-center gap-2 mt-4 shadow-lg shadow-indigo-200">
                        <Save className="w-5 h-5" /> Save To Journal
                    </button>
                </div>

                {/* Quick Log Favorites */}
                <div>
                    <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-3 px-1">Quick Log Favorites</h3>
                    <div className="flex gap-3 overflow-x-auto pb-4 scrollbar-hide">
                        {QUICK_LOGS.map((item, idx) => (
                            <button
                                key={idx}
                                onClick={() => loadQuickLog(item)}
                                className="flex-shrink-0 bg-white p-3 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-3 pr-4 group hover:border-indigo-200 transition-all"
                            >
                                <div className="p-2 bg-yellow-50 rounded-full text-yellow-500">
                                    <Star className="w-4 h-4 fill-yellow-500" />
                                </div>
                                <div className="text-left">
                                    <div className="font-bold text-slate-900 text-sm">{item.name}</div>
                                    <div className="text-xs text-slate-400">{item.calories} kcal</div>
                                </div>
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
