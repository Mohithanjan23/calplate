import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext.jsx'; // Make sure this path is correct
import { supabase } from '../services/supabaseClient.js'; // Make sure this path is correct
import toast from 'react-hot-toast';

export default function Onboarding() {
    const { user } = useAuth();
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({ name: '', age: '', weight: '', height: '', activity: 'moderate', goal: 'maintain' });

    const calculateCalories = () => {
      const { age, weight, height, activity, goal } = formData;
      if (!age || !weight || !height) return 2000; // Return a default if data is missing
      const bmr = 10 * weight + 6.25 * height - 5 * age + 5;
      const activityMultipliers = { sedentary: 1.2, light: 1.375, moderate: 1.55, active: 1.725 };
      const goalAdjustments = { lose: -500, maintain: 0, gain: 300 };
      return Math.round(bmr * activityMultipliers[activity] + goalAdjustments[goal]);
    };

    const handleSubmit = async () => {
      const profileData = { id: user.id, ...formData, calorie_goal: calculateCalories() };
      const { error } = await supabase.from('profiles').upsert(profileData, { onConflict: 'id' });
      if (error) {
          toast.error(error.message);
      } else {
          toast.success("Profile setup complete!");
          window.location.reload(); // Reload to transition to the main app
      }
    };

    // This is a simplified single-page version of your multi-step onboarding
    return (
        <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full space-y-4">
                <h1 className="text-2xl font-bold text-center">Welcome to Calplate!</h1>
                <p className="text-gray-600 text-center mt-2 mb-8">Let's personalize your journey</p>
                
                <input type="text" placeholder="Name" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full p-3 border rounded-lg" />
                <input type="number" placeholder="Age" value={formData.age} onChange={e => setFormData({...formData, age: e.target.value})} className="w-full p-3 border rounded-lg" />
                <input type="number" placeholder="Weight (kg)" value={formData.weight} onChange={e => setFormData({...formData, weight: e.target.value})} className="w-full p-3 border rounded-lg" />
                <input type="number" placeholder="Height (cm)" value={formData.height} onChange={e => setFormData({...formData, height: e.target.value})} className="w-full p-3 border rounded-lg" />
                
                <select value={formData.activity} onChange={e => setFormData({...formData, activity: e.target.value})} className="w-full p-3 border rounded-lg bg-white">
                    <option value="sedentary">Sedentary (Office job)</option>
                    <option value="light">Light (1-3 days/week exercise)</option>
                    <option value="moderate">Moderate (3-5 days/week exercise)</option>
                    <option value="active">Very Active (6-7 days/week exercise)</option>
                </select>
                
                <select value={formData.goal} onChange={e => setFormData({...formData, goal: e.target.value})} className="w-full p-3 border rounded-lg bg-white">
                    <option value="lose">Lose Weight</option>
                    <option value="maintain">Maintain Weight</option>
                    <option value="gain">Gain Weight</option>
                </select>
                
                <button onClick={handleSubmit} className="w-full bg-green-600 text-white py-3 rounded-lg font-medium">Complete Setup</button>
            </div>
        </div>
    );
}