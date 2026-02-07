
import React, { useState } from 'react';
import { type Recipe } from '../../utils/mealDatabase';
import { Clock, ChefHat, DollarSign, ChevronDown, ChevronUp, Plus, Check } from 'lucide-react';

interface RecipeCardProps {
    recipe: Recipe;
    onAddToToday: (recipe: Recipe) => void;
    onSelectForShopping: (recipe: Recipe) => void;
    isShoppingListed?: boolean;
}

export const RecipeCard: React.FC<RecipeCardProps> = ({ recipe, onAddToToday }) => {
    const [expanded, setExpanded] = useState(false);
    const [added, setAdded] = useState(false);

    const handleAdd = (e: React.MouseEvent) => {
        e.stopPropagation();
        onAddToToday(recipe);
        setAdded(true);
        setTimeout(() => setAdded(false), 2000);
    };

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mb-4 transition-all hover:shadow-md">
            <div className="p-4 cursor-pointer" onClick={() => setExpanded(!expanded)}>
                <div className="flex justify-between items-start mb-2">
                    <div>
                        <h3 className="font-bold text-gray-900">{recipe.name}</h3>
                        <div className="flex items-center gap-2 mt-1">
                            <span className="text-xs font-medium px-2 py-0.5 bg-green-100 text-green-700 rounded-full capitalize">{recipe.type}</span>
                            <span className="text-xs text-gray-500 flex items-center gap-0.5"><Clock className="w-3 h-3" /> {recipe.prepTime}</span>
                        </div>
                    </div>
                    <div className="text-right">
                        <span className="block font-bold text-gray-900">{recipe.calories} <span className="text-xs font-normal text-gray-500">cal</span></span>
                        <div className="flex justify-end gap-1 mt-1">
                            {recipe.dietary.slice(0, 2).map(tag => (
                                <span key={tag} className="text-[10px] bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded capitalize">{tag}</span>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-4 text-sm text-gray-500 mt-3">
                    <div className="flex items-center gap-1">
                        <ChefHat className="w-4 h-4" />
                        <span className="capitalize">{recipe.difficulty}</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <DollarSign className="w-4 h-4" />
                        <span>{recipe.cost.length}/3</span>
                    </div>
                    <button
                        onClick={(e) => { e.stopPropagation(); setExpanded(!expanded); }}
                        className="ml-auto text-green-600 flex items-center gap-1 font-medium hover:underline text-xs"
                    >
                        {expanded ? 'Hide Details' : 'View Recipe'}
                        {expanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                    </button>
                </div>
            </div>

            {expanded && (
                <div className="border-t border-gray-100 bg-gray-50 p-4 animate-in slide-in-from-top-2 duration-200">

                    <div className="grid grid-cols-3 gap-2 mb-4">
                        <div className="bg-blue-50 p-2 rounded text-center">
                            <div className="text-blue-700 font-bold">{recipe.macros.protein}g</div>
                            <div className="text-[10px] text-blue-600">Protein</div>
                        </div>
                        <div className="bg-green-50 p-2 rounded text-center">
                            <div className="text-green-700 font-bold">{recipe.macros.carbs}g</div>
                            <div className="text-[10px] text-green-600">Carbs</div>
                        </div>
                        <div className="bg-yellow-50 p-2 rounded text-center">
                            <div className="text-yellow-700 font-bold">{recipe.macros.fat}g</div>
                            <div className="text-[10px] text-yellow-600">Fat</div>
                        </div>
                    </div>

                    <div className="mb-4">
                        <h4 className="font-semibold text-sm mb-2 text-gray-800">Ingredients</h4>
                        <ul className="text-sm text-gray-600 space-y-1 pl-4 list-disc marker:text-green-500">
                            {recipe.ingredients.map((ing, i) => <li key={i}>{ing}</li>)}
                        </ul>
                    </div>

                    <div className="mb-4">
                        <h4 className="font-semibold text-sm mb-2 text-gray-800">Instructions</h4>
                        <ol className="text-sm text-gray-600 space-y-2 pl-4 list-decimal marker:text-green-500 marker:font-bold">
                            {recipe.instructions.map((step, i) => <li key={i}>{step}</li>)}
                        </ol>
                    </div>

                    {recipe.tips && (
                        <div className="bg-yellow-50 border border-yellow-100 p-3 rounded-lg text-sm text-yellow-800 mb-4">
                            <span className="font-bold">💡 Tip:</span> {recipe.tips}
                        </div>
                    )}

                    <div className="flex gap-2 relative z-10">
                        <button
                            onClick={handleAdd}
                            className={`flex-1 py-2.5 rounded-lg font-medium flex items-center justify-center gap-2 transition-all ${added ? 'bg-green-100 text-green-700' : 'bg-green-600 text-white hover:bg-green-700 shadow-md shadow-green-200 hover:shadow-lg'}`}
                        >
                            {added ? <Check className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                            {added ? 'Added!' : 'Add to Today'}
                        </button>
                        {/* Shopping list functionality to be implemented in Phase 2 */}
                    </div>
                </div>
            )}
        </div>
    );
};
