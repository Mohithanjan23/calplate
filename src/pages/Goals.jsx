import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../services/supabaseClient';
import Card from '../components/Card';
import { Target, CheckCircle } from 'lucide-react';

export default function Goals() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [currentGoal, setCurrentGoal] = useState('');
  const [newGoal, setNewGoal] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const goalOptions = {
    '': 'Select a Goal',
    'fat_loss': 'Fat Loss',
    'muscle_gain': 'Muscle Gain',
    'maintenance': 'Maintain Wellness',
  };

  // Fetch the user's current goal when the page loads
  useEffect(() => {
    async function getProfileGoal() {
      if (!user) return;
      
      setLoading(true);
      const { data, error } = await supabase
        .from('profiles')
        .select('goal')
        .eq('id', user.id)
        .single();

      if (error) {
        console.warn('Error fetching goal:', error);
      } else if (data) {
        setCurrentGoal(data.goal || '');
        setNewGoal(data.goal || '');
      }
      setLoading(false);
    }
    getProfileGoal();
  }, [user]);

  // Update the user's goal in the database
  const handleUpdateGoal = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccessMessage('');

    const { error } = await supabase
      .from('profiles')
      .update({ goal: newGoal })
      .eq('id', user.id);

    if (error) {
      alert('Error updating goal: ' + error.message);
    } else {
      setCurrentGoal(newGoal);
      setSuccessMessage('Goal updated successfully!');
      setTimeout(() => setSuccessMessage(''), 3000); // Clear message after 3 seconds
    }
    setLoading(false);
  };

  return (
    <div className="p-4 space-y-6">
      <div className="flex items-center gap-3">
        <Target size={28} />
        <h1 className="text-3xl font-bold">My Fitness Goal</h1>
      </div>

      <Card>
        <h2 className="text-lg font-semibold text-text-secondary mb-2">Current Goal</h2>
        <p className="text-2xl font-bold text-primary">
          {loading ? 'Loading...' : goalOptions[currentGoal] || 'Not Set'}
        </p>
      </Card>

      <Card>
        <form onSubmit={handleUpdateGoal} className="space-y-4">
          <label htmlFor="goal" className="block text-lg font-semibold text-text-secondary">
            Update Your Goal
          </label>
          <select 
            id="goal" 
            value={newGoal}
            onChange={(e) => setNewGoal(e.target.value)}
            className="w-full px-4 py-3 bg-black/20 rounded-lg border border-white/20 focus:outline-none focus:ring-2 focus:ring-primary"
          >
            {Object.entries(goalOptions).map(([value, label]) => (
              <option key={value} value={value}>{label}</option>
            ))}
          </select>
          <button
            type="submit"
            disabled={loading || newGoal === currentGoal}
            className="w-full py-3 rounded-lg font-semibold text-white transition bg-primary hover:bg-primary-dark disabled:bg-primary/50 disabled:cursor-not-allowed"
          >
            {loading ? 'Saving...' : 'Save Goal'}
          </button>
        </form>
      </Card>

      {successMessage && (
        <div className="flex items-center justify-center gap-2 text-green-400">
          <CheckCircle size={20} />
          <p>{successMessage}</p>
        </div>
      )}
    </div>
  );
}
