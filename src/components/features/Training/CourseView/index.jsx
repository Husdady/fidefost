// Librarys
import PropTypes from "prop-types";

// Components
import Stage from "./Stage";
import CourseName from "./CourseName";
import Button from "components/common/Button";
import FloatButtons from "components/features/FloatButtons";

// Hooks
import useCourseView from "./useCourseView";

export default function CourseView(props) {
  const courseViewData = useCourseView(props);

  const {
    hasStage,
    isShowingBackButton,
    isDisabledSubmitButton,

    submit,
    handleBackToPreviousStage,
  } = courseViewData;

  return (
    <form
      onSubmit={submit}
      className="courses-stage course-view h-100 d-flex flex-column"
    >
      <CourseName {...props} />

      {hasStage && <Stage {...props} {...courseViewData} />}

      <FloatButtons
        nextButtonTitle="Continue"
        onBack={handleBackToPreviousStage}
        isShowingBackButton={isShowingBackButton}
        disabledNextButton={isDisabledSubmitButton}
        renderExtraButton={
          <Button
            title="View all courses"
            titlePopup="Click to view all courses"
            className="btn-view-all-courses fw-medium"
            onClick={props.onViewAllCourses}
          />
        }
      />
    </form>
  );
}

CourseView.propTypes = {
  onViewAllCourses: PropTypes.func,
  course: PropTypes.object.isRequired,
};
