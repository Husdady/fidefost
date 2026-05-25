// Librarys
import JSZip from "jszip";

// Hooks
import { useState, useCallback } from "react";

// Database
import getDocumentsByRelation from "database/getDocumentsByRelation";

// Utils
import { showWarnToast } from "utils/toast";
import createSafeFileName from "utils/files/createSafeFileName";
import resolveDocumentFile from "utils/files/resolveDocumentFile";

/**
 * Hook for download operator documents
 * @param {object} params Params
 */
export default function useDownloadDocuments({ setSelectedOperator }) {
  const [isDownloadingDocuments, setIsDownloadingDocuments] = useState(false);

  const handleDownloadDocuments = useCallback(async (operator) => {
    // Validate operator
    if (!operator?._id) return;

    setSelectedOperator(operator);

    try {
      setIsDownloadingDocuments(true);

      const documents = await getDocumentsByRelation(
        "operators",
        operator?._id
      );

      const validDocuments = Array.isArray(documents) ? documents : [];

      if (!validDocuments.length) {
        throw new Error("Invalid documents");
      }

      const zip = new JSZip();

      await Promise.allSettled(
        validDocuments.map(async (document, index) => {
          const { blob, fileName } = await resolveDocumentFile(document, index);

          zip.file(fileName, blob);
        })
      );

      const zipBlob = await zip.generateAsync({ type: "blob" });
      const downloadUrl = URL.createObjectURL(zipBlob);

      const link = document.createElement("a");

      const folderName = createSafeFileName(
        operator?.operatorName || `operator-${operator?._id}`
      );

      link.href = downloadUrl;
      link.download = `${folderName}-documents.zip`;

      document.body.appendChild(link);

      link.click();
      link.remove();

      URL.revokeObjectURL(downloadUrl);
    } catch (error) {
      console.error("Error downloading operator documents:", error);

      showWarnToast(
        "No es posible descargar los documentos de este operador, revisa los archivos subidos"
      );
    } finally {
      setIsDownloadingDocuments(false);
    }
  }, []);

  return {
    isDownloadingDocuments: isDownloadingDocuments,
    handleDownloadDocuments: handleDownloadDocuments,
  };
}
