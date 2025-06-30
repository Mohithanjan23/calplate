import { useEffect, useState } from 'react';
import { supabase } from '../services/supabaseClient';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';

const COLORS = ['#36A2EB', '#FFCE56', '#FF6384']; // protein, carbs, fat
const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export default function Stats() {
  const [weeklyData, setWeeklyData] = useState([]);
  const [macroTotals, setMacroTotals] = useState({ protein: 0, carbs: 0, fat: 0 });

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      alert('⚠️ Failed to get user. Please login.');
      return;
    }

    const today = new Date();
    const lastWeek = new Date(today);
    lastWeek.setDate(today.getDate() - 6);
    const fromDate = lastWeek.toISOString().split('T')[0];

    const { data, error } = await supabase
      .from('meals')
      .select('*')
      .eq('user_id', user.id)
      .gte('date', fromDate);

    if (error) {
      console.error('Error fetching stats:', error.message);
      return;
    }

    const grouped = {};
    let totalProtein = 0, totalCarbs = 0, totalFat = 0;

    for (const meal of data) {
      const date = meal.date ? new Date(meal.date) : new Date();
      const day = date.toLocaleDateString('en-US', { weekday: 'short' });

      grouped[day] = (grouped[day] || 0) + meal.calories;

      totalProtein += meal.protein || 0;
      totalCarbs += meal.carbs || 0;
      totalFat += meal.fat || 0;
    }

    const chartData = WEEKDAYS.map((day) => ({
      day,
      calories: grouped[day] || 0,
    }));

    setWeeklyData(chartData);
    setMacroTotals({ protein: totalProtein, carbs: totalCarbs, fat: totalFat });
  };

  const pieData = [
    { name: 'Protein (g)', value: macroTotals.protein },
    { name: 'Carbs (g)', value: macroTotals.carbs },
    { name: 'Fat (g)', value: macroTotals.fat },
  ];

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold text-center mb-6">📊 Weekly Nutrition</h1>

      <section className="mb-8">
        <h2 className="text-lg font-semibold mb-2">Calories by Day</h2>
        {weeklyData.every(d => d.calories === 0) ? (
          <p className="text-center">No calorie data logged this week.</p>
        ) : (
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={weeklyData}>
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="calories" fill="#4F46E5" radius={[5, 5, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </section>

      <section>
        <h2 className="text-lg font-semibold mb-2">Macros Breakdown</h2>
        {(macroTotals.protein + macroTotals.carbs + macroTotals.fat === 0) ? (
          <p className="text-center">No macro data to display.</p>
        ) : (
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie
                data={pieData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={80}
                label
              >
                {pieData.map((entry, index) => (
                  <Cell key={entry.name} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Legend verticalAlign="bottom" height={36} />
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        )}
      </section>
    </div>
  );
}
