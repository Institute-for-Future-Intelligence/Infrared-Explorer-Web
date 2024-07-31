import React from 'react';
import AccountSection from './accountSection.tsx';
import Title from './title.tsx';

const Header = React.memo(() => {
  return (
    <header className="header">
      <Title />
      <AccountSection />
    </header>
  );
});

export default Header;
