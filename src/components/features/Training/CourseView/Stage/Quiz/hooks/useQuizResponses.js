// Hooks
import { useMemo, useState, useCallback } from "react";

// Utils
import isValidArray from "utils/isValidArray";
import isValidString from "utils/isValidString";
import createValidObject from "utils/createValidObject";
import createValidArray from "utils/createValidArray";

/**
 * Hook for save quiz responses
 * @param {object} params Params
 */
export default function useQuizResponses({ stage }) {
  const [quizResponses, setQuizResponses] = useState([]);

  // Check if has filled all questions
  const hasFilledAllQuestions = useMemo(() => {
    return (
      isValidArray(quizResponses) &&
      stage?.questions?.length === quizResponses?.length &&
      quizResponses.every(
        (item) =>
          isValidString(item?.questionId) && isValidString(item?.selectedOption)
      )
    );
  }, [stage, quizResponses]);

  // Callback to save quiz response
  const saveQuizResponse = useCallback((params) => {
    const { option, question } = createValidObject(params);

    // Get fields
    const questionId = question?._id;
    const selectedOption = option?.currentOption?.value;

    setQuizResponses((prev) => {
      const copy = createValidArray(prev);
      const hasOption = copy.some((item) => item?.questionId === questionId);

      // Check if has option
      if (hasOption) {
        // Get index
        const index = copy.findIndex((item) => item?.questionId === questionId);

        // Update 'selectedOption' field
        copy[index].selectedOption = selectedOption;
      } else {
        copy.push({
          questionId: questionId,
          selectedOption: selectedOption,
          correctOption: question?.correctOption,
        });
      }

      return copy;
    });
  }, []);

  return {
    quizResponses: quizResponses,
    saveQuizResponse: saveQuizResponse,
    hasFilledAllQuestions: hasFilledAllQuestions,
  };
}
