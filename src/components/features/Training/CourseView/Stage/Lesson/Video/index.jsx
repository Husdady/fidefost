// Librarys
import { memo } from "react";
import PropTypes from "prop-types";
import LiteYouTubeEmbed from "react-lite-youtube-embed";

function Video({ stage, course }) {
  // Define flags
  const isYoutubeVideo = stage?.video?.id;
  const isWixVideo = stage?.video?.wixUrl;

  return (
    <section className="video-section d-flex flex-column">
      <div className="box d-flex align-items-center justify-content-between column-gap-3">
        <h6 className="subtitle mb-0 fw-semibold">{stage?.video?.subtitle}</h6>
        <span className="duration fw-light">{stage?.video?.duration}</span>
      </div>

      <div className="video-wrapper mb-3">
        {isYoutubeVideo && (
          <LiteYouTubeEmbed
            id={stage?.video?.id}
            title={`${course?.name} - ${stage?.video?.subtitle}`}
            poster="maxresdefault"
          />
        )}

        {isWixVideo && (
          <video
            controls
            className="wix-video w-100"
            src={stage?.video?.wixUrl}
          ></video>
        )}
      </div>

      <div className="video-description-box">
        <p className="video-description mb-0">{stage?.video?.description}</p>
      </div>
    </section>
  );
}

Video.propTypes = {
  stage: PropTypes.object.isRequired,
  course: PropTypes.object.isRequired,
};

export default memo(Video);
