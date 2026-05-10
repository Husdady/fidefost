// Components
import FileUploadIcon from "components/icons/file-upload-icon";
import AddButton from "components/features/PageHeader/AddButton";

// Hooks
import useUploadFiles from "../hooks/useUploadFiles";

// Constants
import { acceptedFiles } from "../constants";

export default function UploadRoadMapButton() {
  const { fileInputRef, handleFilesChange } = useUploadFiles();

  return (
    <>
      <input
        type="file"
        className="d-none"
        accept={acceptedFiles}
        onChange={handleFilesChange}
        ref={fileInputRef}
      />

      <AddButton
        icon={<FileUploadIcon />}
        title="CARGAR HOJA DE RUTA"
        className="btn-load-roadmap"
        onClick={() => fileInputRef.current?.click()}
      />
    </>
  );
}
