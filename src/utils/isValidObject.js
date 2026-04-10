// Utils
import isObject from "./isObject";

/**
 * Validate if is valid object
 * @param {object} obj Object
 * @returns {boolean} Boolean
 */
export default function isValidObject(obj) {
  return isObject(obj) && Object.keys(obj).length > 0;
}
