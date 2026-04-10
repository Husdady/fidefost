// Librarys
import { memo } from "react";
import PropTypes from "prop-types";

// Components
import Options from "./Options";

// Hooks
import useQuestion from "./useQuestion";

function Question(props) {
  const { options, hasOptions, correctOption, selectedOption } =
    useQuestion(props);

  const { data, index } = props;

  return (
    <li className="question-item d-flex flex-column row-gap-3 list-unstyled m-0 p-0">
      <h6 className="question-name mb-0 fw-semibold">
        {index + 1}. {data?.question}
      </h6>

      {hasOptions && (
        <Options
          options={options}
          questionData={data}
          correctOption={correctOption}
          selectedOption={selectedOption}
        />
      )}
    </li>
  );
}

Question.propTypes = {
  data: PropTypes.object.isRequired,
  index: PropTypes.number.isRequired,
  quizResults: PropTypes.object.isRequired,
  quizes: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export default memo(Question);
