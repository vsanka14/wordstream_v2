import React from "react";

export default function Label({ labelFor, labelValue }) {
  return (
    <label
      className={`
                block
                text-gray-200 text-xs md:text-base 
                font-semibold
            `}
      htmlFor={labelFor}
    >
      {labelValue}
    </label>
  );
}
