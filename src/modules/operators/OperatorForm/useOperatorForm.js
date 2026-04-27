// Librarys
import { yupResolver } from "@hookform/resolvers/yup";

// Hooks
import { useForm } from "react-hook-form";
import { useRef, useMemo, useState, useEffect } from "react";
import { useUpdateClient } from "context/clients/useClients";

import useTriggerForm from "hooks/useTriggerForm";
import useDisabledSubmitButton from "./hooks/useDisabledSubmitButton";

// Database
import { deleteDocument } from "database/deleteDocument";

// Utils
import generateId from "utils/generateId";
import isValidString from "utils/isValidString";
import getDocumentsByRelation from "database/getDocumentsByRelation";

// Constants
import schema from "./schema";

// Utils
function formatFileSize(size) {
  if (!Number.isFinite(size) || size <= 0) return "0 B";

  const units = ["B", "KB", "MB", "GB"];
  const index = Math.min(
    Math.floor(Math.log(size) / Math.log(1024)),
    units.length - 1
  );
  const value = size / 1024 ** index;

  return `${value.toFixed(value >= 10 || index === 0 ? 0 : 1)} ${units[index]}`;
}

function normalizeFiles(files = []) {
  return files.map((file) => ({
    ...file,
    file: file,
    name: file?.name,
    size: file?.size,
    type: file?.type,
    _id: file?._id || generateId(),
    lastModified: file?.lastModified,
    formattedSize: file?.formattedSize || formatFileSize(file?.size || 0),
  }));
}

function filterValidFiles(files = []) {
  const validExtensions = [".pdf", ".jpg", ".jpeg", ".png"];

  return files.filter((file) => {
    const lowerName = file?.name?.toLowerCase?.() || "";
    return validExtensions.some((ext) => lowerName.endsWith(ext));
  });
}

/**
 * Hook for implements logic of OperatorForm component
 */
export default function useOperatorForm({ defaultValues, onSubmit }) {
  const fileInputRef = useRef(null);

  const [selectedFiles, setSelectedFiles] = useState(
    normalizeFiles(defaultValues?.files || [])
  );

  const updateClient = useUpdateClient();
  const [dragActive, setDragActive] = useState(false);

  const initialValues = useMemo(
    () => ({
      _id: defaultValues?._id || "",
      ruc: defaultValues?.ruc || "",
      status: defaultValues?.status || "",
      operatorName: defaultValues?.operatorName || "",
      files: normalizeFiles(defaultValues?.files || []),
    }),
    [defaultValues]
  );

  const {
    watch,
    trigger,
    register,
    handleSubmit,
    setValue,
    setError,
    clearErrors,
    reset,
    formState: { errors },
  } = useForm({
    mode: "all",
    defaultValues: initialValues,
    resolver: yupResolver(schema),
  });

  // Get operator id
  const operatorId = watch("_id");

  const isDisabledSubmitButton = useDisabledSubmitButton({
    watch: watch,
    errors: errors,
  });

  useEffect(() => {
    reset(initialValues);
    setSelectedFiles(normalizeFiles(defaultValues?.files || []));
  }, [defaultValues, initialValues, reset]);

  useEffect(() => {
    register("files", {
      validate: (value) => {
        const files = Array.isArray(value) ? value : [];

        if (!files.length) {
          return "Debe adjuntar al menos un archivo";
        }

        if (files.length > 10) {
          return "Solo puede seleccionar un máximo de 10 archivos";
        }

        return true;
      },
    });
  }, [register]);

  useEffect(() => {
    setValue("files", selectedFiles, { shouldValidate: true });
  }, [selectedFiles, setValue]);

  const addFiles = (incomingFiles = []) => {
    const validFiles = filterValidFiles(incomingFiles).map((file) => ({
      ...file,
      file: file,
      name: file?.name,
      size: file?.size,
      type: file?.type,
      _id: generateId(),
      lastModified: file?.lastModified,
      formattedSize: formatFileSize(file.size),
    }));

    if (!validFiles.length) return;

    const currentFiles = Array.isArray(selectedFiles) ? selectedFiles : [];
    const mergedFiles = [...currentFiles, ...validFiles];
    const limitedFiles = mergedFiles.slice(0, 10);

    if (mergedFiles.length > 10) {
      setError("files", {
        type: "manual",
        message: "Solo puede seleccionar un máximo de 10 archivos",
      });
    } else {
      clearErrors("files");
    }

    setSelectedFiles(limitedFiles);
  };

  const handleFilesChange = (event) => {
    const files = Array.from(event?.target?.files || []);
    addFiles(files);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleRemoveFile = async (file, indexToRemove) => {
    const updatedFiles = selectedFiles.filter(
      (_, index) => index !== indexToRemove
    );

    if (updatedFiles.length <= 0) {
      setError("files", {
        type: "manual",
        message: "Debes subir por lo menos 1 documento legal",
      });
    }

    setSelectedFiles(updatedFiles);

    if (isValidString(operatorId)) {
      const documents = await getDocumentsByRelation("operators", operatorId);

      const filteredDocument = documents.find((item) => item?.id === file?._id);

      updateClient(operatorId, {
        files: updatedFiles,
      });

      if (filteredDocument?.id) {
        await deleteDocument(filteredDocument?.id);
      }
    }

    if (updatedFiles.length <= 0 || updatedFiles.length > 10) return;
    clearErrors("files");
  };

  const handleOpenFileDialog = () => {
    fileInputRef?.current?.click?.();
  };

  const handleDragEnter = (event) => {
    event.preventDefault();
    event.stopPropagation();
    setDragActive(true);
  };

  const handleDragLeave = (event) => {
    event.preventDefault();
    event.stopPropagation();
    setDragActive(false);
  };

  const handleDragOver = (event) => {
    event.preventDefault();
    event.stopPropagation();
  };

  const handleDrop = (event) => {
    event.preventDefault();
    event.stopPropagation();

    setDragActive(false);

    const files = Array.from(event?.dataTransfer?.files || []);
    addFiles(files);
  };

  const internalSubmit = (values) => {
    onSubmit({
      ...values,
      files: selectedFiles,
    });
  };

  useTriggerForm({ trigger });

  return {
    register,
    errors,
    selectedFiles,
    handleSubmit,
    internalSubmit,
    handleFilesChange,
    handleRemoveFile,
    fileInputRef,
    handleOpenFileDialog,
    dragActive,
    handleDragEnter,
    handleDragLeave,
    handleDragOver,
    handleDrop,
    watchedFilesCount: selectedFiles.length,
    isDisabledSubmitButton: isDisabledSubmitButton,
  };
}
