// Hooks
import { useEffect } from "react";

// Utils
import isFunction from "utils/isFunction";

/**
 * Hook for trigger form validations
 * @param {object} params Params
 */
export default function useTriggerForm({ trigger }) {
  useEffect(() => {
    let mounted = true;

    if (mounted && isFunction(trigger)) {
      trigger();
    }

    return () => {
      mounted = false;
    };
  }, []);
}
