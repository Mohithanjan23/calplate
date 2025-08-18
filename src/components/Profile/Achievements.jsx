import React, { useEffect, useState, useContext } from "react";
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
      .order("earned_at", { ascending: false });

    if (!error && data) setAchievements(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchAchievements();
  }, [user]);

  if (loading && !achievements.length) return <Loader />;

  const badgeColors = {
    nutrition: "bg-green-100 text-green-700",
    fitness: "bg-blue-100 text-blue-700",
    streak: "bg-yellow-100 text-yellow-700",
    milestone: "bg-purple-100 text-purple-700",
  };

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-6">🏅 Achievements</h1>

      {!achievements.length ? (
        <p className="text-gray-500">No achievements yet. Keep tracking your progress!</p>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {achievements.map((a) => (
            <div
              key={a.id}
              className={`p-6 rounded-2xl shadow ${badgeColors[a.type] || "bg-gray-100 text-gray-700"}`}
            >
              <h2 className="font-semibold text-lg mb-2">{a.title}</h2>
              <p className="text-sm">{a.description}</p>
              <p className="text-xs mt-3">
                Earned on {new Date(a.earned_at).toLocaleDateString()}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Achievements;
