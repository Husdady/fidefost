import { memo } from "react";
import PropTypes from "prop-types";

// Utils
import classnames from "utils/classnames";

function ContractsGPS({ title, description, className = "",  accent = "default" }) {
  return (
        <article
          className={classnames([
            className,
            `contracts-GPS contracts-GPS--${accent}`,
          ])}
        >
          <div className="contracts-GPS__header d-flex align-items-start justify-content-between">
            <div className="contracts-GPS__info">
              <h1 className="contracts-GPS__title mb-0">{title}</h1>
              <p className="contracts-GPS__description mb-0">{description}</p>
            </div>
          </div>
        </article>
          

  );
}

ContractsGPS.propTypes = {
  className: PropTypes.string,
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  accent: PropTypes.oneOf(["default", "info", "warning", "danger"]),
};

export default memo(ContractsGPS);