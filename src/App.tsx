import './App.css';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import ErrorPage from './pages/errorPage';
import Layout from './layouts/layout';
import './services/firebase';
import HomePage from './pages/homePage';
import MyExperimentsList from './pages/myExperimentsList';

const App = () => {
  const router = createBrowserRouter([
    {
      path: '/infrared-explorer-web',
      element: <Layout />,
      errorElement: <ErrorPage />,
      children: [
        {
          path: '',
          element: <HomePage />,
        },
        {
          path: 'myExperimentsList',
          element: <MyExperimentsList />,
        },
      ],
    },
  ]);

  return <RouterProvider router={router} />;
};

export default App;
