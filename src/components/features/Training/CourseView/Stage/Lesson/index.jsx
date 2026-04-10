// Librarys
import PropTypes from "prop-types";

// Components
import Video from "./Video";
import ModuleHeader from "./ModuleHeader";

// Hooks
import useLesson from "./useLesson";

export default function Lesson(props) {
  const { description, hasVideo, hasDescription, hasModuleHeader } =
    useLesson(props);

  return (
    <section className="lesson-stage d-flex flex-column">
      {hasModuleHeader && <ModuleHeader {...props} />}

      {hasDescription && (
        <p className="stage-description mb-0">{description}</p>
      )}

      {hasVideo && <Video {...props} />}
    </section>
  );
}

Lesson.propTypes = {
  stage: PropTypes.object.isRequired,
  course: PropTypes.object.isRequired,
};
