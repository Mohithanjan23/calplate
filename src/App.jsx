import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { DataProvider } from './contexts/DataContext';

import AuthPage from './pages/AuthPage';
import OnboardingPage from './pages/OnboardingPage';
import AppLayout from './pages/AppLayout';
import DashboardPage from './pages/DashboardPage';
import ProfilePage from './pages/ProfilePage';
import LoadingSpinner from './components/LoadingSpinner';

// A component to protect routes that require authentication
const ProtectedRoute = ({ children }) => {
  const { session, user, loading } = useAuth();

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!session) {
    // If no session, redirect to the auth page
    return <Navigate to="/auth" replace />;
  }

  if (!user) {
    // If session exists but profile is not complete, redirect to onboarding
    return <Navigate to="/onboarding" replace />;
  }
  
  // If session and user profile exist, render the requested component
  return children;
};

function App() {
  return (
    <AuthProvider>
      <DataProvider>
        <BrowserRouter>
          <Routes>
            {/* Public Route for Authentication */}
            <Route path="/auth" element={<AuthPage />} />
            
            {/* Route for Onboarding */}
            <Route path="/onboarding" element={<OnboardingPage />} />

            {/* Protected Routes inside the AppLayout */}
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <AppLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<Navigate to="/dashboard" replace />} />
              <Route path="dashboard" element={<DashboardPage />} />
              <Route path="meals" element={<DashboardPage />} /> {/* Assuming meals is part of dashboard for now */}
              <Route path="profile" element={<ProfilePage />} />
            </Route>

            {/* Fallback route */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </DataProvider>
    </AuthProvider>
  );
}

export default App;