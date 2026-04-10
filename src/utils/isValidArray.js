/**
 * Validate if is valid array
 * @param {unknown[]} array Array
 * @returns {boolean} Boolean
 */
export default function isValidArray(array) {
  return Array.isArray(array) && array.length > 0;
}
