
import React from 'react';
import { Home, Book, Calendar, User } from 'lucide-react';

interface BottomNavProps {
    currentView: string;
    onNavigate: (view: string) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ currentView, onNavigate }) => {
    const tabs = [
        { id: 'dashboard', label: 'Home', icon: Home },
        { id: 'meals', label: 'Meals', icon: Book },
        { id: 'meal-prep', label: 'Meal Prep', icon: Calendar },
        { id: 'profile', label: 'Profile', icon: User },
    ];

    return (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 pb-safe pt-2 px-6 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] z-30">
            <div className="flex justify-between items-center max-w-md mx-auto h-16">
                {tabs.map((tab) => {
                    const Icon = tab.icon;
                    const isActive = currentView === tab.id;
                    return (
                        <button
                            key={tab.id}
                            onClick={() => onNavigate(tab.id)}
                            className={`flex flex-col items-center justify-center w-16 h-full transition-colors ${isActive ? 'text-green-600' : 'text-gray-400 hover:text-gray-600'}`}
                        >
                            <div className={`p-1.5 rounded-xl transition-all ${isActive ? 'bg-green-50 translate-y-[-2px]' : ''}`}>
                                <Icon className={`w-6 h-6 ${isActive ? 'stroke-[2.5px]' : 'stroke-2'}`} />
                            </div>
                            <span className={`text-[10px] font-medium mt-1 ${isActive ? 'text-green-600' : 'text-gray-400'}`}>
                                {tab.label}
                            </span>
                        </button>
                    );
                })}
            </div>
        </div>
    );
};
