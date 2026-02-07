
import React, { useState } from 'react';
import { recipes, type Recipe } from '../../utils/mealDatabase';
import { RecipeCard } from './RecipeCard';
import { Filter, Leaf, Zap, Package, Sun } from 'lucide-react';
import { supabase } from '../../lib/supabaseClient';

interface MealPrepHubProps {
    userId: string;
    onMealAdded: () => void;
}

export const MealPrepHub: React.FC<MealPrepHubProps> = ({ userId, onMealAdded }) => {
    const [activeTab, setActiveTab] = useState<'quick' | 'batch' | 'healthy' | 'seasonal'>('quick');
    const [dietFilter, setDietFilter] = useState('all');

    // Filter recipes
    const filteredRecipes = recipes.filter(r => {
        const matchesCategory = r.category === activeTab;
        const matchesDiet = dietFilter === 'all' || r.dietary.includes(dietFilter);
        return matchesCategory && matchesDiet;
    });

    const handleAddToToday = async (recipe: Recipe) => {
        try {
            const { error } = await supabase!
                .from('meals')
                .insert({
                    user_id: userId,
                    name: recipe.name,
                    calories: recipe.calories,
                    type: recipe.type,
                    created_at: new Date().toISOString()
                });

            if (error) throw error;
            onMealAdded();
        } catch (err) {
            console.error('Error adding recipe meal:', err);
        }
    };

    const categories = [
        { id: 'quick', label: 'Quick', icon: Zap, color: 'text-amber-500' },
        { id: 'batch', label: 'Batch', icon: Package, color: 'text-blue-500' },
        { id: 'healthy', label: 'Healthy', icon: Leaf, color: 'text-green-500' },
        { id: 'seasonal', label: 'Seasonal', icon: Sun, color: 'text-orange-500' },
    ];

    return (
        <div className="p-4 pb-24 max-w-md mx-auto">
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold text-gray-900">Meal Prep Hub</h1>
                <div className="relative">
                    {/* Simplified filter dropdown for MVP */}
                    <select
                        value={dietFilter}
                        onChange={(e) => setDietFilter(e.target.value)}
                        className="appearance-none bg-gray-100 border-none text-sm font-medium py-2 pl-3 pr-8 rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none"
                    >
                        <option value="all">All Diets</option>
                        <option value="vegetarian">Vegetarian</option>
                        <option value="vegan">Vegan</option>
                        <option value="gluten-free">Gluten-Free</option>
                        <option value="keto">Keto</option>
                    </select>
                    <Filter className="w-3 h-3 absolute right-3 top-3 text-gray-500 pointer-events-none" />
                </div>
            </div>

            {/* Categories */}
            <div className="flex gap-2 overflow-x-auto pb-4 scrollbar-hide mb-2">
                {categories.map((cat) => {
                    const Icon = cat.icon;
                    const isActive = activeTab === cat.id;
                    return (
                        <button
                            key={cat.id}
                            onClick={() => setActiveTab(cat.id as any)}
                            className={`flex items-center gap-2 px-4 py-2.5 rounded-full whitespace-nowrap transition-all border ${isActive ? 'bg-gray-900 text-white border-gray-900 shadow-md' : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'}`}
                        >
                            <Icon className={`w-4 h-4 ${isActive ? 'text-white' : cat.color}`} />
                            <span className="text-sm font-medium">{cat.label}</span>
                        </button>
                    )
                })}
            </div>

            {/* Banner */}
            <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 mb-6 flex gap-3">
                <span className="text-xl">💡</span>
                <div>
                    <h4 className="font-bold text-blue-900 text-sm">Pro Tip</h4>
                    <p className="text-xs text-blue-700 leading-relaxed mt-1">
                        {activeTab === 'batch'
                            ? 'Batch cooking on Sundays can save you 5+ hours during the week.'
                            : activeTab === 'quick'
                                ? 'Keep stable ingredients like oats and canned beans for emergencies.'
                                : 'Seasonal produce captures peak nutrition and flavor.'
                        }
                    </p>
                </div>
            </div>

            {/* Recipe Grid */}
            <div>
                {filteredRecipes.length > 0 ? (
                    filteredRecipes.map((recipe) => (
                        <RecipeCard
                            key={recipe.id}
                            recipe={recipe}
                            onAddToToday={handleAddToToday}
                            onSelectForShopping={() => { }}
                        />
                    ))
                ) : (
                    <div className="text-center py-12 text-gray-400">
                        <Filter className="w-12 h-12 mx-auto mb-3 opacity-20" />
                        <p>No recipes found for this filter.</p>
                    </div>
                )}
            </div>

        </div>
    );
};
