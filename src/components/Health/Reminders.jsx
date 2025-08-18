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

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);
    const { data, error } = await supabase
      .from("reminders")
      .insert([
        {
          user_id: user.id,
          type: form.type,
          time: form.time,
          message: form.message,
        },
      ])
      .select();

    if (!error && data) {
      setReminders([...reminders, data[0]]);
      setForm({ type: "meal", time: "", message: "" });
    }
    setLoading(false);
  };

  const handleDelete = async (id) => {
    const { error } = await supabase.from("reminders").delete().eq("id", id);
    if (!error) {
      setReminders(reminders.filter((r) => r.id !== id));
    }
  };

  useEffect(() => {
    fetchReminders();
  }, [user]);

  if (loading && !reminders.length) return <Loader />;

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-6">⏰ Reminders</h1>

      {/* --- Add Reminder Form --- */}
      <form onSubmit={handleAdd} className="bg-white shadow rounded-2xl p-6 mb-6 space-y-4">
        <select
          name="type"
          value={form.type}
          onChange={handleChange}
          className="w-full p-3 border rounded-lg"
        >
          <option value="meal">🍽 Meal</option>
          <option value="workout">💪 Workout</option>
          <option value="water">💧 Water</option>
          <option value="sleep">😴 Sleep</option>
        </select>
        <input
          type="time"
          name="time"
          value={form.time}
          onChange={handleChange}
          className="w-full p-3 border rounded-lg"
          required
        />
        <input
          type="text"
          name="message"
          value={form.message}
          onChange={handleChange}
          placeholder="Reminder message"
          className="w-full p-3 border rounded-lg"
        />
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600 disabled:opacity-50"
        >
          {loading ? "Adding..." : "Add Reminder"}
        </button>
      </form>

      {/* --- Reminders List --- */}
      {!reminders.length ? (
        <p className="text-gray-500">No reminders set.</p>
      ) : (
        <div className="space-y-4">
          {reminders.map((r) => (
            <div
              key={r.id}
              className="bg-white shadow rounded-xl p-4 flex justify-between items-center"
            >
              <div>
                <p className="font-semibold">
                  {r.type === "meal"
                    ? "🍽 Meal"
                    : r.type === "workout"
                    ? "💪 Workout"
                    : r.type === "water"
                    ? "💧 Water"
                    : "😴 Sleep"}
                </p>
                <p className="text-sm text-gray-600">
                  {r.message || "No message"} • {r.time}
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
