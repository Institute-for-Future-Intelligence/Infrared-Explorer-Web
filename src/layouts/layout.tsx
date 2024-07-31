import { Outlet } from 'react-router-dom';
import Header from './header/header';

const Layout = () => {
  return (
    <div className="app">
      <Header />
      <div className="content">
        <Outlet />
      </div>
    </div>
  );
};

export default Layout;
