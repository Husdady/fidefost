// Libraries
import { memo } from "react";
import PropTypes from "prop-types";

// Utils
import classnames from "utils/classnames";

function PageHeader({ title, description, children, className = "" }) {
  return (
    <section className={classnames(["page-header", className])}>
      <div className="page-header__content d-flex align-items-start justify-content-between">
        <div className="page-header__info">
          <h1 className="page-header__title mb-0">{title}</h1>
          <p className="page-header__description mb-0">{description}</p>
        </div>

        <div className="page-header__actions d-flex align-items-center">
          {children}
        </div>
      </div>
    </section>
  );
}

PageHeader.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
};

export default memo(PageHeader);
