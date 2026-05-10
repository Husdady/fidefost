// Constants
const allowedExtensions = [".csv", ".xlsx"];

const allowedTypes = [
  "text/csv",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
];

/**
 * Validates if the uploaded file is allowed
 * @param {File} file Uploaded file
 * @returns {boolean}
 */
export default function isValidFile(file) {
  const fileName = file?.name?.toLowerCase() || "";

  return (
    allowedTypes.includes(file?.type) ||
    allowedExtensions.some((extension) => fileName.endsWith(extension))
  );
}
