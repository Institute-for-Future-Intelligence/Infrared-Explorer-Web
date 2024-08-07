import { useEffect, useState } from 'react';
import useCommonStore from '../stores/common';
import { collection, getDocs } from 'firebase/firestore';
import { firebaseDatabase } from '../services/firebase';
import { User } from '../types';
import Card from '../components/card/card';
import CardListWrapper from '../components/card/cardListWrapper';

interface Experiment {}

const MyExperimentsList = () => {
  const user = useCommonStore((state) => state.user);

  const [experiments, setExperiments] = useState<any[]>([]);

  const fetch = async (user: User) => {
    const querySnapshot = await getDocs(collection(firebaseDatabase, `users/${user.id}/experiments`));

    const res = [] as any[];
    querySnapshot.forEach((doc) => {
      res.push(doc.data());
    });

    setExperiments([...res]);
  };

  useEffect(() => {
    if (!user) return;
    fetch(user);
  }, [user]);

  console.log(experiments);

  return (
    <CardListWrapper>
      <div className="showcase-wrapper">
        <div className="card-list">
          {experiments.map((exp) => {
            return (
              <Card
                key={exp.id}
                id={exp.id}
                url={`recordings/${exp.recordingId}/data_1.png`}
                displayName={exp.display_name}
              />
            );
          })}
        </div>
      </div>
    </CardListWrapper>
  );
};

export default MyExperimentsList;
