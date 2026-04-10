// Hooks
import { useMemo, useCallback } from "react";
import useUpdateCourseProgress from "hooks/onboarding/useUpdateCourseProgress";

// Utils
import createStages from "components/features/Training/CourseView/utils/createStages";

/**
 * Hook for retake completed course
 * @param {object} props Props
 */
export default function useRetakeCourse({ index, course, onStartLesson }) {
  const { updateCourseProgress, isUpdatingCourseProgress } =
    useUpdateCourseProgress({
      // Handle success response at reset course
      onSuccess: (_, variables) => {
        onStartLesson({ ...course, ...variables.courseData, index: index });
      },
    });

  // Get stages of the course
  const stages = useMemo(() => createStages(course), [course]);

  // Click event in retake button
  const handleRetakeLesson = useCallback(() => {
    // Get first stage id
    const firstStageId = stages?.[0]?._id;

    updateCourseProgress({
      courseId: course?.courseId,
      courseData: {
        quizes: [],
        stageId: firstStageId,
        completionPercentage: 0,
      },
    });
  }, [course, stages, onStartLesson]);

  return {
    handleRetakeLesson: handleRetakeLesson,
    isResetingCourse: isUpdatingCourseProgress,
  };
}
