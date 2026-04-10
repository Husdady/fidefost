// Librarys
import PropTypes from "prop-types";

// Components
import CircleCheckIcon from "./icons/circle-check-icon";
import CircleTimesIcon from "./icons/circle-times-icon";

// Utils
import classnames from "utils/classnames";

export default function Options({
  options,
  questionData,
  correctOption,
  selectedOption,
}) {
  return (
    <ul className="question-option-list d-flex flex-column list-unstyled p-0 m-0">
      {options.map((option, i) => {
        // Get index
        const index = i + 1;

        // Define flags
        const isCorrectOption = index === correctOption;
        const isSelectedOption = index === selectedOption;
        const isIncorrectOption = isSelectedOption && !isCorrectOption;

        return (
          <li
            key={`${questionData?._id}-option-${i}`}
            className={classnames([
              isCorrectOption ? "correct" : "",
              isIncorrectOption ? "incorrect" : "",
              "option-item column-gap-4 d-flex align-items-center justify-content-between",
            ])}
          >
            <span className="option-label fw-light">{option}</span>
            {isCorrectOption && isSelectedOption && <CircleCheckIcon />}
            {isIncorrectOption && <CircleTimesIcon />}
          </li>
        );
      })}
    </ul>
  );
}

Options.propTypes = {
  questionData: PropTypes.object.isRequired,
  correctOption: PropTypes.number.isRequired,
  selectedOption: PropTypes.number.isRequired,
  options: PropTypes.arrayOf(PropTypes.string).isRequired,
};
