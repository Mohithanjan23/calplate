import React, { useState, useEffect, useContext } from "react";
import { supabase } from "../../services/supabaseClient";
import { AppContext } from "../../context/AppContext";
import { Loader } from "../Shared/Loader";

const GroupChallenges = () => {
  const { user } = useContext(AppContext);
  const [challenges, setChallenges] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newChallenge, setNewChallenge] = useState("");

  const fetchChallenges = async () => {
    setLoading(true);

    const { data, error } = await supabase
      .from("challenges_view") // view: combines challenges + participants
      .select("*")
      .order("created_at", { ascending: false });

    if (!error && data) setChallenges(data);
    setLoading(false);
  };

  const createChallenge = async (e) => {
    e.preventDefault();
    if (!newChallenge.trim() || !user) return;

    setLoading(true);
    const { error } = await supabase.from("challenges").insert([
      { creator_id: user.id, title: newChallenge },
    ]);

    if (error) {
      console.error(error);
      alert("⚠️ Failed to create challenge.");
    } else {
      setNewChallenge("");
      fetchChallenges();
    }
    setLoading(false);
  };

  const joinChallenge = async (challengeId) => {
    if (!user) return;

    const { error } = await supabase.from("challenge_participants").insert([
      { user_id: user.id, challenge_id: challengeId },
    ]);

    if (error) {
      console.error(error);
      alert("⚠️ Failed to join challenge.");
    } else {
      fetchChallenges();
    }
  };

  useEffect(() => {
    fetchChallenges();
  }, []);

  if (loading && !challenges.length) return <Loader />;

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-6">💪 Group Challenges</h1>

      {/* Create Challenge */}
      <form onSubmit={createChallenge} className="flex gap-2 mb-6">
        <input
          type="text"
          value={newChallenge}
          onChange={(e) => setNewChallenge(e.target.value)}
          placeholder="Enter new challenge (e.g. 5k run this week)"
          className="flex-1 p-3 border rounded-lg"
        />
        <button
          type="submit"
          disabled={loading}
          className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 disabled:opacity-50"
        >
          Create
        </button>
      </form>

      {/* Challenges List */}
      {!challenges.length ? (
        <p className="text-gray-500">No challenges yet. Be the first to create one!</p>
      ) : (
        <div className="space-y-4">
          {challenges.map((c) => (
            <div
              key={c.id}
              className="bg-white shadow rounded-xl p-4 flex justify-between items-center"
            >
              <div>
                <h2 className="font-semibold">{c.title}</h2>
                <p className="text-sm text-gray-600">
                  Participants: {c.participant_count || 0}
                </p>
              </div>
              <button
                onClick={() => joinChallenge(c.id)}
                className="bg-blue-500 text-white px-4 py-1 rounded-lg hover:bg-blue-600 text-sm"
              >
                Join
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default GroupChallenges;
