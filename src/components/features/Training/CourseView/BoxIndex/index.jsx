// Librarys
import { memo } from "react";
import PropTypes from "prop-types";

function BoxIndex({ value }) {
  return (
    <div className="box-index d-flex align-items-center justify-content-center">
      <span className="index fw-semibold">{value}</span>
    </div>
  );
}

BoxIndex.propTypes = {
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};

export default memo(BoxIndex);
