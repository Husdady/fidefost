// Librarys
import PropTypes from "prop-types";

// Components
import Question from "./Question";

// Utils
import createValidArray from "utils/createValidArray";

export default function Questions(props) {
  return (
    <ul className="question-list d-flex flex-column list-unstyled m-0 p-0">
      {createValidArray(props.quizResults?.questions).map((item, i) => (
        <Question {...props} index={i} data={item} key={item?._id} />
      ))}
    </ul>
  );
}

Questions.propTypes = {
  stage: PropTypes.object.isRequired,
  course: PropTypes.object.isRequired,
  quizResults: PropTypes.object.isRequired,
  stages: PropTypes.arrayOf(PropTypes.object).isRequired,
  quizes: PropTypes.arrayOf(PropTypes.object).isRequired,
};
