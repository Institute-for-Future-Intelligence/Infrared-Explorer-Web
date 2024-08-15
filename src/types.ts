export interface User {
  displayName: string | null;
  email: string | null;
  photoURL: string | null;
  id: string;
}

export enum ExperimentType {
  Video = 'video',
  Image = 'image',
}

export type Segment = { start: number; end: number };

export enum TemperatureUnit {
  celsius = 'celsius',
  fahrenheit = 'fahrenheit',
}

export type Experiment = any;

export interface Thermometer {
  id: string;
  x: number;
  y: number;
  value: number;
  unit: TemperatureUnit;
}
