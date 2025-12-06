import React, { useState } from "react";
import * as d3 from "d3";
import { useResizeObserver } from "hooks";
import { IconX } from "icons";

function Bar({
  data,
  wordsData,
  brushRange,
  setDetailsData,
  detailsData,
  onClose,
}) {
  const [hoveredId, setHoveredId] = useState(null);
  const wrapperRef = React.useRef();
  const dimensions = useResizeObserver(wrapperRef);

  if (!data || !dimensions) {
    return (
      <div className="w-full h-full flex flex-col">
        <div className="w-full flex items-center p-1 gap-2">
          <button
            onClick={onClose}
            className="w-5 h-5 flex items-center justify-center rounded-full text-gray-400 hover:text-white hover:bg-gray-700 transition-colors duration-200 focus:outline-none"
            aria-label="Close detail view (Esc)"
            title="Close (Esc)"
          >
            <div className="w-3 h-3">
              <IconX />
            </div>
          </button>
          <h3 className="text-white text-sm md:text-base font-semibold">
            Most Viewed Channels
          </h3>
          {brushRange && (
            <span className="text-gray-400 text-xs">{`(${brushRange[0]} - ${brushRange[1]})`}</span>
          )}
        </div>
        <div ref={wrapperRef} className="w-full flex-1 relative p-2" />
      </div>
    );
  }

  // D3 for calculations only
  const colorScheme = d3.scaleOrdinal([...d3.schemeSet3, ...d3.schemeDark2]);
  const { fields } = wordsData;

  const yScale = d3
    .scaleBand()
    .paddingInner(0.1)
    .domain(data.map((value, index) => index))
    .range([0, dimensions.height]);

  const xScale = d3
    .scaleLinear()
    .domain([0, d3.max(data, (entry) => entry.views)])
    .range([0, dimensions.width]);

  // Event handlers
  const handleBarClick = (entry) => {
    setDetailsData(entry);
  };

  const handleMouseEnter = (entry) => {
    setHoveredId(entry.id);
  };

  const handleMouseLeave = () => {
    setHoveredId(null);
  };

  return (
    <div className="w-full h-full flex flex-col">
      <div className="w-full flex items-center p-1 gap-2">
        <button
          onClick={onClose}
          className="w-5 h-5 flex items-center justify-center rounded-full text-gray-400 hover:text-white hover:bg-gray-700 transition-colors duration-200 focus:outline-none"
          aria-label="Close detail view (Esc)"
          title="Close (Esc)"
        >
          <div className="w-3 h-3">
            <IconX />
          </div>
        </button>
        <h3 className="text-white text-sm md:text-base font-semibold">
          Most Viewed Channels
        </h3>
        <span className="text-gray-400 text-xs">{`(${brushRange[0]} - ${brushRange[1]})`}</span>
      </div>
      <div ref={wrapperRef} className="w-full flex-1 relative p-2">
        <svg className="w-full h-full block">
          {data.map((entry, index) => {
            const isSelected = detailsData && entry.id === detailsData.id;
            const isHovered = hoveredId === entry.id;
            const barColor = colorScheme(fields.indexOf(entry.topic));
            const barOpacity = isSelected ? 1 : isHovered ? 0.9 : 0.75;
            const textColor = "#ffffff";
            const textWeight = isSelected ? "bold" : "normal";

            return (
              <g
                key={entry.id}
                style={{ cursor: "pointer" }}
                onClick={() => handleBarClick(entry)}
                onMouseEnter={() => handleMouseEnter(entry)}
                onMouseLeave={handleMouseLeave}
              >
                <rect
                  fill={barColor}
                  fillOpacity={barOpacity}
                  x={0}
                  y={yScale(index)}
                  width={xScale(entry.views)}
                  height={yScale.bandwidth()}
                  style={{
                    transition: "fill-opacity 200ms ease-out",
                  }}
                />
                <text
                  fill={textColor}
                  fontWeight={textWeight}
                  x={10}
                  y={yScale(index) + yScale.bandwidth() / 2 + 5}
                  style={{
                    pointerEvents: "none",
                    userSelect: "none",
                    transition:
                      "fill 200ms ease-out, font-weight 200ms ease-out",
                  }}
                >
                  {entry.text}
                </text>
              </g>
            );
          })}
        </svg>
      </div>
    </div>
  );
}

export default Bar;
