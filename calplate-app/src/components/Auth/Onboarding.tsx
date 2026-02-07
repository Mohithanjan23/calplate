
import React, { useState } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { calculateDailyCalories } from '../../utils/calorieCalculator';
import { Check, ChevronRight, Ruler, Weight, Activity, Target } from 'lucide-react';

interface OnboardingProps {
    userId: string;
    onComplete: () => void;
}

export const Onboarding: React.FC<OnboardingProps> = ({ userId, onComplete }) => {
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);

    // Step 1: Name
    const [name, setName] = useState('');

    // Step 2: Metrics
    const [age, setAge] = useState<number | ''>('');
    const [weight, setWeight] = useState<number | ''>(''); // kg
    const [height, setHeight] = useState<number | ''>(''); // cm

    // Step 3: Goals
    const [activity, setActivity] = useState<'sedentary' | 'light' | 'moderate' | 'active'>('sedentary');
    const [goal, setGoal] = useState<'lose' | 'maintain' | 'gain'>('maintain');

    const handleNext = () => {
        if (step === 1 && name) setStep(2);
        else if (step === 2 && age && weight && height) setStep(3);
    };

    const handleComplete = async () => {
        setLoading(true);
        const calorieGoal = calculateDailyCalories(
            Number(age),
            Number(weight),
            Number(height),
            activity,
            goal
        );

        try {
            const { error } = await supabase!
                .from('profiles')
                .insert({
                    id: userId,
                    name,
                    email: (await supabase!.auth.getUser()).data.user?.email,
                    age: Number(age),
                    weight: Number(weight),
                    height: Number(height),
                    activity,
                    goal,
                    calorie_goal: calorieGoal,
                    created_at: new Date().toISOString()
                });

            if (error) throw error;
            onComplete();
        } catch (error) {
            console.error('Error saving profile:', error);
            alert('Failed to save profile. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-green-50 flex flex-col items-center justify-center p-4">
            <div className="max-w-md w-full bg-white rounded-2xl shadow-xl overflow-hidden p-8">

                {/* Progress Bar */}
                <div className="flex gap-2 mb-8">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className={`h-2 flex-1 rounded-full transition-all duration-300 ${i <= step ? 'bg-green-500' : 'bg-gray-200'}`} />
                    ))}
                </div>

                {step === 1 && (
                    <div className="animate-in fade-in slide-in-from-right-4 duration-300">
                        <h2 className="text-2xl font-bold text-gray-800 mb-2">Welcome to Calplate! 👋</h2>
                        <p className="text-gray-600 mb-6">Let's start with your name.</p>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">What should we call you?</label>
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="block w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                    placeholder="Your Name"
                                    autoFocus
                                />
                            </div>
                            <button
                                onClick={handleNext}
                                disabled={!name}
                                className="w-full bg-green-600 text-white py-3 rounded-lg font-medium hover:bg-green-700 disabled:opacity-50 transition-colors flex items-center justify-center gap-2"
                            >
                                Continue <ChevronRight className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                )}

                {step === 2 && (
                    <div className="animate-in fade-in slide-in-from-right-4 duration-300">
                        <h2 className="text-2xl font-bold text-gray-800 mb-2">Tell us about yourself</h2>
                        <p className="text-gray-600 mb-6">We need this to calculate your personalized plan.</p>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Age</label>
                                <input
                                    type="number"
                                    value={age}
                                    onChange={(e) => setAge(Number(e.target.value))}
                                    className="block w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                                    placeholder="Years"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Weight (kg)</label>
                                    <div className="relative">
                                        <Weight className="absolute left-3 top-3.5 w-4 h-4 text-gray-400" />
                                        <input
                                            type="number"
                                            value={weight}
                                            onChange={(e) => setWeight(Number(e.target.value))}
                                            className="block w-full pl-9 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                                            placeholder="00"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Height (cm)</label>
                                    <div className="relative">
                                        <Ruler className="absolute left-3 top-3.5 w-4 h-4 text-gray-400" />
                                        <input
                                            type="number"
                                            value={height}
                                            onChange={(e) => setHeight(Number(e.target.value))}
                                            className="block w-full pl-9 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                                            placeholder="000"
                                        />
                                    </div>
                                </div>
                            </div>

                            <button
                                onClick={handleNext}
                                disabled={!age || !weight || !height}
                                className="w-full mt-4 bg-green-600 text-white py-3 rounded-lg font-medium hover:bg-green-700 disabled:opacity-50 transition-colors flex items-center justify-center gap-2"
                            >
                                Next Step <ChevronRight className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                )}

                {step === 3 && (
                    <div className="animate-in fade-in slide-in-from-right-4 duration-300">
                        <h2 className="text-2xl font-bold text-gray-800 mb-2">Your Goals</h2>
                        <p className="text-gray-600 mb-6">Final step! Let's set your target.</p>

                        <div className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
                                    <Activity className="w-4 h-4 text-green-600" /> Activity Level
                                </label>
                                <div className="grid grid-cols-1 gap-2">
                                    {[
                                        { val: 'sedentary', label: 'Sedentary', desc: 'Office job, little exercise' },
                                        { val: 'light', label: 'Light', desc: '1-3 days/week exercise' },
                                        { val: 'moderate', label: 'Moderate', desc: '3-5 days/week exercise' },
                                        { val: 'active', label: 'Very Active', desc: '6-7 days/week hard exercise' }
                                    ].map((opt) => (
                                        <button
                                            key={opt.val}
                                            onClick={() => setActivity(opt.val as any)}
                                            className={`w-full text-left px-4 py-3 rounded-lg border transition-all ${activity === opt.val ? 'border-green-500 bg-green-50 ring-1 ring-green-500' : 'border-gray-200 hover:bg-gray-50'}`}
                                        >
                                            <div className="font-medium text-gray-900">{opt.label}</div>
                                            <div className="text-xs text-gray-500">{opt.desc}</div>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
                                    <Target className="w-4 h-4 text-green-600" /> Goal
                                </label>
                                <div className="flex gap-2">
                                    {[
                                        { val: 'lose', label: 'Lose Weight' },
                                        { val: 'maintain', label: 'Maintain' },
                                        { val: 'gain', label: 'Gain Weight' }
                                    ].map((opt) => (
                                        <button
                                            key={opt.val}
                                            onClick={() => setGoal(opt.val as any)}
                                            className={`flex-1 py-3 px-2 rounded-lg border text-sm font-medium transition-all ${goal === opt.val ? 'border-green-500 bg-green-50 text-green-700 ring-1 ring-green-500' : 'border-gray-200 text-gray-600 hover:bg-gray-50'}`}
                                        >
                                            {opt.label}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <button
                                onClick={handleComplete}
                                disabled={loading}
                                className="w-full mt-6 bg-green-600 text-white py-3 rounded-lg font-medium hover:bg-green-700 disabled:opacity-50 transition-colors flex items-center justify-center gap-2 shadow-lg shadow-green-200"
                            >
                                {loading ? 'Creating Profile...' : 'Complete Setup'}
                                {!loading && <Check className="w-4 h-4" />}
                            </button>
                        </div>
                    </div>
                )}

            </div>
        </div>
    );
};
