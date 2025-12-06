import React from "react";
import cx from "classnames";

function IconContainer({ children }) {
  return <div className={cx("w-6 h-6")}>{children}</div>;
}

export default IconContainer;
