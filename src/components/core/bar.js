import React, { useRef, useEffect } from 'react';
import * as d3 from 'd3';
import { useResizeObserver } from 'hooks';
import { SecondaryHeading, Paragraph } from 'components/common';

function Bar({ data, wordsData, brushRange, setDetailsData, detailsData }) {
	const wrapperRef = useRef();
	const svgRef = useRef();
	const dimensions = useResizeObserver(wrapperRef);
	const clickedItem = useRef();

	useEffect(() => {
		if (!data || !dimensions) return;

		const svg = d3.select(svgRef.current);

		const colorScheme = d3.scaleOrdinal([...d3.schemeSet3, ...d3.schemeDark2]);
		const { fields } = wordsData;

		const yScale = d3
			.scaleBand()
			.paddingInner(0.1)
			.domain(data.map((value, index) => index)) // [0,1,2,3,4,5]
			.range([0, dimensions.height]); // [0, 200]

		const xScale = d3
			.scaleLinear()
			.domain([0, d3.max(data, (entry) => entry.views)]) // [0, 65 (example)]
			.range([0, dimensions.width]); // [0, 400 (example)]

		svg
			.selectAll('.bar')
			.data(data, (entry, index) => entry.id)
			.join((enter) =>
				enter.append('rect').attr('y', (entry, index) => yScale(index))
				.on('click', (entry) => {
					clickedItem.current = entry;
					setDetailsData(entry);
				})
				.on('mouseover', function() {
					d3.select(this).style('cursor', 'pointer');
					d3.select(this).attr('fill-opacity', '0.8');
				})
				.on('mouseout', function(entry) {
					const selectedItem = detailsData && entry.id === detailsData.id;
					if(selectedItem) {
						d3.select(this).attr('fill-opacity', '0.8');
					} else {
						if(clickedItem.current && clickedItem.current.id === entry.id) {
							d3.select(this).attr('fill-opacity', '0.8');
						} else {
							d3.select(this).attr('fill-opacity', '0.4');
						}
					}
				})
			)
			.attr('fill', (entry) => colorScheme(fields.indexOf(entry.topic)))
			.attr('fill-opacity', (entry) => {
				const selectedItem = detailsData && entry.id === detailsData.id;
				if(selectedItem) return 0.8;
				return 0.4;
			})
			.attr('class', 'bar')
			.attr('x', 0)
			.attr('height', yScale.bandwidth())
			.transition()
			.attr('width', (entry) => xScale(entry.views))
			.attr('y', (entry, index) => yScale(index));

		svg
			.selectAll('.label')
			.data(data, (entry, index) => entry.id)
			.join((enter) =>
				enter
					.append('text')
					.on('click', (entry) => {
						clickedItem.current = entry;
						setDetailsData(entry);
					})
					.attr(
						'y',
						(entry, index) => yScale(index) + yScale.bandwidth() / 2 + 5
					)
			)
			.attr('fill', (entry) => {
				const selectedItem = detailsData && entry.id === detailsData.id;
				if(selectedItem) return '#303030';
				return colorScheme(fields.indexOf(entry.topic))
			})
			.text((entry) => `${entry.text}`)
			.attr('class', 'label')
			.attr('x', 10)
			.transition()
			.attr('y', (entry, index) => yScale(index) + yScale.bandwidth() / 2 + 5);
	}, [dimensions, data, wordsData, setDetailsData, detailsData, clickedItem]);

	return (
		<div
			className={`
				w-full h-full
				flex flex-col 
			`}
		>
			<div
				className={`
					w-full 
					flex flex-col justify-center items-center
					p-2
				`}
			>
				<SecondaryHeading> Most Viewed Channels </SecondaryHeading>
				<Paragraph> {`Between ${brushRange[0]} & ${brushRange[1]}`} </Paragraph>
			</div>
			<div
				ref={wrapperRef}
				className={`
					w-full flex-1
					relative
					p-2
				`}
			>
				<svg
					ref={svgRef}
					className={`
						w-full h-full
						block
					`}
				/>
			</div>
		</div>
	);
}

export default Bar;
