import React from "react";
import { NavLink } from "react-router-dom";
import { Home, Camera, User, Utensils } from "lucide-react";

const BottomNav = () => {
  const navItems = [
    { to: "/", label: "Home", icon: <Home size={22} /> },
    { to: "/scanner", label: "Scanner", icon: <Camera size={22} /> },
    { to: "/meal-prep", label: "Meal Prep", icon: <Utensils size={22} /> },
    { to: "/profile", label: "Profile", icon: <User size={22} /> },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-md flex justify-around items-center h-16 z-50">
      {navItems.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          className={({ isActive }) =>
            `flex flex-col items-center text-sm font-medium transition ${
              isActive ? "text-blue-500" : "text-gray-500 hover:text-gray-700"
            }`
          }
        >
          {item.icon}
          <span className="text-xs mt-1">{item.label}</span>
        </NavLink>
      ))}
    </nav>
  );
};

export default BottomNav;
