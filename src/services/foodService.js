// src/services/foodService.js
import { supabase } from './supabaseClient';

// =================================================================
// == Functions for interacting with the REAL Supabase database    ==
// =================================================================

/**
 * Fetches all meal logs for the current user for today's date from Supabase.
 */
export const getTodayMeals = async () => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const { data, error } = await supabase
    .from('meal_logs')
    .select('*')
    .eq('user_id', user.id)
    .gte('created_at', today.toISOString())
    .lt('created_at', tomorrow.toISOString());

  if (error) {
    console.error('Error fetching meals:', error);
    return [];
  }
  return data;
};

/**
 * Logs a new meal for the current user to the Supabase database.
 * @param {object} food - The food object to log.
 * e.g., { name: 'Apple', calories: 95, protein_g: 1, ... }
 */
export const logMeal = async (food) => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    throw new Error("No user logged in to log meal.");
  }

  const { error } = await supabase.from('meal_logs').insert({
    user_id: user.id,
    food_name: food.name,
    calories: food.calories,
    protein_g: food.protein_g || 0,
    carbs_g: food.carbs_g || 0,
    fat_g: food.fat_g || 0,
  });

  if (error) {
    console.error('Error logging meal:', error);
    throw error;
  }
};


// =================================================================
// == Mock API service for searching foods (can be replaced later) ==
// =================================================================

const mockFoods = [
  { id: 1, name: 'Grilled Chicken Breast', calories: 165, protein_g: 31, carbs_g: 0, fat_g: 4 },
  { id: 2, name: 'Brown Rice', calories: 215, protein_g: 5, carbs_g: 45, fat_g: 2 },
  { id: 3, name: 'Broccoli (1 cup)', calories: 55, protein_g: 4, carbs_g: 11, fat_g: 1 },
  { id: 4, name: 'Boiled Egg', calories: 78, protein_g: 6, carbs_g: 1, fat_g: 5 },
  { id: 5, name: 'Oatmeal (1 cup)', calories: 150, protein_g: 6, carbs_g: 27, fat_g: 3 },
  { id: 6, name: 'Apple', calories: 95, protein_g: 1, carbs_g: 25, fat_g: 0 },
  { id: 7, name: 'Avocado', calories: 234, protein_g: 3, carbs_g: 13, fat_g: 21 },
];

/**
 * Simulate searching foods with a query.
 * @param {string} query
 * @returns {Promise<Array>}
 */
export async function searchFoods(query = '') {
  console.log(`Searching for: "${query}"`);
  return new Promise((resolve) => {
    setTimeout(() => {
      if (!query) {
        resolve([]);
        return;
      }
      const result = mockFoods.filter((item) =>
        item.name.toLowerCase().includes(query.toLowerCase())
      );
      resolve(result);
    }, 300); // Simulated network delay
  });
}
export const getMealsFromLast7Days = async () => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];

  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
  sevenDaysAgo.setHours(0, 0, 0, 0); // Start of the day 7 days ago

  const { data, error } = await supabase
    .from('meal_logs')
    .select('created_at, calories')
    .eq('user_id', user.id)
    .gte('created_at', sevenDaysAgo.toISOString());

  if (error) {
    console.error('Error fetching weekly meals:', error);
    return [];
  }
  return data;
};
/**
 * Fetches a daily meal plan from the Spoonacular API.
 * @param {number} targetCalories - The target calorie amount for the day.
 * @param {string} diet - The dietary preference (e.g., 'vegetarian', 'vegan').
 */
export const getMealSuggestions = async (targetCalories, diet) => {
  const apiKey = import.meta.env.VITE_SPOONACULAR_API_KEY;
  if (!apiKey) {
    throw new Error("Spoonacular API key not found.");
  }

  let url = `https://api.spoonacular.com/mealplanner/generate?apiKey=${apiKey}&timeFrame=day&targetCalories=${targetCalories}`;
  
  if (diet) {
    url += `&diet=${diet}`;
  }

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`API call failed with status: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching meal suggestions:", error);
    throw error;
  }
};