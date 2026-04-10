// Librarys
import PropTypes from "prop-types";

// Components
import CourseList from "./CourseList";
import Loader from "components/common/Loader";
import Message from "components/common/Message";

export default function Courses({
  onStartLesson,

  courses,
  hasCourses,
  isLoadingCourses,
}) {
  return (
    <section className="courses mt-4 d-flex flex-column">
      {!isLoadingCourses && (
        <h6 className="subtitle mb-0">Certifications Available for You</h6>
      )}

      {isLoadingCourses && <Loader title="Loading courses...." />}

      {!isLoadingCourses && hasCourses && (
        <CourseList courses={courses} onStartLesson={onStartLesson} />
      )}

      {!isLoadingCourses && !hasCourses && (
        <Message message="There are no courses available for your learning, you can skip this section" />
      )}
    </section>
  );
}

Courses.propTypes = {
  hasCourses: PropTypes.bool,
  onStartLesson: PropTypes.func,
  isLoadingCourses: PropTypes.bool,
  courses: PropTypes.arrayOf(PropTypes.object).isRequired,
};
