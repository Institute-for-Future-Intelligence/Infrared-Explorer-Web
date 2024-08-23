/*
 * @Copyright 2021. Institute for Future Intelligence, Inc.
 */

import Pako from 'pako';
import { TemperatureUnit } from '../types';
import { INTSIZE, IR_ARRAY_HEIGHT, IR_ARRAY_WIDTH } from './constants';
import { celsiusToFahrenheit, kelvinToCelsius } from './helpers';

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
  const buffer = Pako.inflate(arryBuffer).buffer;
  const xAbs = Math.floor(x * IR_ARRAY_WIDTH);
  const yAbs = Math.floor(y * IR_ARRAY_HEIGHT);
  const temp = kelvinToCelsius(readArrayBufferPoint(buffer, yAbs * IR_ARRAY_WIDTH + xAbs) / 100);
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
