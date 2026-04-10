// Hooks
import { useState, useCallback } from "react";

/**
 * Hook for implements logic for show modal
 */
export default function useShowModal() {
  const [isShowingModal, setShowingModal] = useState(false);

  // Show modal
  const showModal = useCallback(() => {
    if (isShowingModal) return;
    setShowingModal(true);
  }, [isShowingModal]);

  // Hide modal
  const hideModal = useCallback(() => {
    if (!isShowingModal) return;
    setShowingModal(false);
  }, [isShowingModal]);

  return {
    show: showModal,
    hide: hideModal,
    isShowing: isShowingModal,
  };
}
