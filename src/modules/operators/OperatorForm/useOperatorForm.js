// Librarys
import { useEffect, useMemo, useRef, useState } from "react";
import { useForm } from "react-hook-form";

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
  const [dragActive, setDragActive] = useState(false);

  const initialValues = useMemo(
    () => ({
      operatorName: defaultValues?.operatorName || "",
      ruc: defaultValues?.ruc || "",
      files: normalizeFiles(defaultValues?.files || []),
    }),
    [defaultValues]
  );

  const {
    register,
    handleSubmit,
    setValue,
    setError,
    clearErrors,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: initialValues,
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

  const handleRemoveFile = (indexToRemove) => {
    const updatedFiles = selectedFiles.filter(
      (_, index) => index !== indexToRemove
    );

    setSelectedFiles(updatedFiles);

    if (updatedFiles.length <= 10) {
      clearErrors("files");
    }
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
  };
}
