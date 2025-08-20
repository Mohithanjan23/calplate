// D:\calplate\frontend\src\components\Auth\Register.jsx
import React, { useState } from "react";
import { supabase } from "../../services/supabaseClient";

const Register = ({ setAuthMode }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    const { error } = await supabase.auth.signUp({ email, password });
    if (error) setError(error.message);
    else setSuccess("Check your email to confirm your account!");
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
            className="flex-1 py-2 font-medium hover:bg-gray-50"
          >
            Login
          </button>
          <button
            onClick={() => setAuthMode("register")}
            className="flex-1 py-2 font-medium bg-gray-100"
          >
            Sign Up
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleRegister} className="space-y-4">
          {error && <p className="text-red-500 text-sm">{error}</p>}
          {success && <p className="text-green-500 text-sm">{success}</p>}

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
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border rounded-lg px-3 py-2 mt-1"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-green-500 text-white py-2 rounded-lg hover:bg-green-600"
          >
            Sign Up
          </button>
        </form>

        <p className="text-center text-sm mt-4">
          Already have an account?{" "}
          <span
            className="text-green-600 cursor-pointer"
            onClick={() => setAuthMode("login")}
          >
            Sign in
          </span>
        </p>
      </div>
    </div>
  );
};

export default Register;
