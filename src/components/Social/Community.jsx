import React, { useState, useEffect, useContext } from "react";
import { supabase } from "../../services/supabaseClient";
import { AppContext } from "../../context/AppContext";
import { Loader } from "../Shared/Loader";

const Community = () => {
  const { user } = useContext(AppContext);
  const [posts, setPosts] = useState([]);
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchPosts = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("community_posts")
      .select("id, content, created_at, profiles(full_name)")
      .order("created_at", { ascending: false });

    if (!error && data) setPosts(data);
    setLoading(false);
  };

  const handlePost = async (e) => {
    e.preventDefault();
    if (!user || !content.trim()) return;

    setLoading(true);
    const { error } = await supabase.from("community_posts").insert([
      { user_id: user.id, content },
    ]);

    if (error) {
      console.error(error);
      alert("⚠️ Failed to post.");
    } else {
      setContent("");
      fetchPosts();
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  if (loading && !posts.length) return <Loader />;

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-6">🌐 Community</h1>

      {/* --- Create Post --- */}
      {user && (
        <form onSubmit={handlePost} className="mb-6">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Share your thoughts, progress, or a question..."
            className="w-full p-3 border rounded-lg mb-2"
            rows={3}
          />
          <button
            type="submit"
            disabled={loading}
            className="bg-purple-500 text-white px-4 py-2 rounded-lg hover:bg-purple-600 disabled:opacity-50"
          >
            Post
          </button>
        </form>
      )}

      {/* --- Posts Feed --- */}
      {!posts.length ? (
        <p className="text-gray-500">No posts yet. Be the first to share!</p>
      ) : (
        <div className="space-y-4">
          {posts.map((p) => (
            <div
              key={p.id}
              className="bg-white shadow rounded-xl p-4"
            >
              <p className="font-semibold">
                {p.profiles?.full_name || "Anonymous"}
              </p>
              <p className="text-sm text-gray-600 mt-1">{p.content}</p>
              <p className="text-xs text-gray-400 mt-2">
                {new Date(p.created_at).toLocaleString()}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Community;
