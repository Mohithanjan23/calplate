import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import AddMeal from './pages/AddMeal.jsx';
import Stats from './pages/Stats.jsx';
import Home from './pages/Home.jsx';
import Auth from './pages/Auth.jsx';

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      { path: '/', element: <Home /> },
      { path: '/add', element: <AddMeal /> },
      { path: '/stats', element: <Stats /> }
    ]
  },
  {
    path: '/auth',
    element: <Auth />
  }
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
