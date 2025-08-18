import React, { useState, useEffect, useContext } from "react";
import { supabase } from "../../services/supabaseClient";
import { AppContext } from "../../context/AppContext";
import { Loader } from "../Shared/Loader";

const SleepTracker = () => {
  const { user } = useContext(AppContext);
  const [logs, setLogs] = useState([]);
  const [sleepTime, setSleepTime] = useState("");
  const [wakeTime, setWakeTime] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchLogs = async () => {
    if (!user) return;
    setLoading(true);

    const { data, error } = await supabase
      .from("sleep_logs")
      .select("*")
      .eq("user_id", user.id)
      .order("date", { ascending: false });

    if (!error && data) setLogs(data);
    setLoading(false);
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!user || !sleepTime || !wakeTime) return;

    const sleepDate = new Date(`2025-01-01T${sleepTime}:00`);
    const wakeDate = new Date(`2025-01-01T${wakeTime}:00`);
    let duration = (wakeDate - sleepDate) / (1000 * 60 * 60);

    // Handle overnight sleep (past midnight)
    if (duration < 0) {
      duration += 24;
    }

    setLoading(true);
    const today = new Date().toISOString().split("T")[0];

    const { error } = await supabase.from("sleep_logs").insert([
      { user_id: user.id, sleep_time: sleepTime, wake_time: wakeTime, duration, date: today },
    ]);

    if (error) {
      console.error(error);
      alert("⚠️ Failed to log sleep.");
    } else {
      setSleepTime("");
      setWakeTime("");
      fetchLogs();
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchLogs();
  }, [user]);

  if (loading && !logs.length) return <Loader />;

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-6">😴 Sleep Tracker</h1>

      {/* Add Sleep Log */}
      <form onSubmit={handleAdd} className="grid gap-3 md:grid-cols-3 mb-6">
        <input
          type="time"
          value={sleepTime}
          onChange={(e) => setSleepTime(e.target.value)}
          className="p-3 border rounded-lg"
          required
        />
        <input
          type="time"
          value={wakeTime}
          onChange={(e) => setWakeTime(e.target.value)}
          className="p-3 border rounded-lg"
          required
        />
        <button
          type="submit"
          disabled={loading}
          className="bg-indigo-500 text-white py-2 rounded-lg hover:bg-indigo-600 disabled:opacity-50"
        >
          Add
        </button>
      </form>

      {/* Sleep Logs */}
      {!logs.length ? (
        <p className="text-gray-500">No sleep data logged yet.</p>
      ) : (
        <div className="space-y-3">
          {logs.map((l) => (
            <div
              key={l.id}
              className="bg-white shadow rounded-xl p-4 flex justify-between"
            >
              <div>
                <p className="font-semibold">
                  Slept {l.sleep_time} → Woke {l.wake_time}
                </p>
                <p className="text-sm text-gray-600">
                  Duration: {l.duration} hrs
                </p>
              </div>
              <span className="text-xs text-gray-400">
                {new Date(l.date).toLocaleDateString()}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SleepTracker;
