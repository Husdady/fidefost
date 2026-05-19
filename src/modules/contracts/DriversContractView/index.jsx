import { createPortal } from "react-dom";
import useGpsContractsStore from "context/contracts/gpsContractsStore";
import DriverIcon from "./Icons/driver-icon";
import UnitIcon from "./Icons/unit-icon";
import GpsIcon from "./Icons/gps-icon";
import WifiIcon from "./Icons/wifi-icon";
import DateIcon from "./Icons/date-icon";

export default function DriverContractView({
  contractData,
  onHide, 
  onDelete,
}) {
   
  const millisecondsPerDay = 1000 * 60 * 60 * 24;

// HOY SIN HORAS
const today = new Date();
today.setHours(0, 0, 0, 0);

// FECHA VENCIMIENTO SIN HORAS
const expirationDate = contractData.auditLicenseExpiration
  ? new Date(contractData.auditLicenseExpiration + "T00:00:00")
  : null;

if (expirationDate) {
  expirationDate.setHours(0, 0, 0, 0);
}

const diffDays = expirationDate
  ? Math.floor(
      (expirationDate.getTime() - today.getTime()) /
      millisecondsPerDay
    )
  : null;

  // estado visual
  let licenseStatusClass = "active";
  let licenseTextStatus = "VIGENTE";

  if (diffDays < 0) {
    licenseStatusClass = "expired";
    licenseTextStatus = "VENCIDA";
  } else if (diffDays < 60) {
    licenseStatusClass = "warning";
    licenseTextStatus = "PROX. VENCER";
  }

  const fullExpirationDate = expirationDate
  ? expirationDate.toLocaleDateString("es-PE")
  : "";

  const [placa, marca] = (contractData.auditUnidad || "").split("-");
  
  if (!contractData) return null;
  const gpsContracts =
  useGpsContractsStore(
    (state) => state.gpsContracts
  );
  const selectedGps =
  gpsContracts.find(
    (gps) =>
      gps.id === contractData.gpsId
  );


  const isLicenseExpired =
  contractData.auditLicenseExpiration &&
  new Date(contractData.auditLicenseExpiration) < new Date();
  
  
 

  return createPortal(
    <div className="modal" onClick={onHide}>
      <div
        className="contract-view-modal"
        onClick={(e) => e.stopPropagation()}
      >
        {/* cerrar */}
        <button
          className="contract-view-close"
          onClick={onHide}
        >
          ✕
        </button>

        {/* HEADER */}
        <div className="contract-view-header">
           <DriverIcon />

          <div>
            <p className="contract-view-label">
              CONDUCTOR TITULAR / POR TEMPORADA
            </p>

            <h2>{contractData.auditDriver}</h2>

            <div className="contract-view-tags">
              <span className={`license-status ${licenseStatusClass}`}>
                Lic-{contractData.auditLicense || "-"}{" "}
                
                {expirationDate && (
                  <>
                    ({licenseTextStatus} {fullExpirationDate})
                  </>
                )}
              </span>

              <span>INDUCCION:{" "}{contractData.auditInductions}</span>
            </div>
          </div>

        </div>

        {/* INFO */}
        <div className="contract-view-grid">

          <div>
            <p className="contract-view-label">
              UNIDAD ASIGNADA
            </p>

            <div className="contract-unit">
              <div className="contract-unit__icon">
                <UnitIcon />
              </div>

              <div className="contract-unit__info">
                <h3>{placa}</h3>
                <p>{marca}</p>
              </div>
            </div>

          </div>

          <div>
            <p className="contract-view-label">
              PERIODO ASIGNACIÓN
            </p>
        
            <div className="contract-dates">
              <div className="contract-dates__icon">
                <DateIcon />
              </div>

              <div className="contract-dates__content">
                <p>{contractData.auditContract?.start}</p>
                <p>{contractData.auditContract?.end}</p>
              </div>
            </div>
  
            <small>
              Activo por {contractData.auditContract?.days} días
            </small>
          </div>

        </div>

        {/* SERVICIOS */}
        <div className="contract-view-services">

          <div>
            <p className="contract-view-label">
              TELEMETRIA
            </p>
            <div className="contract-view-status">

                {contractData.wifi && (
                  <span>
                    WIFI <WifiIcon/>
                  </span>
                )}

                {contractData.gps && (
                  <span>
                    GPS <GpsIcon/>
                  </span>
                )}

            </div>

          </div>

        </div>

        {/* MAP */}
        <div className="contract-view-map">
            {selectedGps?.gpsLink ? (
              <a
                href={selectedGps.gpsLink}
                target="_blank"
                rel="noreferrer"
              >
                Abrir Sistema GPS
              </a>
            ) : (
              "Sin link GPS"
            )}
        </div>

        {/* ACTION */}
        <button className="contract-delete-btn"
                onClick={() => onDelete(contractData)}
        >
          Eliminar Contrato Conductor
        </button>

      </div>
    </div>,
    document.body
  );
}