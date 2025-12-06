import React from "react";
import classNames from "classnames";

export default function Label({ labelFor, labelValue }) {
  return (
    <label
      className={classNames(
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
