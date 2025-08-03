import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../services/supabaseClient';
import Card from '../components/Card.jsx';
import toast from 'react-hot-toast';

export default function Profile() {
  const { user, signOut } = useAuth();
  const [loading, setLoading] = useState(true);
  const [username, setUsername] = useState('');
  const [fullName, setFullName] = useState('');

  useEffect(() => {
    async function getProfile() {
      if (!user) return;
      setLoading(true);
      const { data, error } = await supabase.from('profiles').select(`username, full_name`).eq('id', user.id).single();
      if (error && error.code !== 'PGRST116') {
        toast.error("Could not fetch profile.");
      } else if (data) {
        setUsername(data.username || '');
        setFullName(data.full_name || '');
      }
      setLoading(false);
    }
    getProfile();
  }, [user]);

  async function updateProfile(event) {
    event.preventDefault();
    setLoading(true);
    const updates = { id: user.id, username, full_name: fullName, updated_at: new Date() };
    const { error } = await supabase.from('profiles').upsert(updates);
    if (error) {
      toast.error(error.message);
    } else {
      toast.success('Profile updated successfully!');
    }
    setLoading(false);
  }

  return (
    <div className="p-4">
    <Card className="w-full max-w-md mx-auto">
      <h2 className="text-2xl font-bold text-center mb-6">User Profile</h2>
      <form onSubmit={updateProfile} className="space-y-4">
        <div>Email: <span className="text-text-secondary">{user?.email}</span></div>
        <div>
          <label htmlFor="username" className="block text-sm font-medium text-text-secondary mb-1">Username</label>
          <input id="username" type="text" value={username} onChange={(e) => setUsername(e.target.value)} className="w-full px-4 py-2 mt-1 bg-black/20 rounded-lg border border-white/20 focus:outline-none focus:ring-2 focus:ring-primary" />
        </div>
        <div>
          <label htmlFor="fullName" className="block text-sm font-medium text-text-secondary mb-1">Full Name</label>
          <input id="fullName" type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} className="w-full px-4 py-2 mt-1 bg-black/20 rounded-lg border border-white/20 focus:outline-none focus:ring-2 focus:ring-primary" />
        </div>
        <div className="flex gap-4 pt-2">
          <button className="w-full py-2 bg-primary hover:bg-primary-dark font-bold rounded-lg transition-colors" type="submit" disabled={loading}>
            {loading ? 'Saving...' : 'Update Profile'}
          </button>
           <button className="w-full py-2 bg-surface hover:bg-white/10 border border-white/20 font-bold rounded-lg transition-colors" type="button" onClick={signOut}>
            Sign Out
          </button>
        </div>
      </form>
    </Card>
    </div>
  );
};