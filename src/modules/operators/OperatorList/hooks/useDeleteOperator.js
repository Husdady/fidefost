// Hooks
import { useCallback } from "react";

// Store
import { useDeleteClient } from "context/clients/useClients";

// Utils
import { showWarnToast } from "utils/toast";

/**
 * Hook for delete operator information
 */
export default function useDeleteOperator() {
  const deleteClient = useDeleteClient();

  // Callback for delete operator
  const handleDeleteOperator = useCallback((operator) => {
    deleteClient(operator?._id);
    showWarnToast("El operador ha sido eliminado");
  }, []);

  return {
    handleDeleteOperator: handleDeleteOperator,
  };
}
