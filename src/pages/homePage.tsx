import showcases from '../../db/showcases.json';
import Card from '../components/card/card';
import CardListWrapper from '../components/card/cardListWrapper';

const HomePage = () => {
  return (
    <CardListWrapper>
      {showcases.slice(0, 21).map((showcase) => {
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
