// Librarys
import PropTypes from "prop-types";

// Components
import Portal from "./Portal";
import Times from "./icons/times";
import Button from "components/common/Button";

// Hooks
import useHideModalOnPressEscape from "./useHideModalOnPressEscape";

// Utils
import classnames from "utils/classnames";

export default function Modal({
  onHide,
  children,
  centered,
  className,
  isShowing,
  isShowingCloseIcon = true,
}) {
  useHideModalOnPressEscape({ onHide });

  if (!isShowing) return null;

  return (
    <Portal wrapperId="modal-portal-container">
      <div
        className={classnames([
          className,
          centered ? "centered" : null,
          "modal position-fixed overflow-hidden",
        ])}
      >
        <div role="dialog" className="modal-backdrop" onClick={onHide}></div>

        <div className="modal-content">
          {isShowingCloseIcon && (
            <Button
              icon={<Times />}
              onClick={onHide}
              className="d-flex justify-content-end btn-close-modal shadow-none outline-none"
            />
          )}

          <div className="content">{children}</div>
        </div>
      </div>
    </Portal>
  );
}

Modal.propTypes = {
  className: PropTypes.string,
  onHide: PropTypes.func.isRequired,

  centered: PropTypes.bool,
  isShowing: PropTypes.bool,
  isShowingCloseIcon: PropTypes.bool,

  children: PropTypes.node.isRequired,
};
