// Utils
import isString from "./isString";

/**
 * Validate if is valid string
 * @param {string} str String
 * @returns {boolean} Boolean
 */
export default function isValidString(str) {
  return isString(str) && str.length > 0;
}
