// Hooks
import { useMemo, useCallback } from "react";

// Utils
import isFunction from "utils/isFunction";
import createValidArray from "utils/createValidArray";
import createValidString from "utils/createValidString";

/**
 * Hook for implements logic of Question component
 * @param {object} props Props
 */
export default function useQuestion({ data, quizResponses, onSelectOption }) {
  // Get options
  const options = useMemo(
    () =>
      createValidArray(data?.options).map((option, i) => ({
        label: option,
        value: String(i + 1),
      })),
    [data?.options]
  );

  // Get selected option
  const selectedOption = useMemo(() => {
    // Get response from quiz responses based question id
    const response = createValidArray(quizResponses).find(
      (item) => item?.questionId === data?._id
    );

    return createValidString(response?.selectedOption);
  }, [data, quizResponses]);

  // Callback for select option
  const handleSelectOption = useCallback(
    (option) => {
      if (!isFunction(onSelectOption)) return;
      onSelectOption({ option: option, question: data });
    },
    [data, onSelectOption]
  );

  return {
    options: options,
    selectedOption: selectedOption,
    handleSelectOption: handleSelectOption,
  };
}
