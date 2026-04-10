// Librarys
import PropTypes from "prop-types";

// Components
import ConfirmationModal from "components/modals/ConfirmationModal";

export default function CustomConfirmationModal(props) {
  return (
    <ConfirmationModal {...props} isShowing className="quiz-confirmation-modal">
      <div className="box d-flex flex-column">
        <h6 className="subtitle fw-semibold text-center">Submit responses</h6>

        <p className="message text-center mb-4">
          Once you have submitted it, you will no longer be able to change your
          responses. Are you sure you want to send the answers?
        </p>
      </div>
    </ConfirmationModal>
  );
}

ConfirmationModal.propTypes = {
  onHide: PropTypes.func,
  onConfirm: PropTypes.func,
  isFetching: PropTypes.bool,
};
