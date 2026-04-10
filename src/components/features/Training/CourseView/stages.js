// Constants
import { OWNER, PINCH, SALES } from "data/courses-slugs";

// JSON
import sales from "data/courses-stages/sales.json";
import owner from "data/courses-stages/owner.json";
import pinch from "data/courses-stages/pinch.json";

export const MAX_PERCENTAGE = 100;

const courseStages = {
  [SALES]: sales,
  [OWNER]: owner,
  [PINCH]: pinch,
};

export default courseStages;
