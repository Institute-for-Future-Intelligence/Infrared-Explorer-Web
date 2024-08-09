import { useNavigate } from 'react-router-dom';
import Logo from '../../assets/lab-logo.png';

const Title = () => {
  const navigate = useNavigate();

  return (
    <div
      className="title"
      onClick={() => {
        navigate('');
      }}
    >
      <img src={Logo} />
      <h2>Infrared Explorer</h2>
    </div>
  );
};

export default Title;
