import showcases from '../../scripts/showcases.json';
import Card from '../components/card/card';

const HomePage = () => {
  return (
    <div className="showcase-wrapper">
      <div className="card-list">
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
      </div>
    </div>
  );
};

export default HomePage;
