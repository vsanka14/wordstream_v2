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
  const [isMoving, setIsMoving] = useState(false);
  const [dragStart, setDragStart] = useState(null);
  const [moveOffset, setMoveOffset] = useState(0);

  const { streamSizeScale, stackedLayers, boxWidth, fields, allWords, dates } =
    wordsData;

  // D3 calculations only - no DOM manipulation
  const xAxisScale = scaleBand().domain(dates).range([0, dimensions[0]]);

  // Use original D3 color schemes with better contrast for dark backgrounds
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

  // Convert screen coordinates to SVG coordinates
  const screenToSVGCoords = (svg, clientX, clientY) => {
    const rect = svg.getBoundingClientRect();
    const x = ((clientX - rect.left) / rect.width) * dimensions[0];
    const y = ((clientY - rect.top) / rect.height) * dimensions[1];
    return { x, y };
  };

  // Check if click is inside existing brush
  const isInsideBrush = (x) => {
    if (!brushSelection) return false;
    const [x0, x1] = brushSelection;
    return x >= x0 && x <= x1;
  };

  // Handle brush interactions
  const handleMouseDown = (e) => {
    const svg = e.currentTarget;
    const { x } = screenToSVGCoords(svg, e.clientX, e.clientY);

    // Check if clicking inside existing brush to move it
    if (isInsideBrush(x)) {
      setIsMoving(true);
      setMoveOffset(x);
    } else {
      // Create new brush
      setIsDragging(true);
      setDragStart(x);
      setBrushSelection([x, x]);
    }
  };

  const handleMouseMove = (e) => {
    const svg = e.currentTarget;
    const { x } = screenToSVGCoords(svg, e.clientX, e.clientY);

    if (isMoving && brushSelection) {
      // Move existing brush
      const [x0, x1] = brushSelection;
      const width = x1 - x0;
      const delta = x - moveOffset;
      const newX0 = Math.max(0, Math.min(dimensions[0] - width, x0 + delta));
      const newX1 = newX0 + width;
      setBrushSelection([newX0, newX1]);
      setMoveOffset(x);
    } else if (isDragging && dragStart !== null) {
      // Create new brush
      setBrushSelection([Math.min(dragStart, x), Math.max(dragStart, x)]);
    }
  };

  const handleMouseUp = () => {
    if (!isDragging && !isMoving) return;

    if (!brushSelection) {
      setIsDragging(false);
      setIsMoving(false);
      return;
    }

    setIsDragging(false);
    setIsMoving(false);

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

    // Process brush selection - get all dates between start and end
    const startIndex = domain.indexOf(startDate);
    const endIndex = domain.indexOf(endDate);
    const selectedDates = domain.slice(
      Math.min(startIndex, endIndex),
      Math.max(startIndex, endIndex) + 1
    );

    const selectedData = rawData.filter((item) =>
      selectedDates.includes(item.date)
    );

    console.log("Selected dates:", selectedDates);
    console.log("Selected data items:", selectedData.length);
    console.log("First item structure:", selectedData[0]);

    let words = [];
    selectedData.forEach((item) => {
      Object.values(item.words).forEach((arr) => words.push(...arr));
    });

    console.log("Total words before sort:", words.length);
    console.log(
      "Words by topic:",
      words.reduce((acc, w) => {
        acc[w.topic] = (acc[w.topic] || 0) + 1;
        return acc;
      }, {})
    );

    words.sort((a, b) => b.views - a.views);
    words = words.slice(0, 10);

    console.log(
      "Top 10 words:",
      words.map((w) => ({ text: w.text, topic: w.topic, views: w.views }))
    );

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
          cursor: isDragging
            ? "col-resize"
            : isMoving
            ? "grab"
            : brushSelection && isInsideBrush
            ? "move"
            : "crosshair",
        }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={() => (isDragging || isMoving) && handleMouseUp()}
      >
        {/* Render curves */}
        {curvePaths.map((curve) => (
          <path
            key={curve.id}
            d={curve.path}
            fill={curve.color}
            fillOpacity={0.65}
            stroke={curve.color}
            strokeWidth={1}
            strokeOpacity={0.8}
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
                fill="white"
                fillOpacity={1}
                textAnchor="middle"
                stroke={colorScheme(fields.indexOf(word.topic))}
                strokeWidth={0.5}
                style={{
                  transition: "font-size 250ms ease-out",
                  fontWeight: "600",
                  paintOrder: "stroke fill",
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
            stroke="#aaaaaa"
            strokeWidth={2}
          />
          {axisTicks.map((tick) => (
            <g key={tick.date} transform={`translate(${tick.x}, 0)`}>
              <line
                x1={0}
                x2={0}
                y1={0}
                y2={6}
                stroke="#aaaaaa"
                strokeWidth={1}
              />
              <text
                y={9}
                dy="0.71em"
                textAnchor="middle"
                fontSize={11}
                fill="white"
                fontWeight="500"
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
                r={6}
                cy={i * 20}
                fill={colorScheme(i)}
                fillOpacity={0.9}
                stroke="white"
                strokeWidth={1.5}
              />
              <text
                y={i * 20 + 4}
                dx={12}
                fontSize={11}
                fill="white"
                fontWeight="500"
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
            fill="rgba(255, 255, 255, 0.15)"
            stroke="white"
            strokeWidth={2}
            strokeOpacity={0.8}
            pointerEvents="none"
          />
        )}
      </svg>
    </div>
  );
}

export default React.memo(WordStream);
