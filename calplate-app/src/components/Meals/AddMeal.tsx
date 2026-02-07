
import React, { useState } from 'react';
import { X, Camera, Edit3 } from 'lucide-react';
import { supabase } from '../../lib/supabaseClient';
import { CommonFoods } from './CommonFoods';
import { FoodScanner } from './FoodScanner';

interface AddMealProps {
    onClose: () => void;
    onAdd: () => void;
    userId: string;
}

export const AddMeal: React.FC<AddMealProps> = ({ onClose, onAdd, userId }) => {
    const [activeTab, setActiveTab] = useState<'scan' | 'manual'>('scan');
    const [name, setName] = useState('');
    const [calories, setCalories] = useState('');
    const [type, setType] = useState('breakfast');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e?: React.FormEvent) => {
        e?.preventDefault();
        if (!name || !calories) return;

        setLoading(true);
        try {
            const { error } = await supabase!
                .from('meals')
                .insert({
                    user_id: userId,
                    name,
                    calories: Number(calories),
                    type,
                    created_at: new Date().toISOString()
                });

            if (error) throw error;
            onAdd();
        } catch (err) {
            console.error('Error adding meal:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleFoodSelect = (food: { name: string; calories: number }) => {
        setName(food.name);
        setCalories(food.calories.toString());
        setActiveTab('manual'); // Switch to manual to review/edit before submit
    };

    return (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white w-full max-w-md rounded-t-2xl sm:rounded-2xl p-6 relative max-h-[90vh] overflow-y-auto shadow-2xl animate-in slide-in-from-bottom-10 duration-300">

                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 p-2 bg-gray-100 rounded-full text-gray-500 hover:bg-gray-200"
                >
                    <X className="w-5 h-5" />
                </button>

                <h2 className="text-xl font-bold mb-6">Log Meal</h2>

                {/* Tabs */}
                <div className="flex bg-gray-100 p-1 rounded-xl mb-6">
                    <button
                        onClick={() => setActiveTab('scan')}
                        className={`flex-1 py-2 text-sm font-medium rounded-lg flex items-center justify-center gap-2 transition-all ${activeTab === 'scan' ? 'bg-white shadow-sm text-green-600' : 'text-gray-500 hover:text-gray-700'}`}
                    >
                        <Camera className="w-4 h-4" /> AI Scan
                    </button>
                    <button
                        onClick={() => setActiveTab('manual')}
                        className={`flex-1 py-2 text-sm font-medium rounded-lg flex items-center justify-center gap-2 transition-all ${activeTab === 'manual' ? 'bg-white shadow-sm text-green-600' : 'text-gray-500 hover:text-gray-700'}`}
                    >
                        <Edit3 className="w-4 h-4" /> Manual
                    </button>
                </div>

                {activeTab === 'scan' ? (
                    <div className="space-y-6">
                        <FoodScanner onDetected={(food) => handleFoodSelect(food)} />

                        <div>
                            <div className="flex items-center gap-2 mb-3">
                                <div className="h-px bg-gray-200 flex-1" />
                                <span className="text-xs text-gray-400 font-medium">QUICK ADD</span>
                                <div className="h-px bg-gray-200 flex-1" />
                            </div>
                            <CommonFoods onSelect={handleFoodSelect} />
                        </div>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Meal Name</label>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="block w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                                placeholder="e.g., Oatmeal"
                                autoFocus
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Calories</label>
                                <input
                                    type="number"
                                    value={calories}
                                    onChange={(e) => setCalories(e.target.value)}
                                    className="block w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                                    placeholder="0"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                                <select
                                    value={type}
                                    onChange={(e) => setType(e.target.value)}
                                    className="block w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 bg-white"
                                >
                                    <option value="breakfast">Breakfast</option>
                                    <option value="lunch">Lunch</option>
                                    <option value="dinner">Dinner</option>
                                    <option value="snack">Snack</option>
                                </select>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading || !name || !calories}
                            className="w-full bg-green-600 text-white py-3 rounded-lg font-medium hover:bg-green-700 disabled:opacity-50 mt-4 shadow-lg shadow-green-200"
                        >
                            {loading ? 'Adding...' : 'Add Meal'}
                        </button>
                    </form>
                )}

            </div>
        </div>
    );
};
