// RoadMaps/index.jsx
import "./styles.scss";

// Hooks
import { useGetServices } from "context/services/useServices";

export default function RoadMaps() {
  const services = useGetServices();

  const pendingFiles = services.filter(
    (service) => service?.status === "pending"
  );

  const pendingText =
    pendingFiles.length === 1
      ? "1 Archivo pendiente"
      : `${pendingFiles.length} Archivos pendientes`;

  const formatDate = (date) => {
    if (!date) return "-";

    return new Intl.DateTimeFormat("en", {
      month: "short",
      day: "2-digit",
      year: "numeric",
    }).format(new Date(date));
  };

  const formatSize = (size) => {
    if (!size) return "-";

    return `${(size / 1024 / 1024).toFixed(1)} MB`;
  };

  const getStatusLabel = (status) => {
    const statuses = {
      pending: "Pendiente",
      processed: "Procesado",
      error: "Error",
    };

    return statuses[status] || "Pendiente";
  };

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
        <div className="road-maps-row road-maps-row-head d-flex align-items-center">
          <div className="road-maps-cell road-maps-file">
            Nombre del archivo
          </div>
          <div className="road-maps-cell road-maps-date">Fecha</div>
          <div className="road-maps-cell road-maps-size">Tamaño</div>
          <div className="road-maps-cell road-maps-status text-center">Estado</div>
        </div>

        {services.map((service) => (
          <div
            key={service?._id}
            className="road-maps-row road-maps-row-body d-flex align-items-center"
          >
            <div className="road-maps-cell road-maps-file d-flex align-items-center">
              <div className={`road-maps-icon ${service?.status}`}>
                <span>▤</span>
              </div>

              <strong className="service-name text-break">{service?.fileName}</strong>
            </div>

            <div className="road-maps-cell road-maps-date">
              {formatDate(service?.date)}
            </div>

            <div className="road-maps-cell road-maps-size">
              {formatSize(service?.fileSize)}
            </div>

            <div className="road-maps-cell road-maps-status">
              <span className={`road-maps-status-tag ${service?.status}`}>
                {getStatusLabel(service?.status)}
              </span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
