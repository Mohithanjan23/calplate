import React, { useState, useContext } from "react";
import { supabase } from "../../services/supabaseClient";
import { AppContext } from "../../context/AppContext";

const Onboarding = ({ onComplete }) => {
  const { user } = useContext(AppContext);
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    age: "",
    gender: "male",
    height: "",
    weight: "",
    goal: "lose",
    activity: "moderate",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleNext = () => setStep(step + 1);
  const handleBack = () => setStep(step - 1);

  const handleFinish = async () => {
    if (!user) return;
    setLoading(true);

    const { error } = await supabase.from("profiles").upsert({
      id: user.id,
      age: form.age,
      gender: form.gender,
      height: form.height,
      weight: form.weight,
      goal: form.goal,
      activity: form.activity,
      onboarding_complete: true,
    });

    if (error) {
      console.error(error);
      alert("⚠️ Failed to save onboarding details.");
    } else {
      alert("✅ Welcome to Calplate!");
      if (onComplete) onComplete();
    }
    setLoading(false);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6 bg-gray-50">
      <div className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-md">
        <h1 className="text-xl font-bold mb-6 text-center">🎉 Let's Get Started</h1>

        {step === 1 && (
          <div className="space-y-4">
            <input
              type="number"
              name="age"
              value={form.age}
              onChange={handleChange}
              placeholder="Age"
              className="w-full p-3 border rounded-lg"
              required
            />
            <select
              name="gender"
              value={form.gender}
              onChange={handleChange}
              className="w-full p-3 border rounded-lg"
            >
              <option value="male">♂ Male</option>
              <option value="female">♀ Female</option>
              <option value="other">⚧ Other</option>
            </select>
            <button
              onClick={handleNext}
              className="w-full bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600"
            >
              Next →
            </button>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <input
              type="number"
              name="height"
              value={form.height}
              onChange={handleChange}
              placeholder="Height (cm)"
              className="w-full p-3 border rounded-lg"
              required
            />
            <input
              type="number"
              name="weight"
              value={form.weight}
              onChange={handleChange}
              placeholder="Weight (kg)"
              className="w-full p-3 border rounded-lg"
              required
            />
            <div className="flex justify-between">
              <button
                onClick={handleBack}
                className="bg-gray-300 px-4 py-2 rounded-lg"
              >
                ← Back
              </button>
              <button
                onClick={handleNext}
                className="bg-blue-500 text-white px-4 py-2 rounded-lg"
              >
                Next →
              </button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-4">
            <select
              name="goal"
              value={form.goal}
              onChange={handleChange}
              className="w-full p-3 border rounded-lg"
            >
              <option value="lose">⚡ Lose Weight</option>
              <option value="gain">💪 Gain Muscle</option>
              <option value="maintain">⚖ Maintain</option>
            </select>

            <select
              name="activity"
              value={form.activity}
              onChange={handleChange}
              className="w-full p-3 border rounded-lg"
            >
              <option value="sedentary">🪑 Sedentary</option>
              <option value="light">🚶 Light Activity</option>
              <option value="moderate">🏃 Moderate</option>
              <option value="active">🏋️ Active</option>
            </select>

            <div className="flex justify-between">
              <button
                onClick={handleBack}
                className="bg-gray-300 px-4 py-2 rounded-lg"
              >
                ← Back
              </button>
              <button
                onClick={handleFinish}
                disabled={loading}
                className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 disabled:opacity-50"
              >
                {loading ? "Saving..." : "Finish 🎉"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Onboarding;
