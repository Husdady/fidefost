// Librarys
import { memo } from "react";

function ChevronLeftIcon() {
  return (
    <svg
      width="6"
      height="11"
      fill="none"
      viewBox="0 0 6 11"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fill="#333333"
        stroke="#333333"
        strokeWidth="0.4"
        d="M0.30459 5.47458L4.59043 10.0922C4.73231 10.2398 4.95841 10.2356 5.09544 10.0827C5.22912 9.93359 5.22912 9.69718 5.09544 9.54808L1.0621 5.20252L5.09544 0.85697C5.23487 0.706717 5.23487 0.46312 5.09544 0.312868C4.95596 0.162638 4.72989 0.162638 4.59043 0.312868L0.304591 4.93047C0.165154 5.08075 0.165154 5.32432 0.30459 5.47458Z"
      />
    </svg>
  );
}

export default memo(ChevronLeftIcon);
