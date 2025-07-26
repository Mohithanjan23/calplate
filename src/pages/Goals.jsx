import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../services/supabaseClient';
import Card from '../components/Card';
import { Target } from 'lucide-react';
import toast from 'react-hot-toast';

export default function Goals() {
  const { user } = useAuth(); // Get user from context
  const [goals, setGoals] = useState({
    calories: '',
    protein: '',
    carbs: '',
    fat: '',
    workouts_per_week: ''
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Fetch existing goals when the page loads
    const fetchGoals = async () => {
      if (!user) return;
      setLoading(true);
      const { data, error } = await supabase
        .from('goals')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (data) {
        setGoals({
            calories: data.calories || '',
            protein: data.protein || '',
            carbs: data.carbs || '',
            fat: data.fat || '',
            workouts_per_week: data.workouts_per_week || ''
        });
      } else if (error && error.code !== 'PGRST116') { // Ignore 'no rows found' error
          console.error(error);
          toast.error("Could not fetch your goals.");
      }
      setLoading(false);
    };

    fetchGoals();
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setGoals((prev) => ({ ...prev, [name]: value === '' ? '' : Number(value) }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    // Prepare data for upsert, ensuring null for empty strings
    const goalData = {
        user_id: user.id,
        calories: goals.calories || null,
        protein: goals.protein || null,
        carbs: goals.carbs || null,
        fat: goals.fat || null,
        workouts_per_week: goals.workouts_per_week || null
    };

    const { error } = await supabase
      .from('goals')
      .upsert(goalData, { onConflict: 'user_id' });

    if (error) {
      toast.error('Error saving goals: ' + error.message);
    } else {
      toast.success('Goals saved successfully!');
    }
    setLoading(false);
  };

  const inputStyles = "w-full px-4 py-2 bg-black/20 rounded-lg border border-white/20 focus:outline-none focus:ring-2 focus:ring-primary";

  return (
    <div className="p-4 space-y-6">
      <div className="flex items-center gap-3">
        <Target size={28} />
        <h1 className="text-3xl font-bold">My Goals</h1>
      </div>

      <Card>
        <form onSubmit={handleSubmit} className="space-y-4">
          <h2 className="text-lg font-semibold text-text-secondary">Nutrition Targets</h2>
          <input name="calories" type="number" value={goals.calories} onChange={handleChange} placeholder="Daily Calorie Goal" className={inputStyles}/>
          <div className="grid grid-cols-3 gap-2">
            <input name="protein" type="number" value={goals.protein} onChange={handleChange} placeholder="Protein (g)" className={inputStyles}/>
            <input name="carbs" type="number" value={goals.carbs} onChange={handleChange} placeholder="Carbs (g)" className={inputStyles} />
            <input name="fat" type="number" value={goals.fat} onChange={handleChange} placeholder="Fat (g)" className={inputStyles} />
          </div>
          
          <h2 className="text-lg font-semibold text-text-secondary pt-4">Activity Targets</h2>
          <input name="workouts_per_week" type="number" value={goals.workouts_per_week} onChange={handleChange} placeholder="Workouts per week" className={inputStyles}/>
          
          <button type="submit" disabled={loading} className="w-full py-3 mt-4 rounded-lg font-semibold text-white transition bg-primary hover:bg-primary-dark disabled:bg-primary/50 disabled:cursor-not-allowed">
            {loading ? 'Saving...' : 'Save Goals'}
          </button>
        </form>
      </Card>
    </div>
  );
}
