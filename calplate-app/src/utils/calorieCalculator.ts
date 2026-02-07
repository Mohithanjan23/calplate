
export function calculateDailyCalories(
  age: number,
  weight: number,
  height: number,
  activity: 'sedentary' | 'light' | 'moderate' | 'active',
  goal: 'lose' | 'maintain' | 'gain'
): number {
  // Mifflin-St Jeor Equation (for males, assuming male for MVP simplicity or allow gender later)
  // For now, using the formula provided in requirements which seems to be a variation or simplified version.
  // Requirement formula: (10 * weight) + (6.25 * height) - (5 * age) + 5;
  // This is actually for males. For females it's -161.
  // We'll stick to the requirement's provided formula for now.
  
  const bmr = (10 * weight) + (6.25 * height) - (5 * age) + 5;
  
  const activityMultipliers = {
    sedentary: 1.2,
    light: 1.375,
    moderate: 1.55,
    active: 1.725
  };
  
  const goalAdjustments = {
    lose: -500,
    maintain: 0,
    gain: 300
  };
  
  const tdee = bmr * activityMultipliers[activity];
  const targetCalories = tdee + goalAdjustments[goal];
  
  return Math.round(targetCalories);
}
