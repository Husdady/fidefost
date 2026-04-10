// Utils
import createValidString from "utils/createValidString";

/**
 * Callback for format quiz response id
 * @param {string} quizResultId Quiz result ID
 */
export default function formatQuizResponseId(quizResultId) {
  return createValidString(quizResultId)
    .replace("-results", "")
    .replace(
      /stage(\d+)/,
      (_, stageNumber) => `stage${Number(stageNumber) - 1}`
    );
}
