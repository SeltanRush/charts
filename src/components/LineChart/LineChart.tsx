import * as d3 from 'd3';
import React, { useRef, useEffect } from 'react';

const margin = {
  top: 50,
  left: 50,
  right: 50,
  bottom: 50,
};

const width = 900 - margin.left - margin.right;
const height = 600 - margin.top - margin.bottom;

const LineChart = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef) {
      const svg = d3
        .select(containerRef.current)
        .append('svg')
        .attr('width', width + margin.left + margin.right)
        .attr('height', height + margin.top + margin.bottom)
        .append('g')
        .attr('transform', `translate(${margin.top}, ${margin.left})`);

      const x = d3.scaleBand().rangeRound([0, width]).padding(0.1);

      const y = d3.scaleLinear().range([0, height]);

      const xAxis = d3.axisBottom(x);
      const yAxis = d3.axisLeft(y).ticks(5);

      svg.append('g').attr('class', 'y grid').call(yAxis.ticks(5));

      svg.append('g').attr('class', 'x grid').call(xAxis);
    }
  }, [containerRef]);

  return <div ref={containerRef}></div>;
};

export default LineChart;
