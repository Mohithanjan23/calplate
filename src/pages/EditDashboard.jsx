import { useState } from 'react';
import { Plus } from 'lucide-react';
import Card from '../components/Card.jsx';

// Reusable component for an editable dashboard card
const EditableCard = ({ title, children, isVisible, onToggle }) => (
    <Card className="relative overflow-hidden">
        {/* Blurred background content */}
        <div className="blur-sm select-none">
            {children}
        </div>
        {/* Overlay with controls */}
        <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center gap-4 text-white">
            <h3 className="text-xl font-bold">{title}</h3>
            <button className="px-4 py-2 bg-primary/80 text-white font-semibold rounded-full text-sm">
                Edit Goal
            </button>
            <div 
                className="flex items-center gap-2 cursor-pointer"
                onClick={onToggle}
            >
                <div className={`w-10 h-6 rounded-full flex items-center p-1 transition-colors ${isVisible ? 'bg-blue-500 justify-end' : 'bg-surface justify-start'}`}>
                    <div className="w-4 h-4 bg-white rounded-full"></div>
                </div>
                <span className="text-sm font-semibold">{isVisible ? 'Show on dashboard' : 'Show on dashboard'}</span>
            </div>
        </div>
    </Card>
);

export default function EditDashboard() {
    // State to manage which cards are visible
    const [visibleCards, setVisibleCards] = useState({
        calories: true,
        habits: true,
        steps: true,
        exercise: true,
    });

    const toggleCard = (card) => {
        setVisibleCards(prev => ({ ...prev, [card]: !prev[card] }));
    };

    return (
        <div className="p-4 space-y-6">
            <h1 className="text-3xl font-bold text-center">Edit Dashboard</h1>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Calories Card */}
                <EditableCard title="Calories" isVisible={visibleCards.calories} onToggle={() => toggleCard('calories')}>
                    <p className="text-3xl font-bold">1,250</p>
                    <p>Remaining</p>
                </EditableCard>

                {/* Weekly Habits Card */}
                <EditableCard title="Weekly Habits" isVisible={visibleCards.habits} onToggle={() => toggleCard('habits')}>
                    <p className="font-bold">Start a new habit</p>
                </EditableCard>
                
                {/* Steps Card */}
                <EditableCard title="Steps" isVisible={visibleCards.steps} onToggle={() => toggleCard('steps')}>
                    <p className="text-2xl font-bold">5,432</p>
                </EditableCard>
                
                {/* Exercise Card */}
                <EditableCard title="Exercise" isVisible={visibleCards.exercise} onToggle={() => toggleCard('exercise')}>
                     <p className="text-2xl font-bold">30 min</p>
                </EditableCard>

                {/* Add Goal Card Placeholders */}
                <div className="border-2 border-dashed border-blue-500 rounded-lg flex flex-col items-center justify-center p-10 text-blue-500">
                    <Plus size={24} />
                    <p className="mt-2 text-sm font-semibold">Add Goal Card</p>
                </div>
                 <div className="border-2 border-dashed border-blue-500 rounded-lg flex flex-col items-center justify-center p-10 text-blue-500">
                    <Plus size={24} />
                    <p className="mt-2 text-sm font-semibold">Add Goal Card</p>
                </div>
            </div>

            <button className="w-full py-3 bg-blue-600 font-bold rounded-lg mt-4 text-white">
                Done Editing
            </button>
        </div>
    );
}