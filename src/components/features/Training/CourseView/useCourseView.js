// Hooks
import { useMemo } from "react";
import useStages from "./hooks/useStages";
import useQuizResults from "./hooks/useQuizResults";
import useSaveCourseStage from "./hooks/useSaveCourseStage";

// Constants
import { QUIZ, QUIZ_RESULTS } from "./Stage/types";

/**
 * Hook to implements logic to CourseView component
 * @param {object} props Props
 */
export default function useCourseView(props) {
  const stagesData = useStages(props);
  const quizResults = useQuizResults({ ...props, ...stagesData });
  const courseStageData = useSaveCourseStage({ ...props, ...stagesData });

  const { stage } = stagesData;

  // Check if is disabled submit button
  const isDisabledSubmitButton = useMemo(() => {
    return (
      stage?.type === QUIZ ||
      (stage?.type === QUIZ_RESULTS && !quizResults.hasApprovedQuiz)
    );
  }, [stage, quizResults.hasApprovedQuiz]);

  return {
    ...stagesData,
    ...courseStageData,

    quizResults: quizResults,
    onSendQuizResponses: stagesData.saveQuizes,
    isDisabledSubmitButton: isDisabledSubmitButton,
    handleBackToPreviousStage: stagesData.renderPreviousStage,
  };
}
