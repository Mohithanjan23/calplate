import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../services/supabaseClient';
import Card from '../components/Card.jsx';
import toast from 'react-hot-toast';
import { Settings, User, LogOut, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

// Reusable component for each menu item
const ProfileMenuItem = ({ icon, label, path = '#' }) => (
    <Link to={path} className="flex items-center justify-between p-4 bg-surface rounded-lg hover:bg-white/10 transition-colors">
        <div className="flex items-center gap-4">
            {icon}
            <span className="font-semibold">{label}</span>
        </div>
        <ChevronRight className="text-text-secondary" />
    </Link>
);

export default function Profile() {
  const { user, signOut } = useAuth();
  const [username, setUsername] = useState('');

  useEffect(() => {
    async function getProfile() {
      if (!user) return;
      const { data } = await supabase.from('profiles').select(`username`).eq('id', user.id).single();
      if (data) {
        setUsername(data.username || '');
      }
    }
    getProfile();
  }, [user]);

  return (
    <div className="p-4 space-y-6">
      {/* User Info Header */}
      <div className="flex items-center gap-4">
        <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center">
            <User size={32} />
        </div>
        <div>
            <h1 className="text-2xl font-bold">{username || user?.email}</h1>
            <p className="text-text-secondary">Your personal AI nutritionist</p>
        </div>
      </div>

      {/* Profile Menu List */}
      <div className="space-y-3">
        <ProfileMenuItem icon={<Settings className="text-primary"/>} label="Settings" path="/settings" />
        <ProfileMenuItem icon={<User className="text-primary"/>} label="Edit Profile" />
      </div>

      {/* Sign Out Button */}
      <div className="pt-4">
        <button 
            onClick={signOut}
            className="w-full flex items-center justify-center gap-2 py-3 bg-surface hover:bg-white/10 border border-white/20 font-bold rounded-lg transition-colors"
        >
            <LogOut size={20} />
            Log Out
        </button>
      </div>
    </div>
  );
}