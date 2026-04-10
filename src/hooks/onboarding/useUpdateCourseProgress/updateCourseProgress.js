// Librarys
import api from "libs/axios";

/**
 * Callback to update course progress
 * @param {object} params Params
 * @returns {Promise<object>} API response
 */
export default async function updateCourseProgress({ courseId, courseData }) {
  try {
    // Get API response
    const apiResponse = await api.post(
      `/web/training/course/${courseId}`,
      courseData
    );

    return apiResponse.data;
  } catch (error) {
    console.error("Error to update course progress", { error });
    throw error;
  }
}
