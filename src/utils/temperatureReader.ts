/*
 * @Copyright 2021. Institute for Future Intelligence, Inc.
 */

import Pako from 'pako';
import { TemperatureUnit } from '../types';
import { INTSIZE, IR_ARRAY_HEIGHT, IR_ARRAY_WIDTH } from './constants';
import { celsiusToFahrenheit, kelvinToCelsius } from './helpers';

// export const getMeasuringPoints = (thermometer: Thermometer) => {
//   const points = new Array<Point>();
//   const steps = 5;
//   if (
//     thermometer.measuringAreaType &&
//     thermometer.measuringAreaType !== MeasuringAreaType.point &&
//     thermometer.measuringAreaWidth &&
//     thermometer.measuringAreaHeight
//   ) {
//     let x, y, dx, dy;
//     switch (thermometer.measuringAreaType) {
//       case MeasuringAreaType.rectangle:
//         const w2 = thermometer.measuringAreaWidth / 2;
//         const h2 = thermometer.measuringAreaHeight / 2;
//         for (let i = 0; i < IR_ARRAY_WIDTH; i += steps) {
//           x = i / IR_ARRAY_WIDTH;
//           dx = Math.abs(x - thermometer.x);
//           for (let j = 0; j < IR_ARRAY_HEIGHT; j += steps) {
//             y = j / IR_ARRAY_HEIGHT;
//             dy = Math.abs(y - thermometer.y);
//             if (dx < w2 && dy < h2) {
//               points.push({ x: x, y: y } as Point);
//             }
//           }
//         }
//         break;
//       case MeasuringAreaType.ellipse:
//         const wsq = (thermometer.measuringAreaWidth * thermometer.measuringAreaWidth) / 4;
//         const hsq = (thermometer.measuringAreaHeight * thermometer.measuringAreaHeight) / 4;
//         for (let i = 0; i < IR_ARRAY_WIDTH; i += steps) {
//           x = i / IR_ARRAY_WIDTH;
//           dx = x - thermometer.x;
//           for (let j = 0; j < IR_ARRAY_HEIGHT; j += steps) {
//             y = j / IR_ARRAY_HEIGHT;
//             dy = y - thermometer.y;
//             if ((dx * dx) / wsq + (dy * dy) / hsq < 1) {
//               points.push({ x: x, y: y } as Point);
//             }
//           }
//         }
//         break;
//     }
//   } else {
//     points.push(thermometer as Point);
//   }
//   return points;
// };

// export const getAverageTemperatureInMeasuringArea = async (
//   arrBuf: ArrayBufferLike,
//   points: Point[],
//   unit: ExperimentThermalUnits = ExperimentThermalUnits.celsius,
// ) => {
//   if (!points || points.length === 0) return 0;
//   let total = 0;
//   for (const p of points) {
//     const xAbs = Math.floor(p.x * IR_ARRAY_WIDTH);
//     const yAbs = Math.floor(p.y * IR_ARRAY_HEIGHT);
//     total += readArrayBufferPoint(arrBuf, yAbs * IR_ARRAY_WIDTH + xAbs);
//   }
//   if (points.length > 1) {
//     total /= points.length;
//   }
//   total = kelvinToCelsius(total / 100);
//   return unit === ExperimentThermalUnits.fahrenheit ? celsiusToFahrenheit(total) : total;
// };

// export const getAverageTemperature = (tempArr: number[], unit: ExperimentThermalUnits) => {
//   let temp = 0;
//   tempArr.forEach((t) => (temp += kelvinToCelsius(t / 100)));
//   temp /= tempArr.length;
//   return unit === ExperimentThermalUnits.fahrenheit ? celsiusToFahrenheit(temp) : temp;
// };

export const getTempFromArrayBuffer = (
  arryBuffer: ArrayBufferLike,
  unit: TemperatureUnit = TemperatureUnit.celsius,
) => {
  const arrBuf = Pako.inflate(arryBuffer);
  return readArrayBufferSegment(arrBuf.buffer, 0, IR_ARRAY_WIDTH * IR_ARRAY_HEIGHT).map((d) => {
    const temp = kelvinToCelsius(d / 100);
    return Number((unit === TemperatureUnit.fahrenheit ? celsiusToFahrenheit(temp) : temp).toFixed(2));
  });
};

export const getTemperatureAtPosition = (
  arryBuffer: ArrayBufferLike,
  x: number,
  y: number,
  unit: TemperatureUnit = TemperatureUnit.celsius,
) => {
  const arrBuf = Pako.inflate(arryBuffer);
  const xAbs = Math.floor(x * IR_ARRAY_WIDTH);
  const yAbs = Math.floor(y * IR_ARRAY_HEIGHT);
  const temp = kelvinToCelsius(readArrayBufferPoint(arrBuf.buffer, yAbs * IR_ARRAY_WIDTH + xAbs) / 100);
  return Number((unit === TemperatureUnit.fahrenheit ? celsiusToFahrenheit(temp) : temp).toFixed(2));
};

export const readArrayBufferSegment = (arrBuf: ArrayBufferLike, begin: number, length: number) => {
  let intArrView = new DataView(arrBuf.slice(begin * INTSIZE, (begin + length) * INTSIZE));
  let intArr = [];
  for (let i = 0; i < length; i++) {
    try {
      intArr.push(intArrView.getUint16(i * INTSIZE + 2, false));
    } catch (error) {
      // ignore the out of bound errors
    }
  }
  return intArr;
};

export const readArrayBufferPoint = (arrBuf: ArrayBufferLike, begin: number) => {
  let intArrView = new DataView(arrBuf.slice(begin * INTSIZE, (begin + 1) * INTSIZE));
  try {
    return intArrView.getUint16(2, false);
  } catch (error) {
    // ignore the out of bound errors
    return 0;
  }
};
