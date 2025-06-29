import { useEffect, useState } from 'react';
import { supabase } from '../services/supabaseClient';
import { BarChart, Bar, XAxis, YAxis, Tooltip, PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

const COLORS = ['#10B981', '#3B82F6', '#F59E0B'];

export default function Stats() {
  const [data, setData] = useState([]);
  const [macros, setMacros] = useState({ protein: 0, carbs: 0, fat: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();

    const { data: meals, error } = await supabase
      .from('meals')
      .select('*')
      .eq('user_id', user.id);

    if (error) {
      console.error('Stats fetch error:', error.message);
      setLoading(false);
      return;
    }

    // Aggregate calories per day
    const grouped = {};
    let protein = 0, carbs = 0, fat = 0;

    meals.forEach((meal) => {
      const date = new Date(meal.date).toLocaleDateString();
      grouped[date] = (grouped[date] || 0) + meal.calories;

      protein += meal.protein || 0;
      carbs += meal.carbs || 0;
      fat += meal.fat || 0;
    });

    const caloriesPerDay = Object.entries(grouped).map(([date, total]) => ({
      date,
      calories: total,
    }));

    setData(caloriesPerDay);
    setMacros({ protein, carbs, fat });
    setLoading(false);
  };

  const pieData = [
    { name: 'Protein', value: macros.protein },
    { name: 'Carbs', value: macros.carbs },
    { name: 'Fat', value: macros.fat },
  ];

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-4 text-center">Weekly Summary</h2>

      {loading ? (
        <p className="text-center">Loading stats...</p>
      ) : (
        <>
          <div className="mb-8">
            <h3 className="text-lg font-semibold mb-2">Calories per Day</h3>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={data}>
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="calories" fill="#3B82F6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-2">Macro Breakdown</h3>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  label
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={entry.name} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </>
      )}
    </div>
  );
}
