import { TemperatureStats } from './types';

export const calculateTemperatureStats = (temperatures: number[]): TemperatureStats => {
  if (!temperatures.length) {
    return {
      current: 0,
      average: 0,
      min: 0,
      max: 0
    };
  }

  return {
    current: temperatures[0],
    average: Number((temperatures.reduce((a, b) => a + b, 0) / temperatures.length).toFixed(1)),
    min: Math.min(...temperatures),
    max: Math.max(...temperatures)
  };
};