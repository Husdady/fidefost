// Hooks
import { useCallback } from "react";

// Store
import { useDeleteClient } from "context/clients/useClients";

/**
 * Hook for delete operator information
 */
export default function useDeleteOperator() {
  const deleteClient = useDeleteClient();

  // Callback for delete operator
  const handleDeleteOperator = useCallback((operator) => {
    deleteClient(operator?._id);
  }, []);

  return {
    handleDeleteOperator: handleDeleteOperator,
  };
}
