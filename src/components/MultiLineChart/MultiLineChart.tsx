import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

interface IChartData {
  x: Date;
  y: number;
  category: string;
}

interface ILocalProps {
  data: IChartData[];
  xLabel: string;
  yLabel: string;
}

const MultiLineChart: React.FC<ILocalProps> = (props) => {
  const svgRef = useRef(null);

  useEffect(() => {
    drawChart({
      svgRef,
      ...props,
    });
  }, [props]);

  return (
    <svg ref={svgRef}>
      <g className="container">
        <g className="yAxis"></g>
        <g className="xAxis"></g>
        <g className="legends"></g>
      </g>
    </svg>
  );
};

const drawChart = ({
  svgRef,
  data,
  yLabel,
  xLabel,
}: { svgRef: React.RefObject<SVGElement> } & ILocalProps) => {
  const margin = {
    top: 60,
    left: 80,
    right: 180,
    bottom: 80,
  };

  const width = 1100 - margin.left - margin.right;
  const height = 600 - margin.top - margin.bottom;

  const animationDuration = 300;

  const svg = d3
    .select(svgRef.current)
    .attr('class', 'mlc')
    .attr('width', width + margin.left + margin.right)
    .attr('height', height + margin.top + margin.bottom)
    .select('g.container')
    .attr('transform', `translate(${margin.left}, ${margin.top})`);

  const nested = d3
    .nest<IChartData>()
    .key((d) => d.category)
    .entries(data);

  const yScale = d3
    .scaleLinear()
    .domain([d3.min(data, yValue) || 0, d3.max(data, yValue) || 0])
    .range([height, 0])
    .nice();

  const xScale = d3
    .scaleTime()
    .domain([d3.min(data, xValue) || 0, d3.max(data, xValue) || 0])
    .range([0, width])
    .nice();

  const colorScale = d3
    .scaleOrdinal(d3.schemeCategory10)
    .domain(nested.map((d) => d.key));

  const yAxisG = svg
    .select<SVGSVGElement>('g.yAxis')
    .transition()
    .duration(animationDuration)
    .call(d3.axisLeft(yScale).ticks(10).tickSize(-width).tickPadding(10));

  const xAxisG = svg
    .select<SVGSVGElement>('g.xAxis')
    .attr('transform', `translate(0, ${height})`);

  xAxisG
    .transition()
    .duration(animationDuration)
    .call(
      d3
        .axisBottom(xScale)
        .tickSize(-height)
        .tickPadding(10)
        .tickFormat(d3.timeFormat('%a %d') as any)
    );

  svg.selectAll('.domain').remove();
  svg.selectAll('.tick line').style('opacity', '0.5');

  svg.selectAll('text').style('font-size', '12px');

  // yAxisG
  //   .append('text')
  //   .attr('fill', 'black')
  //   .style('font-size', '20px')
  //   .style('text-anchor', 'middle')
  //   .attr('x', -height / 2)
  //   .attr('y', -50)
  //   .attr('transform', 'rotate(-90)')
  //   .text(yLabel);

  // xAxisG
  //   .append('text')
  //   .attr('fill', 'black')
  //   .style('font-size', '20px')
  //   .style('text-anchor', 'center')
  //   .attr('dx', width / 2)
  //   .attr('dy', 40)
  //   .text(xLabel);

  const lineGenerator = d3
    .line<IChartData>()
    .y((d) => yScale(yValue(d)))
    .x((d) => xScale(xValue(d)))
    .curve(d3.curveBasis);

  svg
    .selectAll('.line-path')
    .data(nested)
    .join('path')
    .attr('class', 'line-path')
    .attr('d', (d) => lineGenerator(d.values) || '')
    .attr('fill', 'transparent')
    .attr('stroke-width', '3')
    .attr('stroke', (d) => colorScale(d.key))
    .attr('stroke-linejoin', 'round')
    .attr('stroke-linecap', 'round')
    .style('mix-blend-mode', 'multiply')
    .on('mouseover', function () {
      d3.selectAll('.line-path').style('opacity', '0.5');
      d3.select(this)
        .transition()
        .duration(300)
        .style('opacity', 1)
        .style('stroke-width', 5)
        .style('cursor', 'pointer');
    })
    .on('mouseout', function (d) {
      d3.selectAll('.line-path').style('opacity', 1);
      d3.select(this)
        .transition()
        .duration(300)
        .style('opacity', 1)
        .style('stroke-width', 3)
        .style('cursor', 'none');
    });

  svg.selectAll('path').transition().duration(animationDuration);

  svg
    .select('.legends')
    .selectAll('.legend-text')
    .data(colorScale.domain())
    .join('text')
    .attr('class', 'legend-text')
    .attr('transform', (d, i) => `translate(${width + 30}, ${100 + i * 25})`)
    .text((d) => d)
    .attr('x', 20)
    .attr('y', '.8em')
    .attr('fill', 'black')
    .style('font-size', '14px');

  svg
    .select('.legends')
    .selectAll('.legend-rect')
    .data(colorScale.domain())
    .join('rect')
    .attr('class', 'legend-rect')
    .attr('transform', (d, i) => `translate(${width + 30}, ${100 + i * 25})`)
    .attr('width', 14)
    .attr('height', 14)
    .attr('fill', (d) => colorScale(d));
};

const xValue = (d: IChartData) => d.x;
const yValue = (d: IChartData) => d.y;

export default MultiLineChart;
