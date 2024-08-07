import { getBlob, ref } from 'firebase/storage';
import { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { firebaseStorage } from '../../services/firebase';

type ImageSrc = string | null;

interface Props {
  recordingId: string;
  currFrameNumber: number;
  duration: number;
}

const ImagePlayer = ({ recordingId, currFrameNumber, duration }: Props) => {
  const { expId } = useParams();

  const imagesRef = useRef<ImageSrc[]>([]);

  const currFrameIdxRef = useRef(currFrameNumber);

  const [currFrameImg, setCurrFrameImg] = useState<ImageSrc>(null);

  const totalFrameNumber = duration * 5;

  const fetchImageAsBlob = async (index: number) => {
    const blob = await getBlob(ref(firebaseStorage, `recordings/${recordingId}/data_${index + 1}.png`));
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
      if (imagesRef.current[i] || i >= totalFrameNumber) continue;
      const blob = await fetchImageAsBlob(i);
      loadImageToArray(blob, i);
    }
  };

  const applyCurrFrameImg = () => {
    setCurrFrameImg(imagesRef.current[currFrameIdxRef.current]);
  };

  const loadFrame = async (index: number) => {
    if (index >= totalFrameNumber) return;
    const blob = await fetchImageAsBlob(index);
    loadImageToArray(blob, index, () => {
      applyCurrFrameImg();
    });
    preload(index + 1);
  };

  useEffect(() => {
    loadFrame(currFrameIdxRef.current);
  }, []);

  const intervalIdRef = useRef<NodeJS.Timeout | null>(null);

  const onClickPlay = () => {
    intervalIdRef.current = setInterval(() => {
      currFrameIdxRef.current += 1;
      if (currFrameIdxRef.current >= totalFrameNumber) {
        currFrameIdxRef.current = 0;
      }
      applyCurrFrameImg();
      preload(currFrameIdxRef.current + 4, 0);
    }, 200);
  };

  const onClickStop = () => {
    if (intervalIdRef.current) {
      clearInterval(intervalIdRef.current);
    }
  };

  const inputRef = useRef(0);
  return (
    <div>
      <div>image player: {expId}</div>

      <div style={{ height: '500px' }}>
        {currFrameImg ? <img style={{ height: '500px' }} src={currFrameImg} /> : <>loading...</>}
      </div>

      <button onClick={onClickPlay}>play</button>
      <button onClick={onClickStop}>stop</button>

      <input
        onChange={(e) => {
          inputRef.current = Number(e.target.value);
        }}
      ></input>
      <button
        onClick={() => {
          currFrameIdxRef.current = inputRef.current;
          loadFrame(currFrameIdxRef.current);
        }}
      >
        apply
      </button>

      <div>
        curr idx: {currFrameIdxRef.current} / {totalFrameNumber}
      </div>
    </div>
  );
};

export default ImagePlayer;
