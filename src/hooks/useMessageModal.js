// Hooks
import { useState, useCallback } from "react";

// Utils
import isValidString from "utils/isValidString";

/**
 * Hook for create dynamic message for modal component
 * @param {object} params Params
 */
export default function useMessageModal(params) {
  const [isShowingModal, setShowingModal] = useState(false);
  const [message, setMessage] = useState(params?.defaultMessage ?? "");

  // Callback for hide Modal component
  const hideModal = useCallback(() => {
    if (!isShowingModal) return;
    setShowingModal(false);
  }, [isShowingModal]);

  // Callback for show Modal component
  const showModal = useCallback(
    (params) => {
      // Validate 'message' from params
      if (isValidString(params?.message) && message !== params?.message) {
        setMessage(params.message);
      }

      if (isShowingModal) return;
      setShowingModal(true);
    },
    [message, isShowingModal]
  );

  return {
    show: showModal,
    hide: hideModal,
    message: message,
    isShowing: isShowingModal,
  };
}
