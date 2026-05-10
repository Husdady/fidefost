/**
 * Resolve file blob and filename from document object
 * @param {object} document
 * @param {number} index
 * @returns {Promise<{ blob: Blob, fileName: string }>}
 */
export default async function resolveDocumentFile(document, index) {
  const fileName =
    document?.name || document?.fileName || `document-${index + 1}`;

  // Get file
  const file = document?.file ?? document?.file?.file;

  // File object
  if (file instanceof File || file instanceof Blob) {
    return {
      blob: file,
      fileName: fileName,
    };
  }

  throw new Error("Document format is not supported");
}
