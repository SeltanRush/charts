import cn from 'classnames';
import React, { useMemo, useState, useCallback } from 'react';
import * as R from 'ramda';

import MultiLineChart from 'components/MultiLineChart/MultiLineChart';

import { CityTemperature } from '../../models/CityTemperature';
import styles from './CitiesTemperatureChart.module.css';

interface ILocalProps {
  data: CityTemperature[];
}

const CitiesTemperatureChart: React.FC<ILocalProps> = ({ data }) => {
  const cities = useMemo(() => R.uniq(data.map((d) => d.city)), [data]);

  const [includedCities, changeIncludedCities] = useState(cities);

  const chartData = useMemo(
    () =>
      data
        .filter((d) => includedCities.includes(d.city))
        .map((d) => ({
          x: new Date(d.timestamp),
          y: d.temperature,
          category: d.city,
        })),
    [includedCities, data]
  );

  const toggleCity = useCallback(
    (city: string) => {
      includedCities.includes(city)
        ? changeIncludedCities(includedCities.filter((c) => c !== city))
        : changeIncludedCities([...includedCities, city]);
    },
    [includedCities]
  );

  return (
    <div className={styles.root}>
      <div className={styles.cities}>
        {cities.map((city) => (
          <City
            key={city}
            toggleCity={toggleCity}
            city={city}
            isActive={includedCities.includes(city)}
          />
        ))}
      </div>
      <MultiLineChart data={chartData} yLabel="Temperature" xLabel="Date" />;
    </div>
  );
};

const City = ({
  city,
  toggleCity,
  isActive,
}: {
  city: string;
  toggleCity: (city: string) => void;
  isActive: boolean;
}) => {
  const onClick = useCallback(() => toggleCity(city), [toggleCity, city]);
  return (
    <div
      className={cn(styles.city, {
        [styles.city_active]: isActive,
      })}
      onClick={onClick}
    >
      {city}
    </div>
  );
};

export default CitiesTemperatureChart;
