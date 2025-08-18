import React, { useState, useContext } from "react";
import { supabase } from "../../services/supabaseClient";
import { AppContext } from "../../context/AppContext";
import { Loader } from "../Shared/Loader";

const FoodScanner = () => {
  const { user, addMeal } = useContext(AppContext);
  const [imageUrl, setImageUrl] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleScan = async () => {
    if (!imageUrl) return;
    setLoading(true);
    setResult(null);

    try {
      // Clarifai request
      const response = await fetch("https://api.clarifai.com/v2/models/food-item-recognition/outputs", {
        method: "POST",
        headers: {
          "Authorization": `Key ${import.meta.env.VITE_CLARIFAI_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          inputs: [{ data: { image: { url: imageUrl } } }],
        }),
      });

      const data = await response.json();
      if (data.outputs?.[0]?.data?.concepts) {
        const topItem = data.outputs[0].data.concepts[0]; // highest probability food item
        setResult({
          name: topItem.name,
          probability: (topItem.value * 100).toFixed(1),
          calories: Math.floor(Math.random() * 300 + 100), // Placeholder calorie estimate
        });
      }
    } catch (err) {
      console.error("Clarifai Error:", err);
    }

    setLoading(false);
  };

  const handleSaveMeal = () => {
    if (!result) return;
    addMeal({
      name: result.name,
      calories: result.calories,
      protein: 0,
      carbs: 0,
      fat: 0,
    });
    setResult(null);
    setImageUrl("");
  };

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">📷 Food Scanner</h1>

      <div className="bg-white shadow rounded-2xl p-6 mb-6">
        <input
          type="text"
          placeholder="Enter image URL of your meal"
          value={imageUrl}
          onChange={(e) => setImageUrl(e.target.value)}
          className="w-full p-3 border rounded-lg mb-4"
        />
        <button
          onClick={handleScan}
          disabled={loading}
          className="w-full bg-blue-500 text-white py-3 rounded-lg font-semibold hover:bg-blue-600 transition disabled:opacity-50"
        >
          {loading ? "Scanning..." : "Scan Food"}
        </button>
      </div>

      {loading && <Loader />}

      {result && (
        <div className="bg-white shadow rounded-2xl p-6 text-center">
          <h2 className="text-lg font-semibold mb-2">Result</h2>
          <p className="text-gray-700">
            🍽 {result.name} <br />
            Confidence: {result.probability}% <br />
            Estimated Calories: {result.calories} kcal
          </p>

          <button
            onClick={handleSaveMeal}
            className="mt-4 bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600 transition"
          >
            Save to Meals
          </button>
        </div>
      )}
    </div>
  );
};

export default FoodScanner;
