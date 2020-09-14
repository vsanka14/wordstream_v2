import React from "react";

function IconContainer({ children }) {
  return (
    <div
      className={`
                w-6 h-6
            `}
    >
      {children}
    </div>
  );
}

export default IconContainer;
