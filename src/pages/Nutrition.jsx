import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { getTodayMeals } from '../services/foodService';
import Card from '../components/Card.jsx';

// --- Placeholder Tab Components ---
const OverviewTab = ({ progress }) => (
    <div className="space-y-4">
        <h2 className="text-xl font-bold">To boost today's progress:</h2>
        <ul className="list-decimal list-inside space-y-2">
            <li>Track your food</li>
            <li>Hit your top nutrient goals</li>
        </ul>
        <Card>
            <h3 className="font-bold">Track your food</h3>
            <p className="text-sm text-text-secondary mt-1">Today you've logged:</p>
            <div className="flex justify-around mt-4">
                <span>{progress.foodCount} foods</span>
                <span>{progress.mealCount} meals</span>
            </div>
        </Card>
    </div>
);

const CaloriesTab = ({ progress, goals }) => (
    <div className="text-center space-y-4">
        <div className="w-40 h-40 bg-surface rounded-full mx-auto flex items-center justify-center">
            {/* Placeholder for calorie circle */}
        </div>
        <p>Total Calories: {progress.calories}</p>
        <p>Goal: {goals.calories}</p>
    </div>
);

const NutrientsTab = ({ progress, goals }) => (
    <div className="space-y-2">
        <div className="grid grid-cols-3 font-bold">
            <span></span>
            <span className="text-right">Total</span>
            <span className="text-right">Goal</span>
        </div>
        <div className="grid grid-cols-3">
            <span>Protein</span>
            <span className="text-right">{progress.protein} g</span>
            <span className="text-right">{goals.protein} g</span>
        </div>
         <div className="grid grid-cols-3">
            <span>Carbohydrates</span>
            <span className="text-right">{progress.carbs} g</span>
            <span className="text-right">{goals.carbs} g</span>
        </div>
         <div className="grid grid-cols-3">
            <span>Fat</span>
            <span className="text-right">{progress.fat} g</span>
            <span className="text-right">{goals.fat} g</span>
        </div>
        {/* Add more nutrients as needed */}
    </div>
);

const MacrosTab = ({ progress, goals }) => {
    const totalMacros = progress.protein + progress.carbs + progress.fat || 1;
    const proteinPct = Math.round((progress.protein / totalMacros) * 100);
    const carbsPct = Math.round((progress.carbs / totalMacros) * 100);
    const fatPct = Math.round((progress.fat / totalMacros) * 100);

    return (
        <div className="space-y-4">
             <div className="w-40 h-40 bg-surface rounded-full mx-auto flex items-center justify-center">
                {/* Placeholder for macro circle */}
            </div>
            <div>
                <div className="flex justify-between"><span>Carbohydrates ({carbsPct}%)</span><span>Goal: {goals.carbs}g</span></div>
                <div className="flex justify-between"><span>Protein ({proteinPct}%)</span><span>Goal: {goals.protein}g</span></div>
                <div className="flex justify-between"><span>Fat ({fatPct}%)</span><span>Goal: {goals.fat}g</span></div>
            </div>
        </div>
    );
};


export default function Nutrition() {
    const [activeTab, setActiveTab] = useState('overview');
    const [progress, setProgress] = useState({ calories: 0, protein: 0, carbs: 0, fat: 0, foodCount: 0, mealCount: 0 });
    const [goals, setGoals] = useState({ calories: 2000, protein: 150, carbs: 250, fat: 70 });

    useEffect(() => {
        // Fetch data here and update progress and goals state
    }, []);

    const tabs = ['overview', 'calories', 'nutrients', 'macros'];

    return (
        <div className="p-4 space-y-6">
            <h1 className="text-3xl font-bold">Nutrition</h1>

            {/* Tab Navigation */}
            <div className="flex justify-between border-b border-white/10">
                {tabs.map(tab => (
                    <button 
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`capitalize pb-2 font-semibold ${activeTab === tab ? 'text-primary border-b-2 border-primary' : 'text-text-secondary'}`}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            {/* Tab Content */}
            <div>
                {activeTab === 'overview' && <OverviewTab progress={progress} />}
                {activeTab === 'calories' && <CaloriesTab progress={progress} goals={goals} />}
                {activeTab === 'nutrients' && <NutrientsTab progress={progress} goals={goals} />}
                {activeTab === 'macros' && <MacrosTab progress={progress} goals={goals} />}
            </div>
        </div>
    );
}