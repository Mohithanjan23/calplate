
import React from 'react';
import { Plus } from 'lucide-react';

interface FloatingActionButtonProps {
    onClick: () => void;
}

export const FloatingActionButton: React.FC<FloatingActionButtonProps> = ({ onClick }) => {
    return (
        <button
            onClick={onClick}
            className="fixed bottom-24 right-6 w-14 h-14 bg-green-600 rounded-full shadow-lg shadow-green-200 flex items-center justify-center text-white transition-transform hover:scale-105 active:scale-95 z-40 focus:outline-none focus:ring-4 focus:ring-green-300"
            aria-label="Add Meal"
        >
            <Plus className="w-8 h-8" />
        </button>
    );
};
