import { memo } from "react";
import PropTypes from "prop-types";

// Utils
import classnames from "utils/classnames";
import DateRange from "../DateRange";


function InsuranceContracts({ title, datefilter, className = "",  accent = "default" }) {
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
            </tr>
          </thead>

          <tbody>
            {DateRange.length ? (
              DateRange.map((contracts) => (
                <tr key={contracts?._id}>
                  <td>
                    <span className="contracts-list-supplier">
                      {contracts?.contractsSupplier || "-"}
                    </span>
                  </td>

                  <td>
                    <span className="contracts-list-type">
                      {contracts?.contractsType || "-"}
                    </span>
                  </td>

                  <td>
                    <span className="contracts-list-date">
                      {formatCreatedAt(contracts?.createdAt)}
                    </span>
                  </td>

                  <td>
                    <span className="contracts-list-status">                     
                      {contracts?.contractsStatus || "-"}
                    </span>
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
        Mostrando {DateRange.length} resultado
        {DateRange.length === 1 ? "" : "s"}
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


