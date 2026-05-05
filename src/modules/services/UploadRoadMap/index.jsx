// Librarys
import { useRef } from "react";

// Components
import RoadmapIcon from "./icons/roadmap-icon";

// Hooks
import useUploadRoadMap from "./useUploadRoadMap";

export default function UploadRoadMap() {
  const fileInputRef = useRef(null);

  const { handleFilesChange, handleDrop, handleDragOver } = useUploadRoadMap();

  return (
    <div
      className="upload-road-map d-flex flex-column align-items-center justify-content-center"
      onClick={() => fileInputRef.current?.click()}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
    >
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept=".csv,.xlsx"
        className="d-none"
        onChange={handleFilesChange}
      />

      <div className="upload-road-map-icon d-flex align-items-center justify-content-center">
        <RoadmapIcon />
      </div>

      <h5 className="upload-road-map-title mb-0">Carga de Hojas de Ruta</h5>

      <p className="upload-road-map-description mb-0">
        Arrastra tus archivos Excel (.xlsx, .csv) o haz clic para explorar
      </p>
    </div>
  );
}
