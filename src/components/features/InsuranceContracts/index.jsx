import { memo } from "react";
import PropTypes from "prop-types";

// Utils
import classnames from "utils/classnames";
import {useGetInsurance} from "context/contracts/useInsurance"
import DateRange from "../DateRange";
import {useState} from "react";
import { useDeleteInsurance } from "context/contracts/useInsurance";
import deleteDocument from "database/deleteDocument";

function InsuranceContracts({ title, datefilter, className = "",  accent = "default" 
}) {
  const deleteInsurance = useDeleteInsurance();
  const [desde, setDesde] = useState("");
  const [hasta, setHasta] = useState("");
  const insuranceContracts = useGetInsurance();

  const filteredContracts =
  insuranceContracts.filter((insurance) => {

    if (!desde && !hasta) {
      return true;
    }

    const startDate =
      new Date(insurance.fechaInicio);

    const fromDate =
      desde
        ? new Date(desde)
        : null;

    const toDate =
      hasta
        ? new Date(hasta)
        : null;

    if (fromDate && startDate < fromDate) {
      return false;
    }

    if (toDate && startDate > toDate) {
      return false;
    }

    return true;
  });

  const formatDate = (dateString) => {

  if (!dateString) {
    return "-";
  }

  const [year, month, day] =
    dateString.split("-");

  return `${day}/${month}/${year}`;
};

  return (
        <article
          className={classnames([
            className,
            `insurance-contracts h-100 insurance-contracts--${accent}`,
          ])}
        >
          <div className="insurance-contracts__header d-flex align-items-start justify-content-between">
            <div className="insurance-contracts__info">
              <h1 className="insurance-contracts__title mb-0">{title}</h1>
              <p className="insurance-contracts__description mb-0">{datefilter}</p>
               <div className="contracts-date-filter">
                <DateRange
                  desde={desde}
                  hasta={hasta}
                  setDesde={setDesde}
                  setHasta={setHasta}
                />
              </div>
            </div>
          </div>
      <div className="insurance-contracts-list-table-wrapper">
        <table className="insurance-contracts__body">
          <colgroup>
            <col className="col-contracts-supplier" />
            <col className="col-contracts-type" />
            <col className="col-contracts-date" />
            <col className="col-contracts-status" />
            <col className="col-contracts-actions" />
          </colgroup>

          <thead>
            <tr>
              <th>PROVEEDOR</th>
              <th>TIPO</th>
              <th>FECHAS</th>
              <th>ESTADO</th>
              <th>DESCARGA</th>
            </tr>
          </thead>

          <tbody>
            {filteredContracts.length > 0 ? (
              filteredContracts.map((insurance) => (
                <tr key={insurance._id}>
                  <td>
                    <div className="contracts-list-supplier">
                      
                      <strong>
                        {insurance.proveedor || "-"}
                      </strong>

                      <small>
                        {insurance.poliza || "-"}
                      </small>

                    </div>
                  </td>

                  <td>
                    <span className="contracts-list-type">
                      {insurance.tipo || "-"}
                    </span>
                  </td>

                  <td>
                    <span className="contracts-list-date">
                      {formatDate(insurance.fechaInicio)}
                      {" - "}
                      {formatDate(insurance.fechaFin)}
                    </span>
                  </td>

                  <td>
                    {(() => {

                      const millisecondsPerDay =
                        1000 * 60 * 60 * 24;

                      // FECHA ACTUAL
                      const today = new Date();

                      const todayString =
                        `${today.getFullYear()}-${
                          String(today.getMonth() + 1).padStart(2, "0")
                        }-${
                          String(today.getDate()).padStart(2, "0")
                        }`;

                      // TIMESTAMPS
                      const currentDate =
                        new Date(todayString).getTime();

                      const endDate =
                        new Date(insurance.fechaFin).getTime();

                      // DIFERENCIA
                      const diffDays =
                        Math.trunc(
                          (endDate - currentDate) /
                          millisecondsPerDay
                        );

                      let status = "ACTIVO";
                      let statusClass = "active";

                      // EXPIRADO
                      if (diffDays < 0) {

                        status = "EXPIRADO";
                        statusClass = "expired";

                      // PROXIMO A VENCER
                      } else if (diffDays <= 59) {

                        status = "PROX. EXPIRAR";
                        statusClass = "warning";
                      }
                      return (
                        <span
                          className={`contracts-list-status ${statusClass}`}
                        >
                          {status}
                        </span>
                      );

                    })()}


                  </td>
                  <td>
                    <div className="contracts-actions">

                      <button
                        className="contracts-download-btn"
                        onClick={() => {

                          insurance.archivos.forEach((doc) => {

                            const url =
                              URL.createObjectURL(doc.blob);

                            const a =
                              document.createElement("a");

                            a.href = url;

                            a.download = doc.name;

                            document.body.appendChild(a);

                            a.click();

                            a.remove();

                            URL.revokeObjectURL(url);

                          });

                        }}
                      >
                        Descargar
                      </button>

                      <button
                        type="button"
                        className="contracts-delete-btn"
                        onClick={async () => {

                          // ELIMINAR ARCHIVOS INDEXEDDB
                          for (const file of insurance.archivos || []) {

                            if (!file.id) {
                              continue;
                            }

                            await deleteDocument(file.id);
                          }

                          // ELIMINAR CONTRATO ZUSTAND
                          deleteInsurance(insurance._id);
                        }}
                      >
                        Eliminar
                      </button>

                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5">
                  <div className="contracts-list-empty">
                    No se encontraron contratos de seguro.
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <p className="contracts-list-results mb-0">
        Mostrando {filteredContracts.length}{" "}
          {insuranceContracts.length === 1
            ? "resultado"
            : "resultados"}
      </p>
      </article>
          

  );
}


InsuranceContracts.propTypes = {
  className: PropTypes.string,
  title: PropTypes.string.isRequired,
  dateFilter: PropTypes.string,
  accent: PropTypes.oneOf(["default", "info", "warning", "danger"]),
};

export default memo(InsuranceContracts);




