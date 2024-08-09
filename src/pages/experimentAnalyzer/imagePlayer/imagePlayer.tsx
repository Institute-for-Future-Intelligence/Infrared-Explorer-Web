import { getBlob, getBytes, ref } from 'firebase/storage';
import { useEffect, useRef, useState } from 'react';
import { firebaseStorage } from '../../../services/firebase';
import ControlBar from './controlBar';
import { throttle } from 'lodash';
import { useMappingIndex } from '../hooks';
import { Experiment, Thermometer } from '../../../types';
import Pako from 'pako';
import { INTSIZE, IR_ARRAY_HEIGHT, IR_ARRAY_WIDTH } from '../../../utils/constants';
import { getTempFromFrameData, readArrayBufferSegment } from '../../../utils/temperatureReader';

type ImageSrc = string | undefined;
type Temperatures = string[];

interface Props {
  experiment: Experiment;
  thermometers: Thermometer[];
}

const ImagePlayer = ({ experiment, thermometers }: Props) => {
  const { recordingId, currentFrameNumber, duration, segments } = experiment;

  // only map to recording index when fetch from firebase.
  const { lastFrameIndex, getRecordingIndex } = useMappingIndex(segments, duration);

  const cacheImageRef = useRef<ImageSrc[]>([]);
  const cacheTemperaturesRef = useRef<Temperatures[]>([]);

  const currFrameIdxRef = useRef(currentFrameNumber - 1);

  const [currFrameImg, setCurrFrameImg] = useState<ImageSrc>();

  const needThermoData = thermometers.length > 0;

  const fetchThermoData = async (index: number) => {
    const mappedIndex = getRecordingIndex(index);
    const arrayBuffer = await getBytes(ref(firebaseStorage, `recordings/${recordingId}/data_${mappedIndex}.dat`));
    return getTempFromFrameData(arrayBuffer);
  };

  const fetchImage = async (index: number) => {
    const mappedIndex = getRecordingIndex(index);
    const blob = await getBlob(ref(firebaseStorage, `recordings/${recordingId}/data_${mappedIndex}.png`));
    return blob;
  };

  const applyImage = (index: number) => {
    if (cacheImageRef.current[index]) {
      setCurrFrameImg(cacheImageRef.current[index]);
    }
  };

  const loadTemperatures = async (index: number) => {
    const temperatures = await fetchThermoData(index);
    cacheTemperaturesRef.current[index] = temperatures;
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

  const applyFrame = (index: number) => {
    if (cacheImageRef.current[index]) {
      applyImage(index);
    } else {
      loadImage(index, () => applyImage(index));
    }
    if (needThermoData && cacheTemperaturesRef.current[index]) {
      loadTemperatures(index);
    }
  };

  // init
  useEffect(() => {
    applyFrame(currFrameIdxRef.current);
    preloadFrame(currFrameIdxRef.current + 1);
  }, []);

  const intervalIdRef = useRef<NodeJS.Timeout | null>(null);

  // stop when close
  useEffect(() => {
    return () => {
      stop();
    };
  }, []);

  const [isPlaying, setIsPlaying] = useState(false);

  const play = () => {
    setIsPlaying(true);
    intervalIdRef.current = setInterval(() => {
      if (currFrameIdxRef.current > lastFrameIndex) {
        currFrameIdxRef.current = 0;
        stop();
        return;
      }

      if (cacheImageRef.current) {
        applyFrame(currFrameIdxRef.current);
        preloadFrame(currFrameIdxRef.current + 5, 1);
        currFrameIdxRef.current++;
      } else {
        applyFrame(currFrameIdxRef.current);
        preloadFrame(currFrameIdxRef.current + 1);
      }
    }, 200);
  };

  const stop = () => {
    setIsPlaying(false);
    if (intervalIdRef.current) {
      clearInterval(intervalIdRef.current);
    }
  };

  const handleClickPlayButton = () => {
    isPlaying ? stop() : play();
  };

  const handleSlide = (n: number) => {
    currFrameIdxRef.current = n;
    if (!isPlaying) {
      applyFrame(n);
      preloadFrame(n + 1);
    }
  };

  return (
    <div className="image-player-wrapper">
      <div className="image-player">
        <div className="image-wrapper">
          <img src={currFrameImg} />
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
