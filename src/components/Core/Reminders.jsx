import React, { useState, useEffect, useContext } from "react";
import { supabase } from "../../services/supabaseClient";
import { AppContext } from "../../context/AppContext";
import { Loader } from "../Shared/Loader";

const Reminders = () => {
  const { user } = useContext(AppContext);
  const [reminders, setReminders] = useState([]);
  const [form, setForm] = useState({
    type: "meal",
    time: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);

  const fetchReminders = async () => {
    if (!user) return;
    setLoading(true);

    const { data, error } = await supabase
      .from("reminders")
      .select("*")
      .eq("user_id", user.id)
      .order("time", { ascending: true });

    if (!error && data) setReminders(data);
    setLoading(false);
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!user || !form.time || !form.message) return;

    setLoading(true);
    const { error } = await supabase.from("reminders").insert([
      {
        user_id: user.id,
        type: form.type,
        time: form.time,
        message: form.message,
      },
    ]);

    if (error) {
      console.error(error);
      alert("⚠️ Failed to add reminder.");
    } else {
      setForm({ type: "meal", time: "", message: "" });
      fetchReminders();
    }
    setLoading(false);
  };

  const handleDelete = async (id) => {
    const { error } = await supabase.from("reminders").delete().eq("id", id);
    if (!error) setReminders(reminders.filter((r) => r.id !== id));
  };

  useEffect(() => {
    fetchReminders();
  }, [user]);

  if (loading && !reminders.length) return <Loader />;

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-6">⏰ Reminders</h1>

      {/* --- Add Reminder --- */}
      <form onSubmit={handleAdd} className="mb-6 grid gap-3 md:grid-cols-3">
        <select
          value={form.type}
          onChange={(e) => setForm({ ...form, type: e.target.value })}
          className="p-2 border rounded-lg"
        >
          <option value="meal">🍽 Meal</option>
          <option value="workout">💪 Workout</option>
          <option value="water">💧 Water</option>
        </select>
        <input
          type="time"
          value={form.time}
          onChange={(e) => setForm({ ...form, time: e.target.value })}
          className="p-2 border rounded-lg"
          required
        />
        <input
          type="text"
          value={form.message}
          onChange={(e) => setForm({ ...form, message: e.target.value })}
          placeholder="Reminder message"
          className="p-2 border rounded-lg md:col-span-2"
          required
        />
        <button
          type="submit"
          disabled={loading}
          className="bg-green-500 text-white py-2 rounded-lg hover:bg-green-600 disabled:opacity-50 md:col-span-1"
        >
          Add
        </button>
      </form>

      {/* --- List of Reminders --- */}
      {!reminders.length ? (
        <p className="text-gray-500">No reminders set yet.</p>
      ) : (
        <div className="space-y-3">
          {reminders.map((r) => (
            <div
              key={r.id}
              className="bg-white shadow rounded-xl p-4 flex justify-between items-center"
            >
              <div>
                <p className="font-semibold">
                  {r.type === "meal" ? "🍽 Meal" : r.type === "workout" ? "💪 Workout" : "💧 Water"}
                </p>
                <p className="text-sm text-gray-600">{r.message}</p>
                <p className="text-xs text-gray-400">
                  At {r.time}
                </p>
              </div>
              <button
                onClick={() => handleDelete(r.id)}
                className="text-red-500 text-sm"
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Reminders;
