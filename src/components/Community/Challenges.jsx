import React, { useState, useEffect, useContext } from "react";
import { supabase } from "../../services/supabaseClient";
import { AppContext } from "../../context/AppContext";
import { Loader } from "../Shared/Loader";

const Challenges = () => {
  const { user } = useContext(AppContext);
  const [challenges, setChallenges] = useState([]);
  const [joined, setJoined] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchChallenges = async () => {
    setLoading(true);
    const { data, error } = await supabase.from("challenges").select("*");
    if (!error && data) setChallenges(data);
    setLoading(false);
  };

  const fetchJoined = async () => {
    if (!user) return;
    const { data, error } = await supabase
      .from("challenge_participants")
      .select("challenge_id")
      .eq("user_id", user.id);

    if (!error && data) setJoined(data.map((c) => c.challenge_id));
  };

  const handleJoin = async (challengeId) => {
    if (!user) return;
    const { error } = await supabase.from("challenge_participants").insert([
      {
        user_id: user.id,
        challenge_id: challengeId,
        joined_at: new Date().toISOString(),
      },
    ]);
    if (!error) setJoined([...joined, challengeId]);
  };

  useEffect(() => {
    fetchChallenges();
    fetchJoined();
  }, [user]);

  if (loading) return <Loader />;

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-6">🏆 Fitness Challenges</h1>

      {!challenges.length ? (
        <p className="text-gray-500">No challenges available right now.</p>
      ) : (
        <div className="space-y-4">
          {challenges.map((ch) => (
            <div
              key={ch.id}
              className="bg-white shadow rounded-xl p-6 flex justify-between items-center"
            >
              <div>
                <h2 className="font-semibold">{ch.title}</h2>
                <p className="text-sm text-gray-600">{ch.description}</p>
                <p className="text-xs text-gray-400 mt-1">
                  Duration: {ch.duration_days} days
                </p>
              </div>
              {joined.includes(ch.id) ? (
                <span className="text-green-600 font-semibold">✔ Joined</span>
              ) : (
                <button
                  onClick={() => handleJoin(ch.id)}
                  className="bg-blue-500 text-white px-3 py-1 rounded-lg hover:bg-blue-600"
                >
                  Join
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Challenges;
