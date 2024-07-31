import { useNavigate } from 'react-router-dom';

const Title = () => {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => {
        navigate('');
      }}
    >
      Infrared Explorer
    </div>
  );
};

export default Title;
