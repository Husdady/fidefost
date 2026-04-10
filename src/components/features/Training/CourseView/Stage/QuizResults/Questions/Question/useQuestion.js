// Hooks
import { useMemo } from "react";

// Utils
import isValidArray from "utils/isValidArray";
import createValidArray from "utils/createValidArray";
import createValidObject from "utils/createValidObject";
import formatQuizResponseId from "./utils/formatQuizResponseId";

/**
 * Hook for implements logic of Question component
 * @param {object} props Props
 */
export default function useQuestion({ data, index, quizes, quizResults }) {
  const { quizStage } = quizResults;

  // Check if has options
  const hasOptions = useMemo(
    () => isValidArray(data?.options),
    [data?.options]
  );

  // Get selected option
  const answer = useMemo(() => {
    const quizResponse = createValidArray(quizes).find(
      (item) => item?.stageId === quizStage?._id
    );

    // Get response by question id
    const response = createValidArray(quizResponse?.questions).find(
      (item) => item?._id === formatQuizResponseId(data?._id)
    );

    return createValidObject(response);
  }, [data, index, quizes, quizStage]);

  return {
    ...answer,
    options: data?.options,
    hasOptions: hasOptions,
  };
}
