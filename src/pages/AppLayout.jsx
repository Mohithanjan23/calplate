import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import BottomNav from '../components/BottomNav';
import AddMeal from '../components/AddMeal';
import { Plus } from 'lucide-react';

const AppLayout = () => {
  const [showAddMeal, setShowAddMeal] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="max-w-md mx-auto p-4">
        <Outlet /> {/* Child pages will render here */}
      </div>
      <BottomNav />
      <button
        onClick={() => setShowAddMeal(true)}
        className="fixed bottom-20 right-6 w-14 h-14 bg-green-600 text-white rounded-full shadow-lg hover:bg-green-700 z-40"
      >
        <Plus className="w-6 h-6 mx-auto" />
      </button>
      {showAddMeal && <AddMeal onClose={() => setShowAddMeal(false)} />}
    </div>
  );
};

export default AppLayout;