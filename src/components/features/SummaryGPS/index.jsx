import { memo } from "react";
import PropTypes from "prop-types";

// Utils
import classnames from "utils/classnames";

function SummaryGPS({ id, icon, title, value, className = "",  accent = "default" }) {
  return (
        <article
          className={classnames([
            className,
            `summary-gps summary-gps--${accent}`,
          ])}
        >
          <div className="summary-gps__header d-flex align-items-start justify-content-between">
            <div className="summary-gps__iconid d-flex align-items-center justify-content-center">
              <h1 className="summary-gps__title"> {id} </h1>
            </div>
              <span className="summary-gps__title">{icon}</span>
            </div>
            <div className="summary-gps__body">
                <h1 className="summary-gps__value mb-0">{title}</h1>
            </div>
              <span className="summary-gps__value mb-0">{value}</span>
        </article>
          

  );
}

SummaryGPS.propTypes = {
  className: PropTypes.string,
  id: PropTypes.string.isRequired,
  icon: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  accent: PropTypes.oneOf(["default", "info", "warning", "danger"]),
};

export default memo(SummaryGPS);