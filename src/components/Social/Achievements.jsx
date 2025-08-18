import React, { useState, useEffect, useContext } from "react";
import { supabase } from "../../services/supabaseClient";
import { AppContext } from "../../context/AppContext";
import { Loader } from "../Shared/Loader";

const Achievements = () => {
  const { user } = useContext(AppContext);
  const [achievements, setAchievements] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchAchievements = async () => {
    if (!user) return;
    setLoading(true);

    const { data, error } = await supabase
      .from("achievements")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: true });

    if (!error && data) setAchievements(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchAchievements();
  }, [user]);

  if (loading && !achievements.length) return <Loader />;

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-6">🎖️ Achievements</h1>

      {!achievements.length ? (
        <p className="text-gray-500">No achievements unlocked yet. Keep going!</p>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {achievements.map((a) => (
            <div
              key={a.id}
              className="bg-white shadow rounded-2xl p-4 flex flex-col items-center text-center"
            >
              <div className="text-4xl mb-3">{a.icon || "⭐"}</div>
              <h2 className="font-semibold text-lg">{a.title}</h2>
              <p className="text-sm text-gray-600">{a.description}</p>
              <p className="text-xs text-gray-400 mt-2">
                Unlocked: {new Date(a.created_at).toLocaleDateString()}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Achievements;
