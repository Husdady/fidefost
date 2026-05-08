import { memo } from "react";
import PropTypes from "prop-types";

// Utils
import classnames from "utils/classnames";
import DateRange from "../DateRange";
import {useGetInsurance} from "context/contracts/useInsurance"

function InsuranceContracts({ title, datefilter, className = "",  accent = "default" 
}) {
  const insuranceContracts = useGetInsurance();
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
            {insuranceContracts.length > 0 ? (
              insuranceContracts.map((insurance) => (
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
                    <button
                      className="contracts-download-btn"
                      onClick={() => {
                        if (
                          insurance.archivos &&
                          insurance.archivos.length > 0
                        ) {
                          window.open(
                            insurance.archivos[0].url,
                            "_blank"
                          );
                        }
                      }}
                    >
                      Descargar
                    </button>
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


