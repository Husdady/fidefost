// Librarys
import api from "libs/axios";

/**
 * Callback to get Wix user profile
 * @returns {Promise<object>} API response
 */
export default async function getProfile() {
  try {
    // Get API response
    const apiResponse = await api.get("/app/onboarding/profile");
    return apiResponse.data;
  } catch (error) {
    console.error("Error to get profile", { error });
    throw error;
  }
}
