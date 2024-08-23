import { ShowcaseData, Experiment, ShowcasePreset, Thermometer, TemperatureUnit } from '../types';

export const parseShowcaseData = (showcase: ShowcaseData) => {
  return {
    id: showcase.id,
    name: showcase.name,
    displayName: showcase.display_name,
    author: showcase.author,
    description: showcase.description,
    subject: showcase.subject,
    duration: showcase.duration,
    date: showcase.date,
    graphsOptions: [1],
  } as Experiment;
};

export const parsePresetThermometer = (
  expID: string,
  data: ShowcasePreset,
): { ids: string[]; thermometers: Thermometer[] } => {
  const thermometerCount = data['ThermometerCount'] ?? 0;
  if (!thermometerCount) {
    return { ids: [], thermometers: [] };
  }

  const thermometers = [...Array(thermometerCount).keys()].map((key) => {
    return {
      x: data[`Thermometer${key}.x`],
      y: data[`Thermometer${key}.y`],
      id: `${expID}_${key}`,
      unit: TemperatureUnit.celsius,
    } as Thermometer;
  });
  return {
    ids: thermometers.map((t) => t.id),
    thermometers,
  };
};
