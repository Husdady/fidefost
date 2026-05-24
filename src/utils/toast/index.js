// Librarys
import { toast } from "react-toastify";

// Utils
import isValidString from "utils/isValidString";

// Constants
import config from "./config";

/**
 * Callback for show success toast
 * @param {string} message Message
 */
export function showSuccessToast(message) {
  // Validate 'message' prop
  if (!isValidString(message)) return;

  toast.success(message, config);
}

/**
 * Callback for show error toast
 * @param {string} message Message
 */
export function showErrorToast(message) {
  // Validate 'message' prop
  if (!isValidString(message)) return;

  toast.error(message, config);
}

/**
 * Callback for show info toast
 * @param {string} message Message
 */
export function showInfoToast(message) {
  // Validate 'message' prop
  if (!isValidString(message)) return;

  toast.info(message, config);
}

/**
 * Callback for show warn toast
 * @param {string} message Message
 */
export function showWarnToast(message) {
  // Validate 'message' prop
  if (!isValidString(message)) return;

  toast.warn(message, config);
}
