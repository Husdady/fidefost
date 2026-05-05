// Hooks
import { useAddServices } from "context/services/useServices";

const allowedTypes = [
  "text/csv",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
];

/**
 * Hook for implements UploadRoadMap logic
 */
export default function useUploadRoadMap() {
  const addServices = useAddServices();

  /**
   * Validates if the uploaded file is allowed
   * @param {File} file Uploaded file
   * @returns {boolean}
   */
  const isValidFile = (file) => {
    const allowedExtensions = [".csv", ".xlsx"];
    const fileName = file?.name?.toLowerCase() || "";

    return (
      allowedTypes.includes(file?.type) ||
      allowedExtensions.some((extension) => fileName.endsWith(extension))
    );
  };

  /**
   * Creates road map file object
   * @param {File} file Uploaded file
   * @returns {object}
   */
  const createRoadMapFile = (file) => ({
    _id: crypto.randomUUID(),
    fileName: file.name,
    fileSize: file.size,
    date: new Date(file.lastModified),
    status: "pending",
  });

  /**
   * Handles uploaded files
   * @param {FileList|File[]} files Uploaded files
   */
  const handleFiles = (files) => {
    const validFiles = Array.from(files || []).filter(isValidFile);

    if (!validFiles.length) return;

    const services = validFiles.map(createRoadMapFile);

    addServices(services);
  };

  /**
   * Handles input file change
   * @param {Event} event Input event
   */
  const handleFilesChange = (event) => {
    handleFiles(event.target.files);

    event.target.value = "";
  };

  /**
   * Handles file drop
   * @param {DragEvent} event Drop event
   */
  const handleDrop = (event) => {
    event.preventDefault();

    handleFiles(event.dataTransfer.files);
  };

  /**
   * Allows drag over dropzone
   * @param {DragEvent} event Drag event
   */
  const handleDragOver = (event) => {
    event.preventDefault();
  };

  return {
    handleDrop,
    handleDragOver,
    handleFilesChange,
  };
}
