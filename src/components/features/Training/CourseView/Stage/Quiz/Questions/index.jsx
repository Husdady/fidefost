// Librarys
import PropTypes from "prop-types";

// Components
import Question from "./Question";

// Hooks
import useQuestions from "./useQuestions";

export default function Questions(props) {
  const { questions } = useQuestions(props);

  return (
    <ul className="question-list d-flex flex-column list-unstyled m-0 p-0">
      {questions.map((item, i) => (
        <Question {...props} index={i} data={item} key={item?._id} />
      ))}
    </ul>
  );
}

Questions.propTypes = {
  onSelectOption: PropTypes.func,
  stage: PropTypes.object.isRequired,
  course: PropTypes.object.isRequired,
  quizResponses: PropTypes.arrayOf(PropTypes.object).isRequired,
};
