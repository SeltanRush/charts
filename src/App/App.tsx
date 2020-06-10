import React, { useMemo } from 'react';

import LineChart from '../components/LineChart/LineChart';
import BarChart from '../components/BarChart/BarChart';

import styles from './App.module.css';
import { countriesPopulations } from '../fixtures/countriesPopulations';

function App() {
  const barChartData = useMemo(
    () =>
      countriesPopulations.map((d) => ({
        value: d.population,
        name: d.countryName,
      })),
    []
  );

  return (
    <div className={styles.root}>
      <div className={styles.chart}>
        <h3 className={styles.chart__title}>LineChart</h3>
        <LineChart />
      </div>

      <div className={styles.chart}>
        <h3 className={styles.chart__title}>BarChart</h3>
        <BarChart data={barChartData} />
      </div>
    </div>
  );
}

export default App;
