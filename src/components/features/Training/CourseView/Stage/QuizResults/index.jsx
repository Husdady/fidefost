// Librarys
import PropTypes from "prop-types";

// Components
import Summary from "./Summary";
import Questions from "./Questions";

export default function QuizResults(props) {
  return (
    <section className="quiz-results-stage pb-4">
      <Summary {...props} />
      <Questions {...props} />
    </section>
  );
}

QuizResults.propTypes = {
  stage: PropTypes.object.isRequired,
  course: PropTypes.object.isRequired,
  quizResults: PropTypes.object.isRequired,

  stages: PropTypes.arrayOf(PropTypes.object).isRequired,
  quizes: PropTypes.arrayOf(PropTypes.object).isRequired,
};
