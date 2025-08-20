// D:\calplate\frontend\src\components\Layout\BottomNav.jsx
import React from "react";
import {
  Home,
  PlusCircle,
  User,
  BarChart3,
  Lightbulb
} from "lucide-react";

const BottomNav = ({ currentTab, setCurrentTab, setShowAddMeal }) => {
  const tabs = [
    { id: "dashboard", label: "Home", icon: Home },
    { id: "stats", label: "Stats", icon: BarChart3 },
    { id: "ai", label: "AI", icon: Lightbulb },
    { id: "profile", label: "Profile", icon: User }
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg">
      <div className="flex justify-around items-center h-16 relative">
        {/* Floating Add Button */}
        <button
          onClick={() => setShowAddMeal(true)}
          className="absolute -top-6 left-1/2 transform -translate-x-1/2 bg-green-600 rounded-full p-4 text-white shadow-lg hover:bg-green-700 transition-colors"
        >
          <PlusCircle className="w-6 h-6" />
        </button>

        {tabs.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setCurrentTab(id)}
            className={`flex flex-col items-center justify-center flex-1 text-sm transition-colors ${
              currentTab === id ? "text-green-600" : "text-gray-500"
            }`}
          >
            <Icon className="w-5 h-5 mb-1" />
            {label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default BottomNav;
