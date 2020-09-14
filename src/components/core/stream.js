import React, { useEffect, useRef } from "react";
import {
  curveCardinal,
  scaleOrdinal,
  scaleBand,
  schemeDark2,
  schemeSet3,
  select,
  area,
  axisBottom,
  easeBackIn,
  brushX,
  event,
} from "d3";
import { usePreviousValue } from "hooks";

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
  const svgRef = useRef();
  const axisNodesRef = useRef();
  const legendRef = useRef();
  const brushRef = useRef();
  const prevBrushRange = usePreviousValue(brushRange);

  useEffect(() => {
    const {
      streamSizeScale,
      stackedLayers,
      boxWidth,
      fields,
      allWords,
      dates,
    } = wordsData;

    const svg = select(svgRef.current);
    const axisNodes = select(axisNodesRef.current);
    const legend = select(legendRef.current);
    const brushNode = select(brushRef.current);

    const xAxisScale = scaleBand().domain(dates).range([0, dimensions[0]]);
    axisNodes.call(axisBottom(xAxisScale));
    axisNodes
      .selectAll("text")
      .attr("stroke", "white")
      .attr("stroke-width", 0.5);
    axisNodes.attr("transform", `translate(0, ${dimensions[1] - 100})`);

    const colorScheme = scaleOrdinal([...schemeSet3, ...schemeDark2]);
    const areaFn = area()
      .curve(curveCardinal)
      .x((d, i) => i * boxWidth)
      .y0((d) => streamSizeScale(d[0]))
      .y1((d) => streamSizeScale(d[1]));

    legend.selectAll("*").remove();
    legend.attr("transform", `translate(${dimensions[0] - 150}, 20)`);
    const legendSelection = legend
      .selectAll(".legendNode")
      .data(fields, (d) => d);

    legendSelection
      .join("circle")
      .attr("r", 5)
      .attr("cy", (d, i) => i * 20)
      .attr("fill", (d, i) => colorScheme(i))
      .attr("fill-opacity", 1)
      .attr("stroke", "white")
      .attr("stroke-width", 0.5);

    legendSelection
      .join("text")
      .text((d) => d)
      .attr("y", (d, i) => i * 20 + 3)
      .attr("font-size", 10)
      .attr("alignment-baseling", "middle")
      .attr("stroke", "white")
      .attr("dx", 10);

    svg
      .selectAll(".curve")
      .data(stackedLayers)
      .join("path")
      .attr("class", "curve")
      .transition()
      .attr("d", areaFn)
      .ease(easeBackIn)
      .duration(400)
      .attr("fill-opacity", 0.4)
      .attr("stroke-width", 0)
      .attr("stroke", "white")
      .attr("topic", (d, i) => fields[i])
      .style("fill", (d, i) => colorScheme(i));

    svg
      .selectAll(".word")
      .data(allWords, (d) => d.id)
      .join(
        (enter) =>
          enter
            .append("g")
            .attr("class", "word")
            .attr(
              "transform",
              (d) => `translate(${d.x}, ${d.y}) rotate(${d.rotate})`
            )
            .append("text")
            .text((d) => d.text)
            .attr("id", (d) => d.id)
            .attr("font-family", "Arial")
            .attr("font-size", (d) => d.fontSize)
            .attr("fill", (d) => colorScheme(fields.indexOf(d.topic)))
            .attr("fill-opacity", 1)
            .attr("text-anchor", "middle")
            .attr("topic", (d) => d.topic)
            .attr("display", (d) => (d.placed ? "block" : "none")),
        (update) =>
          update
            .transition()
            .attr(
              "transform",
              (d) => `translate(${d.x}, ${d.y}) rotate(${d.rotate})`
            )
            .ease(easeBackIn)
            .delay(200)
            .duration(400)
            .select("text")
            .attr("topic", (d) => d.topic)
            .attr("fill", (d) => colorScheme(fields.indexOf(d.topic)))
            .attr("font-size", function (d) {
              return d.fontSize;
            })
            .attr("display", (d) => (d.placed ? "block" : "none")),
        (exit) => exit.remove()
      );
    function scaleBandInvert(scale) {
      const domain = scale.domain();
      const paddingOuter = scale(domain[0]);
      const eachBand = scale.step();
      return function (value) {
        const index = Math.floor((value - paddingOuter) / eachBand);
        return domain[Math.max(0, Math.min(index, domain.length - 1))];
      };
    }
    const brush = brushX()
      .extent([
        [0, 0],
        [dimensions[0], dimensions[1] - 100],
      ])
      .on("end", () => {
        if (event.selection) {
          const dRangeX = event.selection.map(scaleBandInvert(xAxisScale));
          setBrushRange(dRangeX);
        }
      });
    brushNode.call(brush);
    if (clearBrush) {
      brushNode.call(brush.move, null);
    }
  }, [wordsData, dimensions, setBrushRange, clearBrush]);

  useEffect(() => {
    if (!rawData || !brushRange) return;
    if (
      prevBrushRange &&
      prevBrushRange[0] === brushRange[0] &&
      prevBrushRange[1] === brushRange[1]
    )
      return;
    const selectedData = rawData.filter((item) =>
      brushRange.includes(item.date)
    );
    let words = [];
    selectedData.forEach((item) => {
      Object.values(item.words).forEach((arr) => words.push(...arr));
    });
    words.sort((a, b) => b.views - a.views);
    words = words.slice(0, 10);
    setSubGraphData(words);
    setDisplayBarChart(true);
    setClearBrush(false);
  }, [
    setSubGraphData,
    rawData,
    brushRange,
    setDisplayBarChart,
    prevBrushRange,
    setClearBrush,
  ]);

  return (
    <div
      className={`
                w-full h-full
            `}
    >
      <svg
        viewBox={`0 0 ${dimensions[0]} ${dimensions[1]}`}
        style={{
          overflow: "visible",
          display: "block",
          width: "100%",
          height: "100%",
        }}
        ref={svgRef}
      >
        <g ref={axisNodesRef} />
        <g ref={legendRef} />
        <g ref={brushRef} />
      </svg>
    </div>
  );
}

export default React.memo(WordStream);
