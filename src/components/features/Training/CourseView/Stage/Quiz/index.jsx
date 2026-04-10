// Librarys
import PropTypes from "prop-types";

// Components
import Header from "./Header";
import Questions from "./Questions";
import Button from "components/common/Button";
import ConfirmationModal from "./ConfirmationModal";

// Hooks
import useQuiz from "./useQuiz";

export default function Quiz(props) {
  const {
    handleSendQuiz,
    saveQuizResponse,
    saveQuizResponses,

    quizResponses,
    confirmationModal,

    isSendingQuiz,
    isDisabledSendButton,
  } = useQuiz(props);

  return (
    <section className="quiz-stage pb-4">
      <Header {...props} />

      <Questions
        {...props}
        quizResponses={quizResponses}
        onSelectOption={saveQuizResponse}
      />

      <Button
        title="Send"
        className="btn-send btn-submit mt-4 fw-medium"
        disabled={isDisabledSendButton}
        onClick={handleSendQuiz}
      />

      {confirmationModal.isShowing && (
        <ConfirmationModal
          isFetching={isSendingQuiz}
          onHide={confirmationModal.hide}
          onConfirm={saveQuizResponses}
        />
      )}
    </section>
  );
}

Quiz.propTypes = {
  stage: PropTypes.object.isRequired,
  course: PropTypes.object.isRequired,
  onSendQuizResponses: PropTypes.func,
};
