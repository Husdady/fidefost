// Utils
import isObject from "./isObject";

/**
 * Check if two arrays are equal
 * @param {Array<unknown>} arr1 Array
 * @param {Array<unknown>} arr2 Array
 * @returns {boolean} Boolean
 */
export function areArraysEqual(arr1, arr2) {
  // Validate params
  if (!Array.isArray(arr1) || !Array.isArray(arr2)) return false;
  if (arr1.length !== arr2.length) return false;

  // Compare arrays element by element
  for (let i = 0; i < arr1.length; i++) {
    const item1 = arr1[i]; // Get item of first array
    const item2 = arr2[i]; // Get item of second array

    // If both items are arrays, compare recursively
    if (Array.isArray(item1) && Array.isArray(item2)) {
      // Check if both arrays are not equal
      if (!areArraysEqual(item1, item2)) return false;
    } else if (isObject(item1) && isObject(item2)) {
      // Compare the object values of both items
      if (!areObjectsEqual(item1, item2)) return false;
    } else if (item1 !== item2) {
      return false; // Otherwise, compare items directly
    }
  }

  // If all elements are equal, return true
  return true;
}

/**
 * Check if two objects are equal
 * @param {object} obj1 Object
 * @param {object} obj2 Object
 * @returns {boolean} Boolean
 */
export function areObjectsEqual(obj1, obj2) {
  // Validate params
  if (!isObject(obj1) || !isObject(obj2)) return false;

  // Get keys of 'obj1' and 'obj2'
  const keysObj1 = Object.keys(obj1);
  const keysObj2 = Object.keys(obj2);

  // Validate total keys of both objects
  if (keysObj1.length !== keysObj2.length) return false;

  // Compare keys and values of objects
  for (let key of keysObj1) {
    // Check if the key exists in both objects
    if (!obj2.hasOwnProperty(key)) return false;

    // Get values of 'obj1' and 'obj2'
    const valueObj1 = obj1[key];
    const valueObj2 = obj2[key];

    // If both values are objects, compare recursively
    if (isObject(valueObj1) && isObject(valueObj2)) {
      // Check if are equal objects
      if (!areObjectsEqual(valueObj1, valueObj2)) return false;
    } else if (Array.isArray(valueObj1) && Array.isArray(valueObj2)) {
      // If both values are arrays, compare recursively
      if (!areArraysEqual(valueObj1, valueObj2)) return false;
    } else if (valueObj1 !== valueObj2) {
      return false; // Otherwise, compare values directly
    }
  }

  // If all keys and values are equal, return true
  return true;
}
