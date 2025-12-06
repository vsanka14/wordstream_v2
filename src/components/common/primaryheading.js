import React from "react";
import classNames from "classnames";

function PrimaryHeading({ children }) {
  return (
    <h1
      className={classNames(
        "text-gray-200 text-2xl md:text-3xl lg:text-4xl",
        "font-bold tracking-loose"
      )}
    >
      {children}
    </h1>
  );
}

export default PrimaryHeading;
