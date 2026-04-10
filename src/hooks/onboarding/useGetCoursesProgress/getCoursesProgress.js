// Librarys
import api from "libs/axios";

/**
 * Callback to get courses progress
 * @returns {Promise<object>} API response
 */
export default async function getCoursesProgress() {
  try {
    // Get API response
    const apiResponse = await api.get("/web/training/progress");
    return apiResponse.data;
  } catch (error) {
    console.error("Error to get courses progress", { error });
    throw error;
  }
}
