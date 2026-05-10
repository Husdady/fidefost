import { createPortal } from "react-dom";

import DriverIcon from "./Icons/driver-icon";

export default function DriverContractView({
  contractData,
  onHide, 
  onDelete,
}) {
  
  if (!contractData) return null;

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
              <span>  Lic-{contractData.auditLicense || "-"}

                      {contractData.auditLicenseExpiration && (
                        <>
                          {" "}
                          (Vence{" "}
                          {new Date(
                            contractData.auditLicenseExpiration
                          ).getFullYear()}
                          )
                        </>
                      )}
              </span>
              <span>{contractData.auditInductionStatus}</span>
            </div>
          </div>

        </div>

        {/* INFO */}
        <div className="contract-view-grid">

          <div>
            <p className="contract-view-label">
              UNIDAD ASIGNADA
            </p>

            <h3>Volvo FH16 - PLACA: V6X-992</h3>

            <small>Modelo 2023</small>
          </div>

          <div>
            <p className="contract-view-label">
              PERIODO ASIGNACIÓN
            </p>

            <h3>
              {contractData.auditContract?.start}
              {" - "}
              {contractData.auditContract?.end}
            </h3>

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
                    WIFI ✅
                  </span>
                )}

                {contractData.gps && (
                  <span>
                    GPS ✅
                  </span>
                )}

            </div>

          </div>

        </div>

        {/* MAP */}
        <div className="contract-view-map">
          Ubicación Actual: Km 124 Panamericana Sur
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