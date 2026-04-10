// Hooks
import { useCallback } from "react";

// Utils
import isFunction from "utils/isFunction";

/**
 * Hook for implements logic Group Radio button
 * @param {object} params Params
 */
export default function useGroupRadioOptions({ options, onChange }) {
  // Change event in input radio
  const handleOnChange = useCallback(
    ({ event, option, index }) => {
      // Validate 'onChange' callback
      if (!isFunction(onChange)) return;

      onChange({
        index: index,
        event: event,
        position: index + 1,
        currentOption: option,
        options: options,
      });
    },
    [options, onChange]
  );

  return {
    handleOnChange: handleOnChange,
  };
}
