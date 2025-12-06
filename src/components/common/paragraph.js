import React from "react";
import classNames from "classnames";

function Paragraph({ children }) {
  return (
    <p className={classNames("block", "text-gray-200 text-xs md:text-base")}>
      {children}
    </p>
  );
}

export default Paragraph;
