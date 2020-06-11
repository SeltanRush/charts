import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

interface IChartData {
  value: number;
  name: string;
}

interface ILocalProps {
  data: IChartData[];
}

const ScatterPlot: React.FC<ILocalProps> = ({ data }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef && containerRef.current) {
      drawChart({
        container: containerRef.current,
        data,
      });
    }
  }, [containerRef, data]);

  return <div ref={containerRef}></div>;
};

const drawChart = ({ container, data }: { container: HTMLDivElement; data: IChartData[] }) => {
  const margin = {
    top: 60,
    left: 60,
    right: 60,
    bottom: 60,
  };

  const width = 900 - margin.left - margin.right;
  const height = 600 - margin.top - margin.bottom;

  const svg = d3
    .select(container)
    .append('svg')
    .attr('width', width + margin.left + margin.right)
    .attr('height', height + margin.top + margin.bottom)
    .append('g')
    .attr('transform', `translate(${margin.top}, ${margin.left})`);

  const yScale = d3
    .scaleLinear()
    .domain([0, d3.max(data, yValue) || 0])
    .range([height, 0])
    .nice();

  const xScale = d3.scalePoint().domain(data.map(xValue)).range([0, width]).padding(0.3);

  const yAxisG = svg.append('g');
  yAxisG.call(d3.axisLeft(yScale).ticks(10).tickFormat(d3.format('.3s')).tickSize(-width));

  const xAxisG = svg.append('g').attr('transform', `translate(0, ${height})`);

  xAxisG.call(d3.axisBottom(xScale).tickSize(-height));

  svg.selectAll('.domain').remove();
  svg.selectAll('.tick line').style('opacity', '0.5');

  svg.selectAll('text').style('font-size', '12px');

  yAxisG
    .append('text')
    .attr('fill', 'black')
    .style('font-size', '12px')
    .style('text-anchor', 'end')
    .attr('dx', 0)
    .attr('dy', -10)
    .text('Population');

  svg
    .selectAll('circle')
    .data(data)
    .enter()
    .append('circle')
    .attr('cy', (d) => yScale(yValue(d)))
    .attr('cx', (d) => xScale(xValue(d)) || 0)
    .attr('r', 10)
    .attr('fill', 'steelblue');
};

const xValue = (d: IChartData) => d.name;
const yValue = (d: IChartData) => d.value;

export default ScatterPlot;
