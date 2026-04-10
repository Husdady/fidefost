// Utils
import createValidArray from "utils/createValidArray";
import createValidString from "utils/createValidString";

// Constants
import courseStages from "../stages";
import { LESSON } from "../Stage/types";

/**
 * Callback for create course stages
 * @param {object} course Course
 */
export default function createStages(course) {
  return createValidArray(courseStages[course?.slug]).map((item, i) => ({
    ...item,
    _id: `${course?.slug}-stage${i + 1}`,
    type: createValidString(item?.type, LESSON),
  }));
}
