// Hooks
import { useRef } from "react";
import { useAddServices } from "context/services/useServices";

// Utils
import isValidFile from "../utils/isValidFile";
import saveDocument from "database/saveDocument";
import createRoadMapFile from "../utils/createRoadMapFile";

/**
 * Hook for upload Road Maps files
 */

export default function useUploadFiles() {
  const fileInputRef = useRef(null);
  const addServices = useAddServices();

  /**
   * Handles uploaded files
   * @param {FileList|File[]} files Uploaded files
   */
  const handleFiles = async (files) => {

  const validFiles =
    Array.from(files || []).filter(isValidFile);

  if (!validFiles.length) return;

  const services = [];

  for (const file of files) {

    const serviceId =
      crypto.randomUUID();

    const item = {
      ...createRoadMapFile(file),
      _id: serviceId,
    };

    console.log("ITEM:", item);

    services.push(item);

    await saveDocument({
      file: file,
      relatedId: serviceId,
      category: "road-maps",
      module: "services",
    });
  }

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
    fileInputRef: fileInputRef,

    handleDrop: handleDrop,
    handleDragOver: handleDragOver,
    handleFilesChange: handleFilesChange,
  };
}
