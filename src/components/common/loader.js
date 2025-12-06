import React from "react";
import cx from "classnames";
import { IconSpinner } from "icons";

function Loader() {
  return (
    <div
      className={cx(
        "absolute",
        "inset-0",
        "mx-auto my-auto",
        "w-16 h-16",
        "text-gray-300"
      )}
    >
      <IconSpinner />
    </div>
  );
}

export default Loader;
