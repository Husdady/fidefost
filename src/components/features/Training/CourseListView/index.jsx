// Librarys
import PropTypes from "prop-types";

// Components
import Courses from "./Courses";
import InfoMessage from "./InfoMessage";
import SectionTitle from "components/features/SectionTitle";
import CoursesIcon from "components/icons/stages/stage/courses-icon";

// Hooks
import useCourseListView from "./useCourseListView";

export default function CourseListView({ onStartLesson }) {
  const coursesData = useCourseListView();

  return (
    <section className="courses-stage course-list-view pt-2 h-100 d-flex flex-column">
      <SectionTitle
        icon={<CoursesIcon />}
        title="Get Certified Unlock higher-paying jobs"
      />

      <InfoMessage />
      <Courses {...coursesData} onStartLesson={onStartLesson} />
    </section>
  );
}

CourseListView.propTypes = {
  onStartLesson: PropTypes.func,
};
