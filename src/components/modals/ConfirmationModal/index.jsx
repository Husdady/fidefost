// Librarys
import PropTypes from "prop-types";

// Components
import Modal from "components/modals/Modal";
import Button from "components/common/Button";

// Utils
import classnames from "utils/classnames";

export default function ConfirmationModal({
  onHide,
  children,
  onConfirm,
  isShowing,
  isFetching,
  className,
}) {
  if (!isShowing) return null;

  return (
    <Modal
      centered
      isShowing
      onHide={onHide}
      isShowingCloseIcon
      className={classnames([className, "confirmation-modal"])}
    >
      <div className="wrapper d-flex flex-column">
        {children}

        <div className="buttons d-flex justify-content-center">
          <Button
            title="Cancel"
            className="btn-cancel"
            disabled={isFetching}
            onClick={onHide}
          />

          <Button
            title="Confirm"
            onClick={onConfirm}
            isLoading={isFetching}
            className={classnames([
              "btn-confirm fw-medium",
              isFetching ? "confirming" : null,
            ])}
          />
        </div>
      </div>
    </Modal>
  );
}

ConfirmationModal.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,

  onHide: PropTypes.func,
  onConfirm: PropTypes.func,

  isShowing: PropTypes.bool,
  isFetching: PropTypes.bool,
};
