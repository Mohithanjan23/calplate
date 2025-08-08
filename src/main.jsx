import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import './index.css';

// Import components
import App from './App';
import AuthPage from './pages/AuthPage';
import Dashboard from './pages/Dashboard.jsx';
import AddMeal from './pages/AddMeal';
import Stats from './pages/Stats';
import Suggestions from './pages/Suggestions';
import Goals from './pages/Goals';
import WorkoutLog from './pages/WorkoutLog';
import FoodSearch from './pages/FoodSearch';
import Profile from './pages/Profile';
import BMICalculator from './pages/BMICalculator.jsx';
import Nutrition from './pages/Nutrition.jsx';
import Recipes from './pages/Recipes.jsx';
import EditDashboard from './pages/EditDashboard.jsx'; // Add this missing import

const router = createBrowserRouter([
  {
    path: '/auth',
    element: <AuthPage />,
  },
  {
    path: '/',
    element: <App />,
    children: [
      { index: true, element: <Dashboard /> },
      { path: 'add', element: <AddMeal /> },
      { path: 'stats', element: <Stats /> },
      { path: 'suggestions', element: <Suggestions /> },
      { path: 'goals', element: <Goals /> },
      { path: 'workouts', element: <WorkoutLog /> },
      { path: 'search', element: <FoodSearch /> },
      { path: 'profile', element: <Profile /> },
      { path: 'bmi', element: <BMICalculgator /> },
      { path: 'edit-dashboard', element: <EditDashboard /> },
      { path: 'nutrition', element: <Nutrition /> },
      { path: 'recipes', element: <Recipes /> },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  </React.StrictMode>
);