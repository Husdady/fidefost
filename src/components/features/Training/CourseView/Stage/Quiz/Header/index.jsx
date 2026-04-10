// Librarys
import { memo } from "react";
import PropTypes from "prop-types";

// Components
import BoxIndex from "../../../BoxIndex";
import QuestionIcon from "./icons/question-icon";
import CircleCheckIcon from "./icons/circle-check-icon";

function Header({ stage }) {
  return (
    <section className="header-box mb-3 d-flex flex-wrap align-items-center justify-content-between row-gap-3 column-gap-4">
      <aside className="questions-count-box box d-flex align-items-center column-gap-2">
        <QuestionIcon />
        <span className="fw-semibold">Questions Count</span>
        <BoxIndex value={stage?.questions?.length} />
      </aside>

      <aside className="passing-grade-box box d-flex align-items-center column-gap-2">
        <CircleCheckIcon />
        <span className="fw-semibold">Pasing grade</span>
        <BoxIndex value={`${stage?.passingGrade} %`} />
      </aside>
    </section>
  );
}

Header.propTypes = {
  stage: PropTypes.object.isRequired,
  course: PropTypes.object.isRequired,
};

export default memo(Header);
