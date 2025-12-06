import React from "react";
import cx from "classnames";
import { SecondaryHeading } from "components/common";
import { IconBug } from "icons";

function Loader() {
  return (
    <div className={cx("h-full w-full", "flex justify-center items-center")}>
      <div className={cx("w-12 h-12", "text-red-400")}>
        <IconBug />
      </div>
      <SecondaryHeading> Something went wrong. </SecondaryHeading>
    </div>
  );
}

export default Loader;
