import { ArrowLeft } from 'lucide-react';

// --- Reusable Recipe Card Component ---
const RecipeCard = ({ recipe }) => (
    <div className="flex-shrink-0 w-40 space-y-2">
        <div className="h-40 bg-surface rounded-lg">
            {/* In a real app, you would place an <img /> tag here with the recipe image */}
        </div>
        <h3 className="font-semibold leading-tight">{recipe.name}</h3>
        <p className="text-sm text-text-secondary">{recipe.calories} Cal</p>
    </div>
);

// --- Reusable Category Section Component ---
const RecipeCategory = ({ title, recipes }) => (
    <div className="space-y-4">
        <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">{title}</h2>
            <button className="text-sm font-semibold text-primary">View More</button>
        </div>
        <div className="flex gap-4 overflow-x-auto pb-4">
            {recipes.map(recipe => <RecipeCard key={recipe.name} recipe={recipe} />)}
        </div>
    </div>
);


export default function Recipes() {
    // Sample data mimicking the screenshot
    const immuneSupportRecipes = [
        { name: 'Lime-Chili Chicken with Cauliflower Rice', calories: 232 },
        { name: 'Mushrooms, Brussels Sprouts & Barley', calories: 375 },
        { name: 'One-Pot Pasta with Cauliflower', calories: 360 },
    ];

    const pantryStaplesRecipes = [
        { name: 'Instant Pot Chickpea Tikka Masala', calories: 336 },
        { name: 'Spicy Tuna Wrap', calories: 340 },
        { name: 'Air Fryer Truffle Fries', calories: 117 },
    ];
    
    const preWorkoutRecipes = [
        { name: 'Mango-Mandarin Smoothie', calories: 238 },
        { name: 'Oatmeal and Fruit', calories: 110 },
        { name: 'Rice Cakes with Peanut Butter', calories: 155 },
    ];


    return (
        <div className="p-4 space-y-8">
            <div className="flex items-center gap-4">
                <ArrowLeft size={24} />
                <h1 className="text-3xl font-bold">Recipes</h1>
            </div>

            <RecipeCategory title="Immune Support" recipes={immuneSupportRecipes} />
            <RecipeCategory title="Pantry Staples" recipes={pantryStaplesRecipes} />
            <RecipeCategory title="Pre-Workout" recipes={preWorkoutRecipes} />
        </div>
    );
}