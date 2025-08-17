import { Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import { useEffect } from 'react';
import BottomNav from './components/BottomNav.jsx';
import { Toaster } from 'react-hot-toast';

export default function App() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) {
      navigate('/auth');
    }
  }, [user, loading, navigate]);

  if (loading) {
    return <div>Loading...</div>; // Or a proper loading spinner
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      <Toaster position="top-center" />
      <main className="max-w-4xl mx-auto">
        <Outlet />
      </main>
      <BottomNav />
    </div>
  );
}