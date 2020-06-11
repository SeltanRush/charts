import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

interface IChartData {
  x: number;
  y: number;
}

interface ILocalProps {
  data: IChartData[];
  xLabel: string;
  yLabel: string;
}

const ScatterPlot: React.FC<ILocalProps> = (props) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef && containerRef.current) {
      drawChart({
        container: containerRef.current,
        ...props,
      });
    }
  }, [containerRef, props]);

  return <div ref={containerRef}></div>;
};

const drawChart = ({
  container,
  data,
  yLabel,
  xLabel,
}: { container: HTMLDivElement } & ILocalProps) => {
  const margin = {
    top: 60,
    left: 80,
    right: 60,
    bottom: 80,
  };

  const width = 900 - margin.left - margin.right;
  const height = 600 - margin.top - margin.bottom;
  const circleR = 8;

  const svg = d3
    .select(container)
    .append('svg')
    .attr('width', width + margin.left + margin.right)
    .attr('height', height + margin.top + margin.bottom)
    .append('g')
    .attr('transform', `translate(${margin.left}, ${margin.top})`);

  const yScale = d3
    .scaleLinear()
    .domain([d3.min(data, yValue) || 0, d3.max(data, yValue) || 0])
    .range([height, 0]);

  const xScale = d3
    .scaleLinear()
    .domain([d3.min(data, xValue) || 0, d3.max(data, xValue) || 0])
    .range([0, width]);

  const yAxisG = svg.append('g');
  yAxisG.call(
    d3
      .axisLeft(yScale)
      .ticks(10)
      .tickFormat(d3.format('.3s'))
      .tickSize(-width)
      .tickPadding(10)
  );

  const xAxisG = svg.append('g').attr('transform', `translate(0, ${height})`);

  xAxisG.call(d3.axisBottom(xScale).tickSize(-height).tickPadding(10));

  svg.selectAll('.domain').remove();
  svg.selectAll('.tick line').style('opacity', '0.5');

  svg.selectAll('text').style('font-size', '12px');

  yAxisG
    .append('text')
    .attr('fill', 'black')
    .style('font-size', '20px')
    .style('text-anchor', 'middle')
    .attr('x', -height / 2)
    .attr('y', -50)
    .attr('transform', 'rotate(-90)')
    .text(yLabel);

  xAxisG
    .append('text')
    .attr('fill', 'black')
    .style('font-size', '20px')
    .style('text-anchor', 'center')
    .attr('dx', width / 2)
    .attr('dy', 40)
    .text(xLabel);

  svg
    .selectAll('circle')
    .data(data)
    .enter()
    .append('circle')
    .attr('cy', (d) => yScale(yValue(d)))
    .attr('cx', (d) => xScale(xValue(d)) || 0)
    .attr('r', circleR)
    .attr('fill', 'red')
    .attr('opacity', '0.5');
};

const xValue = (d: IChartData) => d.x;
const yValue = (d: IChartData) => d.y;

export default ScatterPlot;
