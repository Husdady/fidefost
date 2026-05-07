import { createPortal } from "react-dom";

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

          <img
            src="https://i.pravatar.cc/100"
            alt="driver"
            className="contract-view-avatar"
          />

          <div>
            <p className="contract-view-label">
              CONDUCTOR TITULAR / POR TEMPORADA
            </p>

            <h2>{contractData.auditDriver}</h2>

            <div className="contract-view-tags">
              <span>Lic-A IIIB (Vence 2026)</span>
              <span>Inducción OK</span>
              <span className="cert">CERTIFICADO</span>
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
              SERVICIOS DE UNIDAD
            </p>

            <h3>Telemetría Avanzada</h3>
          </div>

          <div className="contract-view-status">
            <span>📶 CONECTADO</span>
            <span>📍 GPS OK</span>
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