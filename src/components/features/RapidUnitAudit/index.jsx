import { memo } from "react";
import PropTypes from "prop-types";
import { useEffect, useState } from "react";
// Utils
import classnames from "utils/classnames";

//tableRapidUnitAudit
//import {TableContainer, Table, TableHead, TableBody, TableRow, TableCell} from "@mui/material"


function RapidUnitAudit({ title, children, className = "",  accent = "default", data = [] }) {

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
                  <th>LICENCIA/EPS</th>
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
                        <span className="audit-list-contracts">
                          {audit?.auditContract || "-"}
                        </span>
                      </td>

                      <td>
                        <span className="audit-list-license">
                          {audit?.auditLicense || "-"}
                        </span>
                      </td>

                      <td>
                        <span className="audit-list-operationalStatus">
                          {audit?.auditOperationalStatus || "-"}
                        </span>
                      </td>

                      <td>
                        <span className="audit-list-actions">
                          {audit?.auditActions || "-"}
                        </span>
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

 