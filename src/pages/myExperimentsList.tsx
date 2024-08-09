import { useEffect, useState } from 'react';
import useCommonStore from '../stores/common';
import { collection, getDocs } from 'firebase/firestore';
import { firebaseDatabase } from '../services/firebase';
import { ExperimentType, User } from '../types';
import Card from '../components/card/card';
import CardListWrapper from '../components/card/cardListWrapper';
import { useNavigate } from 'react-router-dom';

interface Experiment {}

const MyExperimentsList = () => {
  const user = useCommonStore((state) => state.user);

  const [experiments, setExperiments] = useState<any[]>([]);

  const fetchExperiments = async (user: User) => {
    const querySnapshot = await getDocs(collection(firebaseDatabase, `users/${user.id}/experiments`));

    const res = [] as any[];
    querySnapshot.forEach((doc) => {
      res.push(doc.data());
    });

    setExperiments([...res]);
  };

  useEffect(() => {
    if (!user) return;
    fetchExperiments(user);
  }, [user]);

  console.log('experiments', experiments);

  const navigate = useNavigate();

  const handleClick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    const expId = (e.target as any).id;
    if (expId && user) {
      navigate(`/experiments/${ExperimentType.Image}/${user.id}/${expId}`);
    }
  };

  return (
    <CardListWrapper onClick={handleClick}>
      {experiments
        .filter((e) => !e.segments)
        .map((exp) => {
          return (
            <Card
              key={exp.id}
              id={exp.id}
              url={`recordings/${exp.recordingId}/data_1.png`}
              displayName={exp.displayName}
            />
          );
        })}
    </CardListWrapper>
  );
};

export default MyExperimentsList;
