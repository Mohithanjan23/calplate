import React, { useState, useContext } from "react";
import { AppContext } from "../../context/AppContext";
import { Loader } from "../Shared/Loader";

const AIChat = () => {
  const { user } = useContext(AppContext);
  const [messages, setMessages] = useState([
    { role: "assistant", text: "👋 Hi! I’m your AI fitness coach. How can I help you today?" },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = { role: "user", text: input };
    setMessages([...messages, userMessage]);
    setInput("");
    setLoading(true);

    try {
      // Call your backend API route that integrates with OpenAI
      const res = await fetch("/api/ai-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user?.id, message: input }),
      });

      const data = await res.json();
      const aiMessage = {
        role: "assistant",
        text: data.reply || "⚠️ Sorry, I couldn’t generate a response.",
      };

      setMessages((prev) => [...prev, aiMessage]);
    } catch (err) {
      console.error("AI error:", err);
      setMessages((prev) => [
        ...prev,
        { role: "assistant", text: "⚠️ Something went wrong. Please try again later." },
      ]);
    }

    setLoading(false);
  };

  return (
    <div className="flex flex-col h-[80vh] p-6">
      <h1 className="text-xl font-bold mb-4">🤖 AI Coach</h1>

      {/* --- Chat Window --- */}
      <div className="flex-1 bg-gray-50 rounded-2xl p-4 overflow-y-auto space-y-3">
        {messages.map((m, i) => (
          <div
            key={i}
            className={`p-3 rounded-xl max-w-[80%] ${
              m.role === "user"
                ? "ml-auto bg-blue-500 text-white"
                : "mr-auto bg-white border"
            }`}
          >
            {m.text}
          </div>
        ))}
        {loading && <Loader />}
      </div>

      {/* --- Input Box --- */}
      <form onSubmit={handleSend} className="mt-4 flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask me about meals, workouts, or goals..."
          className="flex-1 p-3 border rounded-lg"
        />
        <button
          type="submit"
          disabled={loading}
          className="bg-purple-500 text-white px-4 py-2 rounded-lg hover:bg-purple-600 disabled:opacity-50"
        >
          Send
        </button>
      </form>
    </div>
  );
};

export default AIChat;
