// Hooks
import { useCallback, useState } from "react";
import useShowModal from "hooks/useShowModal";

// Store
import { useUpdateClient } from "context/clients/useClients";

// Database
import saveDocument from "database/saveDocument";
import getDocumentsByRelation from "database/getDocumentsByRelation";

// Utils
import generateId from "utils/generateId";

/**
 * Hook for edit operator information
 */
export default function useEditOperator() {
  const updateClient = useUpdateClient();
  const editOperatorForm = useShowModal();
  const [selectedOperator, setSelectedOperator] = useState({});
  const [isEditingOperator, setIsEditingOperator] = useState(false);

  /**
   * Callback for show edit operator form
   */
  const handleShowEditOperatorForm = useCallback(
    (operator) => {
      setSelectedOperator(operator || {});
      editOperatorForm.show();
    },
    [editOperatorForm.show]
  );

  /**
   * Callback for validate and normalize operator documents
   */
  const normalizeDocuments = useCallback(
    (documents) => {
      const currentDocuments = Array.isArray(selectedOperator?.documents)
        ? selectedOperator.documents
        : [];

      const formDocuments = Array.isArray(documents) ? documents : [];

      const validDocuments = formDocuments.filter((document) => {
        const isFile = document instanceof File;

        const isSavedDocument =
          document &&
          typeof document === "object" &&
          !isFile &&
          document?.name &&
          document?.size;

        return isFile || isSavedDocument;
      });

      /**
       * If the user does not upload or keep documents in the form,
       * preserve the current operator documents.
       */
      if (!validDocuments.length) return currentDocuments;

      return validDocuments.slice(0, 10);
    },
    [selectedOperator]
  );

  /**
   * Callback for edit operator information
   */
  const handleEditOperator = useCallback(
    async ({ _id, ruc, operatorName, files }) => {
      try {
        setIsEditingOperator(true);
        const validFiles = Array.isArray(files) ? files : [];
        const documents = await getDocumentsByRelation("operators", _id);

        // Build client files
        const clientFiles = validFiles.map((file) => ({
          file: file?.file,
          name: file?.name || "",
          size: file?.size || 0,
          type: file?.type || "",
          _id: file?._id || generateId(),
          lastModified: file?.lastModified
            ? new Date(file.lastModified)
            : new Date(),
          formattedSize: file?.formattedSize || "",
        }));

        // Build client object
        const updatedClient = {
          ruc: ruc || "",
          operatorName: operatorName || "",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          files: clientFiles,
        };

        // Filter client files
        const filteredFiles = validFiles.filter(
          (file) => !documents.some((item) => item?.id === file?._id)
        );

        // Save each file in database
        await Promise.all(
          filteredFiles.map((file) =>
            saveDocument({
              file: file,
              relatedId: _id,
              module: "operators",
              category: "legal-documents",
            })
          )
        );

        updateClient(_id, updatedClient);
        editOperatorForm.hide();
      } catch (error) {
        console.error("Error editing operator", error);
      } finally {
        setIsEditingOperator(false);
      }
    },
    [selectedOperator, normalizeDocuments, editOperatorForm.hide]
  );

  return {
    editOperatorForm: editOperatorForm,
    selectedOperator: selectedOperator,
    isEditingOperator: isEditingOperator,
    setSelectedOperator: setSelectedOperator,
    handleEditOperator: handleEditOperator,
    handleShowEditOperatorForm: handleShowEditOperatorForm,
  };
}
