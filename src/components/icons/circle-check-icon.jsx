// Librarys
import { memo } from "react";

function CircleCheckIcon() {
  return (
    <svg
      width="16"
      height="16"
      fill="none"
      viewBox="0 0 16 16"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fill="#241d5d"
        d="M8 16C12.4183 16 16 12.4183 16 8C16 3.58172 12.4183 0 8 0C3.58172 0 0 3.58172 0 8C0 12.4183 3.58172 16 8 16Z"
      />

      <path
        fill="#ffffff"
        d="M11.1938 4.80078L12.0002 5.60292L6.3723 11.2008L3.2002 7.85977L4.0294 7.08105L6.39584 9.57342L11.1938 4.80078Z"
      />
    </svg>
  );
}

export default memo(CircleCheckIcon);
