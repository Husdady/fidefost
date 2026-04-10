/**
 * Check if the value received by parameters is a function
 * @param {function} func Function as parameter
 * @returns {boolean} Boolean
 */
export default function isFunction(func) {
  return typeof func === "function";
}
