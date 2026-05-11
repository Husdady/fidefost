// Libraries
import { memo } from "react";
import PropTypes from "prop-types";

// Utils
import classnames from "utils/classnames";

function SummaryCard({
  icon,
  title,
  value,
  description,
  className = "",
  accent = "default",
}) {
  return (
    <article
      className={classnames([
        className,
        `summary-card summary-card--${accent}`,
      ])}
    >
      <div className="summary-card__header d-flex align-items-start justify-content-between">
        {icon && (
          <div className="summary-card__icon-box d-flex align-items-center justify-content-center">
            {icon}
          </div>
        )}

        <span className="summary-card__title">{title}</span>
      </div>

      <div className="summary-card__body">
        <h3 className="summary-card__value mb-0">{value}</h3>
        <div className="summary-card__description mb-0">{description}</div>
      </div>
    </article>
  );
}

SummaryCard.propTypes = {
  className: PropTypes.string,
  icon: PropTypes.node,
  title: PropTypes.string.isRequired,
  description: PropTypes.node,
  value: PropTypes.node,
  accent: PropTypes.oneOf(["default", "info", "warning", "danger"]),
};

export default memo(SummaryCard);
