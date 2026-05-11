// Components
import Button from "components/common/Button";
import FileIcon from "components/icons/file-icon";
import TrashIcon from "components/icons/trash-icon";

// Hooks
import useRoadMaps from "./useRoadMaps";

// Utils
import isValidArray from "utils/isValidArray";
import formatDate from "utils/format/formatDate";
import formatFileSize from "utils/format/formatFileSize";
import DownloadIcon from "components/icons/download-icon";

export default function RoadMaps() {
  const { services, pendingText, handleDownloadFile, handleDeleteService } =
    useRoadMaps();

  return (
    <section className="road-maps">
      <header className="road-maps-header d-flex align-items-center justify-content-between">
        <h5 className="road-maps-title mb-0">Archivos recientes</h5>

        <div className="road-maps-pending d-flex align-items-center">
          <span className="road-maps-pending-dot" />
          <span>{pendingText}</span>
        </div>
      </header>

      <div className="road-maps-table">
        <div className="road-maps-row road-maps-row-head d-flex align-items-center column-gap-4">
          <div className="road-maps-cell road-maps-file">
            Nombre del archivo
          </div>
          <div className="road-maps-cell road-maps-size">Tamaño</div>
          <div className="road-maps-cell road-maps-date">Fecha de subida</div>
          <div className="road-maps-cell road-maps-last-modified">
            Fecha de origen
          </div>
          <div className="road-maps-cell road-maps-actions">Acciones</div>
        </div>

        {!isValidArray(services) && (
          <div className="empty-message-box d-flex py-5 px-4 d-flex align-items-center justify-content-center">
            <p className="empty-message text-center m-0 small">
              Actualmente no hay archivos cargados para mostrar. Sube archivos
              CSV o Excel para visualizar y gestionar las hojas de ruta
              recientes....
            </p>
          </div>
        )}

        {services.map((service) => (
          <div
            key={service?._id}
            className="road-maps-row road-maps-row-body d-flex align-items-center column-gap-4"
          >
            <div className="road-maps-cell road-maps-file d-flex align-items-center">
              <div className="road-maps-icon d-flex align-items-center justify-content-center">
                <FileIcon />
              </div>

              <strong className="text-break">{service?.fileName}</strong>
            </div>

            <div className="road-maps-cell road-maps-size">
              {formatFileSize(service?.fileSize)}
            </div>

            <div className="road-maps-cell road-maps-date text-break">
              {formatDate(service?.date)}
            </div>

            <div className="road-maps-cell road-maps-last-modified text-break">
              {formatDate(service?.lastModified)}
            </div>

            <div className="road-maps-cell road-maps-actions d-flex align-items-center column-gap-2">
              <Button
                icon={<DownloadIcon />}
                aria-label="Descargar archivo"
                className="road-maps-download-file"
                titlePopup="Click to download this file"
                onClick={() => handleDownloadFile(service?._id)}
              />

              <Button
                icon={<TrashIcon />}
                className="road-maps-delete"
                aria-label="Eliminar archivo"
                titlePopup="Click to remove this file"
                onClick={() => handleDeleteService(service?._id)}
              />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
