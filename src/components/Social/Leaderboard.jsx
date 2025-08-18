import React, { useState, useEffect, useContext } from "react";
import { supabase } from "../../services/supabaseClient";
import { AppContext } from "../../context/AppContext";
import { Loader } from "../Shared/Loader";

const Leaderboard = () => {
  const { user } = useContext(AppContext);
  const [leaders, setLeaders] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchLeaderboard = async () => {
    setLoading(true);

    // Example: ranking users by total calories burned (or workouts logged)
    const { data, error } = await supabase
      .from("leaderboard_view") // could be a DB view combining stats
      .select("user_id, username, total_workouts, total_calories")
      .order("total_workouts", { ascending: false })
      .limit(20);

    if (!error && data) setLeaders(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  if (loading) return <Loader />;

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-6">🏆 Leaderboard</h1>

      {!leaders.length ? (
        <p className="text-gray-500">No leaderboard data available.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse bg-white shadow rounded-xl overflow-hidden">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-3 text-left">Rank</th>
                <th className="p-3 text-left">User</th>
                <th className="p-3 text-left">Workouts</th>
                <th className="p-3 text-left">Calories Burned</th>
              </tr>
            </thead>
            <tbody>
              {leaders.map((l, idx) => (
                <tr
                  key={l.user_id}
                  className={`border-t ${
                    l.user_id === user?.id ? "bg-yellow-50 font-semibold" : ""
                  }`}
                >
                  <td className="p-3">{idx + 1}</td>
                  <td className="p-3">{l.username || "Anonymous"}</td>
                  <td className="p-3">{l.total_workouts}</td>
                  <td className="p-3">{l.total_calories}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Leaderboard;
