// Librarys
import { memo } from "react";

function ChevronRightIcon() {
  return (
    <svg
      width="6"
      height="11"
      fill="none"
      viewBox="0 0 6 11"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fill="#ffffff"
        stroke="#ffffff"
        strokeWidth="1"
        d="M5.09543 4.92484L0.809598 0.307232C0.667713 0.159595 0.441619 0.163834 0.304589 0.316702C0.170908 0.465827 0.170908 0.702231 0.304589 0.851334L4.33792 5.19689L0.304588 9.54244C0.165152 9.6927 0.165152 9.93629 0.304588 10.0865C0.444066 10.2368 0.670139 10.2368 0.809596 10.0865L5.09543 5.46894C5.23487 5.31867 5.23487 5.07509 5.09543 4.92484Z"
      />
    </svg>
  );
}

export default memo(ChevronRightIcon);
