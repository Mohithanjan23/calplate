import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import App from './App';
import Home from './pages/Home';
import AddMeal from './pages/AddMeal';
import Stats from './pages/Stats';
import Suggestions from './pages/Suggestions';
import Goals from './pages/Goals';
import WorkoutLog from './pages/WorkoutLog';
import AuthPage from './pages/AuthPage';
import './index.css';

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      { path: '/', element: <Home /> },
      { path: '/add', element: <AddMeal /> },
      { path: '/stats', element: <Stats /> },
      { path: '/suggestions', element: <Suggestions /> },
      { path: '/goals', element: <Goals /> },
      { path: '/workouts', element: <WorkoutLog /> },
    ],
  },
  {
    path: '/auth',
    element: <AuthPage />,
  },
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
