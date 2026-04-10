// Hooks
import { useMutation } from "react-query";

// Utils
import updateCourseProgress from "./updateCourseProgress";

const UPDATE_COURSE_PROGRESS_KEY = "update-course-progress";

/**
 * Hook for update course progress
 * @param {object} params Params
 */
export default function useUpdateCourseProgress(params) {
  const mutation = useMutation({
    onError: params?.onError,
    onSuccess: params?.onSuccess,
    mutationFn: updateCourseProgress,
    mutationKey: UPDATE_COURSE_PROGRESS_KEY,
  });

  return {
    updateCourseProgress: mutation.mutateAsync,
    isUpdatingCourseProgress: mutation.isLoading,
  };
}
