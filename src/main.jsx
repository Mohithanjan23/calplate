// This is the new content for `src/main.jsx`
// This centralizes your routing configuration.

import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { SpeedInsights } from "@vercel/speed-insights/react";
import './index.css';

// Import your page and layout components
import App from './App';
import Home from './pages/Home';
import AddMeal from './pages/AddMeal';
import Stats from './pages/Stats';
import Suggestions from './pages/Suggestions';
import Goals from './pages/Goals';
import WorkoutLog from './pages/WorkoutLog';
import FoodSearch from './pages/FoodSearch';
import AuthPage from './pages/AuthPage';

const router = createBrowserRouter([
  {
    path: '/auth',
    element: <AuthPage />,
  },
  {
    path: '/',
    element: <App />, // App.jsx is the layout for all protected pages
    children: [
      { index: true, element: <Home /> },
      { path: 'add', element: <AddMeal /> },
      { path: 'stats', element: <Stats /> },
      { path: 'suggestions', element: <Suggestions /> },
      { path: 'goals', element: <Goals /> },
      { path: 'workouts', element: <WorkoutLog /> },
      { path: 'search', element: <FoodSearch /> },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider>
      <RouterProvider router={router} />
      <SpeedInsights />
    </AuthProvider>
  </React.StrictMode>
);
