import { useParams } from 'react-router-dom';
import VideoPlayer from './videoPlayer';
import ImagePlayer from './imagePlayer';
import { ExperimentType } from '../../types';
import { useEffect, useState } from 'react';
import useCommonStore from '../../stores/common';
import { doc, getDoc } from 'firebase/firestore';
import { firebaseDatabase } from '../../services/firebase';

const ExperimentAnalyzer = () => {
  const { expType, expId } = useParams();
  const user = useCommonStore((state) => state.user);

  const [experiment, setExperiment] = useState<any>(null);

  const fetchExperiment = async (userId: string, expId: string) => {
    const docRef = doc(firebaseDatabase, `users/${userId}/experiments/${expId}`);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      setExperiment(docSnap.data());
    } else {
      console.log('no such document');
    }
  };

  useEffect(() => {
    if (user && expId) {
      fetchExperiment(user.id, expId);
    }
  }, [user?.id, expId]);

  const showPlayer = () => {
    switch (expType) {
      case ExperimentType.Video: {
        return <VideoPlayer />;
      }
      case ExperimentType.Image: {
        if (!experiment) return null;
        return (
          <ImagePlayer
            recordingId={experiment.recordingId}
            duration={experiment.duration}
            currFrameNumber={experiment.currentFrameNumber}
          />
        );
      }
    }
  };

  console.log(experiment);
  return <div>{showPlayer()}</div>;
};

export default ExperimentAnalyzer;
