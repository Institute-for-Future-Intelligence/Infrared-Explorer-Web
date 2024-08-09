import { useParams } from 'react-router-dom';
import VideoPlayer from './videoPlayer';
import ImagePlayer from './imagePlayer/imagePlayer';
import { Experiment, ExperimentType, Thermometer } from '../../types';
import { useEffect, useState } from 'react';
import { collection, doc, getDoc, getDocs } from 'firebase/firestore';
import { firebaseDatabase } from '../../services/firebase';

const ExperimentAnalyzer = () => {
  const { expType, userId, expId } = useParams();

  const [experiment, setExperiment] = useState<Experiment>(null);
  const [thermometers, setThermometers] = useState<Thermometer[]>([]);

  const fetchExperiment = async (userId: string, expId: string) => {
    const docRef = doc(firebaseDatabase, `users/${userId}/experiments/${expId}`);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      setExperiment(docSnap.data());
    } else {
      console.log('no such document');
    }
  };

  const fetchThermometers = async (userId: string, expId: string) => {
    const querySnapshot = await getDocs(
      collection(firebaseDatabase, `users/${userId}/experiments/${expId}/thermometers`),
    );
    const thermometers: Thermometer[] = [];
    querySnapshot.forEach((doc) => {
      // doc.data() is never undefined for query doc snapshots
      thermometers.push(doc.data());
    });
    setThermometers(thermometers);
  };

  useEffect(() => {
    if (!userId || !expId) return;
    if (expType === ExperimentType.Image) {
      fetchExperiment(userId, expId);
    }
    fetchThermometers(userId, expId);
  }, [expType, userId, expId]);

  const showPlayer = () => {
    switch (expType) {
      case ExperimentType.Video: {
        return <VideoPlayer />;
      }
      case ExperimentType.Image: {
        if (!experiment) return null;
        return <ImagePlayer experiment={experiment} thermometers={thermometers} />;
      }
    }
  };

  console.log('experiment', experiment);
  console.log('thermometers', thermometers);

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
