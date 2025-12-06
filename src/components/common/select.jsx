import React, { useState, useRef } from "react";
import cx from "classnames";
import { useClickOutside } from "hooks";

// Single Select Component with custom dropdown
export function Select({ value, options, onChange, name, className }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useClickOutside(dropdownRef, () => setIsOpen(false));

  const handleSelect = (option) => {
    onChange(option);
    setIsOpen(false);
  };

  const displayText = value?.label || "Select an option...";

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={cx(
          "w-full px-3 py-2 bg-gray-800 text-white border border-gray-700 rounded-md",
          "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent",
          "cursor-pointer text-left flex items-center justify-between",
          className
        )}
      >
        <span className="truncate">{displayText}</span>
        <svg
          className={cx(
            "w-5 h-5 ml-2 transition-transform flex-shrink-0",
            isOpen && "transform rotate-180"
          )}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute z-50 w-full mt-1 bg-gray-800 border border-gray-700 rounded-md shadow-lg max-h-60 overflow-y-auto">
          {options.map((option) => {
            const isSelected = value?.value === option.value;
            return (
              <div
                key={option.value}
                onClick={() => handleSelect(option)}
                className={cx(
                  "px-3 py-2 hover:bg-gray-700 cursor-pointer transition-colors",
                  isSelected && "bg-blue-600 hover:bg-blue-700"
                )}
              >
                <span className="text-white">{option.label}</span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// Multi Select Component with custom dropdown
export function MultiSelect({ value, options, onChange, name, className }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const selectedValues = value ? value.map((v) => v.value) : [];

  // Close dropdown when clicking outside
  useClickOutside(dropdownRef, () => setIsOpen(false));

  const handleToggle = (option) => {
    const isSelected = selectedValues.includes(option.value);
    let newSelected;

    if (isSelected) {
      newSelected = value.filter((v) => v.value !== option.value);
    } else {
      newSelected = [...(value || []), option];
    }

    onChange(newSelected);
  };

  const handleSelectAll = () => {
    if (selectedValues.length === options.length) {
      onChange([]);
    } else {
      onChange([...options]);
    }
  };

  const displayText =
    value && value.length > 0
      ? value.length === 1
        ? value[0].label
        : `${value.length} selected`
      : "Select options...";

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={cx(
          "w-full px-3 py-2 bg-gray-800 text-white border border-gray-700 rounded-md",
          "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent",
          "cursor-pointer text-left flex items-center justify-between",
          className
        )}
      >
        <span className="truncate">{displayText}</span>
        <svg
          className={cx(
            "w-5 h-5 ml-2 transition-transform flex-shrink-0",
            isOpen && "transform rotate-180"
          )}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute z-50 w-full mt-1 bg-gray-800 border border-gray-700 rounded-md shadow-lg max-h-60 overflow-y-auto">
          {/* Select All Option */}
          <div
            onClick={handleSelectAll}
            className="px-3 py-2 hover:bg-gray-700 cursor-pointer border-b border-gray-700 flex items-center"
          >
            <input
              type="checkbox"
              checked={selectedValues.length === options.length}
              onChange={() => {}}
              className="mr-2 w-4 h-4 cursor-pointer"
            />
            <span className="text-white font-semibold">
              {selectedValues.length === options.length
                ? "Deselect All"
                : "Select All"}
            </span>
          </div>

          {/* Options */}
          {options.map((option) => {
            const isSelected = selectedValues.includes(option.value);
            return (
              <div
                key={option.value}
                onClick={() => handleToggle(option)}
                className={cx(
                  "px-3 py-2 hover:bg-gray-700 cursor-pointer flex items-center transition-colors",
                  isSelected && "bg-gray-750"
                )}
              >
                <input
                  type="checkbox"
                  checked={isSelected}
                  onChange={() => {}}
                  className="mr-2 w-4 h-4 cursor-pointer"
                />
                <span className="text-white">{option.label}</span>
              </div>
            );
          })}
        </div>
      )}

      {/* Selected count indicator */}
      {value && value.length > 0 && (
        <div className="mt-1 flex flex-wrap gap-1">
          {value.slice(0, 3).map((item) => (
            <span
              key={item.value}
              className="inline-flex items-center px-2 py-1 text-xs bg-blue-600 text-white rounded"
            >
              {item.label}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleToggle(item);
                }}
                className="ml-1 hover:text-gray-300"
              >
                ×
              </button>
            </span>
          ))}
          {value.length > 3 && (
            <span className="inline-flex items-center px-2 py-1 text-xs bg-gray-700 text-gray-300 rounded">
              +{value.length - 3} more
            </span>
          )}
        </div>
      )}
    </div>
  );
}
