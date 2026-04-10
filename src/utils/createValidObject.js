// Utils
import isObject from "./isObject";

/**
 * Callback for create valid object
 * @param {object} obj Object
 * @param {object} defaultObj Default object
 * @returns {object} Object
 */
export default function createValidObject(obj, defaultObj) {
  // Validate 'obj' param
  if (!isObject(obj)) return isObject(defaultObj) ? defaultObj : {};
  return { ...obj };
}
