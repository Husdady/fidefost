// Hooks
import { useMemo, useCallback } from "react";
import useUpdateCourseProgress from "hooks/onboarding/useUpdateCourseProgress";

// Utils
import createValidArray from "utils/createValidArray";
import resetScrollPosition from "utils/onboarding/resetScrollPosition";
import getCompletionPercentage from "../utils/getCompletionPercentage";

/**
 * Callback to handle save Course stage
 * @param {object} params Params
 */
export default function useSaveCourseStage({
  stage,
  stages,

  course,
  quizes,

  stageIndex,
  maxStageIndex,

  renderNextStage,
  setMaxStageIndex,
  onViewAllCourses,
}) {
  const { updateCourseProgress } = useUpdateCourseProgress({
    // Handle success response at update course progress
    onSuccess: () => {
      setMaxStageIndex(stageIndex);
    },
  });

  // Check if is last stage
  const isLastStage = useMemo(() => {
    // Get last stage
    const lastStage = stages[stages?.length - 1];

    return lastStage?._id === stage?._id;
  }, [stage, stages]);

  // Submit event for continue to the next
  const submit = useCallback(
    (event) => {
      event.preventDefault();

      resetScrollPosition();

      // Check if is the last stage
      if (isLastStage) {
        onViewAllCourses();
        return;
      }

      const newStage = renderNextStage();

      // Get index of the next stage
      const newStageIndex = newStage?.index;

      // Check if can course stage
      const canSaveStage = newStageIndex > maxStageIndex;
      if (!canSaveStage) return;

      // Get completion percentage
      const completionPercentage = getCompletionPercentage({
        stageIndex: newStageIndex,
        totalStages: stages?.length,
      });

      updateCourseProgress({
        courseId: course?.courseId,
        courseData: {
          stageId: newStage._id,
          quizes: createValidArray(quizes),
          completionPercentage: completionPercentage,
        },
      });
    },
    [
      stage,
      stages,
      course,
      quizes,
      stageIndex,
      isLastStage,
      maxStageIndex,
      renderNextStage,
      onViewAllCourses,
    ]
  );

  return {
    submit: submit,
  };
}
