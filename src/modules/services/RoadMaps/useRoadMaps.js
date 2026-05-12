// Hooks
import { useCallback } from "react";
import { useGetServices, useDeleteService } from "context/services/useServices";

// Database
import deleteDocument from "database/deleteDocument";
import getDocumentsByRelation from "database/getDocumentsByRelation";

// Utils
import isValidString from "utils/isValidString";

/**
 * Hook for RoadMaps component logic
 */
export default function useRoadMaps() {
  const services = useGetServices();
  const deleteService = useDeleteService();

  const pendingText =
    services.length === 1
      ? "1 Archivo subido"
      : `${services.length} Archivos subidos`;

  // Callback for delete service by id
  const handleDeleteService = useCallback(async (serviceId) => {
    if (!serviceId) return;

    deleteService(serviceId);

    const documents = await getDocumentsByRelation("services", serviceId);

    // Get document id
    const documentId = documents?.[0]?.id;

    if (!documentId) return;
    deleteDocument(documentId);
  }, []);

  // Callback for download file
  const handleDownloadFile = useCallback(async (serviceId) => {
    try {

      if (!isValidString(serviceId)) {
        throw new Error("Invalid service id");
      }
console.log("SERVICE ID:", serviceId);
      // Get documents by service id
      const documents = await getDocumentsByRelation("services", serviceId);
console.log("DOCUMENTS:", documents);
      const document = documents?.[0];

      if (!document) {
        throw new Error("No file found for this service");
      }

      // Get blob file from document
      const blob = document.blob;

      const downloadUrl =
        URL.createObjectURL(blob);

      const link =
        window.document.createElement("a");

      link.href = downloadUrl;

      link.download =
        document.name || "service-file";

      window.document.body.appendChild(link);

      link.click();
      link.remove();

      URL.revokeObjectURL(downloadUrl);
    } catch (error) {
      console.error("Error to download service file", { error });
    }
  }, []);

  return {
    services: services,
    pendingText: pendingText,
    handleDownloadFile: handleDownloadFile,
    handleDeleteService: handleDeleteService,
  };
}
