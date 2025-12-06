import React from "react";
import cx from "classnames";

function Range({ name, value, handleChange, min, max }) {
  return (
    <input
      className={cx("w-full", "cursor-pointer")}
      value={value}
      onChange={handleChange}
      id={name}
      name={name}
      type="range"
      min={min}
      max={max}
    />
  );
}

export default Range;
