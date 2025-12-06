import React from "react";
import classNames from "classnames";

function IconContainer({ children }) {
  return <div className={classNames("w-6 h-6")}>{children}</div>;
}

export default IconContainer;
