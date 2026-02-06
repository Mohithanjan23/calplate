import { useState } from 'react';
import { ArrowLeft, CheckCircle, Circle } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

interface Ingredient {
    name: string;
    amount: string;
    category: 'produce' | 'dairy' | 'pantry' | 'protein' | 'other';
    completed?: boolean;
}

export default function ShoppingList() {
    const navigate = useNavigate();
    const location = useLocation();
    const initialIngredients = (location.state?.ingredients || []) as Ingredient[];

    // Combine duplicates logic could go here
    const [items, setItems] = useState<Ingredient[]>(initialIngredients);

    const toggleItem = (index: number) => {
        const newItems = [...items];
        newItems[index].completed = !newItems[index].completed;
        setItems(newItems);
    };

    const groupedItems = items.reduce((acc, item) => {
        const cat = item.category;
        if (!acc[cat]) acc[cat] = [];
        acc[cat].push(item);
        return acc;
    }, {} as Record<string, Ingredient[]>);

    return (
        <div className="min-h-screen bg-slate-50 p-4">
            <div className="flex items-center gap-4 mb-6">
                <button onClick={() => navigate(-1)} className="p-2 bg-white rounded-full border border-slate-200">
                    <ArrowLeft className="w-5 h-5" />
                </button>
                <h1 className="text-xl font-bold">Shopping List</h1>
            </div>

            {items.length === 0 ? (
                <div className="text-center text-slate-500 mt-20">
                    <p>No items in list. Add meals from the Meal Prep Hub.</p>
                </div>
            ) : (
                <div className="space-y-6">
                    {Object.entries(groupedItems).map(([category, ingredients]) => (
                        <div key={category} className="bg-white p-5 rounded-2xl shadow-sm">
                            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4">{category}</h3>
                            <div className="space-y-3">
                                {ingredients.map((item, idx) => (
                                    <div key={idx} className="flex items-center gap-3 cursor-pointer" onClick={() => toggleItem(items.indexOf(item))}>
                                        {item.completed ? (
                                            <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                                        ) : (
                                            <Circle className="w-5 h-5 text-slate-300 flex-shrink-0" />
                                        )}
                                        <div className={`${item.completed ? 'line-through text-slate-400' : 'text-slate-800'}`}>
                                            <span className="font-medium">{item.name}</span> <span className="text-slate-500 text-sm">({item.amount})</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
