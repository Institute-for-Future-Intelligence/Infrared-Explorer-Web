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

export enum ExperimentThermalUnits {
  celsius = 'celsius',
  fahrenheit = 'fahrenheit',
}

export type Experiment = any;

export type Thermometer = any;
