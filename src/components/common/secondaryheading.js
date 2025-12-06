import React from "react";
import cx from "classnames";

function SecondaryHeading({ children }) {
  return (
    <h1
      className={cx(
        "text-gray-200 text-xl md:text-2xl lg:text-3xl text-center",
        "font-semibold tracking-loose"
      )}
    >
      {children}
    </h1>
  );
}

export default SecondaryHeading;
