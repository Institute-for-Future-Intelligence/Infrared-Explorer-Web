import { useParams } from 'react-router-dom';
import VideoPlayer from './videoPlayer';
import ImagePlayer from './imagePlayer/imagePlayer';
import { Experiment, ExperimentType, Thermometer } from '../../types';
import { useEffect, useState } from 'react';
import { collection, doc, getDoc, getDocs } from 'firebase/firestore';
import { firebaseDatabase } from '../../services/firebase';
import useCommonStore from '../../stores/common';

const ExperimentAnalyzer = () => {
  const { expType, userId, expId } = useParams();

  const experiment = useCommonStore((state) => (expId ? state.experimentMap.get(expId) : undefined));
  const [thermometersId, setThermometersId] = useState<string[]>([]);

  const fetchExperiment = async (userId: string, expId: string) => {
    const docRef = doc(firebaseDatabase, `users/${userId}/experiments/${expId}`);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const experiment = docSnap.data() as Experiment;
      useCommonStore.getState().setExperiment(experiment.id, experiment);
    } else {
      console.log('no such document');
    }
  };

  const fetchThermometers = async (userId: string, expId: string) => {
    const querySnapshot = await getDocs(
      collection(firebaseDatabase, `users/${userId}/experiments/${expId}/thermometers`),
    );
    const ids: string[] = [];
    querySnapshot.forEach((doc) => {
      const thermometer = doc.data() as Thermometer;
      useCommonStore.getState().setThermometer(thermometer.id, thermometer);
      ids.push(thermometer.id);
    });
    setThermometersId([...ids]);
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
        return <ImagePlayer experiment={experiment} thermometersId={thermometersId} />;
      }
    }
  };

  return (
    <div className="experiment-analyzer">
      <div className="left-content">left</div>
      <div className="right-content">{showPlayer()}</div>
    </div>
  );
};

export default ExperimentAnalyzer;
