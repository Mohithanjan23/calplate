import React, { useEffect, useState, useContext } from "react";
import { supabase } from "../../services/supabaseClient";
import { AppContext } from "../../context/AppContext";
import { Loader } from "../Shared/Loader";

const Community = () => {
  const { user } = useContext(AppContext);
  const [posts, setPosts] = useState([]);
  const [form, setForm] = useState({ content: "" });
  const [loading, setLoading] = useState(false);

  const fetchPosts = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("community_posts")
      .select("id, content, created_at, user_id, users(email)")
      .order("created_at", { ascending: false });

    if (!error && data) setPosts(data);
    setLoading(false);
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user || !form.content.trim()) return;

    setLoading(true);
    const { data, error } = await supabase
      .from("community_posts")
      .insert([{ user_id: user.id, content: form.content }])
      .select("id, content, created_at, user_id, users(email)");

    if (!error && data) {
      setPosts([data[0], ...posts]);
      setForm({ content: "" });
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  if (loading && !posts.length) return <Loader />;

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-6">🌍 Community Feed</h1>

      {/* --- New Post --- */}
      <form onSubmit={handleSubmit} className="bg-white shadow rounded-2xl p-6 mb-6">
        <textarea
          name="content"
          rows="3"
          placeholder="Share your meal, workout, or progress..."
          value={form.content}
          onChange={handleChange}
          className="w-full p-3 border rounded-lg mb-4"
        />
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600 disabled:opacity-50"
        >
          {loading ? "Posting..." : "Post"}
        </button>
      </form>

      {/* --- Feed --- */}
      {!posts.length ? (
        <p className="text-gray-500">No posts yet. Be the first to share!</p>
      ) : (
        <div className="space-y-4">
          {posts.map((post) => (
            <div key={post.id} className="bg-white shadow rounded-xl p-4">
              <p className="text-gray-800 mb-2">{post.content}</p>
              <div className="flex justify-between text-sm text-gray-500">
                <span>
                  {post.users?.email || "Anonymous"} 
                </span>
                <span>{new Date(post.created_at).toLocaleString()}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Community;
