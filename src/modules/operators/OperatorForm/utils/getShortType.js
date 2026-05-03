/**
 * Returns a short file type based on File.type (MIME)
 * @param {string} type - File.type (MIME type)
 * @returns {string}
 */
export default function getShortType(type) {
  if (!type) return "";

  const normalizedType = type.toLowerCase();

  if (normalizedType === "application/pdf") return "PDF";

  if (
    normalizedType === "application/msword"
  ) return "DOC";

  if (
    normalizedType ===
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
  ) return "DOC";

  return "???";
}