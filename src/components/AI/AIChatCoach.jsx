import React, { useState, useContext } from "react";
import { AppContext } from "../../context/AppContext";
import { Loader } from "../Shared/Loader";

// This assumes you have a backend API route that connects to OpenAI / Gemini / Llama model
// Example: /api/ai-chat that takes { message, userId } and returns { reply }

const AIChatCoach = () => {
  const { user } = useContext(AppContext);
  const [messages, setMessages] = useState([
    { role: "assistant", content: "👋 Hi! I’m your AI Coach. Ask me anything about fitness, nutrition, or wellness." }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const newMessages = [...messages, { role: "user", content: input }];
    setMessages(newMessages);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/ai-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: input, userId: user?.id }),
      });

      const data = await res.json();
      if (data.reply) {
        setMessages([...newMessages, { role: "assistant", content: data.reply }]);
      } else {
        setMessages([...newMessages, { role: "assistant", content: "⚠️ Sorry, I couldn’t process that." }]);
      }
    } catch (err) {
      console.error(err);
      setMessages([...newMessages, { role: "assistant", content: "⚠️ Error connecting to AI service." }]);
    }

    setLoading(false);
  };

  return (
    <div className="p-6 flex flex-col h-[80vh]">
      <h1 className="text-xl font-bold mb-4">🤖 AI Health Coach</h1>

      {/* Chat Window */}
      <div className="flex-1 bg-gray-50 rounded-lg p-4 overflow-y-auto space-y-3">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`p-3 rounded-lg max-w-[70%] ${
              msg.role === "user"
                ? "bg-blue-500 text-white ml-auto"
                : "bg-white shadow"
            }`}
          >
            {msg.content}
          </div>
        ))}
        {loading && <Loader />}
      </div>

      {/* Input Box */}
      <form onSubmit={sendMessage} className="mt-4 flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask me about workouts, diet, or motivation..."
          className="flex-1 p-3 border rounded-lg"
          required
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

export default AIChatCoach;
