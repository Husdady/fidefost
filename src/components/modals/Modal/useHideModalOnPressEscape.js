// Hooks
import { useEffect } from "react";

/**
 * Hook for hide modal when 'Escape' key is pressed
 * @param {object} params Params
 */
export default function useHideModalOnPressEscape({ onHide }) {
  useEffect(() => {
    /**
     * Callback for close modal when 'Escape' key is pressed
     * @param {Event} e event
     */
    function closeOnEscapeKey(e) {
      if (e.key !== "Escape" || !isFunction(onHide)) return;
      onHide();
    }

    document.body.addEventListener("keydown", closeOnEscapeKey);

    return () => {
      document.body.removeEventListener("keydown", closeOnEscapeKey);
    };
  }, [onHide]);
}
