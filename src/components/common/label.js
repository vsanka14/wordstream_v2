import React from "react";
import cx from "classnames";

export default function Label({ labelFor, labelValue }) {
  return (
    <label
      className={cx(
        "block",
        "text-gray-200 text-xs md:text-base",
        "font-semibold"
      )}
      htmlFor={labelFor}
    >
      {labelValue}
    </label>
  );
}
