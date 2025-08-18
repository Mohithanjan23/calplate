import React, { useState } from "react";
import { supabase } from "../../services/supabaseClient";

const Settings = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [notifications, setNotifications] = useState(true);
  const [deleting, setDeleting] = useState(false);

  const toggleTheme = () => {
    setDarkMode(!darkMode);
    document.documentElement.classList.toggle("dark");
  };

  const toggleNotifications = () => {
    setNotifications(!notifications);
    // Later: hook into push notifications / email reminders
  };

  const handleDeleteAccount = async () => {
    if (!window.confirm("Are you sure you want to delete your account? This cannot be undone.")) {
      return;
    }
    setDeleting(true);

    try {
      // 👇 Delete user from Supabase Auth (requires server-side function usually)
      const { error } = await supabase.auth.admin.deleteUser(
        (await supabase.auth.getUser()).data.user.id
      );
      if (error) throw error;
      alert("Account deleted successfully.");
    } catch (err) {
      console.error("Error deleting account:", err.message);
      alert("Failed to delete account. Contact support.");
    }

    setDeleting(false);
  };

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-6">⚙️ Settings</h1>

      {/* --- Theme Toggle --- */}
      <div className="bg-white shadow rounded-2xl p-6 mb-6 flex justify-between items-center">
        <div>
          <h2 className="text-lg font-semibold">Dark Mode</h2>
          <p className="text-gray-500 text-sm">Switch between light and dark theme</p>
        </div>
        <button
          onClick={toggleTheme}
          className={`px-4 py-2 rounded-lg ${
            darkMode ? "bg-gray-800 text-white" : "bg-gray-200 text-black"
          }`}
        >
          {darkMode ? "On" : "Off"}
        </button>
      </div>

      {/* --- Notifications --- */}
      <div className="bg-white shadow rounded-2xl p-6 mb-6 flex justify-between items-center">
        <div>
          <h2 className="text-lg font-semibold">Notifications</h2>
          <p className="text-gray-500 text-sm">Reminders for meals & workouts</p>
        </div>
        <button
          onClick={toggleNotifications}
          className={`px-4 py-2 rounded-lg ${
            notifications ? "bg-green-500 text-white" : "bg-gray-200 text-black"
          }`}
        >
          {notifications ? "Enabled" : "Disabled"}
        </button>
      </div>

      {/* --- Account Deletion --- */}
      <div className="bg-white shadow rounded-2xl p-6">
        <h2 className="text-lg font-semibold mb-2">Danger Zone</h2>
        <p className="text-gray-500 text-sm mb-4">
          Deleting your account will remove all your data permanently.
        </p>
        <button
          onClick={handleDeleteAccount}
          disabled={deleting}
          className="w-full bg-red-500 text-white py-3 rounded-lg hover:bg-red-600 disabled:opacity-50"
        >
          {deleting ? "Deleting..." : "Delete Account"}
        </button>
      </div>
    </div>
  );
};

export default Settings;
