import React, { useEffect, useState, useContext } from "react";
import { supabase } from "../../services/supabaseClient";
import { AppContext } from "../../context/AppContext";
import { Loader } from "../Shared/Loader";

const Friends = () => {
  const { user } = useContext(AppContext);
  const [friends, setFriends] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch all users (to follow)
  const fetchUsers = async () => {
    setLoading(true);
    const { data, error } = await supabase.from("profiles").select("id, email");
    if (!error && data) setAllUsers(data.filter((u) => u.id !== user.id));
    setLoading(false);
  };

  // Fetch friends list
  const fetchFriends = async () => {
    if (!user) return;
    const { data, error } = await supabase
      .from("friends")
      .select("friend_id, profiles(email)")
      .eq("user_id", user.id);

    if (!error && data) setFriends(data);
  };

  const handleAddFriend = async (friendId) => {
    if (!user) return;

    const { error } = await supabase.from("friends").insert([
      {
        user_id: user.id,
        friend_id: friendId,
      },
    ]);

    if (!error) {
      fetchFriends();
    }
  };

  useEffect(() => {
    fetchUsers();
    fetchFriends();
  }, [user]);

  if (loading) return <Loader />;

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-6">👥 Friends</h1>

      {/* --- Current Friends --- */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold mb-3">Your Friends</h2>
        {!friends.length ? (
          <p className="text-gray-500">You haven’t added any friends yet.</p>
        ) : (
          <div className="space-y-3">
            {friends.map((f) => (
              <div
                key={f.friend_id}
                className="bg-white shadow rounded-xl p-4 flex justify-between items-center"
              >
                <span>{f.profiles?.email || "Unknown User"}</span>
                <span className="text-sm text-gray-400">Following</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* --- Discover Users --- */}
      <div>
        <h2 className="text-lg font-semibold mb-3">Discover Users</h2>
        {!allUsers.length ? (
          <p className="text-gray-500">No users available.</p>
        ) : (
          <div className="space-y-3">
            {allUsers.map((u) => (
              <div
                key={u.id}
                className="bg-white shadow rounded-xl p-4 flex justify-between items-center"
              >
                <span>{u.email}</span>
                <button
                  onClick={() => handleAddFriend(u.id)}
                  className="bg-blue-500 text-white px-3 py-1 rounded-lg hover:bg-blue-600"
                >
                  Follow
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Friends;
