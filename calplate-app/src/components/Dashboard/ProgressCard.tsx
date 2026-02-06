import { Flame } from 'lucide-react';

interface ProgressCardProps {
    currentCalories: number;
    goalCalories: number;
}

export default function ProgressCard({ currentCalories, goalCalories }: ProgressCardProps) {
    const percentage = Math.min(Math.round((currentCalories / goalCalories) * 100), 100);
    const remaining = goalCalories - currentCalories;

    // Logic: Green (<50%), Yellow (50-90%), Red (>90%)
    // Spec says "Green-to-Red progress bar".
    // Let's do a gradient or dynamic color.

    let colorClass = 'bg-green-500';
    if (percentage > 50) colorClass = 'bg-yellow-500';
    if (percentage > 90) colorClass = 'bg-red-500';

    return (
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 relative overflow-hidden">
            <div className="flex justify-between items-start mb-4 relative z-10">
                <div>
                    <h2 className="text-slate-500 text-sm font-semibold uppercase tracking-wider">Daily Energy</h2>
                    <div className="flex items-baseline gap-1 mt-1">
                        <span className="text-3xl font-bold text-slate-900">{currentCalories}</span>
                        <span className="text-sm text-slate-400">/ {goalCalories} kcal</span>
                    </div>
                </div>
                <div className={`p-3 rounded-2xl ${percentage > 90 ? 'bg-red-50 text-red-500' : 'bg-green-50 text-green-500'}`}>
                    <Flame className="w-6 h-6" />
                </div>
            </div>

            <div className="relative h-4 bg-slate-100 rounded-full overflow-hidden">
                <div
                    className={`absolute top-0 left-0 h-full transition-all duration-1000 ease-out ${colorClass}`}
                    style={{ width: `${percentage}%` }}
                />
            </div>

            <p className="text-right text-xs text-slate-400 mt-2 font-medium">
                {remaining > 0 ? `${remaining} kcal remaining` : `${Math.abs(remaining)} kcal over limit`}
            </p>
        </div>
    );
}
