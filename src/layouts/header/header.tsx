import React from 'react';
import AccountSection from './accountSection.tsx';
import Title from './title.tsx';
import goBackArrow from '../../assets/left-arrow.svg';
import { useLocation, useNavigate } from 'react-router-dom';

const Header = React.memo(() => {
  const location = useLocation();
  const navagate = useNavigate();
  return (
    <header className="header">
      {location.pathname !== '/' && <img className="goback-arrow" src={goBackArrow} onClick={() => navagate(-1)} />}
      <Title />
      <AccountSection />
    </header>
  );
});

export default Header;
