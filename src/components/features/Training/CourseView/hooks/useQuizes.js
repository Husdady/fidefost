// Hooks
import { useState, useCallback } from "react";

// Utils
import createValidArray from "utils/createValidArray";

/**
 * Hook for implements logic of Quizes component
 * @param {object} props Props
 */
export default function useQuizes({ stage, course }) {
  const [quizes, setQuizes] = useState(() => {
    return createValidArray(course?.quizes);
  });

  // Callback to save quiz response
  const saveQuizes = useCallback(
    (quizResponses) => {
      // Get stage id
      const stageId = stage?._id;

      // Define new questions
      const questions = createValidArray(quizResponses).map((item) => ({
        _id: item?.questionId,
        correctOption: item?.correctOption,
        selectedOption: Number(item?.selectedOption),
      }));

      setQuizes((prev) => {
        const copy = createValidArray(prev);
        const hasOption = copy.some((item) => item?.stageId === stageId);

        // Check if has option
        if (hasOption) {
          // Get index
          const index = copy.findIndex((item) => item?.stageId === stageId);

          // Update 'selectedOption' field
          copy[index].questions = questions;
        } else {
          copy.push({ stageId, questions });
        }

        return copy;
      });
    },
    [stage]
  );

  return {
    quizes: quizes,
    saveQuizes: saveQuizes,
  };
}
