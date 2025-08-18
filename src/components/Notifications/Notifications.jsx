import React, { useState, useEffect, useContext } from "react";
import { AppContext } from "../../context/AppContext";
import { Loader } from "../Shared/Loader";

const Notifications = () => {
  const { user } = useContext(AppContext);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);

  // Mock fetch (later replace with Supabase table "notifications")
  const fetchNotifications = async () => {
    setLoading(true);

    // Simulate fetching notifications for the user
    setTimeout(() => {
      const sample = [
        {
          id: 1,
          message: "✅ You reached your daily calorie goal!",
          created_at: new Date().toISOString(),
          type: "success",
        },
        {
          id: 2,
          message: "🍽 Don’t forget to log your dinner.",
          created_at: new Date(Date.now() - 3600 * 1000).toISOString(),
          type: "reminder",
        },
        {
          id: 3,
          message: "💪 Great job! You completed 3 workouts this week.",
          created_at: new Date(Date.now() - 2 * 3600 * 1000).toISOString(),
          type: "achievement",
        },
      ];
      setNotifications(sample);
      setLoading(false);
    }, 1000);
  };

  useEffect(() => {
    if (user) fetchNotifications();
  }, [user]);

  if (loading) return <Loader />;

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-6">🔔 Notifications</h1>

      {!notifications.length ? (
        <p className="text-gray-500">No notifications yet.</p>
      ) : (
        <div className="space-y-4">
          {notifications.map((n) => (
            <div
              key={n.id}
              className={`p-4 rounded-xl shadow ${
                n.type === "success"
                  ? "bg-green-100 text-green-700"
                  : n.type === "reminder"
                  ? "bg-yellow-100 text-yellow-700"
                  : "bg-blue-100 text-blue-700"
              }`}
            >
              <p>{n.message}</p>
              <span className="text-xs text-gray-500">
                {new Date(n.created_at).toLocaleString()}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Notifications;
