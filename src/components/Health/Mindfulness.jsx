import React, { useState, useEffect, useContext } from "react";
import { supabase } from "../../services/supabaseClient";
import { AppContext } from "../../context/AppContext";
import { Loader } from "../Shared/Loader";

const Mindfulness = () => {
  const { user } = useContext(AppContext);
  const [logs, setLogs] = useState([]);
  const [form, setForm] = useState({
    type: "meditation",
    duration: "",
    notes: "",
  });
  const [loading, setLoading] = useState(false);

  const fetchLogs = async () => {
    if (!user) return;
    setLoading(true);

    const { data, error } = await supabase
      .from("mindfulness_logs")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (!error && data) setLogs(data);
    setLoading(false);
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!user || !form.duration) return;

    setLoading(true);
    const { error } = await supabase.from("mindfulness_logs").insert([
      {
        user_id: user.id,
        type: form.type,
        duration: parseInt(form.duration),
        notes: form.notes,
      },
    ]);

    if (error) {
      console.error(error);
      alert("⚠️ Failed to log session.");
    } else {
      setForm({ type: "meditation", duration: "", notes: "" });
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
      <h1 className="text-xl font-bold mb-6">🧘 Mindfulness</h1>

      {/* Add Session */}
      <form onSubmit={handleAdd} className="grid gap-3 md:grid-cols-3 mb-6">
        <select
          value={form.type}
          onChange={(e) => setForm({ ...form, type: e.target.value })}
          className="p-3 border rounded-lg"
        >
          <option value="meditation">🧘 Meditation</option>
          <option value="breathing">🌬 Breathing</option>
          <option value="relaxation">🌿 Relaxation</option>
        </select>
        <input
          type="number"
          value={form.duration}
          onChange={(e) => setForm({ ...form, duration: e.target.value })}
          placeholder="Duration (min)"
          className="p-3 border rounded-lg"
          required
        />
        <input
          type="text"
          value={form.notes}
          onChange={(e) => setForm({ ...form, notes: e.target.value })}
          placeholder="Notes (optional)"
          className="p-3 border rounded-lg md:col-span-2"
        />
        <button
          type="submit"
          disabled={loading}
          className="bg-teal-500 text-white py-2 rounded-lg hover:bg-teal-600 disabled:opacity-50 md:col-span-1"
        >
          Add
        </button>
      </form>

      {/* Session Logs */}
      {!logs.length ? (
        <p className="text-gray-500">No mindfulness sessions logged yet.</p>
      ) : (
        <div className="space-y-3">
          {logs.map((l) => (
            <div
              key={l.id}
              className="bg-white shadow rounded-xl p-4 flex justify-between"
            >
              <div>
                <p className="font-semibold capitalize">
                  {l.type} – {l.duration} min
                </p>
                {l.notes && <p className="text-sm text-gray-600">{l.notes}</p>}
              </div>
              <span className="text-xs text-gray-400">
                {new Date(l.created_at).toLocaleString()}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Mindfulness;
