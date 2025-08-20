// D:\calplate\frontend\src\context\AppContext.jsx
import React, { createContext, useState, useContext, useEffect } from "react";

// Create context
const AppContext = createContext();

// Context provider
export const AppProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [meals, setMeals] = useState([]);
  const [currentTab, setCurrentTab] = useState("dashboard");
  const [showAddMeal, setShowAddMeal] = useState(false);

  // Load user + meals from localStorage on mount
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const storedMeals = localStorage.getItem("meals");
    if (storedUser) setUser(JSON.parse(storedUser));
    if (storedMeals) setMeals(JSON.parse(storedMeals));
  }, []);

  // Save user + meals when changed
  useEffect(() => {
    if (user) localStorage.setItem("user", JSON.stringify(user));
  }, [user]);

  useEffect(() => {
    if (meals.length > 0)
      localStorage.setItem("meals", JSON.stringify(meals));
  }, [meals]);

  // Compute derived values
  const today = new Date().toISOString().split("T")[0];
  const todayMeals = meals.filter((meal) => meal.date?.startsWith(today));
  const todayCalories = todayMeals.reduce((sum, m) => sum + m.calories, 0);

  const value = {
    user,
    setUser,
    meals,
    setMeals,
    todayMeals,
    todayCalories,
    currentTab,
    setCurrentTab,
    showAddMeal,
    setShowAddMeal
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

// Custom hook
export const useAppContext = () => {
  return useContext(AppContext);
};
