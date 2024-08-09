import { useEffect, useState } from 'react';
import { firebaseStorage } from '../../services/firebase';
import { getDownloadURL, ref } from 'firebase/storage';
import showcases from '../../../db/showcases.json';
import ReactPlayer from 'react-player';
import { useParams } from 'react-router-dom';

interface Props {}

const VideoPlayer = () => {
  const { expId } = useParams();
  const [videoURL, setVideoURL] = useState<string | null>(null);

  const findExperiment = (expId: string) => {
    const showCase = showcases.find((showCase) => showCase.id === expId);
    return showCase;
  };

  useEffect(() => {
    if (!expId) return;
    const experiment = findExperiment(expId);
    if (!experiment) return;

    getDownloadURL(ref(firebaseStorage, `videostore/${experiment.name}.mp4`)).then((url) => {
      setVideoURL(url);
    });
  }, [expId]);

  if (!videoURL) return <div>loading...</div>;
  return (
    <div className="video-player-wrapper">
      <ReactPlayer className={'react-player'} width={'100%'} height={'100%'} url={videoURL} controls />
    </div>
  );
};

export default VideoPlayer;
