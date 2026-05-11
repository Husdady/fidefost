/**
 * Creates road map file object
 * @param {File} file Uploaded file
 * @returns {object}
 */
export default function createRoadMapFile(file) {
  return {
    date: new Date(),
    fileName: file.name,
    fileSize: file.size,
    _id: crypto.randomUUID(),
    lastModified: new Date(file.lastModified),
  };
}
