// Librarys
import PropTypes from "prop-types";
import { createPortal } from "react-dom";

export default function Portal({
  children,
  wrapperId = "react-portal-wrapper",
}) {
  // Get container
  const container = document.getElementById("portals");

  // Validate container selector in DOM
  if (!container) return null;

  return createPortal(children, container, wrapperId);
}

Portal.propTypes = {
  wrapperId: PropTypes.string,
  children: PropTypes.node.isRequired,
};
