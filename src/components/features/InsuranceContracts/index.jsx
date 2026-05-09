import { memo } from "react";
import PropTypes from "prop-types";

// Utils
import classnames from "utils/classnames";
import {useGetInsurance} from "context/contracts/useInsurance"
import DateRange from "../DateRange";
import {useState} from "react";
import { useDeleteInsurance } from "context/contracts/useInsurance";

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
            </div>
          </div>
      <div className="insurance-contracts-list-table-wrapper">
         <DateRange
            desde={desde}
            hasta={hasta}
            setDesde={setDesde}
            setHasta={setHasta}
          />
        <table className="insurance-contracts__body">
          <colgroup>
            <col className="col-contracts-supplier" />
            <col className="col-contracts-type" />
            <col className="col-contracts-date" />
            <col className="col-contracts-status" />
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
                      {insurance.fechaInicio}
                      {" - "}
                      {insurance.fechaFin}
                    </span>
                  </td>

                  <td>
                    {(() => {

                      const today = new Date();

                      const endDate = new Date(
                        insurance.fechaFin
                      );

                      const diffTime =
                        endDate - today;

                      const diffDays =
                        Math.ceil(
                          diffTime / (1000 * 60 * 60 * 24)
                        );

                      let status = "ACTIVO";
                      let statusClass = "active";

                      if (diffDays < 0) {
                        status = "EXPIRADO";
                        statusClass = "expired";
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
                        className="contracts-delete-btn"
                        onClick={() => {
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
                <td colSpan="4">
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
        Mostrando {insuranceContracts.length}{" "}
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
  datefilter: PropTypes.string.isRequired,
  accent: PropTypes.oneOf(["default", "info", "warning", "danger"]),
};

export default memo(InsuranceContracts);




