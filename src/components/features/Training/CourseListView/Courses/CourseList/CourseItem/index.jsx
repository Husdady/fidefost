// Librarys
import PropTypes from "prop-types";

// Components
import RetakeIcon from "./icons/retake-icon";
import Button from "components/common/Button";
import CircleCheckIcon from "components/icons/circle-check-icon";

// Hooks
import useCourseItem from "./useCourseItem";

// Utils
import classnames from "utils/classnames";

// Constants
import { buttonTitles, buttonTitlesPopup } from "./button";

export default function CourseItem(props) {
  const {
    status,
    courseLogo,

    isCompleted,
    isResetingCourse,

    handleStartLesson,
    handleRetakeLesson,
  } = useCourseItem(props);

  const { course } = props;

  return (
    <li
      className={classnames([
        "course-item d-flex flex-column",
        course?.required ? "required" : "optional",
      ])}
    >
      <div className="course-header d-flex align-items-start justify-content-between column-gap-2">
        <img
          src={courseLogo}
          alt={`${course?.name}-logo`}
          className="course-logo"
          fetchpriority="high"
        />

        <div className="course-condition-box d-flex align-items-center justify-content-center">
          <span className="label">
            {course?.required ? "Required" : "Optional"}
          </span>
        </div>
      </div>

      <div className="course-information mt-3 mb-4 d-flex flex-column">
        <h6 className="course-name fw-semibold mb-0">{course?.name}</h6>
        <p className="course-description fw-light mb-0">{course?.subTitle}</p>
      </div>

      <div className="box w-100 d-flex align-items-center mt-auto">
        <Button
          onClick={handleStartLesson}
          title={buttonTitles[status]}
          titlePopup={buttonTitlesPopup[status]}
          icon={isCompleted ? <CircleCheckIcon /> : null}
          className={classnames([status, "btn-learn-course w-100 fw-medium"])}
        />

        {isCompleted && (
          <Button
            icon={<RetakeIcon />}
            disabled={isResetingCourse}
            onClick={handleRetakeLesson}
            titlePopup="Click to retake again the lesson"
            className={classnames([
              isResetingCourse ? "reseting" : "",
              "btn-retake-course h-100 fw-medium",
            ])}
          />
        )}
      </div>
    </li>
  );
}

CourseItem.propTypes = {
  index: PropTypes.number,
  onStartLesson: PropTypes.func,
  course: PropTypes.object.isRequired,
};
