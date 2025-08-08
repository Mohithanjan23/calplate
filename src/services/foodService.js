// src/services/foodService.js
import { supabase } from './supabaseClient';

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

export const getMealsFromLast7Days = async () => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];

  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
  sevenDaysAgo.setHours(0, 0, 0, 0);

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