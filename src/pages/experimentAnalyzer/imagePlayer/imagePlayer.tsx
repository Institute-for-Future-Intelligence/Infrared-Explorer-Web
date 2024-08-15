import { getBlob, getBytes, ref } from 'firebase/storage';
import { useEffect, useMemo, useRef, useState } from 'react';
import { firebaseStorage } from '../../../services/firebase';
import ControlBar from './controlBar';
import { throttle } from 'lodash';
import { useMappingIndex } from '../hooks';
import { Experiment, Thermometer } from '../../../types';
import Pako from 'pako';
import { INTSIZE, IR_ARRAY_HEIGHT, IR_ARRAY_WIDTH } from '../../../utils/constants';
import {
  getTemperatureAtPosition,
  getTempFromFrameData,
  readArrayBufferSegment,
} from '../../../utils/temperatureReader';
import Thermometers, { THERMOMETERS_WRAPPER_ID } from '../thermometers/thermometers';
import useCommonStore from '../../../stores/common';

type ImageSrc = string | undefined;

interface Props {
  experiment: Experiment;
  thermometersId: string[];
}

const ImagePlayer = ({ experiment, thermometersId }: Props) => {
  const { recordingId, currentFrameNumber, duration, segments } = experiment;
  const delay = useMemo(() => {
    const FPS = 5;
    return (1 / FPS) * 1000;
  }, []);

  // only map to recording index when fetch from firebase.
  const { lastFrameIndex, getRecordingIndex } = useMappingIndex(segments, duration);

  const cacheImageRef = useRef<ImageSrc[]>([]);
  const cacheTemperaturesRef = useRef<number[][]>([]);

  const currFrameIdxRef = useRef(currentFrameNumber - 1);

  /**
   * This is the only one true state for Player.
   * Only image change would cause rerender, not even frame index.
   * We need index to fetch image first, and render the sence after we got the image. Nothing else can cause rerender.
   * So everything is updated together with image change, no other intermiddle state.
   * Try use ref for other valus if possible
   */
  const [currFrameImg, setCurrFrameImg] = useState<ImageSrc>();

  const needThermoData = thermometersId.length > 0;

  const fetchThermoData = async (index: number) => {
    const mappedIndex = getRecordingIndex(index);
    const arrayBuffer = await getBytes(ref(firebaseStorage, `recordings/${recordingId}/data_${mappedIndex}.dat`));
    return getTempFromFrameData(arrayBuffer);
  };

  const loadTemperatures = async (index: number) => {
    const temperatures = await fetchThermoData(index);
    cacheTemperaturesRef.current[index] = temperatures;
  };

  const updateThermometersOnFrame = (index: number) => {
    useCommonStore.getState().setStore((state) => {
      for (const thermometerId of thermometersId) {
        const thermometer = state.thermometerMap.get(thermometerId);
        if (thermometer) {
          const temperatures = cacheTemperaturesRef.current[index];
          thermometer.value = getTemperatureAtPosition(temperatures, thermometer.x, thermometer.y);
        }
      }
    });
  };

  /** x,y is [0,1] */
  const updateThermoemterByPosition = (id: string, x: number, y: number) => {
    useCommonStore.getState().setStore((state) => {
      const thermometer = state.thermometerMap.get(id);
      if (thermometer) {
        thermometer.x = x;
        thermometer.y = y;
        const temperatures = cacheTemperaturesRef.current[currFrameIdxRef.current];
        thermometer.value = getTemperatureAtPosition(temperatures, x, y);
      }
    });
  };

  const fetchImage = async (index: number) => {
    const mappedIndex = getRecordingIndex(index);
    const blob = await getBlob(ref(firebaseStorage, `recordings/${recordingId}/data_${mappedIndex}.png`));
    return blob;
  };

  const loadImage = async (index: number, onloadend?: () => void) => {
    const blob = await fetchImage(index);
    const fileReader = new FileReader();
    fileReader.onloadend = () => {
      const res = fileReader.result;
      if (res) {
        cacheImageRef.current[index] = res as string;
        onloadend && onloadend();
      }
    };
    fileReader.readAsDataURL(blob);
  };

  const preloadFrame = async (start: number, length = 5) => {
    for (let i = start; i < start + length && i < lastFrameIndex; i++) {
      if (!cacheImageRef.current[i]) {
        loadImage(i);
      }
      if (needThermoData && !cacheTemperaturesRef.current[i]) {
        loadTemperatures(i);
      }
    }
  };

  const updateImage = (index: number) => {
    if (cacheImageRef.current[index]) {
      setCurrFrameImg(cacheImageRef.current[index]);
    }
  };

  const updateFrame = async (index: number) => {
    if (cacheImageRef.current[index]) {
      updateImage(index);
    } else {
      loadImage(index, () => updateImage(index));
    }
    if (needThermoData) {
      if (!cacheTemperaturesRef.current[index]) {
        await loadTemperatures(index);
      }
      updateThermometersOnFrame(index);
    }
  };

  // init
  useEffect(() => {
    loadImage(currFrameIdxRef.current, () => updateImage(currFrameIdxRef.current));
    if (needThermoData) {
      loadTemperatures(currFrameIdxRef.current);
    }
    preloadFrame(currFrameIdxRef.current + 1);
  }, [needThermoData]);

  const intervalIdRef = useRef<NodeJS.Timeout | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const play = () => {
    setIsPlaying(true);
    intervalIdRef.current = setInterval(() => {
      if (currFrameIdxRef.current > lastFrameIndex) {
        currFrameIdxRef.current = 0;
        stop();
        return;
      }

      updateFrame(currFrameIdxRef.current);
      if (cacheImageRef.current) {
        preloadFrame(currFrameIdxRef.current + 5, 1);
        currFrameIdxRef.current++;
      } else {
        preloadFrame(currFrameIdxRef.current + 1);
      }
    }, delay);
  };

  const stop = () => {
    setIsPlaying(false);
    if (intervalIdRef.current) {
      clearInterval(intervalIdRef.current);
    }
  };

  // stop when close
  useEffect(() => {
    return () => {
      stop();
    };
  }, []);

  const handleClickPlayButton = () => {
    isPlaying ? stop() : play();
  };

  const handleSlide = (n: number) => {
    currFrameIdxRef.current = n;
    if (!isPlaying) {
      updateFrame(n);
      preloadFrame(n + 1);
    }
  };

  if (!currFrameImg) return null;
  return (
    <div className="image-player-wrapper">
      <div className="image-player">
        <div className="image-wrapper">
          <img className="current-frame-image" src={currFrameImg} />

          <Thermometers thermometersId={thermometersId} onUpdate={updateThermoemterByPosition} />
        </div>

        <ControlBar
          isPlaying={isPlaying}
          currFrameIndex={currFrameIdxRef.current}
          lastFrameIndex={lastFrameIndex}
          onClickPlayButton={handleClickPlayButton}
          onSlide={throttle(handleSlide, 100)}
        />
      </div>

      <div className="tool-bar"></div>
    </div>
  );
};

export default ImagePlayer;
