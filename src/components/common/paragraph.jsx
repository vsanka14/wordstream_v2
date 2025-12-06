import React from "react";

function Paragraph({ children }) {
  return <p className="block text-white text-xs md:text-base">{children}</p>;
}

export default Paragraph;
