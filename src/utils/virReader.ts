import Pako from 'pako';
import { Dimension } from '../types';
import { INTSIZE } from './constants';
import { kelvinToCelsius } from './helpers';
import { readArrayBufferSegment } from './temperatureReader';

// Some cameras may have a different resolution than 120x160.
// So we read the dimension info from the header of the VIR file.
const getDimension = (arrBuf: ArrayBufferLike): Dimension => {
  const d = readArrayBufferSegment(arrBuf, 0, 2);
  return { width: d[0], height: d[1], size: d[0] * d[1] };
};

export const getTempCOfCurrFrame = (arrBuf: ArrayBufferLike, currentPercent: number) => {
  const sizeInByte = arrBuf.byteLength;
  const dimension = getDimension(arrBuf);
  const totalPixelCount = (sizeInByte - 8) / INTSIZE;
  const totalFrameCount = totalPixelCount / dimension.size;
  const currFrame = Math.ceil(currentPercent * totalFrameCount);
  const frameBeginIndex = (currFrame / totalFrameCount) * totalPixelCount - dimension.size + 2;
  return readArrayBufferSegment(arrBuf, frameBeginIndex < 0 ? 2 : frameBeginIndex, dimension.size).map((d) =>
    kelvinToCelsius(d / 100),
  );
};

export const parseRawThermalData = (arrBuf: ArrayBuffer) => {
  const dimension = getDimension(arrBuf);
  const sizeInByte = arrBuf.byteLength;
  const totalPixelCount = (sizeInByte - 8) / INTSIZE;
  const totalFrameCount = totalPixelCount / dimension.size;

  const res: ArrayBuffer[] = [];
  for (let i = 0; i < totalFrameCount; i++) {
    const start = i * dimension.size + 8;
    const end = start + dimension.size * INTSIZE;
    res.push(Pako.deflate(arrBuf.slice(start, end)));
  }

  return res;
};
