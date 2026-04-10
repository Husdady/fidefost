// Librarys
import { memo } from "react";

// Components
import BoxIndex from "../BoxIndex";

function CourseName({ course }) {
  return (
    <section className="course-name-box mb-3 d-flex align-items-center justify-content-between column-gap-5">
      <aside className="course-information d-flex flex-column">
        <h6 className="course-name mb-0 fw-semibold text-uppercase">
          {course?.name}
        </h6>

        <p className="course-description mb-0 fw-light fst-italic">
          {course?.subTitle}
        </p>
      </aside>

      <aside className="box d-flex align-items-center column-gap-2">
        <span className="fw-semibold">Course</span>
        <BoxIndex value={course?.index + 1} />
      </aside>
    </section>
  );
}

export default memo(CourseName);
