import React, { useState, useEffect, useContext } from "react";
import { supabase } from "../../services/supabaseClient";
import { AppContext } from "../../context/AppContext";
import { Loader } from "../Shared/Loader";

const Friends = () => {
  const { user } = useContext(AppContext);
  const [friends, setFriends] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchFriends = async () => {
    if (!user) return;
    setLoading(true);

    const { data, error } = await supabase
      .from("friends_view") // a DB view joining friendships + profiles
      .select("friend_id, friend_name, total_workouts, total_calories")
      .eq("user_id", user.id);

    if (!error && data) setFriends(data);
    setLoading(false);
  };

  const addFriend = async () => {
    if (!search.trim() || !user) return;

    setLoading(true);
    const { error } = await supabase.from("friends").insert([
      { user_id: user.id, friend_email: search.trim() },
    ]);

    if (error) {
      console.error(error);
      alert("⚠️ Failed to add friend.");
    } else {
      alert("✅ Friend request sent!");
      setSearch("");
      fetchFriends();
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchFriends();
  }, [user]);

  if (loading && !friends.length) return <Loader />;

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-6">👥 Friends</h1>

      {/* Add Friend */}
      <div className="flex gap-2 mb-6">
        <input
          type="email"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Enter friend's email..."
          className="flex-1 p-3 border rounded-lg"
        />
        <button
          onClick={addFriend}
          disabled={loading}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 disabled:opacity-50"
        >
          Add
        </button>
      </div>

      {/* Friends List */}
      {!friends.length ? (
        <p className="text-gray-500">You don’t have any friends yet.</p>
      ) : (
        <div className="space-y-4">
          {friends.map((f) => (
            <div
              key={f.friend_id}
              className="bg-white shadow rounded-xl p-4 flex justify-between items-center"
            >
              <div>
                <h2 className="font-semibold">{f.friend_name}</h2>
                <p className="text-sm text-gray-600">
                  Workouts: {f.total_workouts} | Calories Burned: {f.total_calories}
                </p>
              </div>
              <button
                className="text-red-500 text-sm"
                onClick={() => alert("⚠️ Remove friend not implemented yet.")}
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Friends;
