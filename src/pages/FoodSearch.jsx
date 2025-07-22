import { useState, useEffect } from 'react';
import { Search, PlusCircle } from 'lucide-react';
import { motion } from 'framer-motion';

const mockFoods = [
  { id: 1, name: 'Grilled Chicken Breast', calories: 165 },
  { id: 2, name: 'Brown Rice', calories: 215 },
  { id: 3, name: 'Broccoli (1 cup)', calories: 55 },
  { id: 4, name: 'Boiled Eggs', calories: 78 },
  { id: 5, name: 'Oatmeal (1 cup)', calories: 150 },
  { id: 6, name: 'Apple', calories: 95 },
];

export default function FoodSearch() {
  const [query, setQuery] = useState('');
  const [filteredFoods, setFilteredFoods] = useState(mockFoods);

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (query.trim()) {
        const q = query.toLowerCase();
        setFilteredFoods(
          mockFoods.filter((food) => food.name.toLowerCase().includes(q))
        );
      } else {
        setFilteredFoods(mockFoods);
      }
    }, 300); // debounce search

    return () => clearTimeout(timeout);
  }, [query]);

  return (
    <div className="max-w-2xl mx-auto px-4 pt-20 pb-28">
      <div className="flex items-center gap-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 shadow-sm mb-6">
        <Search className="text-gray-500 dark:text-gray-400 w-5 h-5" />
        <input
          type="text"
          placeholder="Search food..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full bg-transparent outline-none text-sm text-gray-900 dark:text-white"
        />
      </div>

      <ul className="space-y-3">
        {filteredFoods.length > 0 ? (
          filteredFoods.map((food) => (
            <motion.li
              key={food.id}
              className="bg-white dark:bg-gray-800 border dark:border-gray-700 p-4 rounded-lg flex items-center justify-between shadow-sm"
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
            >
              <div>
                <p className="font-medium">{food.name}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {food.calories} kcal
                </p>
              </div>
              <button
                onClick={() => console.log('Add', food)}
                className="text-blue-600 dark:text-blue-400 hover:scale-110 transition-transform"
              >
                <PlusCircle size={22} />
              </button>
            </motion.li>
          ))
        ) : (
          <p className="text-gray-500 text-sm">No food found.</p>
        )}
      </ul>
    </div>
  );
}
