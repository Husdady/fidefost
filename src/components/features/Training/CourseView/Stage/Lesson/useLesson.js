// Utils
import isValidString from "utils/isValidString";
import isValidObject from "utils/isValidObject";

/**
 * Hook for implements logic for Lesson component
 * @param {object} props Props
 */
export default function useLesson({ stage }) {
  // Get fields
  const video = stage?.video;
  const description = stage?.description;
  const moduleHeader = stage?.moduleHeader;

  // Define flags
  const hasVideo = isValidObject(video);
  const hasDescription = isValidString(description);
  const hasModuleHeader = isValidObject(moduleHeader);

  return {
    description: description,

    hasVideo: hasVideo,
    hasDescription: hasDescription,
    hasModuleHeader: hasModuleHeader,
  };
}
