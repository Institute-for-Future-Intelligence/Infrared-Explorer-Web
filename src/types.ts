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

// interface Experiment {
//   id: string;
//   recordingId: string;
//   segments: number[][];
// }
