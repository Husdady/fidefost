// Hooks
import { useRef } from "react";
import {
  useAddServices,
  useGetServices,
} from "context/services/useServices";

// Utils
import { showInfoToast, showErrorToast } from "utils/toast";

import generateId from "utils/generateId";
import isValidFile from "../utils/isValidFile";
import saveDocument from "database/saveDocument";
import createRoadMapFile from "../utils/createRoadMapFile";
import { getRoadMapStats } from "../utils/getRoadMapStats";

//limites de carga
const MAX_FILES = 12;
const MAX_FILE_SIZE_MB = 10;
/**
 * Hook for upload Road Maps files
 * @param {object} params Params
 */
export default function useUploadFiles(params) {
  const fileInputRef = useRef(null);
  const addServices = useAddServices();
  const currentServices = useGetServices();

  /**
   * Handles uploaded files
   * @param {FileList|File[]} files Uploaded files
   */
  const handleFiles = async (files) => {
    const uploadedFiles = Array.from(files || []);

    if (currentServices.length + uploadedFiles.length > MAX_FILES) {
      showErrorToast(
      `Solo puedes tener hasta ${MAX_FILES} archivos subidos.`
    );

      return;
    }

    const validFiles = uploadedFiles.filter((file) => {
      const sizeInMb =
        file.size / (1024 * 1024);

      if (sizeInMb > MAX_FILE_SIZE_MB) {
        showErrorToast(
          `${file.name} supera los ${MAX_FILE_SIZE_MB} MB permitidos.`
        );

        return false;
      }

      if (!isValidFile(file)) {
        showErrorToast(
          `${file.name} no es un archivo Excel o CSV válido.`
        );

        return false;
      }

      return true;
    });

    if (!validFiles.length) return;

    const services = [];

    for (const file of validFiles) {
      const serviceId = generateId();

      const item = {
        ...createRoadMapFile(file),
        _id: serviceId,
      };

      let stats;

      try {
        stats = await getRoadMapStats(file);
      } catch (error) {
        console.error("Error reading road map Excel:", error);

        showErrorToast(
          `No se pudo leer el archivo ${file.name}. Verifica que sea un Excel válido.`
        );

        continue;
      }

      if (stats.invalidHeadersDetected) {
        showInfoToast(
          `El archivo ${file.name} tiene columnas no reconocidas. Algunas columnas del reporte pueden quedar vacías.`
        );
      }

      // Add service
      services.push({ ...item, ...stats });

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
