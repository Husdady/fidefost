// Hooks
import { useMemo } from "react";
import useGetCoursesProgress from "hooks/onboarding/useGetCoursesProgress";

// Utils
import isValidArray from "utils/isValidArray";
import createValidArray from "utils/createValidArray";

// Constants
import { COMPLETED } from "data/courses-status";

/**
 * Hook for implements logic of course list view
 */
export default function useCourseListView() {
  const query = useGetCoursesProgress();

  // Get courses
  const courses = useMemo(
    () => createValidArray(query.data?.data),
    [query.data?.data]
  );

  // Check if has courses
  const hasCourses = useMemo(() => isValidArray(courses), [courses]);

  // Check if is disabled next button based required courses not completed
  const disabledNextButton = useMemo(() => {
    // Get required courses
    const requiredCourses = courses.filter((course) => course.required);

    // Check if all required courses has been completed
    const hasCompletedRequiredCourses = requiredCourses.every(
      (item) => item?.status === COMPLETED
    );

    return !hasCompletedRequiredCourses;
  }, [courses]);

  return {
    courses: courses,
    hasCourses: hasCourses,
    isLoadingCourses: query.isLoading,
    disabledNextButton: disabledNextButton,
  };
}
