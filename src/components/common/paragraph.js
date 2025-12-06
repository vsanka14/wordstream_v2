import React from "react";
import cx from "classnames";

function Paragraph({ children }) {
  return (
    <p className={cx("block", "text-gray-200 text-xs md:text-base")}>
      {children}
    </p>
  );
}

export default Paragraph;
