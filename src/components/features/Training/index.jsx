// Components
import CourseView from "./CourseView";
import CourseListView from "./CourseListView";

// Hooks
import useViews from "./hooks/useViews";

export default function Training() {
  const {
    course,

    isCourseView,
    isCourseListView,

    setCourseView,
    setCourseListView,
  } = useViews();

  if (isCourseView) {
    return <CourseView course={course} onViewAllCourses={setCourseListView} />;
  }

  if (isCourseListView) {
    return <CourseListView onStartLesson={setCourseView} />;
  }

  return null;
}
