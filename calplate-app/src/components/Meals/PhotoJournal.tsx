import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { PanInfo } from 'framer-motion';
import { Trash2, Utensils } from 'lucide-react';

interface Meal {
    id: number;
    name: string;
    calories: number;
    image?: string;
    time: string;
}

const MOCK_MEALS: Meal[] = [
    { id: 1, name: 'Oatmeal & Berries', calories: 350, time: '8:30 AM', image: 'https://images.unsplash.com/photo-1517093724098-3628a9077792?auto=format&fit=crop&w=150&q=80' },
    { id: 2, name: 'Grilled Chicken Salad', calories: 450, time: '1:15 PM' }, // No image fallback
];

export default function PhotoJournal() {
    const [meals, setMeals] = useState<Meal[]>(MOCK_MEALS);

    const handleDragEnd = (_: Event, info: PanInfo, id: number) => {
        if (info.offset.x < -100) {
            setMeals((prev) => prev.filter((meal) => meal.id !== id));
        }
    };

    return (
        <div className="space-y-4">
            <h3 className="font-bold text-slate-900 px-1">Today's Meals</h3>
            <AnimatePresence>
                {meals.length === 0 ? (
                    <div className="text-center py-10 text-slate-400 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                        <p>No meals logged yet.</p>
                    </div>
                ) : (
                    meals.map((meal) => (
                        <div key={meal.id} className="relative overflow-hidden rounded-2xl shadow-sm group">
                            {/* Background / Delete Layer */}
                            <div className="absolute inset-0 bg-red-500 flex items-center justify-end pr-6">
                                <Trash2 className="w-6 h-6 text-white" />
                            </div>

                            {/* Swipeable Card */}
                            <motion.div
                                drag="x"
                                dragConstraints={{ left: 0, right: 0 }}
                                onDragEnd={(e, info) => handleDragEnd(e, info, meal.id)}
                                className="bg-white p-3 pr-4 flex items-center gap-4 relative z-10 cursor-grab active:cursor-grabbing"
                            >
                                <div className="w-16 h-16 rounded-xl overflow-hidden bg-slate-100 flex-shrink-0">
                                    {meal.image ? (
                                        <img src={meal.image} alt={meal.name} className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-slate-300">
                                            <Utensils className="w-6 h-6" />
                                        </div>
                                    )}
                                </div>
                                <div className="flex-1">
                                    <div className="flex justify-between items-start">
                                        <h4 className="font-bold text-slate-900">{meal.name}</h4>
                                        <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2 py-1 rounded-full">
                                            {meal.calories} kcal
                                        </span>
                                    </div>
                                    <p className="text-xs text-slate-400 mt-1">{meal.time}</p>
                                </div>
                            </motion.div>
                        </div>
                    ))
                )}
            </AnimatePresence>
            <p className="text-xs text-center text-slate-400 mt-2">Swipe left to delete entry</p>
        </div>
    );
}
