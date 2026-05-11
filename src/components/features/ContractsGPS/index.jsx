import { memo } from "react";
import PropTypes from "prop-types";

// Utils
import classnames from "utils/classnames";

function ContractsGPS({ title, icon, summarygps, action, className = "",  accent = "default" }) {
  return (
        <article
          className={classnames([
            className,
            `contracts-GPS contracts-GPS--${accent}`,
          ])}
        >
          <div className="contracts-GPS__header d-flex align-items-start justify-content-between">
            <div className="contracts-GPS__info">
              <div className="contracts-GPS__title mb-0">
                {title}
                {icon}
              </div>

              <div className="contracts-GPS__button">{action}</div>
              
              <h2 className="contracts-GPS__body mb-0">{summarygps}</h2>
            </div>
          </div>
        </article>
          

  );
}

ContractsGPS.propTypes = {
  className: PropTypes.string,
  title: PropTypes.string.isRequired,
  icon: PropTypes.node,
  summarygps: PropTypes.node,
  accent: PropTypes.oneOf(["default", "info", "warning", "danger"]),
};

export default memo(ContractsGPS);