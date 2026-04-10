// Librarys
import { memo } from "react";
import PropTypes from "prop-types";

// Components
import Button from "components/common/Button";

// Utils
import classnames from "utils/classnames";

function Summary({ quizResults }) {
  const {
    questions,
    quizStage,
    onRetakeQuiz,
    hasApprovedQuiz,
    resultsPercentage,
    totalCorrectAnwers,
  } = quizResults;

  return (
    <article
      className={classnames([
        hasApprovedQuiz ? "approved-quiz" : "failed-quiz",
        "summary-box mb-4 d-flex align-items-center justify-content-between",
      ])}
    >
      <div className="box d-flex align-items-center column-gap-5">
        <div className="results-box d-flex flex-column">
          <h6 className="subtitle fw-semibold mb-0">Results</h6>
          <span className="results-percentage fw-semibold">
            {resultsPercentage}%
          </span>
        </div>

        <div className="answererd-correctly-box d-flex flex-column">
          <h6 className="subtitle fw-semibold mb-0">
            {totalCorrectAnwers} of {questions?.length} Questions answered
            correctly
          </h6>

          <span className="passing-grade">
            Passing grade: {quizStage?.passingGrade}%
          </span>
        </div>
      </div>

      {!hasApprovedQuiz && (
        <Button
          title="Retake"
          titlePopup="Click to retake quiz"
          className="btn-retake btn-submit fw-medium"
          onClick={onRetakeQuiz}
        />
      )}
    </article>
  );
}

Summary.propTypes = {
  quizResults: PropTypes.object.isRequired,
};

export default memo(Summary);
