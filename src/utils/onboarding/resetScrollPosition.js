// Constants
import { INSTANT } from "data/scroll";

const MOBILE_BREAKPOINT = 1125;

/**
 * Callback to reset scroll position
 */
export default function resetScrollPosition() {
  const isSmallScreen = window.innerWidth <= MOBILE_BREAKPOINT;

  if (isSmallScreen) {
    const element =
      document.querySelector(".course-name-box") ||
      document.querySelector(".app-container > .box > .main-content");

    if (element) {
      element.scrollIntoView({ block: "start", behavior: INSTANT });

      return;
    }
  }

  window.scrollTo({
    top: 0,
    left: 0,
    behavior: INSTANT,
  });
}
