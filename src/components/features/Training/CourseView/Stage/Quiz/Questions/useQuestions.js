// Hooks
import { useMemo } from "react";

// Utils
import createValidArray from "utils/createValidArray";

/**
 * Hook for implements logic of Questions component
 * @param {object} param Params
 */
export default function useQuestions({ stage }) {
  // Define questions
  const questions = useMemo(
    () =>
      createValidArray(stage?.questions).map((item, i) => ({
        ...item,
        _id: `${stage?._id}-quiz-question${i + 1}`,
      })),
    [stage]
  );

  return {
    questions: questions,
  };
}
