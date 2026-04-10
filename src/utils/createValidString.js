// Utils
import isString from "./isString";

/**
 * Callback for create valid string
 * @param {string} str String
 * @param {string} [defaultString] String
 * @returns {string} String
 */
export default function createValidString(str, defaultString = "") {
  // Validate 'str' param
  if (isString(str)) return str;

  return isString(defaultString) ? defaultString : "";
}
