import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShoppingCart, Clock, Leaf, Calendar, Zap, ArrowLeft, Check } from 'lucide-react';

const MOCK_RECIPES = {
    quick: [
        { id: 1, name: '15-min Chicken Stir Fry', calories: 450, ingredients: [{ name: 'Chicken Breast', amount: '200g', category: 'protein' }, { name: 'Bell Peppers', amount: '2', category: 'produce' }] },
        { id: 2, name: 'Quick Oats & Berries', calories: 300, ingredients: [{ name: 'Oats', amount: '50g', category: 'pantry' }, { name: 'Berries', amount: '100g', category: 'produce' }] },
    ],
    batch: [
        { id: 3, name: 'Turkey Chili', calories: 500, ingredients: [{ name: 'Turkey Mince', amount: '500g', category: 'protein' }, { name: 'Beans', amount: '2 cans', category: 'pantry' }] },
    ],
    healthy: [
        { id: 4, name: 'Quinoa Salad', calories: 350, ingredients: [{ name: 'Quinoa', amount: '100g', category: 'pantry' }, { name: 'Cucumber', amount: '1', category: 'produce' }] },
    ],
    seasonal: [
        { id: 5, name: 'Pumpkin Soup', calories: 250, ingredients: [{ name: 'Pumpkin', amount: '500g', category: 'produce' }, { name: 'Cream', amount: '50ml', category: 'dairy' }] },
    ]
};

export default function MealPrepHub() {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState<'quick' | 'batch' | 'healthy' | 'seasonal'>('quick');
    const [selectedRecipes, setSelectedRecipes] = useState<number[]>([]);

    const toggleRecipe = (id: number) => {
        setSelectedRecipes(prev =>
            prev.includes(id) ? prev.filter(mid => mid !== id) : [...prev, id]
        );
    };

    const generateShoppingList = () => {
        const allIngredients = Object.values(MOCK_RECIPES)
            .flat()
            .filter(r => selectedRecipes.includes(r.id))
            .flatMap(r => r.ingredients);

        navigate('/shopping-list', { state: { ingredients: allIngredients } });
    };

    const tabs = [
        { id: 'quick', label: 'Quick', icon: Zap },
        { id: 'batch', label: 'Batch', icon: Clock },
        { id: 'healthy', label: 'Healthy', icon: Leaf },
        { id: 'seasonal', label: 'Seasonal', icon: Calendar },
    ];

    return (
        <div className="min-h-screen bg-slate-50 p-4 pb-24">
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                    <button onClick={() => navigate('/dashboard')} className="p-2 bg-white rounded-full border border-slate-200">
                        <ArrowLeft className="w-5 h-5" />
                    </button>
                    <h1 className="text-xl font-bold">Meal Prep</h1>
                </div>
                <button
                    onClick={generateShoppingList}
                    className="p-2 bg-indigo-600 text-white rounded-full shadow-lg relative"
                >
                    <ShoppingCart className="w-6 h-6" />
                    {selectedRecipes.length > 0 && (
                        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                            {selectedRecipes.length}
                        </span>
                    )}
                </button>
            </div>

            {/* Tabs */}
            <div className="flex gap-2 overflow-x-auto pb-4 scrollbar-hide">
                {tabs.map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id as any)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-full whitespace-nowrap transition-colors ${activeTab === tab.id
                            ? 'bg-slate-900 text-white shadow-md'
                            : 'bg-white text-slate-600 border border-slate-200'
                            }`}
                    >
                        <tab.icon className="w-4 h-4" />
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Recipes */}
            <div className="space-y-4">
                {MOCK_RECIPES[activeTab]?.map((recipe: any) => (
                    <div
                        key={recipe.id}
                        onClick={() => toggleRecipe(recipe.id)}
                        className={`bg-white p-4 rounded-2xl border transition-all cursor-pointer ${selectedRecipes.includes(recipe.id)
                            ? 'border-indigo-500 ring-1 ring-indigo-500 shadow-md bg-indigo-50/10'
                            : 'border-slate-100 shadow-sm'
                            }`}
                    >
                        <div className="flex justify-between items-start">
                            <div>
                                <h3 className="font-bold text-slate-900">{recipe.name}</h3>
                                <p className="text-sm text-slate-500 mt-1">{recipe.calories} kcal • {recipe.ingredients.length} ingredients</p>
                            </div>
                            <div className={`w-6 h-6 rounded-full flex items-center justify-center transition-colors ${selectedRecipes.includes(recipe.id) ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-300'
                                }`}>
                                <Check className="w-4 h-4" />
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
