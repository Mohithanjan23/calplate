// Mock API service for food data — replace later with actual API call (e.g., Firebase, Supabase, Nutritionix)

const mockFoods = [
  { id: 1, name: 'Grilled Chicken Breast', calories: 165 },
  { id: 2, name: 'Brown Rice', calories: 215 },
  { id: 3, name: 'Broccoli (1 cup)', calories: 55 },
  { id: 4, name: 'Boiled Eggs', calories: 78 },
  { id: 5, name: 'Oatmeal (1 cup)', calories: 150 },
  { id: 6, name: 'Apple', calories: 95 },
];

/**
 * Simulate searching foods with a query.
 * @param {string} query
 * @returns {Promise<Array>}
 */
export async function searchFoods(query = '') {
  return new Promise((resolve) => {
    setTimeout(() => {
      const result = mockFoods.filter((item) =>
        item.name.toLowerCase().includes(query.toLowerCase())
      );
      resolve(result);
    }, 300); // Simulated delay
  });
}

/**
 * Get all foods (no filter)
 * @returns {Promise<Array>}
 */
export async function getAllFoods() {
  return new Promise((resolve) => {
    setTimeout(() => resolve(mockFoods), 200);
  });
}
