// Librarys
import { memo } from "react";
import PropTypes from "prop-types";

// Components
import BoxIndex from "../../../BoxIndex";

function ModuleHeader({ stage }) {
  return (
    <section className="module-header-box mb-3 d-flex align-items-center justify-content-between column-gap-5">
      <aside className="box d-flex align-items-center column-gap-2">
        <span className="fw-semibold">Module</span>
        <BoxIndex value={stage?.moduleHeader?.step} />
      </aside>

      <h6 className="subtitle mb-0 fw-semibold">
        {stage?.moduleHeader?.subtitle}
      </h6>
    </section>
  );
}

ModuleHeader.propTypes = {
  stage: PropTypes.object.isRequired,
  course: PropTypes.object.isRequired,
};

export default memo(ModuleHeader);
