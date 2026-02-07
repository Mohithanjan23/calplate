
import React from 'react';
import { commonFoods } from '../../utils/mealDatabase';
import { Plus } from 'lucide-react';

interface CommonFoodsProps {
    onSelect: (food: any) => void;
}

export const CommonFoods: React.FC<CommonFoodsProps> = ({ onSelect }) => {
    return (
        <div className="grid grid-cols-2 gap-3">
            {commonFoods.map((food) => (
                <button
                    key={food.name}
                    onClick={() => onSelect(food)}
                    className="p-3 bg-gray-50 rounded-xl border border-gray-100 hover:border-green-200 hover:bg-green-50 transition-colors text-left group"
                >
                    <div className="flex justify-between items-start">
                        <div>
                            <div className="font-medium text-gray-900 text-sm">{food.name}</div>
                            <div className="text-gray-500 text-xs">{food.calories} cal</div>
                        </div>
                        <div className="bg-white p-1 rounded-full shadow-sm opacity-0 group-hover:opacity-100 transition-opacity">
                            <Plus className="w-3 h-3 text-green-600" />
                        </div>
                    </div>
                </button>
            ))}
        </div>
    );
};
