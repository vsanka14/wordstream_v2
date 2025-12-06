import React, { useMemo } from "react";
import cx from "classnames";

function Button({ color, children, onClick, disabled, type }) {
  const colors = useMemo(
    () => ({
      green: "bg-green-500",
      red: "bg-red-500",
      blue: "bg-blue-600",
    }),
    []
  );
  const hoverColors = useMemo(
    () => ({
      green: "hover:bg-green-700",
      red: "hover:bg-red-700",
      blue: "hover:bg-blue-700",
    }),
    []
  );

  return (
    <button
      className={cx(
        "w-full h-auto py-3 px-4 focus:outline-none focus:shadow-outline inline-flex justify-center items-center text-white text-sm md:text-base font-bold transition-all duration-150 ease-in-out cursor-pointer rounded",
        colors[color],
        hoverColors[color],
        {
          "cursor-not-allowed opacity-75": disabled,
        }
      )}
      onClick={onClick}
      disabled={disabled}
      type={type}
    >
      {children}
    </button>
  );
}

export default Button;
