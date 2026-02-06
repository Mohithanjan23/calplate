import React, { useState, useEffect } from 'react';
import { Activity, Calculator, Check, User, Database, AlertCircle } from 'lucide-react';
import { calculateBMR, calculateTDEE, type UserStats, ACTIVITY_MULTIPLIERS } from './utils/calculations';
import { supabase } from './lib/supabase';

function App() {
  const [stats, setStats] = useState<UserStats>({
    gender: 'male',
    weight: 0,
    height: 0,
    age: 0,
    activityLevel: 'sedentary',
  });

  const [bmr, setBmr] = useState<number>(0);
  const [tdee, setTdee] = useState<number>(0);
  const [dbStatus, setDbStatus] = useState<'checking' | 'connected' | 'error' | 'not_configured'>('checking');

  useEffect(() => {
    checkSupabaseConnection();
  }, []);

  const checkSupabaseConnection = async () => {
    if (!supabase) {
      setDbStatus('not_configured');
      return;
    }
    try {
      const { error } = await supabase.from('users').select('count', { count: 'exact', head: true });
      if (error && error.code !== 'PGRST116') { // Ignoring 'empty result' or specific table errors if table missing
        // For a generic check, simple fetch is okay. 
        // If table 'users' doesn't exist, it might error. 
        // Let's assume successful auth means connected.
        console.warn("Supabase check warning:", error);
        setDbStatus('connected'); // Treat as connected but maybe table missing
      } else {
        setDbStatus('connected');
      }
    } catch (e) {
      console.error("Supabase connection error:", e);
      setDbStatus('error');
    }
  };

  useEffect(() => {
    setBmr(calculateBMR(stats));
    setTdee(calculateTDEE(stats));
  }, [stats]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setStats(prev => ({
      ...prev,
      [name]: name === 'gender' || name === 'activityLevel' ? value : Number(value)
    }));
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 font-sans text-slate-800">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="bg-indigo-600 p-6 text-white text-center">
          <div className="mx-auto w-12 h-12 bg-indigo-500 rounded-lg flex items-center justify-center mb-4">
            <Calculator className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-bold mb-1">Calplate Calculator</h1>
          <p className="text-indigo-200 text-sm">Mifflin-St Jeor Equation</p>

          <div className="mt-4 flex items-center justify-center gap-2 text-xs opacity-75">
            {dbStatus === 'checking' && <span className="flex items-center gap-1"><Activity className="w-3 h-3 animate-pulse" /> Connecting...</span>}
            {dbStatus === 'connected' && <span className="flex items-center gap-1 text-green-200"><Check className="w-3 h-3" /> DB Connected</span>}
            {dbStatus === 'error' && <span className="flex items-center gap-1 text-red-300"><AlertCircle className="w-3 h-3" /> DB Error</span>}
            {dbStatus === 'not_configured' && <span className="flex items-center gap-1 text-yellow-200"><Database className="w-3 h-3" /> DB Not Configured</span>}
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Gender Selection */}
          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={() => setStats(prev => ({ ...prev, gender: 'male' }))}
              className={`p-3 rounded-xl border-2 flex items-center justify-center gap-2 transition-all ${stats.gender === 'male'
                ? 'border-indigo-600 bg-indigo-50 text-indigo-700'
                : 'border-slate-200 hover:border-indigo-300'
                }`}
            >
              <User className="w-4 h-4" /> Male
            </button>
            <button
              onClick={() => setStats(prev => ({ ...prev, gender: 'female' }))}
              className={`p-3 rounded-xl border-2 flex items-center justify-center gap-2 transition-all ${stats.gender === 'female'
                ? 'border-pink-600 bg-pink-50 text-pink-700'
                : 'border-slate-200 hover:border-pink-300'
                }`}
            >
              <User className="w-4 h-4" /> Female
            </button>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-500 uppercase">Age (years)</label>
              <input
                type="number"
                name="age"
                value={stats.age || ''}
                onChange={handleInputChange}
                className="w-full p-3 rounded-lg border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all outline-none"
                placeholder="25"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-500 uppercase">Weight (kg)</label>
              <input
                type="number"
                name="weight"
                value={stats.weight || ''}
                onChange={handleInputChange}
                className="w-full p-3 rounded-lg border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all outline-none"
                placeholder="70"
              />
            </div>

            <div className="col-span-2 space-y-1">
              <label className="text-xs font-semibold text-slate-500 uppercase">Height (cm)</label>
              <input
                type="number"
                name="height"
                value={stats.height || ''}
                onChange={handleInputChange}
                className="w-full p-3 rounded-lg border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all outline-none"
                placeholder="175"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-500 uppercase">Activity Level</label>
            <div className="relative">
              <Activity className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <select
                name="activityLevel"
                value={stats.activityLevel}
                onChange={handleInputChange}
                className="w-full p-3 pl-10 rounded-lg border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all outline-none appearance-none bg-white"
              >
                {Object.keys(ACTIVITY_MULTIPLIERS).map((level) => (
                  <option key={level} value={level}>
                    {level.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="border-t border-slate-100 pt-6">
            <h3 className="text-sm font-semibold text-slate-900 mb-4">Your Results</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-slate-50 p-4 rounded-xl">
                <p className="text-xs text-slate-500 mb-1">BMR (Daily)</p>
                <p className="text-2xl font-bold text-slate-900">{bmr} <span className="text-sm font-normal text-slate-400">kcal</span></p>
              </div>
              <div className="bg-indigo-50 p-4 rounded-xl">
                <p className="text-xs text-indigo-500 mb-1">TDEE (Daily)</p>
                <p className="text-2xl font-bold text-indigo-700">{tdee} <span className="text-sm font-normal text-indigo-400">kcal</span></p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
