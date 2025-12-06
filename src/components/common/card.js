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
    <div className="px-2 py-2">
      <div
        className={cx(
          "px-6 py-4 rounded-xl shadow-lg",
          "text-gray-100",
          "flex items-center space-x-3",
          colors[color]
        )}
      >
        <div className="w-8 h-8 flex-shrink-0">{icon()}</div>
        <Paragraph>
          <span className="font-semibold text-sm">{data}</span>
        </Paragraph>
      </div>
    </div>
  );
}

export default Card;
