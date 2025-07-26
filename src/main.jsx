import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import './index.css';

// Import layout and page components
import App from './App';
import AuthPage from './pages/AuthPage';
import Home from './pages/Home';
import AddMeal from './pages/AddMeal';
import Stats from './pages/Stats';
import Suggestions from './pages/Suggestions';
import Goals from './pages/Goals';
import WorkoutLog from './pages/WorkoutLog';
import FoodSearch from './pages/FoodSearch';
import Profile from './pages/Profile';
import BMICalculator from './pages/BMICalculator';

// Define the application's routes
const router = createBrowserRouter([
  {
    path: '/auth',
    element: <AuthPage />, // Standalone public route for authentication
  },
  {
    path: '/',
    element: <App />, // The main layout for all protected pages
    children: [
      { index: true, element: <Home /> }, // Dashboard
      { path: 'add', element: <AddMeal /> }, // AI Scanner & Manual Log
      { path: 'stats', element: <Stats /> }, // Weekly/Monthly Stats
      { path: 'suggestions', element: <Suggestions /> }, // Meal Suggestions
      { path: 'goals', element: <Goals /> }, // Fitness Goals
      { path: 'workouts', element: <WorkoutLog /> }, // Workout Logging
      { path: 'search', element: <FoodSearch /> }, // Food Database Search
      { path: 'profile', element: <Profile /> }, // User Profile Settings
      { path: 'bmi', element: <BMICalculator /> }, // BMI Calculator
    ],
  },
]);

// Render the application
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  </React.StrictMode>
);
