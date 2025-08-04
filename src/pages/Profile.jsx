import { useAuth } from '../context/AuthContext';
import { supabase } from '../services/supabaseClient';
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';
import {
    User,
    Shield,
    Settings,
    LogOut,
    ChevronRight,
    Target
} from 'lucide-react';

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

  return (
    <div className="p-4 space-y-6">
      {/* User Info Header */}
      <div className="flex items-center gap-4">
        <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center">
            <User size={32} />
        </div>
        <div>
            <h1 className="text-2xl font-bold">{user?.user_metadata?.full_name || 'Username'}</h1>
            <p className="text-text-secondary">{user?.email}</p>
        </div>
      </div>

      {/* Profile Menu List */}
      <div className="space-y-3">
        <ProfileMenuItem icon={<Target className="text-primary"/>} label="My Goals" path="/goals" />
        <ProfileMenuItem icon={<Settings className="text-primary"/>} label="Settings" />
        <ProfileMenuItem icon={<Shield className="text-primary"/>} label="Privacy" />
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
};