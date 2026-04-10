// Librarys
import api from "../index";

// Utils
import isValidString from "utils/isValidString";

/**
 * Callback for save token in axios instance
 * @param {string} token Token
 */
export default function saveToken(token) {
  // Validate 'token' param
  if (!isValidString(token)) return;

  // Define session token
  const sessionToken = `Bearer ${token}`;

  // Save token in axios instance
  api.defaults.headers["Authorization"] = sessionToken;
  api.defaults.headers.common["Authorization"] = sessionToken;

  // Set 'Content-Type' header
  api.defaults.headers.common["Content-Type"] = "application/json";
}
