// Hooks
import { useCallback } from "react";
import useShowModal from "hooks/useShowModal";
import useQuizResponses from "./hooks/useQuizResponses";
import useUpdateCourseProgress from "hooks/onboarding/useUpdateCourseProgress";

// Utils
import isFunction from "utils/isFunction";
import createValidArray from "utils/createValidArray";
import resetScrollPosition from "utils/onboarding/resetScrollPosition";
import getCompletionPercentage from "../../utils/getCompletionPercentage";

/**
 * Hook for implements logic of Quiz component
 * @param {object} params Params
 */
export default function useQuiz({
  course,
  quizes,

  stage,
  stages,
  maxStageIndex,

  getNextStage,
  renderNextStage,
  setMaxStageIndex,
  onSendQuizResponses,
}) {
  const confirmationModal = useShowModal();

  const quizResponsesData = useQuizResponses({ stage, quizes });

  const { updateCourseProgress, isUpdatingCourseProgress } =
    useUpdateCourseProgress({
      // Handle success response at update course progress
      onSuccess: () => {
        resetScrollPosition();
        const newStage = renderNextStage();
        setMaxStageIndex(newStage?.index);
      },
    });

  // Click event in Send button
  const handleSendQuiz = useCallback(() => {
    confirmationModal.show();

    // Validate 'onSendQuizResponses' callback
    if (!isFunction(onSendQuizResponses)) return;
    onSendQuizResponses(quizResponsesData.quizResponses);
  }, [
    onSendQuizResponses,
    confirmationModal.show,
    quizResponsesData.quizResponses,
  ]);

  // Click event in Send button
  const saveQuizResponses = useCallback(() => {
    const newStage = getNextStage();

    // Get index of the next stage
    const newStageIndex = newStage?.index;

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
  }, [course, quizes, getNextStage]);

  return {
    ...quizResponsesData,

    handleSendQuiz: handleSendQuiz,
    saveQuizResponses: saveQuizResponses,
    confirmationModal: confirmationModal,
    isSendingQuiz: isUpdatingCourseProgress,
    isDisabledSendButton: !quizResponsesData.hasFilledAllQuestions,
  };
}
