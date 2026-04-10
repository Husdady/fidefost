// Librarys
import PropTypes from "prop-types";

// Components
import Quiz from "./Quiz";
import Lesson from "./Lesson";
import QuizResults from "./QuizResults";
import Congratulations from "./Congratulations";

// Constants
import { QUIZ, LESSON, QUIZ_RESULTS, CONGRATULATIONS } from "./types";

export default function Stage(props) {
  // Get stage type
  const stageType = props.stage?.type;

  // Check if is Quiz stage
  if (stageType === QUIZ) {
    return <Quiz {...props} />;
  }

  // Check if is QuizResults stage
  if (stageType === QUIZ_RESULTS) {
    return <QuizResults {...props} />;
  }

  // Check if is Lesson stage
  if (stageType === LESSON) {
    return <Lesson {...props} />;
  }

  // Check if is Congratulations stage
  if (stageType === CONGRATULATIONS) {
    return <Congratulations {...props} />;
  }

  return null;
}

Stage.propTypes = {
  onSendQuizResponses: PropTypes.func,

  stage: PropTypes.object.isRequired,
  course: PropTypes.object.isRequired,
  quizResults: PropTypes.object.isRequired,

  stages: PropTypes.arrayOf(PropTypes.object).isRequired,
  quizes: PropTypes.arrayOf(PropTypes.object).isRequired,
};
