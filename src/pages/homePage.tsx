import { useNavigate } from 'react-router-dom';
import showcases from '../../db/showcases.json';
import Card from '../components/card/card';
import CardListWrapper from '../components/card/cardListWrapper';
import { ExperimentType } from '../types';

const HomePage = () => {
  const navigate = useNavigate();

  const handleClick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    const expId = (e.target as any).id;
    if (expId) {
      navigate(`experiments/${ExperimentType.Video}/showcases/${expId}`);
    }
  };

  return (
    <CardListWrapper onClick={handleClick}>
      {showcases.map((showcase) => {
        return (
          <Card
            key={showcase.id}
            id={showcase.id}
            url={`videostore/${showcase.name}.png`}
            displayName={showcase.display_name}
          />
        );
      })}
    </CardListWrapper>
  );
};

export default HomePage;
