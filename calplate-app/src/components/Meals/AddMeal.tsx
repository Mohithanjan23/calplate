import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft, Save } from 'lucide-react';

export default function AddMeal() {
    const location = useLocation();
    const navigate = useNavigate();
    const initialData = location.state?.scannedData || {};

    const [meal, setMeal] = useState({
        name: initialData.name || '',
        calories: initialData.calories || '',
        protein: initialData.protein || '',
        carbs: initialData.carbs || '',
        fat: initialData.fat || '',
    });

    const handleSave = async () => {
        // TODO: Save to database
        console.log("Saving meal:", meal);
        navigate('/dashboard');
    };

    return (
        <div className="min-h-screen bg-slate-50 p-4">
            <div className="flex items-center gap-4 mb-6">
                <button onClick={() => navigate(-1)} className="p-2 bg-white rounded-full border border-slate-200">
                    <ArrowLeft className="w-5 h-5" />
                </button>
                <h1 className="text-xl font-bold">Add Meal</h1>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm space-y-4">
                <div>
                    <label className="text-sm font-medium text-slate-700">Meal Name</label>
                    <input
                        value={meal.name}
                        onChange={e => setMeal({ ...meal, name: e.target.value })}
                        className="w-full p-3 mt-1 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none"
                        placeholder="e.g. Grilled Chicken Salad"
                    />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="text-sm font-medium text-slate-700">Calories</label>
                        <input
                            type="number"
                            value={meal.calories}
                            onChange={e => setMeal({ ...meal, calories: e.target.value })}
                            className="w-full p-3 mt-1 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none"
                            placeholder="0"
                        />
                    </div>
                    {/* Add macros similarly */}
                </div>

                <button onClick={handleSave} className="w-full bg-indigo-600 text-white p-4 rounded-xl font-semibold flex items-center justify-center gap-2 mt-4">
                    <Save className="w-5 h-5" /> Save Meal
                </button>
            </div>
        </div>
    );
}
