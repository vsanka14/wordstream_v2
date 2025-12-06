import React, { useRef, useEffect } from "react";
import * as d3 from "d3";
import { useResizeObserver } from "hooks";

function Bar({ data, wordsData, brushRange, setDetailsData, detailsData }) {
  const wrapperRef = useRef();
  const svgRef = useRef();
  const dimensions = useResizeObserver(wrapperRef);

  useEffect(() => {
    if (!data || !dimensions) return;

    const svg = d3.select(svgRef.current);

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

    // Create groups for each bar + label pair
    const barGroups = svg
      .selectAll(".bar-group")
      .data(data, (entry) => entry.id)
      .join((enter) =>
        enter.append("g").attr("class", "bar-group").style("cursor", "pointer")
      );

    // Add/update rectangles
    barGroups.each(function (entry, index) {
      const group = d3.select(this);
      const isSelected = detailsData && entry.id === detailsData.id;

      // Rectangle
      let rect = group.select("rect");
      if (rect.empty()) {
        rect = group.append("rect");
      }
      rect
        .attr("fill", colorScheme(fields.indexOf(entry.topic)))
        .attr("fill-opacity", isSelected ? 0.9 : 0.5)
        .attr("x", 0)
        .attr("height", yScale.bandwidth())
        .attr("width", xScale(entry.views))
        .attr("y", yScale(index));

      // Text label
      let text = group.select("text");
      if (text.empty()) {
        text = group.append("text");
      }
      text
        .attr(
          "fill",
          isSelected ? "#202020" : colorScheme(fields.indexOf(entry.topic))
        )
        .attr("font-weight", isSelected ? "bold" : "normal")
        .attr("x", 10)
        .attr("y", yScale(index) + yScale.bandwidth() / 2 + 5)
        .style("pointer-events", "none")
        .style("user-select", "none")
        .text(entry.text);
    });

    // Event handlers on group level (D3 v5 API: data is first argument)
    barGroups
      .on("click", function (entry) {
        setDetailsData(entry);
      })
      .on("mouseenter", function (entry) {
        const isSelected = detailsData && entry.id === detailsData.id;
        if (!isSelected) {
          d3.select(this).select("rect").attr("fill-opacity", 0.75);
        }
      })
      .on("mouseleave", function (entry) {
        const isSelected = detailsData && entry.id === detailsData.id;
        d3.select(this)
          .select("rect")
          .attr("fill-opacity", isSelected ? 0.9 : 0.5);
      });
  }, [dimensions, data, wordsData, setDetailsData, detailsData]);

  return (
    <div className="w-full h-full flex flex-col">
      <div className="w-full flex justify-center items-center p-1 gap-2">
        <h3 className="text-gray-200 text-sm md:text-base font-semibold">
          Most Viewed Channels
        </h3>
        <span className="text-gray-400 text-xs">{`(${brushRange[0]} - ${brushRange[1]})`}</span>
      </div>
      <div ref={wrapperRef} className="w-full flex-1 relative p-2">
        <svg ref={svgRef} className="w-full h-full block" />
      </div>
    </div>
  );
}

export default Bar;
