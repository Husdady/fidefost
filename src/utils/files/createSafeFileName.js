/**
 * Create safe folder/file name
 * @param {string} value
 * @returns {string}
 */
export default function createSafeFileName(value = "") {
  return String(value || "")
    .trim()
    .replace(/[\\/:*?"<>|]/g, "-");
}
