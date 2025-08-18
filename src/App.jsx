import React, { useContext } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { AppContext } from "./context/AppContext";

// Components
import AuthScreen from "./components/Auth/AuthScreen";
import Onboarding from "./components/Auth/Onboarding";
import Dashboard from "./components/Dashboard/Dashboard";
import Profile from "./components/Profile/Profile";
import FoodScanner from "./components/Meals/FoodScanner";
import MealPrepRecommendations from "./components/Meals/MealPrepRecommendations";
import BottomNav from "./components/Layout/BottomNav";

const App = () => {
  const { session } = useContext(AppContext);

  return (
    <div className="min-h-screen bg-gray-50">
      <Routes>
        {!session ? (
          <>
            <Route path="/" element={<AuthScreen />} />
            <Route path="/onboarding" element={<Onboarding />} />
            <Route path="*" element={<Navigate to="/" />} />
          </>
        ) : (
          <>
            <Route path="/" element={<Dashboard />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/scanner" element={<FoodScanner />} />
            <Route path="/meal-prep" element={<MealPrepRecommendations />} />
            <Route path="*" element={<Navigate to="/" />} />
          </>
        )}
      </Routes>

      {session && <BottomNav />}
    </div>
  );
};

export default App;
