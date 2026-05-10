// Hooks
import { useMemo } from "react";
import { useGetServices } from "context/services/useServices";
import isValidArray from "utils/isValidArray";

const statuses = {
  pending: "pending",
  processed: "processed",
  error: "error",
};

function getTimeAgo(date) {
  if (!date) return "-";

  const now = new Date();
  const serviceDate = new Date(date);
  const diffMs = now - serviceDate;

  const minutes = Math.floor(diffMs / 1000 / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (minutes < 1) return "Hace unos segundos";
  if (minutes === 1) return "Hace 1 minuto";
  if (minutes < 60) return `Hace ${minutes} minutos`;

  if (hours === 1) return "Hace 1 hora";
  if (hours < 24) return `Hace ${hours} horas`;

  if (days === 1) return "Hace 1 día";

  return `Hace ${days} días`;
}

function getStatusClass(status) {
  return statuses[status] || "pending";
}

export default function RecentActivity() {
  const services = useGetServices();

  const recentServices = useMemo(
    () =>
      [...services]
        .sort((a, b) => new Date(b?.date) - new Date(a?.date))
        .slice(0, 5),
    [services]
  );

  return (
    <section className="recent-activity">
      <header className="recent-activity-header d-flex align-items-center">
        <svg
          width="11"
          height="11"
          fill="none"
          viewBox="0 0 11 11"
          className="activity-icon"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fill="#171C1F"
            d="M5.25 10.5C3.90833 10.5 2.73924 10.0552 1.74271 9.16562C0.746181 8.27604 0.175 7.16528 0.0291667 5.83333H1.225C1.36111 6.84444 1.81076 7.68056 2.57396 8.34167C3.33715 9.00278 4.22917 9.33333 5.25 9.33333C6.3875 9.33333 7.35243 8.93715 8.14479 8.14479C8.93715 7.35243 9.33333 6.3875 9.33333 5.25C9.33333 4.1125 8.93715 3.14757 8.14479 2.35521C7.35243 1.56285 6.3875 1.16667 5.25 1.16667C4.57917 1.16667 3.95208 1.32222 3.36875 1.63333C2.78542 1.94444 2.29444 2.37222 1.89583 2.91667H3.5V4.08333H0V0.583333H1.16667V1.95417C1.6625 1.33194 2.26771 0.850694 2.98229 0.510417C3.69688 0.170139 4.45278 0 5.25 0C5.97917 0 6.66215 0.138542 7.29896 0.415625C7.93576 0.692708 8.48993 1.06701 8.96146 1.53854C9.43299 2.01007 9.80729 2.56424 10.0844 3.20104C10.3615 3.83785 10.5 4.52083 10.5 5.25C10.5 5.97917 10.3615 6.66215 10.0844 7.29896C9.80729 7.93576 9.43299 8.48993 8.96146 8.96146C8.48993 9.43299 7.93576 9.80729 7.29896 10.0844C6.66215 10.3615 5.97917 10.5 5.25 10.5ZM6.88333 7.7L4.66667 5.48333V2.33333H5.83333V5.01667L7.7 6.88333L6.88333 7.7Z"
          />
        </svg>

        <h2 className="recent-activity-title mb-0">Actividad Reciente</h2>
      </header>

      <div className="recent-activity-list d-flex flex-column">
        {!isValidArray(recentServices) && (
          <p className="empty-message small text-center">
            No hay actividad reciente registrada para visualizarla....
          </p>
        )}

        {recentServices.map((service) => (
          <article
            key={service?._id}
            className="recent-activity-item d-flex align-items-start"
          >
            <span
              className={`recent-activity-dot ${getStatusClass(
                service?.status
              )}`}
            />

            <div>
              <h3 className="recent-activity-name mb-0 text-break">
                {service?.fileName || "Archivo sin nombre"} añadido exitosamente
              </h3>

              <p className="recent-activity-time mb-0 text-break">
                {getTimeAgo(service?.date)}
              </p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
