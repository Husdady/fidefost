// Librarys
import JSZip from "jszip";

// Hooks
import { useState, useCallback } from "react";
import { useGetServices } from "context/services/useServices";

// Database
import getDocumentsByRelation from "database/getDocumentsByRelation";

// Utils
import createValidArray from "utils/createValidArray";
import { showWarnToast } from "utils/toast";
/**
 * Hook for implements logic of ExportButton component
 */
export default function useExportButton() {
  const services = useGetServices();
  const [isExportingServices, setIsExportingServices] = useState(false);

  // Callback for export services files
  const handleExport = useCallback(async () => {
    try {
      setIsExportingServices(true);

      const promises = createValidArray(services).map((item) => {
        return getDocumentsByRelation("services", item?._id);
      });

      const promisesResolved = await Promise.allSettled(promises);

      const documents = promisesResolved.map((item) => item?.value).flat();

      if (!documents.length) {
        throw new Error("Invalid documents");
      }

      const zip = new JSZip();

      documents.forEach((document, index) => {
        if (document?.blob) {
          zip.file(`${index + 1}-${document.name}`, document.blob);
        }
      });

      const zipBlob = await zip.generateAsync({ type: "blob" });
      const downloadUrl = URL.createObjectURL(zipBlob);

      const link = document.createElement("a");

      link.href = downloadUrl;
      link.download = "road-maps.zip";

      document.body.appendChild(link);

      link.click();
      link.remove();

      URL.revokeObjectURL(downloadUrl);
    } catch (error) {
      console.error("Error downloading Road Map files:", error);
      showWarnToast("No hay hojas de rutas válidas para exportar");
    } finally {
      setIsExportingServices(false);
    }
  }, [services]);

  return {
    handleExport: handleExport,
    isExportingServices: isExportingServices,
  };
}
