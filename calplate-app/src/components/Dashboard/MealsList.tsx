
import React from 'react';
import { Utensils, Clock, Trash2 } from 'lucide-react';
import { supabase } from '../../lib/supabaseClient';

interface Meal {
    id: number;
    name: string;
    calories: number;
    type: string;
    created_at: string;
}

interface MealsListProps {
    meals: Meal[];
    onDelete?: (id: number) => void;
}

export const MealsList: React.FC<MealsListProps> = ({ meals, onDelete }) => {
    const handleDelete = async (id: number) => {
        if (onDelete) {
            onDelete(id);
        } else {
            // Fallback internal delete if not provided prop
            const { error } = await supabase!
                .from('meals')
                .delete()
                .eq('id', id);

            if (error) {
                console.error('Error deleting meal:', error);
                alert('Failed to delete meal');
            } else {
                // Ideally we should update parent state, but trigger refresh via prop is better
                window.location.reload(); // Temporary brute force if no handler
            }
        }
    };

    if (meals.length === 0) {
        return (
            <div className="bg-gray-100 rounded-2xl p-8 text-center border border-gray-200 border-dashed">
                <div className="bg-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
                    <Utensils className="w-8 h-8 text-gray-300" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-1">No meals logged today</h3>
                <p className="text-gray-500 text-sm">Use the AI scanner or manual entry to track your food.</p>
            </div>
        );
    }

    return (
        <div className="space-y-4 mb-24">
            <h3 className="font-semibold text-gray-800 flex items-center gap-2">
                <CalendarIcon /> Today's Meals
            </h3>

            <div className="space-y-3">
                {meals.map((meal) => (
                    <div key={meal.id} className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex justify-between items-center group">
                        <div className="flex items-center gap-4">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${meal.type === 'breakfast' ? 'bg-orange-100 text-orange-600' :
                                    meal.type === 'lunch' ? 'bg-blue-100 text-blue-600' :
                                        meal.type === 'dinner' ? 'bg-indigo-100 text-indigo-600' :
                                            'bg-green-100 text-green-600'
                                }`}>
                                <span className="text-xs font-bold uppercase">{meal.type[0]}</span>
                            </div>
                            <div>
                                <h4 className="font-medium text-gray-900 capitalize">{meal.name}</h4>
                                <div className="flex items-center gap-2 text-xs text-gray-500">
                                    <Clock className="w-3 h-3" />
                                    {new Date(meal.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center gap-4">
                            <span className="font-bold text-gray-900">{meal.calories} <span className="text-xs font-normal text-gray-500">cal</span></span>
                            <button
                                onClick={() => handleDelete(meal.id)}
                                className="p-2 text-gray-400 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                                title="Delete meal"
                            >
                                <Trash2 className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

const CalendarIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-500"><rect width="18" height="18" x="3" y="4" rx="2" ry="2" /><line x1="16" x2="16" y1="2" y2="6" /><line x1="8" x2="8" y1="2" y2="6" /><line x1="3" x2="21" y1="10" y2="10" /></svg>
)
