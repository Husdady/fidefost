import { memo } from "react";
import PropTypes from "prop-types";
import { useEffect, useState } from "react";
// Utils
import classnames from "utils/classnames";


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

  const [audits, setAudits] = useState([]);

  useEffect(() => {
    setAudits(data); 
  }, [data]);

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
                <col className="col-audit-operationalStatus" />
                <col className="col-audit-actions" />
              </colgroup>

              <thead>
                <tr>
                  <th>CONDUCTOR</th>
                  <th>CONTRATO</th>
                  <th>LICENCIA/INDUCCION</th>
                  <th>ESTADO OPERATIVO</th>
                  <th>ACCIONES</th>
                </tr>
              </thead>

              <tbody>
                {audits.length ? (
                  audits.map((audit) => (
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
                        <span className="audit-list-license">
                          {audit?.auditLicense || "-"}

                          {audit?.auditInductionStatus && (
                            <>
                              {" / "}
                              <span
                                style={{
                                  color:
                                    audit.auditInductionStatus === "Inducción OK"
                                      ? "#16a34a"
                                      : "#dc2626",

                                  fontWeight: 600,
                                  fontSize: 11,
                                }}
                              >
                                {audit.auditInductionStatus}
                              </span>
                            </>
                          )}
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
                        <div className="audit-list-actions-edit"
                             onClick={() => onEdit(audit)}
                        >
                          <span className="audit-list-actions-icon">
                          <svg
                            width="16"
                            height="16"
                            viewBox="0 0 16 16"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M8 13.3333H14"
                              stroke="currentColor"
                              strokeWidth="1.6"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                            <path
                              d="M11.0001 2.33331C11.2653 2.0681 11.625 1.91907 12.0001 1.91907C12.3752 1.91907 12.7349 2.0681 13.0001 2.33331C13.2653 2.59853 13.4143 2.9582 13.4143 3.33331C13.4143 3.70841 13.2653 4.0681 13.0001 4.33331L4.66675 12.6666L2.00008 13.3333L2.66675 10.6666L11.0001 2.33331Z"
                              stroke="currentColor"
                              strokeWidth="1.6"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                          </span>

                          <span>Editar</span>
                        </div>

                        <div className="audit-list-actions-visual"
                        onClick={() => onView(audit)}
                        >  
                          <span className="audit-list-actions-icon">
                            <svg width="22" 
                                height="15"
                                viewBox="0 0 22 15" 
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg">
                                
                                <path d="M11 12C12.25 12 13.3125 11.5625 14.1875 10.6875C15.0625 9.8125 15.5 8.75 15.5 7.5C15.5 6.25 15.0625 5.1875 14.1875 4.3125C13.3125 3.4375 12.25 3 11 3C9.75 3 8.6875 3.4375 7.8125 4.3125C6.9375 5.1875 6.5 6.25 6.5 7.5C6.5 8.75 6.9375 9.8125 7.8125 10.6875C8.6875 11.5625 9.75 12 11 12ZM11 10.2C10.25 10.2 9.6125 9.9375 9.0875 9.4125C8.5625 8.8875 8.3 8.25 8.3 7.5C8.3 6.75 8.5625 6.1125 9.0875 5.5875C9.6125 5.0625 10.25 4.8 11 4.8C11.75 4.8 12.3875 5.0625 12.9125 5.5875C13.4375 6.1125 13.7 6.75 13.7 7.5C13.7 8.25 13.4375 8.8875 12.9125 9.4125C12.3875 9.9375 11.75 10.2 11 10.2ZM11 15C8.56667 15 6.35 14.3208 4.35 12.9625C2.35 11.6042 0.9 9.78333 0 7.5C0.9 5.21667 2.35 3.39583 4.35 2.0375C6.35 0.679167 8.56667 0 11 0C13.4333 0 15.65 0.679167 17.65 2.0375C19.65 3.39583 21.1 5.21667 22 7.5C21.1 9.78333 19.65 11.6042 17.65 12.9625C15.65 14.3208 13.4333 15 11 15ZM11 13C12.8833 13 14.6125 12.5042 16.1875 11.5125C17.7625 10.5208 18.9667 9.18333 19.8 7.5C18.9667 5.81667 17.7625 4.47917 16.1875 3.4875C14.6125 2.49583 12.8833 2 11 2C9.11667 2 7.3875 2.49583 5.8125 3.4875C4.2375 4.47917 3.03333 5.81667 2.2 7.5C3.03333 9.18333 4.2375 10.5208 5.8125 11.5125C7.3875 12.5042 9.11667 13 11 13Z" 
                                  fill="#6E797E"/>
                            </svg>
                          </span>

                          <span>Visualizar</span>
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
          Mostrando {audits.length} resultado
          {audits.length === 1 ? "" : "s"}
          </p>
        </article>
          

  );
}

RapidUnitAudit.propTypes = {
  className: PropTypes.string,
  title: PropTypes.string.isRequired,
  children: PropTypes.string.isRequired,
  accent: PropTypes.oneOf(["default", "info", "warning", "danger"]),
};

export default memo(RapidUnitAudit);

 