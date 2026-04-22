import { memo } from "react";

function RiseIcon() {
  return (
    <svg
      width="12"
      height="7"
      fill="none"
      viewBox="0 0 12 7"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fill="#004E61"
        d="M0.816667 7L0 6.18333L4.31667 1.8375L6.65 4.17083L9.68333 1.16667H8.16667V0H11.6667V3.5H10.5V1.98333L6.65 5.83333L4.31667 3.5L0.816667 7Z"
      />
    </svg>
  );
}

export default memo(RiseIcon);
