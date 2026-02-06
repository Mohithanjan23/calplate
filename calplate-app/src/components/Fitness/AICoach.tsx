import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, ArrowLeft, Dumbbell, ArrowRight, Check } from 'lucide-react';

export default function AICoach() {
    const navigate = useNavigate();
    const [step, setStep] = useState(1);
    const [goal, setGoal] = useState('');
    const [equipment, setEquipment] = useState('');
    const [duration, setDuration] = useState('');
    const [generatedPlan, setGeneratedPlan] = useState<any>(null);
    const [loading, setLoading] = useState(false);

    const generatePlan = () => {
        setLoading(true);
        // Simulate using the inputs
        console.log(`Generating plan for Goal: ${goal}, Equipment: ${equipment}, Duration: ${duration}`);

        setTimeout(() => {
            setGeneratedPlan({
                name: "AI Personalized HIIT",
                duration: duration,
                intensity: "High",
                exercises: [
                    { name: "Jumping Jacks", sets: "3", reps: "60s" },
                    { name: "Push-ups", sets: "3", reps: "15" },
                    { name: "Burpees", sets: "3", reps: "10" },
                    { name: "Mountain Climbers", sets: "3", reps: "45s" }
                ]
            });
            setLoading(false);
            setStep(4);
        }, 2500);
    };

    return (
        <div className="min-h-screen bg-slate-900 text-white p-6 relative overflow-hidden">
            {/* Background decorations */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-600/20 rounded-full blur-3xl z-0 pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-80 h-80 bg-purple-600/20 rounded-full blur-3xl z-0 pointer-events-none" />

            <div className="relative z-10">
                <div className="flex items-center gap-4 mb-8">
                    <button onClick={() => navigate('/fitness-hub')} className="p-2 bg-slate-800 rounded-full border border-slate-700 hover:bg-slate-700 transition-colors">
                        <ArrowLeft className="w-5 h-5 text-indigo-400" />
                    </button>
                    <h1 className="text-xl font-bold flex items-center gap-2">
                        <Sparkles className="w-5 h-5 text-yellow-400" /> AI Coach
                    </h1>
                </div>

                {step === 1 && (
                    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
                        <h2 className="text-2xl font-bold">What's your goal today?</h2>
                        <div className="space-y-3">
                            {['Lose Weight', 'Build Muscle', 'Improve Endurance', 'Flexibility'].map((opt) => (
                                <button
                                    key={opt}
                                    onClick={() => { setGoal(opt); setStep(2); }}
                                    className="w-full p-4 bg-slate-800 rounded-2xl border border-slate-700 hover:border-indigo-500 hover:bg-slate-750 transition-all text-left font-semibold flex justify-between items-center group"
                                >
                                    {opt}
                                    <ArrowRight className="w-5 h-5 text-slate-500 group-hover:text-indigo-400" />
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {step === 2 && (
                    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
                        <h2 className="text-2xl font-bold">Equipment available?</h2>
                        <div className="space-y-3">
                            {['None (Bodyweight)', 'Dumbbells', 'Full Gym', 'Resistance Bands'].map((opt) => (
                                <button
                                    key={opt}
                                    onClick={() => { setEquipment(opt); setStep(3); }}
                                    className="w-full p-4 bg-slate-800 rounded-2xl border border-slate-700 hover:border-indigo-500 hover:bg-slate-750 transition-all text-left font-semibold flex justify-between items-center group"
                                >
                                    {opt}
                                    <ArrowRight className="w-5 h-5 text-slate-500 group-hover:text-indigo-400" />
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {step === 3 && (
                    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
                        <h2 className="text-2xl font-bold">How much time?</h2>
                        <div className="grid grid-cols-2 gap-4">
                            {['15 min', '30 min', '45 min', '60 min'].map((opt) => (
                                <button
                                    key={opt}
                                    onClick={() => { setDuration(opt); generatePlan(); }}
                                    className="p-6 bg-slate-800 rounded-2xl border border-slate-700 hover:border-indigo-500 hover:scale-105 transition-all font-bold text-center"
                                >
                                    {opt}
                                </button>
                            ))}
                        </div>
                        {loading && (
                            <div className="text-center mt-8 space-y-3">
                                <Sparkles className="w-8 h-8 text-yellow-400 animate-spin mx-auto" />
                                <p className="text-indigo-300 animate-pulse">Designing your workout...</p>
                            </div>
                        )}
                    </div>
                )}

                {step === 4 && generatedPlan && (
                    <div className="animate-in zoom-in duration-500">
                        <div className="text-center mb-6">
                            <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-400">
                                {generatedPlan.name}
                            </h2>
                            <p className="text-slate-400 mt-1">{generatedPlan.duration} • {generatedPlan.intensity} Intensity</p>
                        </div>

                        <div className="bg-slate-800/50 rounded-3xl border border-slate-700 p-2 space-y-2 mb-6">
                            {generatedPlan.exercises.map((ex: any, idx: number) => (
                                <div key={idx} className="bg-slate-800 p-4 rounded-2xl flex justify-between items-center">
                                    <div>
                                        <div className="font-bold">{ex.name}</div>
                                        <div className="text-sm text-slate-400">{ex.sets} sets x {ex.reps}</div>
                                    </div>
                                    <div className="w-8 h-8 bg-indigo-500/20 rounded-full flex items-center justify-center text-indigo-400">
                                        <Dumbbell className="w-4 h-4" />
                                    </div>
                                </div>
                            ))}
                        </div>

                        <button
                            onClick={() => navigate('/fitness-hub')}
                            className="w-full py-4 bg-indigo-500 hover:bg-indigo-600 rounded-xl font-bold text-white shadow-lg shadow-indigo-500/30 transition-all flex items-center justify-center gap-2"
                        >
                            <Check className="w-5 h-5" /> Start Workout
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
