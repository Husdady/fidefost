// Librarys
import { memo } from "react";
import PropTypes from "prop-types";

function ChevronDownIcon(props) {
  return (
    <svg
      {...props}
      width="14"
      height="14"
      fill="none"
      viewBox="0 0 15 7"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fill="#333333"
        d="M7.91157 6.85359L14.838 0.85342C15.0594 0.654782 15.0531 0.338249 14.8238 0.146408C14.6001 -0.0407459 14.2455 -0.0407459 14.0218 0.146408L7.50349 5.79307L0.985162 0.146406C0.759783 -0.048805 0.394387 -0.048805 0.169008 0.146406C-0.0563364 0.341675 -0.0563364 0.658178 0.169008 0.853418L7.09542 6.85359C7.32083 7.0488 7.68619 7.0488 7.91157 6.85359Z"
      />
    </svg>
  );
}

ChevronDownIcon.propTypes = {
  role: PropTypes.string,
  onClick: PropTypes.func,
};

export default memo(ChevronDownIcon);
