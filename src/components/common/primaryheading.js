import React from "react";
import cx from "classnames";

function PrimaryHeading({ children }) {
  return (
    <h1
      className={cx(
        "text-gray-200 text-2xl md:text-3xl lg:text-4xl",
        "font-bold tracking-loose"
      )}
    >
      {children}
    </h1>
  );
}

export default PrimaryHeading;
