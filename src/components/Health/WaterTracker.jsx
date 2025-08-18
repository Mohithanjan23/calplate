import React, { useState, useEffect, useContext } from "react";
import { supabase } from "../../services/supabaseClient";
import { AppContext } from "../../context/AppContext";
import { Loader } from "../Shared/Loader";

const WaterTracker = () => {
  const { user } = useContext(AppContext);
  const [logs, setLogs] = useState([]);
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const dailyGoal = 3000; // ml (default goal)

  const fetchLogs = async () => {
    if (!user) return;
    setLoading(true);

    const today = new Date().toISOString().split("T")[0]; // YYYY-MM-DD
    const { data, error } = await supabase
      .from("water_logs")
      .select("*")
      .eq("user_id", user.id)
      .eq("date", today)
      .order("created_at", { ascending: false });

    if (!error && data) setLogs(data);
    setLoading(false);
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!user || !amount) return;

    setLoading(true);
    const today = new Date().toISOString().split("T")[0];
    const { error } = await supabase.from("water_logs").insert([
      { user_id: user.id, amount: parseInt(amount), date: today },
    ]);

    if (error) {
      console.error(error);
      alert("⚠️ Failed to log water.");
    } else {
      setAmount("");
      fetchLogs();
    }
    setLoading(false);
  };

  const totalIntake = logs.reduce((sum, l) => sum + l.amount, 0);
  const progress = Math.min((totalIntake / dailyGoal) * 100, 100);

  useEffect(() => {
    fetchLogs();
  }, [user]);

  if (loading && !logs.length) return <Loader />;

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-6">💧 Water Tracker</h1>

      {/* Progress */}
      <div className="mb-6">
        <p className="text-lg font-semibold">
          {totalIntake} ml / {dailyGoal} ml
        </p>
        <div className="w-full bg-gray-200 rounded-full h-4 mt-2">
          <div
            className="bg-blue-500 h-4 rounded-full transition-all"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div>

      {/* Add Log */}
      <form onSubmit={handleAdd} className="flex gap-2 mb-6">
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="Amount (ml)"
          className="flex-1 p-3 border rounded-lg"
          required
        />
        <button
          type="submit"
          disabled={loading}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 disabled:opacity-50"
        >
          Add
        </button>
      </form>

      {/* Logs */}
      {!logs.length ? (
        <p className="text-gray-500">No water logged today.</p>
      ) : (
        <div className="space-y-2">
          {logs.map((l) => (
            <div
              key={l.id}
              className="bg-white shadow rounded-xl p-3 flex justify-between"
            >
              <span>{l.amount} ml</span>
              <span className="text-gray-500 text-sm">
                {new Date(l.created_at).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default WaterTracker;
