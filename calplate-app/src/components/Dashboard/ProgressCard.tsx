import { PieChart, Pie, Cell, ResponsiveContainer, Label } from 'recharts';
import { Flame } from 'lucide-react';

interface ProgressCardProps {
    currentCalories: number;
    goalCalories: number;
    burnedCalories?: number;
}

export default function ProgressCard({ currentCalories, goalCalories, burnedCalories = 0 }: ProgressCardProps) {
    // Net logic: Remaining = (Goal + Burned) - Consumed
    const totalBudget = goalCalories + burnedCalories;
    const remaining = totalBudget - currentCalories;
    const isOver = remaining < 0;

    // Data for the ring
    const data = [
        { name: 'Consumed', value: Math.min(currentCalories, totalBudget) },
        { name: 'Remaining', value: Math.max(0, remaining) },
    ];

    // Colors
    const COLORS = ['#6366f1', '#f1f5f9']; // Indigo-500, Slate-100
    if (isOver) COLORS[0] = '#ef4444'; // Red-500 if over

    // Calculate percentage for display (based on total budget)
    const percentage = Math.round((currentCalories / totalBudget) * 100);

    return (
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 relative overflow-hidden">
            <div className="flex items-center justify-between mb-2">
                <h2 className="text-slate-500 text-sm font-semibold uppercase tracking-wider">Net Energy</h2>
                <div className={`p-2 rounded-full ${isOver ? 'bg-red-50 text-red-500' : 'bg-indigo-50 text-indigo-500'}`}>
                    <Flame className="w-5 h-5" />
                </div>
            </div>

            <div className="flex items-center justify-between">
                {/* Ring Chart */}
                <div className="h-32 w-32 relative">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={data}
                                cx="50%"
                                cy="50%"
                                innerRadius={45}
                                outerRadius={58}
                                startAngle={90}
                                endAngle={-270}
                                dataKey="value"
                                cornerRadius={10}
                                stroke="none"
                            >
                                {data.map((_, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                                <Label
                                    value={`${percentage}%`}
                                    position="center"
                                    className="text-xl font-bold fill-slate-900"
                                    style={{ fontSize: '18px', fontWeight: 'bold' }}
                                />
                            </Pie>
                        </PieChart>
                    </ResponsiveContainer>
                </div>

                {/* Stats Text */}
                <div className="flex-1 pl-6">
                    <div className="mb-2">
                        <span className="text-3xl font-bold text-slate-900">{currentCalories}</span>
                        <span className="text-sm text-slate-400 block">/ {totalBudget} kcal (Net)</span>
                    </div>

                    {burnedCalories > 0 && (
                        <div className="mb-2 text-xs text-indigo-600 bg-indigo-50 px-2 py-1 rounded inline-block">
                            + {burnedCalories} kcal earned
                        </div>
                    )}

                    <p className={`text-xs font-medium ${isOver ? 'text-red-500' : 'text-slate-900'}`}>
                        {isOver
                            ? `${Math.abs(remaining)} kcal over limit`
                            : `${remaining} kcal remaining`
                        }
                    </p>
                </div>
            </div>
        </div>
    );
}
