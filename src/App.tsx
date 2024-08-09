import './App.css';
import { createHashRouter, RouterProvider } from 'react-router-dom';
import ErrorPage from './pages/errorPage';
import Layout from './layouts/layout';
import './services/firebase';
import HomePage from './pages/homePage';
import MyExperimentsList from './pages/myExperimentsList';
import ExperimentAnalyzer from './pages/experimentAnalyzer/experimentAnalyzer';

const App = () => {
  const router = createHashRouter([
    {
      path: '',
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
        {
          path: 'experiments/:expType/:userId/:expId',
          element: <ExperimentAnalyzer />,
        },
        {
          path: '*',
          element: <ErrorPage />,
        },
      ],
    },
  ]);

  return <RouterProvider router={router} />;
};

export default App;
