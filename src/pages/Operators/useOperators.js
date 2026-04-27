// Hooks
import { useCallback } from "react";
import { useAddClient } from "context/clients/useClients";
import useShowModal from "hooks/useShowModal";

// Database
import saveDocument from "database/saveDocument";

// Utils
import generateId from "utils/generateId";

/**
 * Hook for operators actions
 */
export default function useOperators() {
  const addClient = useAddClient();
  const createOperatorModal = useShowModal();

  // Callback to create new operator
  const handleCreateOperator = useCallback(
    async ({ ruc, operatorName, files }) => {
      const validFiles = Array.isArray(files) ? files : [];

      // Build client files
      const clientFiles = validFiles.map((file) => ({
        name: file?.name || "",
        size: file?.size || 0,
        type: file?.type || "",
        file: file?.file || "",
        _id: file?._id || generateId(),
        lastModified: file?.lastModified
          ? new Date(file.lastModified)
          : new Date(),
        formattedSize: file?.formattedSize || "",
      }));

      // Build client object
      const newClient = {
        _id:
          typeof crypto !== "undefined" && crypto?.randomUUID
            ? crypto.randomUUID()
            : `${Date.now()}-${Math.random().toString(36).slice(2, 11)}`,
        ruc: ruc || "",
        status: "fine",
        operatorName: operatorName || "",
        createdAt: new Date().toISOString(),
        files: clientFiles,
      };

      // Save each file in database
      await Promise.all(
        validFiles.map((file) =>
          saveDocument({
            file: file,
            module: "operators",
            relatedId: newClient?._id,
            category: "legal-documents",
          })
        )
      );

      addClient(newClient);
      createOperatorModal.hide();

      return newClient;
    },
    [addClient, createOperatorModal.hide]
  );

  return {
    createOperatorModal: createOperatorModal,
    handleCreateOperator: handleCreateOperator,
  };
}
