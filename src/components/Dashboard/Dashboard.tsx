import React, { useContext, useEffect } from "react";
import { AppContext } from "../../context/AppContext";
import AddMeal from "./AddMeal";
import { Loader } from "../Shared/Loader";
import { motion } from "framer-motion";
import { PieChart, Pie, Cell, Tooltip } from "recharts";

const Dashboard = () => {
  const { user, meals, fetchMeals, loading } = useContext(AppContext);

  useEffect(() => {
    if (user) fetchMeals();
  }, [user]);

  if (loading) return <Loader />;

  // --- Daily Summary ---
  const todayMeals = meals.filter((m) => {
    const today = new Date().toDateString();
    return new Date(m.created_at).toDateString() === today;
  });

  const totalCalories = todayMeals.reduce((sum, m) => sum + (m.calories || 0), 0);
  const macros = {
    protein: todayMeals.reduce((s, m) => s + (m.protein || 0), 0),
    carbs: todayMeals.reduce((s, m) => s + (m.carbs || 0), 0),
    fat: todayMeals.reduce((s, m) => s + (m.fat || 0), 0),
  };

  const data = [
    { name: "Protein", value: macros.protein },
    { name: "Carbs", value: macros.carbs },
    { name: "Fat", value: macros.fat },
  ];
  const COLORS = ["#3b82f6", "#facc15", "#ef4444"];

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">Hello, {user?.email} 👋</h1>

      {/* --- Calorie Summary --- */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white shadow rounded-2xl p-6 mb-6"
      >
        <h2 className="text-lg font-semibold mb-2">Today’s Summary</h2>
        <p className="text-gray-600">Calories: {totalCalories} kcal</p>

        <PieChart width={250} height={200}>
          <Pie
            data={data}
            dataKey="value"
            cx="50%"
            cy="50%"
            outerRadius={70}
            label
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </motion.div>

      {/* --- Recent Meals --- */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="bg-white shadow rounded-2xl p-6 mb-6"
      >
        <h2 className="text-lg font-semibold mb-4">Recent Meals</h2>
        {todayMeals.length === 0 ? (
          <p className="text-gray-500">No meals logged today.</p>
        ) : (
          <ul className="space-y-2">
            {todayMeals.map((meal) => (
              <li
                key={meal.id}
                className="flex justify-between items-center p-3 bg-gray-50 rounded-xl"
              >
                <span className="font-medium">{meal.name}</span>
                <span className="text-sm text-gray-600">
                  {meal.calories} kcal
                </span>
              </li>
            ))}
          </ul>
        )}
      </motion.div>

      {/* --- Add Meal Button --- */}
      <AddMeal />
    </div>
  );
};

export default Dashboard;
