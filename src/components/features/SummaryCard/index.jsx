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
        <div className="summary-card__icon-box d-flex align-items-center justify-content-center">
          {icon}
        </div>

        <span className="summary-card__title">{title}</span>
      </div>

      <div className="summary-card__body">
        <h3 className="summary-card__value mb-0">{value}</h3>
        <p className="summary-card__description mb-0">{description}</p>
      </div>
    </article>
  );
}

SummaryCard.propTypes = {
  className: PropTypes.string,
  icon: PropTypes.node.isRequired,
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  accent: PropTypes.oneOf(["default", "info", "warning", "danger"]),
};

export default memo(SummaryCard);
