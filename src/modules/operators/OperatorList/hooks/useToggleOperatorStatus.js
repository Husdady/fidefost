// Librarys
import { useCallback } from "react";
import { useUpdateClient } from "context/clients/useClients";

/**
 * Hook for toggle operator status
 */
export default function useToggleOperatorStatus() {
  const updateClient = useUpdateClient();

  const handleToggleOperatorStatus = useCallback(
    (operator) => {
      // Validate operator
      if (!operator?._id) return;

      const nextStatus = operator?.status === "danger" ? "fine" : "danger";

      updateClient(operator._id, {
        status: nextStatus,
      });
    },
    [updateClient]
  );

  return handleToggleOperatorStatus;
}
