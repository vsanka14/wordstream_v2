import React from "react";

const circlecheck = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className={`
            h-full w-full
            stroke-current
        `}
    viewBox="0 0 24 24"
    strokeWidth="2"
    fill="none"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path stroke="none" d="M0 0h24v24H0z" />
    <circle cx="12" cy="12" r="9" />
    <path d="M9 12l2 2l4 -4" />
  </svg>
);

export default circlecheck;
