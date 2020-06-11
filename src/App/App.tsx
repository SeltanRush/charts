import React, { useMemo } from 'react';

import LineChart from '../components/LineChart/LineChart';
import BarChart from '../components/BarChart/BarChart';

import styles from './App.module.css';
import { countriesPopulations } from '../fixtures/countriesPopulations';
import ScatterPlot from '../components/ScatterPlot/ScatterPlot';
import { cars } from '../fixtures/cars';
import { temperature } from '../fixtures/temperature';
import MultiLineChart from '../components/MultiLineChart/MultiLineChart';
import { citiesTemperature } from '../fixtures/citiesTemperature';
import CitiesTemperatureChart from 'components/CitiesTemperatureChart/CitiesTemperatureChart';

function App() {
  const barChartData = useMemo(
    () =>
      countriesPopulations.map((d) => ({
        value: d.population,
        name: d.countryName,
      })),
    []
  );

  const scatterPlotData = useMemo(
    () =>
      cars.map((d) => ({
        x: d.horsepower,
        y: d.weight,
      })),
    []
  );

  const lineChartData = useMemo(
    () =>
      temperature.map((d) => ({ x: new Date(d.timestamp), y: d.temperature })),
    []
  );

  return (
    <div className={styles.root}>
      <div className={styles.chart}>
        <h3 className={styles.chart__title}>LineChart</h3>
        <LineChart data={lineChartData} yLabel="Temperature" xLabel="Date" />
      </div>

      <div className={styles.chart}>
        <h3 className={styles.chart__title}>BarChart</h3>
        <BarChart data={barChartData} />
      </div>

      <div className={styles.chart}>
        <h3 className={styles.chart__title}>ScatterPlot</h3>
        <ScatterPlot
          xLabel="Horsepower"
          yLabel="Weight"
          data={scatterPlotData}
        />
      </div>

      <div className={styles.chart}>
        <h3 className={styles.chart__title}>MultiLineChart</h3>
        <CitiesTemperatureChart data={citiesTemperature} />
      </div>
    </div>
  );
}

export default App;
