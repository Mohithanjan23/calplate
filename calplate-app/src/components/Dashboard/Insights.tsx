import { BarChart, Bar, XAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const WEEKLY_DATA = [
    { day: 'Mon', calories: 1800 },
    { day: 'Tue', calories: 2100 },
    { day: 'Wed', calories: 1950 },
    { day: 'Thu', calories: 2300 },
    { day: 'Fri', calories: 1700 }, // Today (simulated)
    { day: 'Sat', calories: 2400 },
    { day: 'Sun', calories: 2000 },
];

const MACRO_DATA = [
    { name: 'Protein', value: 140, color: '#6366f1' }, // Indigo
    { name: 'Carbs', value: 250, color: '#f59e0b' },   // Amber
    { name: 'Fat', value: 65, color: '#10b981' },      // Emerald
];

export default function Insights() {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-slate-50 p-6 pb-24">
            <div className="flex items-center gap-4 mb-6">
                <button onClick={() => navigate(-1)} className="p-2 bg-white rounded-full border border-slate-200">
                    <ArrowLeft className="w-5 h-5" />
                </button>
                <h1 className="text-xl font-bold">Insights</h1>
            </div>

            <div className="space-y-6">
                {/* Weekly Calories Bar Chart */}
                <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
                    <h3 className="font-bold text-slate-900 mb-4">Weekly Intake</h3>
                    <div className="h-48 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={WEEKLY_DATA}>
                                <XAxis dataKey="day" tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                                <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} cursor={{ fill: '#f1f5f9' }} />
                                <Bar dataKey="calories" fill="#6366f1" radius={[4, 4, 4, 4]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Macro Distribution Pie Chart */}
                <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
                    <h3 className="font-bold text-slate-900 mb-4">Macro Split</h3>
                    <div className="flex items-center">
                        <div className="h-40 w-40 relative">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={MACRO_DATA}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={40}
                                        outerRadius={60}
                                        paddingAngle={5}
                                        dataKey="value"
                                        stroke="none"
                                    >
                                        {MACRO_DATA.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} />
                                        ))}
                                    </Pie>
                                </PieChart>
                            </ResponsiveContainer>
                        </div>

                        <div className="flex-1 space-y-3 pl-4">
                            {MACRO_DATA.map((macro) => (
                                <div key={macro.name} className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: macro.color }} />
                                        <span className="text-sm font-medium text-slate-700">{macro.name}</span>
                                    </div>
                                    <span className="text-sm font-bold text-slate-900">{macro.value}g</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
