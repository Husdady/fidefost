// Librarys
import PropTypes from "prop-types";

// Components
import CourseItem from "./CourseItem";

// Utils
import createValidArray from "utils/createValidArray";

export default function CourseList({ courses, onStartLesson }) {
  return (
    <ul className="course-list d-flex flex-wrap align-items-stretch list-unstyled m-0 p-0">
      {createValidArray(courses).map((course, i) => (
        <CourseItem
          index={i}
          course={course}
          onStartLesson={onStartLesson}
          key={`course-item-${i}-${course?.courseId}`}
        />
      ))}
    </ul>
  );
}

CourseList.propTypes = {
  onStartLesson: PropTypes.func,
  courses: PropTypes.arrayOf(PropTypes.object).isRequired,
};
