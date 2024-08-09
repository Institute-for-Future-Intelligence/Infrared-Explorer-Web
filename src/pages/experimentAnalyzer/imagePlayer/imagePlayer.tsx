import { getBlob, ref } from 'firebase/storage';
import { useEffect, useRef, useState } from 'react';
import { firebaseStorage } from '../../../services/firebase';
import ControlBar from './controlBar';
import { throttle } from 'lodash';
import { useMappingIndex } from '../hooks';

type ImageSrc = string | undefined;

interface Props {
  experiment: any;
}

const ImagePlayer = ({ experiment }: Props) => {
  const { recordingId, currentFrameNumber, duration, segments } = experiment;

  // only map to recording index when fetch from firebase.
  const { lastFrameIndex, getRecordingIndex } = useMappingIndex(segments, duration);

  const imagesRef = useRef<ImageSrc[]>([]);

  const currFrameIdxRef = useRef(currentFrameNumber - 1);

  const [currFrameImg, setCurrFrameImg] = useState<ImageSrc>();

  const fetchImageAsBlob = async (index: number) => {
    const mappedIndex = getRecordingIndex(index);
    const blob = await getBlob(ref(firebaseStorage, `recordings/${recordingId}/data_${mappedIndex + 1}.png`));
    return blob;
  };

  const loadImageToArray = (blob: Blob, index: number, onloadend?: () => void) => {
    const fileReader = new FileReader();
    fileReader.onloadend = () => {
      const res = fileReader.result;
      if (res) {
        imagesRef.current[index] = res as string;
        onloadend && onloadend();
      }
    };
    fileReader.readAsDataURL(blob);
  };

  const preload = async (index: number, preloads = 4) => {
    for (let i = index; i <= index + preloads; i++) {
      if (imagesRef.current[i] || i >= lastFrameIndex) continue;
      const blob = await fetchImageAsBlob(i);
      loadImageToArray(blob, i);
    }
  };

  const applyCurrFrameImg = (index: number) => {
    setCurrFrameImg(imagesRef.current[index]);
  };

  const loadFrame = async (index: number) => {
    if (index >= lastFrameIndex) return;
    const blob = await fetchImageAsBlob(index);
    loadImageToArray(blob, index, () => {
      applyCurrFrameImg(index);
    });
    preload(index + 1);
  };

  const init = async () => {
    loadFrame(currFrameIdxRef.current);
  };

  // init
  useEffect(() => {
    init();
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
      if (currFrameIdxRef.current >= lastFrameIndex) {
        currFrameIdxRef.current = 0;
        stop();
        return;
      }

      if (imagesRef.current[currFrameIdxRef.current]) {
        applyCurrFrameImg(currFrameIdxRef.current);
        currFrameIdxRef.current++;
        preload(currFrameIdxRef.current + 4, 0);
      } else {
        loadFrame(currFrameIdxRef.current);
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
    loadFrame(n);
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
