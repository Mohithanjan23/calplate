// D:\calplate\frontend\src\App.jsx
import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Dashboard from "./components/Dashboard/Dashboard";
import MealIdeas from "./components/Dashboard/MealIdeas";
import Profile from "./components/User/Profile";
import Login from "./components/Auth/Login";
import Register from "./components/Auth/Register";
import BottomNav from "./components/Layout/BottomNav";

function App() {
  const [authMode, setAuthMode] = useState("login");

  return (
    <Router>
      <Routes>
        {/* Auth pages */}
        <Route
          path="/auth"
          element={
            authMode === "login" ? (
              <Login setAuthMode={setAuthMode} />
            ) : (
              <Register setAuthMode={setAuthMode} />
            )
          }
        />

        {/* Main App */}
        <Route
          path="/"
          element={
            <div className="pb-16">
              <Dashboard />
              <BottomNav />
            </div>
          }
        />
        <Route
          path="/meal-ideas"
          element={
            <div className="pb-16">
              <MealIdeas />
              <BottomNav />
            </div>
          }
        />
        <Route
          path="/profile"
          element={
            <div className="pb-16">
              <Profile />
              <BottomNav />
            </div>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
