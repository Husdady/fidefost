// Constants
import { OWNER, SALES, PINCH } from "data/courses-slugs";

// Images
import activeSalesLogo from "./course-logos/active/sales.png";
import activePinchLogo from "./course-logos/active/pinch.png";
import activeMultifamilyLogo from "./course-logos/active/multifamily.png";

import desactiveSalesLogo from "./course-logos/desactive/sales.png";
import desactivePinchLogo from "./course-logos/desactive/pinch.png";
import desactiveMultifamilyLogo from "./course-logos/desactive/multifamily.png";

export const activeLogos = {
  [SALES]: activeSalesLogo,
  [PINCH]: activePinchLogo,
  [OWNER]: activeMultifamilyLogo,
};

export const desactiveLogos = {
  [SALES]: desactiveSalesLogo,
  [PINCH]: desactivePinchLogo,
  [OWNER]: desactiveMultifamilyLogo,
};
