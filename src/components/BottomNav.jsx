import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Book, User, Calendar } from 'lucide-react';
import MealPrepRecommendations from './MealPrepRecommendations';

const BottomNav = () => {
  const [showMealPlan, setShowMealPlan] = useState(false);

  const navItems = [
    { to: '/dashboard', icon: Home, label: 'Home' },
    { to: '/meals', icon: Book, label: 'Meals' },
    { id: 'prep', icon: Calendar, label: 'Meal Prep' },
    { to: '/profile', icon: User, label: 'Profile' },
  ];

  const baseClasses = "flex flex-col items-center py-2 px-4 rounded-lg transition-colors text-gray-500 hover:text-gray-700";
  const activeClasses = "text-green-600 bg-green-50";

  return (
    <>
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200">
        <div className="flex justify-around max-w-md mx-auto">
          {navItems.map((item) => (
            item.to ? (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) => `${baseClasses} ${isActive ? activeClasses : ''}`}
              >
                <item.icon className="w-5 h-5 mb-1" />
                <span className="text-xs">{item.label}</span>
              </NavLink>
            ) : (
              <button
                key={item.id}
                onClick={() => setShowMealPlan(true)}
                className={`${baseClasses} ${showMealPlan ? activeClasses : ''}`}
              >
                <item.icon className="w-5 h-5 mb-1" />
                <span className="text-xs">{item.label}</span>
              </button>
            )
          ))}
        </div>
      </div>
      {showMealPlan && <MealPrepRecommendations onClose={() => setShowMealPlan(false)} />}
    </>
  );
};

export default BottomNav;