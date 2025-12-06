import React, { useMemo } from "react";
import cx from "classnames";
import { Paragraph } from ".";

function Card({ color, icon, data }) {
  const colors = useMemo(
    () => ({
      red: "bg-red-600",
      blue: "bg-blue-600",
      gray: "bg-gray-600",
      green: "bg-green-600",
      purple: "bg-purple-600",
    }),
    []
  );

  return (
    <div
      className={cx(
        "px-4 py-3 rounded-xl shadow-lg",
        "text-white",
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
