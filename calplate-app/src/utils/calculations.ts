export type Gender = 'male' | 'female';
export type ActivityLevel = 'sedentary' | 'lightly_active' | 'moderately_active' | 'very_active' | 'extra_active';

export interface UserStats {
    gender: Gender;
    weight: number; // kg
    height: number; // cm
    age: number; // years
    activityLevel: ActivityLevel;
}

export const ACTIVITY_MULTIPLIERS: Record<ActivityLevel, number> = {
    sedentary: 1.2,
    lightly_active: 1.375,
    moderately_active: 1.55,
    very_active: 1.725,
    extra_active: 1.9,
};

export function calculateBMR(stats: UserStats): number {
    const { gender, weight, height, age } = stats;

    // Defensive checks to prevent NaN
    if (!weight || !height || !age || weight <= 0 || height <= 0 || age <= 0) {
        return 0; // Or throw error, but 0 is safer for UI
    }

    let bmr = (10 * weight) + (6.25 * height) - (5 * age);

    if (gender === 'male') {
        bmr += 5;
    } else {
        bmr -= 161;
    }

    return Math.round(bmr);
}

export function calculateTDEE(stats: UserStats): number {
    const bmr = calculateBMR(stats);
    const multiplier = ACTIVITY_MULTIPLIERS[stats.activityLevel];
    return Math.round(bmr * multiplier);
}
