import { useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Header from './components/Header';
import BottomNav from './components/BottomNav';
import { Toaster } from 'react-hot-toast';

function App() {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // If the user is not authenticated, this effect redirects them to the login page.
    if (!isAuthenticated) {
      navigate('/auth');
    }
  }, [isAuthenticated, navigate]);

  // While the authentication check is happening or redirecting, render nothing.
  if (!isAuthenticated) {
    return null;
  }

  // If the user is authenticated, render the main app layout.
  // <Outlet /> renders the correct page component based on the URL.
  return (
    <div className="min-h-screen bg-background text-text-primary pt-16 pb-20">
      <Toaster
        position="top-center"
        toastOptions={{
          style: {
            background: '#000c45ff', // 'surface' color
            color: '#FFFFFF', // 'text-primary' color
          },
        }}
      />
      <Header />
      <main>
        <Outlet />
      </main>
      <BottomNav />
    </div>
  );
}

export default App;
