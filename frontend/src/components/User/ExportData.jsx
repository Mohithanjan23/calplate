// D:\calplate\frontend\src\components\User\ExportData.jsx
import React from "react";

const ExportData = ({ meals }) => {
  const handleExport = () => {
    const headers = ["Date", "Meal", "Type", "Calories"];
    const rows = meals.map((meal) => [
      meal.date,
      meal.name,
      meal.type,
      meal.calories,
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers, ...rows].map((e) => e.join(",")).join("\n");

    const link = document.createElement("a");
    link.href = encodeURI(csvContent);
    link.download = "calplate_meals.csv";
    link.click();
  };

  return (
    <div className="p-6">
      <div className="bg-white rounded-2xl shadow-sm border p-6 text-center">
        <h2 className="text-xl font-bold mb-4">📤 Export Data</h2>
        <button
          onClick={handleExport}
          className="bg-green-600 text-white px-4 py-3 rounded-lg font-medium hover:bg-green-700"
        >
          Export as CSV
        </button>
      </div>
    </div>
  );
};

export default ExportData;
