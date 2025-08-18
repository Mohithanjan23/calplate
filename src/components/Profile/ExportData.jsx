import React, { useState, useContext } from "react";
import { supabase } from "../../services/supabaseClient";
import { AppContext } from "../../context/AppContext";
import { Loader } from "../Shared/Loader";

const ExportData = () => {
  const { user } = useContext(AppContext);
  const [loading, setLoading] = useState(false);
  const [exported, setExported] = useState(null);

  const fetchTable = async (table) => {
    const { data, error } = await supabase
      .from(table)
      .select("*")
      .eq("user_id", user.id);
    return error ? [] : data;
  };

  const handleExport = async () => {
    if (!user) return;
    setLoading(true);

    // Gather all logs
    const meals = await fetchTable("meals");
    const workouts = await fetchTable("workouts");
    const water = await fetchTable("water_intake");
    const sleep = await fetchTable("sleep_logs");
    const reminders = await fetchTable("reminders");

    // Combine into CSV format
    let csv = "Category,Date,Data\n";

    meals.forEach((m) => {
      csv += `Meal,${m.created_at},${m.food_name} (${m.calories} kcal)\n`;
    });

    workouts.forEach((w) => {
      csv += `Workout,${w.created_at},${w.type} - ${w.duration} mins\n`;
    });

    water.forEach((w) => {
      csv += `Water,${w.created_at},${w.amount} ml\n`;
    });

    sleep.forEach((s) => {
      csv += `Sleep,${s.date},${s.hours} hrs\n`;
    });

    reminders.forEach((r) => {
      csv += `Reminder,${r.time},${r.type} - ${r.message}\n`;
    });

    // Download as CSV file
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "calplate_export.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setExported(new Date().toLocaleString());
    setLoading(false);
  };

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-6">📤 Export Data</h1>

      <p className="text-gray-600 mb-4">
        Download all your logged data (meals, workouts, water, sleep, reminders) as a CSV file.
      </p>

      <button
        onClick={handleExport}
        disabled={loading}
        className="bg-purple-500 text-white px-6 py-3 rounded-lg hover:bg-purple-600 disabled:opacity-50"
      >
        {loading ? "Exporting..." : "Export as CSV"}
      </button>

      {exported && (
        <p className="text-sm text-green-600 mt-4">
          ✅ Exported successfully at {exported}
        </p>
      )}
    </div>
  );
};

export default ExportData;
