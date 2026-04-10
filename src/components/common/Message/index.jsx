// Librarys
import { memo } from "react";
import PropTypes from "prop-types";

// Utils
import createValidString from "utils/createValidString";

function Message({ message }) {
  return (
    <div className="message-box py-3 px-4 d-flex align-items-center justify-content-center">
      <p className="message mb-0 text-center">
        {createValidString(message, "No data....")}
      </p>
    </div>
  );
}

Message.propTypes = {
  message: PropTypes.string.isRequired,
};

export default memo(Message);
