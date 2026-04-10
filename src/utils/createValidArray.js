/**
 * Callback for create valid array
 * @param {Array} array Array
 * @returns {Array} Array
 */
export default function createValidArray(array) {
  // Validate 'array' param
  if (!Array.isArray(array)) return [];
  return [...array];
}
