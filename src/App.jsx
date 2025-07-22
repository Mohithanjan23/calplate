// This is the new content for `src/App.jsx`
// This is now a layout component that protects its children.

import { useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import BottomNav from './components/BottomNav';
import Header from './components/Header';

function App() {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // If the user is not authenticated, this effect redirects them to the login page.
    if (!isAuthenticated) {
      navigate('/auth');
    }
  }, [isAuthenticated, navigate]);

  // While the redirect is happening, we can render nothing or a loading spinner.
  if (!isAuthenticated) {
    return null; 
  }

  // If the user is authenticated, render the main app layout.
  // <Outlet /> renders the correct page based on the URL (Home, Stats, etc.)
  return (
    <div className="min-h-screen pt-16 pb-20 bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white">
      <Header />
      <main>
        <Outlet />
      </main>
      <BottomNav />
    </div>
  );
}

export default App;
