// Librarys
import JSZip from "jszip";
import { useCallback, useState } from "react";

// Database
import getDocumentsByRelation from "database/getDocumentsByRelation";

/**
 * Download file from url and convert it to Blob
 * @param {string} url
 * @returns {Promise<Blob>}
 */
async function getBlobFromUrl(url) {
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error("Failed to download document");
  }

  return response.blob();
}

/**
 * Convert base64 string to Blob
 * @param {string} base64
 * @param {string} mimeType
 * @returns {Blob}
 */
function base64ToBlob(base64, mimeType = "application/octet-stream") {
  const cleanedBase64 = base64.includes(",") ? base64.split(",")[1] : base64;
  const byteCharacters = atob(cleanedBase64);
  const byteNumbers = new Array(byteCharacters.length);

  for (let index = 0; index < byteCharacters.length; index += 1) {
    byteNumbers[index] = byteCharacters.charCodeAt(index);
  }

  const byteArray = new Uint8Array(byteNumbers);

  return new Blob([byteArray], { type: mimeType });
}

/**
 * Get file extension from mime type
 * @param {string} mimeType
 * @returns {string}
 */
function getExtensionFromMimeType(mimeType = "") {
  const normalizedMimeType = mimeType.toLowerCase();

  if (normalizedMimeType.includes("pdf")) return "pdf";
  if (normalizedMimeType.includes("png")) return "png";
  if (normalizedMimeType.includes("jpeg")) return "jpg";
  if (normalizedMimeType.includes("jpg")) return "jpg";

  return "file";
}

/**
 * Create safe folder/file name
 * @param {string} value
 * @returns {string}
 */
function createSafeFileName(value = "") {
  return String(value || "")
    .trim()
    .replace(/[\\/:*?"<>|]/g, "-");
}

/**
 * Resolve file blob and filename from document object
 * @param {object} document
 * @param {number} index
 * @returns {Promise<{ blob: Blob, fileName: string }>}
 */
async function resolveDocumentFile(document, index) {
  const fileName =
    document?.name || document?.fileName || `document-${index + 1}`;

  // Get file
  const file = document?.file?.file;

  // File object
  if (file instanceof File || file instanceof Blob) {
    return {
      blob: file,
      fileName: fileName,
    };
  }

  throw new Error("Document format is not supported");
}

/**
 * Hook for download operator documents
 */
export default function useDownloadDocuments() {
  const [isDownloadingDocuments, setIsDownloadingDocuments] = useState(false);

  const handleDownloadDocuments = useCallback(async (operator) => {
    // Validate operator
    if (!operator?._id) return;

    try {
      setIsDownloadingDocuments(true);

      const documents = await getDocumentsByRelation(
        "operators",
        operator?._id
      );

      const validDocuments = Array.isArray(documents) ? documents : [];

      if (!validDocuments.length) {
        return;
      }

      const zip = new JSZip();
      const folderName = createSafeFileName(
        operator?.operatorName || `operator-${operator?._id}`
      );
      const folder = zip.folder(folderName);

      await Promise.all(
        validDocuments.map(async (document, index) => {
          const { blob, fileName } = await resolveDocumentFile(document, index);

          folder.file(fileName, blob);
        })
      );

      const zipBlob = await zip.generateAsync({ type: "blob" });
      const downloadUrl = URL.createObjectURL(zipBlob);

      const link = document.createElement("a");
      link.href = downloadUrl;
      link.download = `${folderName}-documents.zip`;
      document.body.appendChild(link);
      link.click();
      link.remove();

      URL.revokeObjectURL(downloadUrl);
    } catch (error) {
      console.error("Error downloading operator documents:", error);
    } finally {
      setIsDownloadingDocuments(false);
    }
  }, []);

  return {
    isDownloadingDocuments,
    handleDownloadDocuments,
  };
}
