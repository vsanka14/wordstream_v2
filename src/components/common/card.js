import React, { useMemo } from "react";
import cx from "classnames";
import { Paragraph } from ".";

function Card({ color, icon, data }) {
  const colors = useMemo(
    () => ({
      red: "bg-red-400",
      blue: "bg-blue-400",
      gray: "bg-gray-500",
      green: "bg-green-500",
    }),
    []
  );

  return (
    <div
      className={cx(
        "px-4 py-3 rounded-xl shadow-lg",
        "text-gray-100",
        "flex items-center justify-center space-x-2",
        colors[color]
      )}
    >
      <div className="w-6 h-6 flex-shrink-0">{icon()}</div>
      <Paragraph>
        <span className="font-semibold text-sm whitespace-nowrap">{data}</span>
      </Paragraph>
    </div>
  );
}

export default Card;
