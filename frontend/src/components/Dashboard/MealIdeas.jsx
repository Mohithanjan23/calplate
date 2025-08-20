// D:\calplate\frontend\src\components\Dashboard\MealIdeas.jsx
import React, { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import api from "../../services/api";

const MealIdeas = () => {
  const [loading, setLoading] = useState(true);
  const [ideas, setIdeas] = useState([]);

  useEffect(() => {
    const fetchIdeas = async () => {
      try {
        const res = await api.get("/aiMealSuggestion");
        setIdeas(res.data.meals || []);
      } catch (error) {
        console.error("Error fetching meal ideas:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchIdeas();
  }, []);

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">🍴 Meal Ideas</h2>

      {loading ? (
        <div className="flex justify-center items-center h-40">
          <Loader2 className="animate-spin w-6 h-6 text-green-600" />
          <span className="ml-2">Fetching ideas...</span>
        </div>
      ) : ideas.length === 0 ? (
        <p className="text-gray-500">No ideas available right now.</p>
      ) : (
        <div className="space-y-4">
          {ideas.map((meal, idx) => (
            <div
              key={idx}
              className="border rounded-lg p-4 shadow-sm hover:shadow-md transition"
            >
              <h3 className="font-semibold text-lg">{meal.name}</h3>
              <p className="text-gray-600">{meal.description}</p>
              <p className="text-sm text-green-600 mt-2">
                {meal.calories} cal • {meal.time} min
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MealIdeas;
