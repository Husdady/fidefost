// Librarys
import PropTypes from "prop-types";

// Components
import GroupRadioOptions from "components/common/GroupRadioOptions";

// Hooks
import useQuestion from "./useQuestion";

export default function Question(props) {
  const { options, selectedOption, handleSelectOption } = useQuestion(props);

  const { data, index, stage } = props;

  return (
    <li className="question-item d-flex flex-column row-gap-3 list-unstyled m-0 p-0">
      <h6 className="question-name mb-0 fw-semibold">
        {index + 1}. {data?.question}
      </h6>

      <GroupRadioOptions
        align="vertical"
        options={options}
        onChange={handleSelectOption}
        selectedOption={selectedOption}
        name={`${stage?._id}-question-anwers-${index}`}
      />
    </li>
  );
}

Question.propTypes = {
  onSelectOption: PropTypes.func,
  data: PropTypes.object.isRequired,
  stage: PropTypes.object.isRequired,
  index: PropTypes.number.isRequired,
  quizResponses: PropTypes.arrayOf(PropTypes.object).isRequired,
};
