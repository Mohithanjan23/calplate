import { Home, BarChart2, Settings, Plus } from 'lucide-react';
import Card from '../components/Card.jsx';

const StatCard = ({ title, value, unit, children }) => (
    <div className="bg-white p-4 rounded-2xl shadow-sm border flex-1">
        <p className="text-sm text-gray-500">{title}</p>
        <p className="text-2xl font-bold">{value}<span className="text-lg text-gray-400"> {unit}</span></p>
        {children}
    </div>
);

export default function Dashboard() {
    return (
        <div className="p-4 space-y-6">
            <h1 className="text-3xl font-bold">Dashboard</h1>
            <div className="flex gap-4">
                <StatCard title="Steps today" value="9,845" unit="/10,000">
                    <div className="w-16 h-16 bg-gray-100 rounded-full border-4 border-gray-200 mt-2"></div>
                </StatCard>
                <StatCard title="Calories burned" value="332" unit="">
                     <div className="text-xs text-gray-500 mt-2">
                        <p>Steps +282</p>
                        <p>Weight lifting +50</p>
                    </div>
                </StatCard>
            </div>
        </div>
    );
}