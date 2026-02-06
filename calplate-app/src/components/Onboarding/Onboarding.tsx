import React, { useState } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { type UserStats, calculateBMR, calculateTDEE, ACTIVITY_MULTIPLIERS } from '../../utils/calculations';
import { useNavigate } from 'react-router-dom';
import { Ruler, Weight as WeightIcon, User, ChevronRight, Check, Mail, Lock, Loader2 } from 'lucide-react';

export default function Onboarding() {
    const navigate = useNavigate();
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [stats, setStats] = useState<UserStats>({
        gender: 'male',
        weight: 0,
        height: 0,
        age: 0,
        activityLevel: 'sedentary',
    });

    const [authData, setAuthData] = useState({
        email: '',
        password: ''
    });

    const updateStats = (key: keyof UserStats, value: any) => {
        setStats(prev => ({ ...prev, [key]: value }));
    };

    const handleSignUp = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!supabase) {
            setError("Supabase client not initialized.");
            return;
        }
        setLoading(true);
        setError(null);

        try {
            // 1. Sign Up
            const { data: { user }, error: authError } = await supabase.auth.signUp({
                email: authData.email,
                password: authData.password,
            });

            if (authError) throw authError;
            if (!user) throw new Error('No user created');

            // 2. Calculate initial macros
            const bmr = calculateBMR(stats);
            const tdee = calculateTDEE(stats);

            // 3. Create Profile
            const { error: profileError } = await supabase
                .from('profiles')
                .insert({
                    id: user.id,
                    ...stats,
                    bmr,
                    tdee,
                    calorie_goal: tdee, // Default to maintenance
                    created_at: new Date().toISOString(),
                });

            if (profileError) {
                // If profile creation fails, we might want to retry or warn
                console.error("Profile creation failed:", profileError);
                // throw profileError; // Optional: block or allow
            }

            navigate('/dashboard');

        } catch (err: any) {
            setError(err.message || 'An error occurred during sign up');
        } finally {
            setLoading(false);
        }
    };

    const renderStep1_Gender = () => (
        <div className="space-y-6 animate-fadeIn">
            <h2 className="text-2xl font-bold text-center mb-8">Tell us about yourself</h2>
            <div className="grid grid-cols-2 gap-4">
                <button
                    onClick={() => updateStats('gender', 'male')}
                    className={`p-6 rounded-2xl border-2 flex flex-col items-center gap-3 transition-all ${stats.gender === 'male' ? 'border-indigo-600 bg-indigo-50 text-indigo-700' : 'border-slate-200 opacity-60 hover:opacity-100'
                        }`}
                >
                    <User className="w-8 h-8" />
                    <span className="font-semibold">Male</span>
                </button>
                <button
                    onClick={() => updateStats('gender', 'female')}
                    className={`p-6 rounded-2xl border-2 flex flex-col items-center gap-3 transition-all ${stats.gender === 'female' ? 'border-pink-600 bg-pink-50 text-pink-700' : 'border-slate-200 opacity-60 hover:opacity-100'
                        }`}
                >
                    <User className="w-8 h-8" />
                    <span className="font-semibold">Female</span>
                </button>
            </div>
            <button onClick={() => setStep(2)} className="w-full bg-slate-900 text-white p-4 rounded-xl font-semibold flex items-center justify-center gap-2 mt-8 hover:bg-slate-800 transition-colors">
                Next <ChevronRight className="w-5 h-5" />
            </button>
        </div>
    );

    const renderStep2_Body = () => (
        <div className="space-y-6 animate-fadeIn">
            <h2 className="text-2xl font-bold text-center mb-8">Your body stats</h2>

            <div className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Age</label>
                    <input
                        type="number"
                        value={stats.age || ''}
                        onChange={(e) => updateStats('age', Number(e.target.value))}
                        className="w-full p-4 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none text-lg"
                        placeholder="25"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Weight (kg)</label>
                    <div className="relative">
                        <WeightIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                        <input
                            type="number"
                            value={stats.weight || ''}
                            onChange={(e) => updateStats('weight', Number(e.target.value))}
                            className="w-full p-4 pl-12 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none text-lg"
                            placeholder="70"
                        />
                    </div>
                </div>
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Height (cm)</label>
                    <div className="relative">
                        <Ruler className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                        <input
                            type="number"
                            value={stats.height || ''}
                            onChange={(e) => updateStats('height', Number(e.target.value))}
                            className="w-full p-4 pl-12 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none text-lg"
                            placeholder="175"
                        />
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mt-8">
                <button onClick={() => setStep(1)} className="p-4 rounded-xl font-semibold text-slate-600 hover:bg-slate-50 transition-colors">
                    Back
                </button>
                <button
                    onClick={() => setStep(3)}
                    disabled={!stats.age || !stats.weight || !stats.height}
                    className="bg-slate-900 text-white p-4 rounded-xl font-semibold flex items-center justify-center gap-2 hover:bg-slate-800 transition-colors disabled:opacity-50"
                >
                    Next <ChevronRight className="w-5 h-5" />
                </button>
            </div>
        </div>
    );

    const renderStep3_Activity = () => (
        <div className="space-y-6 animate-fadeIn">
            <h2 className="text-2xl font-bold text-center mb-8">Activity Level</h2>

            <div className="space-y-3">
                {Object.entries(ACTIVITY_MULTIPLIERS).map(([key, value]) => (
                    <button
                        key={key}
                        onClick={() => updateStats('activityLevel', key)}
                        className={`w-full p-4 rounded-xl border-2 text-left transition-all ${stats.activityLevel === key ? 'border-indigo-600 bg-indigo-50' : 'border-slate-200 hover:border-indigo-300'
                            }`}
                    >
                        <div className="font-semibold text-slate-900 capitalize">{key.replace(/_/g, ' ')}</div>
                        <div className="text-xs text-slate-500">Multiplier: x{value}</div>
                    </button>
                ))}
            </div>

            <div className="grid grid-cols-2 gap-4 mt-8">
                <button onClick={() => setStep(2)} className="p-4 rounded-xl font-semibold text-slate-600 hover:bg-slate-50 transition-colors">
                    Back
                </button>
                <button onClick={() => setStep(4)} className="bg-slate-900 text-white p-4 rounded-xl font-semibold flex items-center justify-center gap-2 hover:bg-slate-800 transition-colors">
                    Next <ChevronRight className="w-5 h-5" />
                </button>
            </div>
        </div>
    );

    const renderStep4_Auth = () => (
        <div className="space-y-6 animate-fadeIn">
            <h2 className="text-2xl font-bold text-center mb-2">Create Account</h2>
            <p className="text-center text-slate-500 text-sm mb-6">Save your plan and start tracking</p>

            <form onSubmit={handleSignUp} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
                    <div className="relative">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                        <input
                            type="email"
                            required
                            value={authData.email}
                            onChange={(e) => setAuthData(prev => ({ ...prev, email: e.target.value }))}
                            className="w-full p-4 pl-12 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none"
                            placeholder="hello@example.com"
                        />
                    </div>
                </div>
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
                    <div className="relative">
                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                        <input
                            type="password"
                            required
                            minLength={6}
                            value={authData.password}
                            onChange={(e) => setAuthData(prev => ({ ...prev, password: e.target.value }))}
                            className="w-full p-4 pl-12 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none"
                            placeholder="••••••••"
                        />
                    </div>
                </div>

                {error && (
                    <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg flex items-center gap-2">
                        <span className="font-bold">!</span> {error}
                    </div>
                )}

                <div className="grid grid-cols-2 gap-4 mt-8">
                    <button type="button" onClick={() => setStep(3)} className="p-4 rounded-xl font-semibold text-slate-600 hover:bg-slate-50 transition-colors">
                        Back
                    </button>
                    <button
                        type="submit"
                        disabled={loading}
                        className="bg-indigo-600 text-white p-4 rounded-xl font-semibold flex items-center justify-center gap-2 hover:bg-indigo-700 transition-colors disabled:opacity-70"
                    >
                        {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <>Start Journey <Check className="w-5 h-5" /></>}
                    </button>
                </div>
            </form>
        </div>
    );

    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
            <div className="max-w-md w-full bg-white rounded-3xl shadow-xl overflow-hidden p-8">
                <div className="flex gap-2 mb-8 justify-center">
                    {[1, 2, 3, 4].map(s => (
                        <div key={s} className={`h-2 rounded-full transition-all duration-300 ${s <= step ? 'w-8 bg-indigo-600' : 'w-2 bg-slate-200'}`} />
                    ))}
                </div>

                {step === 1 && renderStep1_Gender()}
                {step === 2 && renderStep2_Body()}
                {step === 3 && renderStep3_Activity()}
                {step === 4 && renderStep4_Auth()}
            </div>
        </div>
    );
}
