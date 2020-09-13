import React, { useRef, useEffect } from 'react';
import * as d3 from 'd3';
import { useResizeObserver } from 'hooks';
import { SecondaryHeading, Paragraph } from 'components/styled';

function Bar({ data, wordsData, brushRange }) {
	const wrapperRef = useRef();
	const svgRef = useRef();
	const tooltipRef = useRef()
	const dimensions = useResizeObserver(wrapperRef);

	useEffect(() => {
        if (!data || !dimensions) return;
        console.log(`dimensions: `, dimensions);

		const svg = d3.select(svgRef.current);
		const tooltip = d3.select(tooltipRef.current);

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
				.on('mouseover', () => {
					tooltip
					.style('visibility', 'visible')
				})
				.on('mousemove', (entry) => {
					tooltip
					.html(`${entry.views} views`)
					.style('left', `${d3.event.pageX - svgRef.current.getBoundingClientRect().x + 10}px`)
					.style('top', `${d3.event.pageY - svgRef.current.getBoundingClientRect().y + 10}px`)
				})
				.on('mouseout', () => {
					tooltip
					.style('visibility', 'hidden')
				})
			)
            .attr('fill', (entry) => colorScheme(fields.indexOf(entry.topic)))
            .attr('fill-opacity', 0.4)
			.attr('class', 'bar')
			.attr('x', 0)
			.attr('height', yScale.bandwidth())
			.transition()
			.attr('width', (entry) => xScale(entry.views))
			.attr('y', (entry, index) => yScale(index))

		svg
			.selectAll('.label')
			.data(data, (entry, index) => entry.id)
			.join((enter) =>
				enter
					.append('text')
					.attr(
						'y',
						(entry, index) => yScale(index) + yScale.bandwidth() / 2 + 5
                    )
                    .attr('fill', (entry) => colorScheme(fields.indexOf(entry.topic)))
			)
			.text((entry) => `${entry.text}`)
			.attr('class', 'label')
			.attr('x', 10)
			.transition()
            .attr('y', (entry, index) => yScale(index) + yScale.bandwidth() / 2 + 5);
            
	}, [dimensions, data, wordsData]);

	return (
		<div
			className={`
				w-full h-full
			`}
		>
			<div
				className={`
					w-full 
					flex flex-col justify-center items-center
					p-2
					mb-2
				`}
				style={{
					height: '15%'
				}}
			>
				<SecondaryHeading> Most Viewed Channels </SecondaryHeading>
				<Paragraph> {`Between ${brushRange[0]} & ${brushRange[1]}`} </Paragraph>
			</div>
			<div
				ref={wrapperRef}
				className={`
					w-full 
					relative
				`}
				style={{
					height: '85%'
				}}
			>
				<div 
					ref={tooltipRef}
					className={`
						w-32 h-12
						bg-pink-500
						text-gray-200 text-base text-center
						absolute
						flex justify-center items-center
						invisible
						rounded
					`}
					style={{
						opacity: '90%'
					}}
				/>
				<svg 
					ref={svgRef}
					className={`
						w-full
						h-full
						overflow-visible
						block
					`}
				/>
			</div>
		</div>
	);
}

export default Bar;
