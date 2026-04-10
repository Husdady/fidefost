// Hooks
import { useMemo, useState, useCallback } from "react";

// Utils
import createValidObject from "utils/createValidObject";
import resetScrollPosition from "utils/onboarding/resetScrollPosition";

// Constants
import { COURSE, COURSE_LIST } from "../views";

/**
 * Hook for implements logic for multi views in Courses stage
 */
export default function useViews() {
  const [course, setCourse] = useState({});
  const [view, setView] = useState(COURSE_LIST);

  // Define flags to check active view
  const flags = useMemo(
    () => ({
      isCourseView: view === COURSE,
      isCourseListView: view === COURSE_LIST,
    }),
    [view]
  );

  // Callback to handle set CourseList view
  const handleSetCourseListView = useCallback(() => {
    setCourse({});
    setView(COURSE_LIST);
    resetScrollPosition();
  }, []);

  // Callback to handle set Course view
  const handleSetCourseView = useCallback((newCourse) => {
    setView(COURSE);
    setCourse(createValidObject(newCourse));
    resetScrollPosition();
  }, []);

  return {
    ...flags,

    course: course,
    setCourseView: handleSetCourseView,
    setCourseListView: handleSetCourseListView,
  };
}
