import React from "react";

export default function Input({
  id,
  type,
  handleChange,
  value,
  required,
  errored,
}) {
  return (
    <input
      className={`
                shadow
                appearance-none
                border rounded
                w-full
                py-3 px-3
                text-gray-700 text-sm md:text-base lg:text-lg xl:text-xl
                focus:outline-none focus:shadow-outline
                ${errored ? `border-red-500` : null}
            `}
      id={id}
      type={type}
      onChange={handleChange}
      value={value}
      required={required}
    />
  );
}
