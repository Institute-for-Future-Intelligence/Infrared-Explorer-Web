import { useNavigate } from 'react-router-dom';

const Title = () => {
  const navigate = useNavigate();

  return (
    <h2
      onClick={() => {
        navigate('');
      }}
    >
      Infrared Explorer
    </h2>
  );
};

export default Title;
