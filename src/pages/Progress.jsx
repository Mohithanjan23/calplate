import { LineChart, Line, XAxis, YAxis, ResponsiveContainer } from 'recharts';

export default function Progress() {
    const data = [ { name: 'Sun', value: 75 }, { name: 'Mon', value: 72 }, { name: 'Tue', value: 73 } ];
    return (
        <div className="p-4 space-y-4">
            <h1 className="text-3xl font-bold">Progress</h1>
            <div className="bg-white p-4 rounded-2xl shadow-sm border h-64">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={data}>
                        <XAxis dataKey="name" stroke="#9ca3af" fontSize={12} />
                        <YAxis stroke="#9ca3af" fontSize={12} />
                        <Line type="monotone" dataKey="value" stroke="#000000" strokeWidth={2} />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}