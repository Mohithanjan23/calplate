// src/services/workoutService.js
import { supabase } from './supabaseClient';

/**
 * Logs a new workout for the current user.
 * @param {object} workoutData - The workout data to log.
 * e.g., { exercise_name: 'Bench Press', sets: 3, reps: 8, weight_kg: 60 }
 */
export const logWorkout = async (workoutData) => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("No user logged in to log workout.");

  const { error } = await supabase.from('workout_logs').insert({
    user_id: user.id,
    ...workoutData,
  });

  if (error) {
    console.error('Error logging workout:', error);
    throw error;
  }
};

/**
 * Fetches all workouts logged by the current user for today.
 */
export const getTodaysWorkouts = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return [];

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const { data, error } = await supabase
        .from('workout_logs')
        .select('*')
        .eq('user_id', user.id)
        .gte('created_at', today.toISOString())
        .lt('created_at', tomorrow.toISOString())
        .order('created_at', { ascending: false }); // Show newest first

    if (error) {
        console.error('Error fetching today\'s workouts:', error);
        return [];
    }
    return data;
};