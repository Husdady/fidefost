// Hooks
import { useRef } from "react";
import { useAddServices } from "context/services/useServices";

// Utils
import { showInfoToast } from "utils/toast";

import generateId from "utils/generateId";
import isValidFile from "../utils/isValidFile";
import saveDocument from "database/saveDocument";
import createRoadMapFile from "../utils/createRoadMapFile";

/**
 * Hook for upload Road Maps files
 * @param {object} params Params
 */
export default function useUploadFiles(params) {
  const fileInputRef = useRef(null);
  const addServices = useAddServices();

  /**
   * Handles uploaded files
   * @param {FileList|File[]} files Uploaded files
   */
  const handleFiles = async (files) => {
    const validFiles = Array.from(files || []).filter(isValidFile);

    console.log({ validFiles })

    if (!validFiles.length) return;

    const services = [];

    for (const file of validFiles) {
      const serviceId = generateId();

      const item = {
        ...createRoadMapFile(file),
        _id: serviceId,
      };

      services.push(item);

      await saveDocument({
        file: file,
        relatedId: serviceId,
        category: "road-maps",
        module: "services",
      });
    }

    addServices(services);

    const totalServices = services?.length;
    const hasMultipleServices = totalServices > 1;
    const s = hasMultipleServices ? "s" : "";

    const defaultMessage = `Se ${
      hasMultipleServices ? "añadieron" : "añadió"
    } ${totalServices} hoja${s} de ruta${s}`;

    showInfoToast(params?.message ?? defaultMessage);
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
