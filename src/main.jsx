import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext.jsx';
import './index.css';

// Import all pages
import App from './App.jsx';
import AuthPage from './pages/AuthPage.jsx';
import Dashboard from './pages/Dashboard.jsx';
import Onboarding from './pages/Onboarding.jsx';
import Profile from './pages/Profile.jsx';
import Settings from './pages/Settings.jsx'; // Add this missing import
import Progress from './pages/Progress.jsx';

const router = createBrowserRouter([
  { path: '/auth', element: <AuthPage /> },
  { path: '/onboarding', element: <Onboarding /> },
  {
    path: '/',
    element: <App />,
    children: [
      { index: true, element: <Dashboard /> },
      { path: 'profile', element: <Profile /> },
      { path: 'settings', element: <Settings /> },
      { path: 'progress', element: <Progress /> },
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