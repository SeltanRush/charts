import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

const margin = {
  top: 60,
  left: 60,
  right: 60,
  bottom: 60,
};

const width = 900 - margin.left - margin.right;
const height = 600 - margin.top - margin.bottom;

interface IChartData {
  value: number;
  name: string;
}

interface ILocalProps {
  data: IChartData[];
}

const BarChart: React.FC<ILocalProps> = ({ data }) => {
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
  const svg = d3
    .select(container)
    .append('svg')
    .attr('width', width + margin.left + margin.right)
    .attr('height', height + margin.top + margin.bottom)
    .append('g')
    .attr('transform', `translate(${margin.top}, ${margin.left})`);

  const yScale = d3
    .scaleLinear()
    .domain([0, d3.max(data, yValue)!])
    .range([height, 0]);

  const xScale = d3.scaleBand().domain(data.map(xValue)).range([0, width]).padding(0.3);

  const yAxisG = svg.append('g');
  yAxisG.call(d3.axisLeft(yScale).ticks(10).tickFormat(d3.format('.3s')));

  svg
    .append('g')
    .attr('transform', `translate(0, ${height})`)
    .call(d3.axisBottom(xScale))
    .selectAll('.domain, .tick line')
    .remove();

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
    .selectAll('rect')
    .data(data)
    .enter()
    .append('rect')
    .attr('y', (d) => yScale(yValue(d)))
    .attr('x', (d) => xScale(xValue(d))!)
    .attr('width', (d) => xScale.bandwidth())
    .attr('height', (d) => height - yScale(yValue(d)))
    .attr('fill', 'steelblue');
};

const xValue = (d: IChartData) => d.name;
const yValue = (d: IChartData) => d.value;

export default BarChart;
