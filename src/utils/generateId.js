// Constants
export const BASE_36 = 36;

/**
 * Generate unique id
 * @returns {string} ID
 */
export default function generateId() {
  // Convert timestamp to base 36 (numbers and letters)
  const timestamp = Date.now().toString(36);

  // Get the first 5 random characters
  const aleatoryNumber = Math.random().toString(36).substring(2, 5);

  return timestamp + aleatoryNumber;
}
