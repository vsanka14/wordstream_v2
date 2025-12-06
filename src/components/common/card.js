import React, { useMemo } from "react";
import classNames from "classnames";
import { Paragraph } from ".";

function Card({ color, icon, data }) {
  const colors = useMemo(
    () => ({
      red: "bg-red-500",
      blue: "bg-blue-500",
      gray: "bg-gray-500",
    }),
    []
  );

  return (
    <div className={classNames("w-full h-full", "px-2 py-5")}>
      <div
        className={classNames(
          "w-full h-full",
          "text-gray-100",
          "flex flex-col justify-center items-center",
          colors[color]
        )}
      >
        <div className={classNames("w-16 h-16")}>{icon()}</div>
        <Paragraph>
          <span className={classNames("font-semibold")}>{data}</span>
        </Paragraph>
      </div>
    </div>
  );
}

export default Card;
