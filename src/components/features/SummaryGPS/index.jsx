import { memo } from "react";
import PropTypes from "prop-types";

// Utils
import classnames from "utils/classnames";

function SummaryGPS({ id, icon, status, facility, endcontract, className = "",  accent = "default" }) {
  return (
        <article
          className={classnames([
            className,
            `summary-gps summary-gps--${accent}`,
          ])}
        >
          <div className="summary-gps__header d-flex align-items-start justify-content-between">
            <div className="summary-gps__icon-id d-flex align-items-center justify-content-center">
              <h1 className="summary-gps__id"> {id} </h1>
            </div>
              <span className="summary-gps__icon">{icon} {status}</span>
            </div>
            <div className="summary-gps__body d-flex align-items-start justify-content-between">
              <div className="summary-gps__facility">
               <h1 className="summary-gps__title">INSTALACION</h1>
               <p className="summary-gps__description mb-0">{facility}</p>
              </div>   
              
              <div className="summary-gps__end">
               <h1 className="summary-gps__title">FIN CONTRATO</h1>
               <p className="summary-gps__description-end mb-0">{endcontract}</p>
              </div>
            </div>
 
        </article>
          

  );
}

SummaryGPS.propTypes = {
  className: PropTypes.string,
  id: PropTypes.string.isRequired,
  icon: PropTypes.string.isRequired,
  status: PropTypes.string.isRequired,
  facility: PropTypes.string.isRequired,
  endcontract: PropTypes.string.isRequired,
  accent: PropTypes.oneOf(["default", "info", "warning", "danger"]),
};

export default memo(SummaryGPS);