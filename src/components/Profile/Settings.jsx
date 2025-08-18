import React, { useState, useContext, useEffect } from "react";
import { AppContext } from "../../context/AppContext";
import { supabase } from "../../services/supabaseClient";

const Settings = () => {
  const { user } = useContext(AppContext);
  const [settings, setSettings] = useState({
    darkMode: false,
    units: "metric",
    notifications: true,
  });
  const [loading, setLoading] = useState(false);

  const fetchSettings = async () => {
    if (!user) return;
    const { data, error } = await supabase
      .from("user_settings")
      .select("*")
      .eq("user_id", user.id)
      .single();

    if (!error && data) {
      setSettings({
        darkMode: data.dark_mode,
        units: data.units,
        notifications: data.notifications,
      });
    }
  };

  const handleSave = async () => {
    if (!user) return;
    setLoading(true);

    const { error } = await supabase.from("user_settings").upsert({
      user_id: user.id,
      dark_mode: settings.darkMode,
      units: settings.units,
      notifications: settings.notifications,
    });

    if (error) {
      console.error(error);
      alert("⚠️ Failed to save settings.");
    } else {
      alert("✅ Settings updated successfully!");
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchSettings();
  }, [user]);

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-6">⚙️ Settings</h1>

      {/* Dark Mode */}
      <div className="flex items-center justify-between mb-6">
        <span>🌙 Dark Mode</span>
        <input
          type="checkbox"
          checked={settings.darkMode}
          onChange={(e) => setSettings({ ...settings, darkMode: e.target.checked })}
          className="w-5 h-5"
        />
      </div>

      {/* Units */}
      <div className="mb-6">
        <span className="block mb-2">📏 Units</span>
        <select
          value={settings.units}
          onChange={(e) => setSettings({ ...settings, units: e.target.value })}
          className="p-2 border rounded-lg"
        >
          <option value="metric">Metric (kg, cm)</option>
          <option value="imperial">Imperial (lbs, inches)</option>
        </select>
      </div>

      {/* Notifications */}
      <div className="flex items-center justify-between mb-6">
        <span>🔔 Notifications</span>
        <input
          type="checkbox"
          checked={settings.notifications}
          onChange={(e) =>
            setSettings({ ...settings, notifications: e.target.checked })
          }
          className="w-5 h-5"
        />
      </div>

      <button
        onClick={handleSave}
        disabled={loading}
        className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 disabled:opacity-50"
      >
        {loading ? "Saving..." : "Save Settings"}
      </button>
    </div>
  );
};

export default Settings;
