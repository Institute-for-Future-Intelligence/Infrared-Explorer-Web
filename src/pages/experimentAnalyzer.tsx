import { useParams } from 'react-router-dom';
import showcases from '../../db/showcases.json';
import { useEffect, useState } from 'react';
import { getDownloadURL, ref } from 'firebase/storage';
import { firebaseStorage } from '../services/firebase';
import ReactPlayer from 'react-player';

const ExperimentAnalyzer = () => {
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
  return <ReactPlayer url={videoURL} controls />;
};

export default ExperimentAnalyzer;
