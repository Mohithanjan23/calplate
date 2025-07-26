import { useState, useEffect } from 'react';
import { Lightbulb } from 'lucide-react';
import Card from '../components/Card';
import { getMealSuggestions } from '../services/foodService';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../services/supabaseClient';

const SuggestionCard = ({ meal }) => (
    <Card className="flex-1">
        <h3 className="font-bold text-lg text-primary capitalize">{meal.title}</h3>
        <p className="text-sm text-text-secondary mt-1">Ready in {meal.readyInMinutes} minutes</p>
        <p className="text-sm text-text-secondary">Servings: {meal.servings}</p>
        <a 
            href={meal.sourceUrl} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="block mt-4 text-center w-full py-2 bg-primary/20 text-primary font-semibold rounded-lg hover:bg-primary/30 transition-colors"
        >
            View Recipe
        </a>
    </Card>
);

export default function Suggestions() {
    const { user } = useAuth(); // Get the current user
    const [loading, setLoading] = useState(false);
    const [suggestions, setSuggestions] = useState(null);
    const [targetCalories, setTargetCalories] = useState(2200); // Default calories
    const [diet, setDiet] = useState('');

    // NEW: useEffect to fetch the user's goal and set a default calorie target
    useEffect(() => {
        async function fetchUserGoal() {
            if (!user) return;

            const { data, error } = await supabase
                .from('profiles')
                .select('goal')
                .eq('id', user.id)
                .single();

            if (error) {
                console.warn('Could not fetch user goal for suggestions.');
            } else if (data && data.goal) {
                // Set a smart default based on the user's goal
                switch (data.goal) {
                    case 'fat_loss':
                        setTargetCalories(1800);
                        break;
                    case 'muscle_gain':
                        setTargetCalories(2800);
                        break;
                    case 'maintenance':
                        setTargetCalories(2200);
                        break;
                    default:
                        setTargetCalories(2200);
                }
            }
        }

        fetchUserGoal();
    }, [user]); // Rerun this effect if the user object changes

    const handleGenerate = async (e) => {
        e.preventDefault();
        setLoading(true);
        setSuggestions(null);

        try {
            const data = await getMealSuggestions(targetCalories, diet);
            setSuggestions(data);
        } catch (error) {
            alert("Failed to get suggestions. Please check your API key or the console for details.");
        }
        setLoading(false);
    };

    return (
        <div className="p-4 space-y-6">
            <div className="flex items-center gap-3">
                <Lightbulb size={28} />
                <h1 className="text-3xl font-bold">Meal Suggestions</h1>
            </div>

            <Card>
                <form onSubmit={handleGenerate} className="space-y-4">
                    <h2 className="text-lg font-semibold text-text-secondary">Set Your Preferences</h2>
                    <div>
                        <label htmlFor="calories" className="block text-sm font-medium mb-1">Target Calories</label>
                        <input type="number" id="calories" value={targetCalories} onChange={(e) => setTargetCalories(e.target.value)} required className="w-full px-4 py-2 bg-black/20 rounded-lg border border-white/20 focus:outline-none focus:ring-2 focus:ring-primary" />
                        <p className="text-xs text-text-secondary mt-1">We've suggested a target based on your goal.</p>
                    </div>
                     <div>
                        <label htmlFor="diet" className="block text-sm font-medium mb-1">Dietary Preference (Optional)</label>
                        <select id="diet" value={diet} onChange={(e) => setDiet(e.target.value)} className="w-full px-4 py-3 bg-black/20 rounded-lg border border-white/20 focus:outline-none focus:ring-2 focus:ring-primary">
                            <option value="">None</option>
                            <option value="vegetarian">Vegetarian</option>
                            <option value="vegan">Vegan</option>
                            <option value="ketogenic">Ketogenic</option>
                            <option value="gluten free">Gluten Free</option>
                        </select>
                    </div>
                    <button type="submit" disabled={loading} className="w-full py-3 rounded-lg font-semibold text-white transition bg-primary hover:bg-primary-dark disabled:bg-primary/50 disabled:cursor-not-allowed">
                        {loading ? 'Generating...' : 'Generate Meal Plan'}
                    </button>
                </form>
            </Card>

            {suggestions && (
                <div>
                    <h2 className="text-xl font-bold mb-3">Your Daily Plan</h2>
                    <p className="text-text-secondary mb-4">Total Calories: {Math.round(suggestions.nutrients.calories)} kcal</p>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {suggestions.meals.map(meal => <SuggestionCard key={meal.id} meal={meal} />)}
                    </div>
                </div>
            )}
        </div>
    );
}
