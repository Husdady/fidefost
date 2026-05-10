// Components
import RoadmapIcon from "./icons/roadmap-icon";

// Hooks
import useUploadFiles from "../hooks/useUploadFiles";

// Constants
import { acceptedFiles } from "../constants";

export default function UploadRoadMap() {
  const { fileInputRef, handleDrop, handleDragOver, handleFilesChange } =
    useUploadFiles();

  return (
    <div
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onClick={() => fileInputRef.current?.click()}
      className="upload-road-map d-flex flex-column align-items-center justify-content-center"
    >
      <input
        multiple
        type="file"
        className="d-none"
        onChange={handleFilesChange}
        accept={acceptedFiles}
        ref={fileInputRef}
      />

      <div className="upload-road-map-icon w-100 h-100 mb-3 d-flex align-items-center justify-content-center">
        <RoadmapIcon />
      </div>

      <h5 className="upload-road-map-title mb-0">Carga de Hojas de Ruta</h5>

      <p className="upload-road-map-description mb-0">
        Arrastra tus archivos Excel (.xlsx, .csv) o haz clic para explorar
      </p>
    </div>
  );
}
