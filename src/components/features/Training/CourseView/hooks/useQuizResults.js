// Hooks
import { useMemo, useCallback } from "react";

// Utils
import createValidArray from "utils/createValidArray";
import createValidObject from "utils/createValidObject";

/**
 * Hook for validate Quiz results stage
 * @param {object} param Params
 */
export default function useQuizResults({ stage, stages, quizes, setStage }) {
  // Get quiz stage
  const quizStage = useMemo(() => {
    const stageIndex = createValidArray(stages).findIndex(
      (item) => item?._id === stage?._id
    );

    return createValidObject(stages[stageIndex - 1]);
  }, [stage, stages]);

  // Define questions
  const questions = useMemo(() => {
    // Create stage copy
    const stageCopy = createValidObject(stage);

    // Add questions of quiz stage
    stageCopy.questions = createValidArray(quizStage?.questions);

    return stageCopy.questions.map((item, i) => ({
      ...item,
      _id: `${stage?._id}-quiz-results-question${i + 1}`,
    }));
  }, [stage, quizStage]);

  // Get total correct answers
  const totalCorrectAnwers = useMemo(() => {
    const quizResponse = createValidArray(quizes).find(
      (item) => item?.stageId === quizStage?._id
    );

    return createValidArray(quizResponse?.questions).reduce((acc, item) => {
      // Check if has the correct option
      const hasCorrectOption = item?.selectedOption === item?.correctOption;

      if (hasCorrectOption) {
        acc = acc + 1;
      }

      return acc;
    }, 0);
  }, [quizes, quizStage]);

  // Get results percentage
  const resultsPercentage = useMemo(() => {
    const percentage = (totalCorrectAnwers / questions?.length) * 100;

    return Number.isInteger(percentage) ? percentage : percentage.toFixed(2);
  }, [questions?.length, totalCorrectAnwers]);

  // Check if has approved quiz
  const hasApprovedQuiz = useMemo(
    () => resultsPercentage >= quizStage?.passingGrade,
    [quizStage, resultsPercentage]
  );

  // Callback to retake quiz
  const onRetakeQuiz = useCallback(() => {
    setStage(quizStage);
  }, [quizStage]);

  return {
    questions: questions,
    quizStage: quizStage,
    onRetakeQuiz: onRetakeQuiz,
    hasApprovedQuiz: hasApprovedQuiz,
    resultsPercentage: resultsPercentage,
    totalCorrectAnwers: totalCorrectAnwers,
  };
}
