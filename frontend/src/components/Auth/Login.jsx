// D:\calplate\frontend\src\components\Auth\Login.jsx
import React, { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { supabase } from "../../services/supabaseClient";

const Login = ({ setAuthMode }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) setError(error.message);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-blue-50">
      <div className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-md">
        {/* Title */}
        <h1 className="text-2xl font-bold text-center mb-1">Calplate</h1>
        <p className="text-gray-600 text-center mb-6">
          Your AI-powered nutrition companion
        </p>

        {/* Tabs */}
        <div className="flex mb-6 rounded-lg overflow-hidden border">
          <button
            onClick={() => setAuthMode("login")}
            className="flex-1 py-2 font-medium bg-gray-100"
          >
            Login
          </button>
          <button
            onClick={() => setAuthMode("register")}
            className="flex-1 py-2 font-medium hover:bg-gray-50"
          >
            Sign Up
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleLogin} className="space-y-4">
          {error && <p className="text-red-500 text-sm">{error}</p>}

          <div>
            <label className="block text-sm font-medium">Email</label>
            <input
              type="email"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border rounded-lg px-3 py-2 mt-1"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Password</label>
            <div className="relative">
              <input
                type={showPass ? "text" : "password"}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border rounded-lg px-3 py-2 mt-1"
                required
              />
              <button
                type="button"
                onClick={() => setShowPass(!showPass)}
                className="absolute right-3 top-3 text-gray-500"
              >
                {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-green-500 text-white py-2 rounded-lg hover:bg-green-600"
          >
            Sign In
          </button>
        </form>

        <p className="text-center text-sm mt-4">
          Don’t have an account?{" "}
          <span
            className="text-green-600 cursor-pointer"
            onClick={() => setAuthMode("register")}
          >
            Sign up
          </span>
        </p>
      </div>
    </div>
  );
};

export default Login;
