// Hooks
import { useCallback } from "react";
import useRetakeCourse from "./hooks/useRetakeCourse";

// Utils
import isFunction from "utils/isFunction";
import isValidObject from "utils/isValidObject";

// Constants
import { COMPLETED } from "data/courses-status";
import { activeLogos, desactiveLogos } from "./logos";

/**
 * Hook for implements logic for CourseItem component
 * @param {object} props Props
 */
export default function useCourseItem(props) {
  const { index, course, onStartLesson } = props;

  const retakeCourseData = useRetakeCourse(props);

  // Get course status
  const status = course?.override ? COMPLETED : course?.status;

  // Check if the course is completed
  const isCompleted = status === COMPLETED;

  // Get course logos based course status
  const courseLogos = isCompleted ? activeLogos : desactiveLogos;

  // Get course logo by slug
  const courseLogo = courseLogos[course?.slug || ""];

  // Click event in button
  const handleStartLesson = useCallback(() => {
    // Do not make anything if the course already has completed
    if (isCompleted || !isFunction(onStartLesson) || !isValidObject(course)) {
      return;
    }

    onStartLesson({ ...course, index: index });
  }, [index, course, onStartLesson]);

  return {
    ...retakeCourseData,

    status: status,
    courseLogo: courseLogo,
    isCompleted: isCompleted,
    handleStartLesson: handleStartLesson,
  };
}
