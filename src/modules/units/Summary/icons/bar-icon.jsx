import { memo } from "react";

function BarIcon() {
  return (
    <svg
      width="172"
      height="6"
      fill="none"
      viewBox="0 0 172 6"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect width="172" height="6" rx="3" fill="#007F9D" fillOpacity="0.2" />
      <rect width="162.02" height="6" rx="3" fill="#00647C" />
    </svg>
  );
}

export default memo(BarIcon);
