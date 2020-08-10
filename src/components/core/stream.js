import React, { useEffect, useRef, useState } from 'react';
import { curveCardinal, scaleOrdinal, scaleBand, schemeDark2, schemeSet3, select, area, axisBottom, easeBackIn } from 'd3';

function WordStream({wordsData, dimensions}) {
    const svgRef = useRef();
    const axisNodesRef = useRef();
    const legendRef = useRef();

    useEffect(()=>{
        const {streamSizeScale, stackedLayers, boxWidth, fields, allWords, dates} = wordsData;

        const svg = select(svgRef.current);
        const axisNodes = select(axisNodesRef.current);
        const legend = select(legendRef.current);

        const xAxisScale = scaleBand().domain(dates).range([0, dimensions[0]]);
        axisNodes.call(axisBottom(xAxisScale));
        axisNodes.selectAll('text').attr('stroke', 'white').attr('stroke-width', 0.5);
        axisNodes.attr('transform', `translate(0, ${dimensions[1] - 100})`);

        const colorScheme = scaleOrdinal([...schemeSet3, ...schemeDark2]);
        const areaFn = area()
        .curve(curveCardinal)
        .x((d, i)=>i*boxWidth)
        .y0((d)=>streamSizeScale(d[0]))
        .y1((d)=>streamSizeScale(d[1]));

        legend.selectAll('*').remove();
        legend.attr('transform', `translate(${dimensions[0] - 150}, 20)`);
        const legendSelection = legend.selectAll('.legendNode').data(fields, d=>d);

        legendSelection
        .join('circle')
        .attr('r', 5)
        .attr('cy', (d, i)=>(i)*20)
        .attr('fill', (d, i)=>colorScheme(i))
        .attr('fill-opacity', 1)
        .attr('stroke', 'white')
        .attr('stroke-width', 0.5);

        legendSelection
        .join('text')
        .text(d=>d)
        .attr('y', (d, i)=>(i)*20 + 3)
        .attr('font-size', 10)
        .attr('alignment-baseling', 'middle')
        .attr('stroke', 'white')
        .attr('dx', 10);


        svg.selectAll('.curve').data(stackedLayers)
        .join('path')
        .attr('class', 'curve')
        .transition()
        .attr('d', areaFn)
        .ease(easeBackIn).duration(400)
        .attr('fill-opacity', 0.4)
        .attr('stroke-width', 0)
        .attr('stroke', 'white')
        .attr('topic', (d,i)=>fields[i])
        .style('fill', (d,i)=>colorScheme(i));

        svg
        .selectAll('.word').data(allWords, d=>d.id)
        .join(enter=>
            enter
            .append('g')
            .attr('class', 'word')
            .attr('transform', d=>`translate(${d.x}, ${d.y}) rotate(${d.rotate})`)
            .append('text')
            .text(d=>d.text)
            .attr('id', d=>d.id)
            .attr('font-family', 'Arial')
            .attr('font-size', d=>d.fontSize)
            .attr('fill', d=>colorScheme(fields.indexOf(d.topic)))
            .attr('fill-opacity', 1)
            .attr('text-anchor', 'middle')
            .attr('topic', d=>d.topic)
            .attr('display', d=>d.placed?'block':'none'),
            update=>
            update
            .transition()
            .attr('transform', d=>`translate(${d.x}, ${d.y}) rotate(${d.rotate})`)
            .ease(easeBackIn).delay(200).duration(400)
            .select('text')
            .attr('topic', d=>d.topic)
            .attr('fill', d=>colorScheme(fields.indexOf(d.topic)))
            .attr('font-size', function (d) {
                return d.fontSize;
            })
            .attr('display', d=>d.placed?'block':'none'),
            exit=>exit.remove()
        );

    }, [wordsData, dimensions]);

    return (
        <div 
            className={`
                w-full h-full
            `}
        >
            <svg 
                viewBox={`0 0 ${dimensions[0]} ${dimensions[1]}`}
                style={{
                    overflow: 'visible',
                    display: 'block',
                    width: '100%',
                    height: '100%'
                }}
                ref={svgRef}
            > 
                {/* <g ref={svgRef} /> */}
                <g ref={axisNodesRef} /> 
                <g ref={legendRef} />
            </svg>
        </div>
    )
}

export default React.memo(WordStream);