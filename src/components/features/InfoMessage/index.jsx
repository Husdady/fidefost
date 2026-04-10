// Librarys
import { memo } from "react";
import PropTypes from "prop-types";

// Utils
import classnames from "utils/classnames";
import isValidString from "utils/isValidString";

function InfoMessage({ message, subtitle, className }) {
  // Check if has subtitle
  const hasSubtitle = isValidString(subtitle);

  return (
    <article
      className={classnames([
        className,
        "onboarding-info-message d-flex flex-column row-gap-2 p-3",
      ])}
    >
      {hasSubtitle && <h6 className="subtitle mb-0 fw-semibold">{subtitle}</h6>}
      <p className="message mb-0">{message}</p>
    </article>
  );
}

InfoMessage.propTypes = {
  subtitle: PropTypes.string,
  className: PropTypes.string,
  message: PropTypes.string.isRequired,
};

export default memo(InfoMessage);
