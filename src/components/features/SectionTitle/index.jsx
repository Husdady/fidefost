// Librarys
import { memo } from "react";
import PropTypes from "prop-types";

function SectionTitle({ icon, title }) {
  return (
    <div className="section-title-box d-flex align-items-center">
      {icon}
      <h4 className="title text-uppercase mb-0 fw-bold">{title}</h4>
    </div>
  );
}

SectionTitle.propTypes = {
  icon: PropTypes.node.isRequired,
  title: PropTypes.string.isRequired,
};

export default memo(SectionTitle);
