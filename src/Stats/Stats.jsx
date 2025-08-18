import React, { useContext, useEffect, useState } from "react";
import { AppContext } from "../../context/AppContext";
import { Loader } from "../Shared/Loader";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";

const Stats = () => {
  const { user, meals, fetchMeals, loading } = useContext(AppContext);
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    if (user) fetchMeals();
  }, [user]);

  useEffect(() => {
    if (meals.length) {
      // Group meals by date → sum calories/macros
      const grouped = meals.reduce((acc, meal) => {
        const date = new Date(meal.created_at).toLocaleDateString();
        if (!acc[date]) {
          acc[date] = { date, calories: 0, protein: 0, carbs: 0, fat: 0 };
        }
        acc[date].calories += meal.calories || 0;
        acc[date].protein += meal.protein || 0;
        acc[date].carbs += meal.carbs || 0;
        acc[date].fat += meal.fat || 0;
        return acc;
      }, {});
      setChartData(Object.values(grouped));
    }
  }, [meals]);

  if (loading) return <Loader />;

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-6">📊 Progress Stats</h1>

      {!chartData.length ? (
        <p className="text-gray-500">No data available. Start logging meals!</p>
      ) : (
        <div className="space-y-8">
          {/* --- Calories Line Chart --- */}
          <div className="bg-white shadow rounded-2xl p-6">
            <h2 className="text-lg font-semibold mb-4">Calories Over Time</h2>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="calories" stroke="#3b82f6" />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* --- Macros Bar Chart --- */}
          <div className="bg-white shadow rounded-2xl p-6">
            <h2 className="text-lg font-semibold mb-4">Macros Breakdown</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="protein" stackId="a" fill="#3b82f6" />
                <Bar dataKey="carbs" stackId="a" fill="#facc15" />
                <Bar dataKey="fat" stackId="a" fill="#ef4444" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </div>
  );
};

export default Stats;
