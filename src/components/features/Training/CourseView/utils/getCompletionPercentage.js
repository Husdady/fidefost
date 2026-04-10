// Constants
import { MAX_PERCENTAGE } from "../stages";

/**
 * Callback for get completion percentage
 * @param {object} params Params
 */
export default function getCompletionPercentage({ stageIndex, totalStages }) {
  // Define the completion percentage
  const percentage = ((stageIndex + 1) / totalStages) * MAX_PERCENTAGE;

  // Validate less than zero percentage
  if (percentage <= 0 || isNaN(percentage)) return 0;

  return percentage >= MAX_PERCENTAGE ? MAX_PERCENTAGE : percentage;
}
