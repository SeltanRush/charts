import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

const margin = {
  top: 50,
  left: 50,
  right: 50,
  bottom: 50,
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
  const container = containerRef.current;

  useEffect(() => {
    if (container) {
      drawChart({
        container,
        data,
      });
    }
  }, [container, data]);

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

  svg.selectAll('rect').data(data).enter();
};

export default BarChart;
