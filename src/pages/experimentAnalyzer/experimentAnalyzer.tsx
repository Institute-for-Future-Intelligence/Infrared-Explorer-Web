import { useParams } from 'react-router-dom';
import VideoPlayer from './videoPlayer';
import ImagePlayer from './imagePlayer/imagePlayer';
import { ExperimentType } from '../../types';
import { useEffect, useState } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { firebaseDatabase } from '../../services/firebase';

const ExperimentAnalyzer = () => {
  const { expType, userId, expId } = useParams();

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
    if (expType === ExperimentType.Image && userId && expId) {
      fetchExperiment(userId, expId);
    }
  }, [expType, userId, expId]);

  const showPlayer = () => {
    switch (expType) {
      case ExperimentType.Video: {
        return <VideoPlayer />;
      }
      case ExperimentType.Image: {
        if (!experiment) return null;
        return <ImagePlayer experiment={experiment} />;
      }
    }
  };

  console.log('experiment', experiment);
  return (
    <div className="experiment-analyzer">
      <div className="left-content">left</div>
      <div className="right-content">
        <>{showPlayer()}</>
      </div>
    </div>
  );
};

export default ExperimentAnalyzer;
