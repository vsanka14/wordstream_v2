import React, { useRef, useCallback } from "react";
import { useClickOutside } from "hooks";

function Tooltip({
  isOpen,
  onClose,
  children,
  triggerRef,
  title,
  description,
  ariaDescribedBy = "tooltip-description",
}) {
  const tooltipRef = useRef(null);

  // Handle click outside to close (excluding trigger button)
  const handleClickOutside = useCallback(
    (event) => {
      // Don't close if clicking on the trigger button
      if (triggerRef?.current?.contains(event.target)) {
        return;
      }
      if (isOpen) {
        onClose();
      }
    },
    [isOpen, onClose, triggerRef]
  );

  useClickOutside(tooltipRef, handleClickOutside);

  if (!isOpen) return null;

  return (
    <div className="absolute left-1/2 transform -translate-x-1/2 top-full mt-2 z-50">
      <div
        ref={tooltipRef}
        role="tooltip"
        aria-live="polite"
        aria-describedby={ariaDescribedBy}
        tabIndex={0}
        className="bg-gray-900 text-white text-sm rounded-lg shadow-xl text-left border border-gray-800 animate-fade-in focus:outline-none focus:ring-2 focus:ring-blue-500"
        style={{
          width: "300px",
          maxWidth: "90vw",
        }}
      >
        {/* Close button for additional accessibility */}
        <button
          onClick={onClose}
          className="absolute text-gray-400 hover:text-white focus:text-white focus:outline-none hover:bg-gray-700 rounded-full p-1 transition-colors duration-200 z-10"
          style={{ top: "8px", right: "8px" }}
          aria-label="Close tooltip"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

        <div className="px-6 py-4 pr-10">
          {title && (
            <div className="font-semibold mb-2 text-blue-400">{title}</div>
          )}
          {description && (
            <div
              id={ariaDescribedBy}
              className="text-sm text-gray-300 leading-relaxed"
            >
              {description}
            </div>
          )}
          {children}
        </div>
      </div>
    </div>
  );
}

export default Tooltip;
