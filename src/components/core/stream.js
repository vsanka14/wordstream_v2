import React, { useState } from "react";
import {
  curveCardinal,
  scaleOrdinal,
  scaleBand,
  schemeDark2,
  schemeSet3,
  area,
} from "d3";

function WordStream({
  rawData,
  wordsData,
  dimensions,
  setSubGraphData,
  setDisplayBarChart,
  brushRange,
  setBrushRange,
  clearBrush,
  setClearBrush,
}) {
  const [brushSelection, setBrushSelection] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState(null);

  const { streamSizeScale, stackedLayers, boxWidth, fields, allWords, dates } =
    wordsData;

  // D3 calculations only - no DOM manipulation
  const xAxisScale = scaleBand().domain(dates).range([0, dimensions[0]]);

  const colorScheme = scaleOrdinal([...schemeSet3, ...schemeDark2]);

  const areaFn = area()
    .curve(curveCardinal)
    .x((d, i) => i * boxWidth)
    .y0((d) => streamSizeScale(d[0]))
    .y1((d) => streamSizeScale(d[1]));

  // Generate axis ticks
  const axisTicks = dates.map((date) => ({
    date,
    x: xAxisScale(date) + xAxisScale.bandwidth() / 2,
  }));

  // Generate path data for curves
  const curvePaths = stackedLayers.map((layer, i) => ({
    id: fields[i],
    path: areaFn(layer),
    color: colorScheme(i),
  }));

  // Handle brush interactions
  const handleMouseDown = (e) => {
    const svg = e.currentTarget;
    const rect = svg.getBoundingClientRect();
    const x = e.clientX - rect.left;
    setIsDragging(true);
    setDragStart(x);
    setBrushSelection([x, x]);
  };

  const handleMouseMove = (e) => {
    if (!isDragging || dragStart === null) return;
    const svg = e.currentTarget;
    const rect = svg.getBoundingClientRect();
    const x = e.clientX - rect.left;
    setBrushSelection([Math.min(dragStart, x), Math.max(dragStart, x)]);
  };

  const handleMouseUp = () => {
    if (!isDragging || !brushSelection) {
      setIsDragging(false);
      return;
    }

    setIsDragging(false);

    // Convert pixel positions to dates
    const [x0, x1] = brushSelection;
    const domain = xAxisScale.domain();
    const paddingOuter = xAxisScale(domain[0]);
    const eachBand = xAxisScale.step();

    const index0 = Math.floor((x0 - paddingOuter) / eachBand);
    const index1 = Math.floor((x1 - paddingOuter) / eachBand);

    const startDate = domain[Math.max(0, Math.min(index0, domain.length - 1))];
    const endDate = domain[Math.max(0, Math.min(index1, domain.length - 1))];

    const dRangeX = [startDate, endDate];
    setBrushRange(dRangeX);

    // Process brush selection
    const selectedData = rawData.filter((item) => dRangeX.includes(item.date));
    let words = [];
    selectedData.forEach((item) => {
      Object.values(item.words).forEach((arr) => words.push(...arr));
    });
    words.sort((a, b) => b.views - a.views);
    words = words.slice(0, 10);
    setSubGraphData(words);
    setDisplayBarChart(true);
    setClearBrush(false);
  };

  // Clear brush when requested
  if (clearBrush && brushSelection) {
    setBrushSelection(null);
    setClearBrush(false);
  }

  return (
    <div className="w-full h-full">
      <svg
        viewBox={`0 0 ${dimensions[0]} ${dimensions[1]}`}
        style={{
          overflow: "visible",
          display: "block",
          width: "100%",
          height: "100%",
          cursor: isDragging ? "col-resize" : "crosshair",
        }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={() => isDragging && handleMouseUp()}
      >
        {/* Render curves */}
        {curvePaths.map((curve) => (
          <path
            key={curve.id}
            d={curve.path}
            fill={curve.color}
            fillOpacity={0.4}
            stroke="white"
            strokeWidth={0}
            style={{
              transition: "d 250ms ease-out, fill 250ms ease-out",
            }}
          />
        ))}

        {/* Render words */}
        {allWords
          .filter((word) => word.placed)
          .map((word) => (
            <g
              key={word.id}
              transform={`translate(${word.x}, ${word.y}) rotate(${word.rotate})`}
              style={{
                transition: "transform 250ms ease-out",
                willChange: "transform",
              }}
            >
              <text
                fontFamily="Arial"
                fontSize={word.fontSize}
                fill={colorScheme(fields.indexOf(word.topic))}
                fillOpacity={1}
                textAnchor="middle"
                style={{
                  transition: "font-size 250ms ease-out, fill 250ms ease-out",
                }}
              >
                {word.text}
              </text>
            </g>
          ))}

        {/* Render axis */}
        <g transform={`translate(0, ${dimensions[1] - 100})`}>
          <line
            x1={0}
            x2={dimensions[0]}
            y1={0}
            y2={0}
            stroke="currentColor"
            strokeWidth={1}
          />
          {axisTicks.map((tick) => (
            <g key={tick.date} transform={`translate(${tick.x}, 0)`}>
              <line
                x1={0}
                x2={0}
                y1={0}
                y2={6}
                stroke="currentColor"
                strokeWidth={1}
              />
              <text
                y={9}
                dy="0.71em"
                textAnchor="middle"
                fontSize={10}
                stroke="white"
                strokeWidth={0.5}
                fill="white"
              >
                {tick.date}
              </text>
            </g>
          ))}
        </g>

        {/* Render legend */}
        <g transform={`translate(${dimensions[0] - 150}, 20)`}>
          {fields.map((field, i) => (
            <g key={field}>
              <circle
                r={5}
                cy={i * 20}
                fill={colorScheme(i)}
                fillOpacity={1}
                stroke="white"
                strokeWidth={0.5}
              />
              <text
                y={i * 20 + 3}
                dx={10}
                fontSize={10}
                fill="white"
                stroke="white"
                strokeWidth={0.3}
              >
                {field}
              </text>
            </g>
          ))}
        </g>

        {/* Render brush selection overlay */}
        {brushSelection && (
          <rect
            x={brushSelection[0]}
            y={0}
            width={brushSelection[1] - brushSelection[0]}
            height={dimensions[1] - 100}
            fill="rgba(128, 128, 128, 0.3)"
            stroke="white"
            strokeWidth={1}
            pointerEvents="none"
          />
        )}
      </svg>
    </div>
  );
}

export default React.memo(WordStream);
