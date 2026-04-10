// Librarys
import { memo } from "react";
import PropTypes from "prop-types";

// Components
import LikeIcon from "./icons/like-icon";

function Congratulations({ stage }) {
  return (
    <section className="congratulations-box mt-3 d-flex align-items-center justify-content-center">
      <div className="box d-flex flex-column text-center">
        <LikeIcon />
        <h6 className="subtitle mt-2 mb-3 fw-semibold">Congratulations</h6>

        <p
          className="message mb-0 mx-auto"
          dangerouslySetInnerHTML={{ __html: stage?.message || "" }}
        />
      </div>
    </section>
  );
}

Congratulations.propTypes = {
  stage: PropTypes.object.isRequired,
};

export default memo(Congratulations);
