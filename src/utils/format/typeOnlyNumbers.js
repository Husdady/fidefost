// Utils
import isValidString from "../isValidString";

/**
 * Callback for type only numbers of input text
 * @param {MouseEvent} event Event
 * @returns {string} Value
 */
export default function typeOnlyNumbers(event) {
  // Get input value
  let value = event?.target?.value;

  // Validate text value
  if (!isValidString(value)) return;

  // Removes non-numeric characters
  value = value.replace(/[^0-9]/g, "");

  // Prevent numbers from starting with '0' unless it's exactly '0'
  if (value.length > 1 && value.startsWith("0")) {
    value = value.slice(-1); // Delete zeros at start
  }

  // Update input value
  event.target.value = value;

  return value;
}
