// Librarys
import { memo } from "react";
import PropTypes from "prop-types";

// Utils
import classnames from "utils/classnames";

function Loader({ className, title = "Loading data..." }) {
  return (
    <section
      className={classnames([
        className,
        "loading-data w-100 position-relative d-flex align-items-center justify-content-center flex-column",
      ])}
    >
      <div className="custom-loader d-grid"></div>
      <h5 className="mb-0 label fw-medium text-center">{title}</h5>
    </section>
  );
}

Loader.propTypes = {
  title: PropTypes.string,
  className: PropTypes.string,
};

export default memo(Loader);
