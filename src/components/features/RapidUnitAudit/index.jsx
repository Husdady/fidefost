import { memo } from "react";
import PropTypes from "prop-types";
import { useEffect, useState } from "react";
// Utils
import classnames from "utils/classnames";
import exportAuditZip from "utils/exportAuditZip";

//icons
import EditIcon from "./icons/edit-icon";
import VisualIcon from "./icons/visual-icon";
import ExportIcon from "./icons/export-icon";

const formatMonthYear = (date) => {
  if (!date) return "";

  const months = [
    "Ene","Feb","Mar","Abr","May","Jun",
    "Jul","Ago","Sep","Oct","Nov","Dic"
  ];

  const [year, month] = date.split("-");
  return `${months[parseInt(month) - 1]} ${year}`;
};

function RapidUnitAudit({ title, children, className = "",  accent = "default", data = [], onEdit, onView }) {
  
  const [audits, setAudits, ] = useState([]);
  const [search, setSearch] =
  useState("");

  const filteredAudits =
  audits.filter((item) =>
    item.auditDriver
      ?.toLowerCase()
      .includes(
        search.toLowerCase()
      )
  );

  useEffect(() => {
    setAudits(data); 
  }, [data]);

  const toggleEstado = (id) => {
  setAudits((prev) =>
    prev.map((audit) =>
      audit._id === id
        ? {
            ...audit,
            auditOperationalStatus:
              audit.auditOperationalStatus === "EN RUTA"
                ? "DETENIDO"
                : "EN RUTA",
          }
        : audit
    )
  );
};

  return (
        <article
          className={classnames([
            className,
            `rapid-unit-audit rapid-unit-audit--${accent}`,
          ])}
        >
        <section className={classnames(["page-header", className])}>
          <div className="rapid-unit-audit__header d-flex align-items-start justify-content-between">
            <div className="rapid-unit-audit__info">
              <h1 className="rapid-unit-audit__title mb-0">{title}</h1>
              <div className="rapid-unit-audit__search">           
                 <input
                  type="text"
                  placeholder="Buscar conductor..."
                  value={search}
                  onChange={(e) =>
                    setSearch(e.target.value)
                  }
                  className="audit-search"
                />
              </div>
            </div>
          
            <div className="rapid-unit-audit__actions d-flex align-items-center">
            {children}
            </div>          
           
          </div>
        
        </section>  
            <div className="rapid-unit-audit-list-table-wrapper">
            <table className="rapid-unit-audit__body">
              <colgroup>
                <col className="col-audit-driver" />
                <col className="col-audit-contract" />
                <col className="col-audit-license" />
                <col className="col-audit-inductions" />
                <col className="col-audit-operationalStatus" />
                <col className="col-audit-actions" />
              </colgroup>

              <thead>
                <tr>
                  <th>CONDUCTOR</th>
                  <th>CONTRATO</th>
                  <th>LICENCIA/F.V</th>
                  <th>INDUCCIONES</th>
                  <th>ESTADO OPERATIVO</th>
                  <th>ACCIONES</th>
                </tr>
              </thead>

              <tbody>
                {audits.length ? (
                  filteredAudits.map((audit) => (
                    <tr key={audit?._id}>
                      <td>
                        <span className="audit-list-driver">
                          {audit?.auditDriver || "-"}
                        </span>
                      </td>

                      <td>
                        <div className="audit-list-contracts">
                            <strong>
                              {formatMonthYear(audit?.auditContract?.start)} -{" "}
                              {formatMonthYear(audit?.auditContract?.end)}
                            </strong>

                            <p>
                              Activo por {audit?.auditContract?.days} días
                            </p>
                        </div>
                      </td>

                      <td>
                        {(() => {
                          const millisecondsPerDay = 1000 * 60 * 60 * 24;

                          // HOY SIN HORAS
                          const today = new Date();
                          today.setHours(0, 0, 0, 0);

                          // FECHA VENCIMIENTO
                          const expirationDate = audit.auditLicenseExpiration
                            ? new Date(audit.auditLicenseExpiration + "T00:00:00")
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

                          let statusClass = "active";
                          let statusText = "VIGENTE";

                          if (diffDays < 0) {
                            statusClass = "expired";
                            statusText = "VENCIDA";
                          } else if (diffDays <= 60) {
                            statusClass = "warning";
                            statusText = "PROX. VENCER";
                          }

                          const fullDate = expirationDate
                            ? expirationDate.toLocaleDateString("es-PE")
                            : "-";

                          return (
                            
                            <div className="license-status">
                              <p className="license-title">
                                Licencia 
                              </p>
                              <span>{audit.auditLicense || "-"}</span>

                              <p className={`license-badge ${statusClass}`}>
                                {statusText}  {fullDate}
                              </p>
                            </div>
                          );
                        })()}
                      </td>

                      <td>
                        <span className="audit-list-inductions">
                          {audit?.auditInductions || "-"}
                        </span>
                      </td>
                      
                      <td>
                        <button
                          className={`status-btn ${
                            (audit.auditOperationalStatus || "en ruta")
                              .toLowerCase()
                              .replace(" ", "-")
                          }`}
                          onClick={() => toggleEstado(audit._id)}
                        >
                          {audit.auditOperationalStatus || "EN RUTA"}
                        </button>
                      </td>

                      <td>
                        <div className="audit-list-actions"
                        >
                          <button className="btn-audit-list-actions"
                                  onClick={() => onEdit(audit)}
                                  >
                             <EditIcon />
                          </button>
                            
                          <button className="btn-audit-list-actions"
                                  onClick={() => onView(audit)}
                                  >
                              <VisualIcon />
                          </button>

                          <button className="btn-audit-list-actions"
                                onClick={()=>
                                   exportAuditZip(audit,
                                  `AU-${audit.auditDriver}`)}
                                   >
                              <ExportIcon />
                        </button>
                      </div>

                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5">
                      <div className="audit-list-empty">
                        No se encontraron Auditoria Rapida de Unidades.
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          <p className="audit-list-results mb-0">
          Mostrando {filteredAudits.length} resultado
          {audits.length === 1 ? "" : "s"}
          </p>
        </article>
          

  );
}

RapidUnitAudit.propTypes = {
  className: PropTypes.string,
  title: PropTypes.string.isRequired,
  children: PropTypes.node,
  accent: PropTypes.oneOf(["default", "info", "warning", "danger"]),
};

export default memo(RapidUnitAudit);

 