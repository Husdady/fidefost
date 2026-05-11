/**
 * Callback for format file size
 * @param {number} size Size
 * @returns {string} Formatted file size
 */
export default function formatFileSize(size) {
  const bytes = Number(size);

  if (!bytes) return "-";

  if (bytes < 1024) {
    return `${bytes} B`;
  }

  if (bytes < 1024 * 1024) {
    return `${(bytes / 1024).toFixed(1)} KB`;
  }

  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}
