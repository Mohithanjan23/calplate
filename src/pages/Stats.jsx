import { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { getMealsFromLast7Days } from '../services/foodService';
import Card from '../components/Card.jsx';
import { BarChart2 } from 'lucide-react';

export default function Stats() {
  const [loading, setLoading] = useState(true);
  const [chartData, setChartData] = useState([]);
  const [averageCalories, setAverageCalories] = useState(0);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      const meals = await getMealsFromLast7Days();

      const dailyData = meals.reduce((acc, meal) => {
        const date = new Date(meal.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        if (!acc[date]) {
          acc[date] = 0;
        }
        acc[date] += meal.calories;
        return acc;
      }, {});

      const formattedChartData = Object.keys(dailyData).map(date => ({
        date,
        calories: dailyData[date],
      })).sort((a, b) => new Date(a.date) - new Date(b.date));
      
      setChartData(formattedChartData);
      
      if (formattedChartData.length > 0) {
        const totalCalories = formattedChartData.reduce((sum, day) => sum + day.calories, 0);
        setAverageCalories(Math.round(totalCalories / formattedChartData.length));
      }

      setLoading(false);
    }
    fetchData();
  }, []);

  if (loading) {
    return <div className="p-4 text-center">Loading stats...</div>;
  }
  
  return (
    <div className="p-4 space-y-6">
      <div className="flex items-center gap-3">
        <BarChart2 size={28} />
        <h1 className="text-3xl font-bold">My Stats</h1>
      </div>

      <Card>
        <h2 className="text-lg font-semibold text-text-secondary mb-4">Last 7 Days - Calorie Intake</h2>
        <div style={{ width: '100%', height: 300 }}>
          <ResponsiveContainer>
            <LineChart data={chartData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.1)" />
              <XAxis dataKey="date" stroke="#A9A9A9" />
              <YAxis stroke="#A9A9A9" />
              <Tooltip
                contentStyle={{ backgroundColor: '#1A1A1A', borderColor: 'rgba(255, 255, 255, 0.2)' }}
                labelStyle={{ color: '#FFFFFF' }}
              />
              <Line type="monotone" dataKey="calories" stroke="#8A2BE2" strokeWidth={2} activeDot={{ r: 8 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </Card>

      <Card>
         <h2 className="text-lg font-semibold text-text-secondary mb-2">Weekly Average</h2>
         <p className="text-2xl font-bold text-primary">{averageCalories} <span className="text-lg font-normal text-text-secondary">kcal / day</span></p>
      </Card>
    </div>
  );
}