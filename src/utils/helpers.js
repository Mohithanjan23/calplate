// Reusable utilities — use across multiple pages

/**
 * Format number as kcal with unit.
 * @param {number} cal
 * @returns {string}
 */
export function formatCalories(cal) {
  return `${cal} kcal`;
}

/**
 * Capitalize the first letter of a word or sentence.
 * @param {string} str
 * @returns {string}
 */
export function capitalize(str = '') {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * Round a number to specified decimal places.
 * @param {number} num
 * @param {number} places
 * @returns {number}
 */
export function roundTo(num, places = 2) {
  return +parseFloat(num).toFixed(places);
}
