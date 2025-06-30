import { useEffect, useState } from 'react';
import { supabase } from '../services/supabaseClient';

export default function Suggestions() {
  const [dietType, setDietType] = useState('veg');
  const [budgetLevel, setBudgetLevel] = useState('low');

  const suggestions = {
    veg: {
      low: [
        'Poha with veggies',
        'Chana salad',
        'Oats with banana',
        'Moong dal cheela'
      ],
      medium: [
        'Paneer bhurji with roti',
        'Veg pulao with curd',
        'Quinoa salad',
        'Stuffed paratha with curd'
      ],
      high: [
        'Tofu stir-fry',
        'Mixed veg curry with brown rice',
        'Protein smoothie with almond milk',
        'Grilled paneer with salad'
      ]
    },
    nonveg: {
      low: [
        'Boiled eggs and toast',
        'Chicken curry with rice',
        'Tuna salad',
        'Egg bhurji with chapati'
      ],
      medium: [
        'Grilled chicken with veggies',
        'Omelette with oats',
        'Chicken soup',
        'Chicken sandwich with brown bread'
      ],
      high: [
        'Grilled salmon with salad',
        'Chicken breast with quinoa',
        'Prawn curry with brown rice',
        'Beef stir-fry with vegetables'
      ]
    },
    vegan: {
      low: [
        'Banana oats smoothie',
        'Lentil soup',
        'Veg upma',
        'Chickpea salad'
      ],
      medium: [
        'Tofu scramble with toast',
        'Quinoa and lentil khichdi',
        'Soy milk smoothie',
        'Grilled tofu wrap'
      ],
      high: [
        'Tempeh bowl with veggies',
        'Vegan protein shake with almond milk',
        'Avocado toast with seeds',
        'Tofu curry with brown rice'
      ]
    }
  };

  const meals = suggestions[dietType][budgetLevel];

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold text-center mb-4">Meal Suggestions</h1>

      <div className="flex justify-center gap-4 mb-4">
        <select
          value={dietType}
          onChange={(e) => setDietType(e.target.value)}
          className="border px-3 py-2 rounded"
        >
          <option value="veg">Vegetarian</option>
          <option value="nonveg">Non-Vegetarian</option>
          <option value="vegan">Vegan</option>
        </select>

        <select
          value={budgetLevel}
          onChange={(e) => setBudgetLevel(e.target.value)}
          className="border px-3 py-2 rounded"
        >
          <option value="low">Low Budget</option>
          <option value="medium">Medium Budget</option>
          <option value="high">High Budget</option>
        </select>
      </div>

      <ul className="space-y-3">
        {meals.map((meal, index) => (
          <li key={index} className="p-3 border rounded shadow-sm bg-white dark:bg-gray-800">
            {meal}
          </li>
        ))}
      </ul>
    </div>
  );
}
