// src/pages/Profile.jsx

import { useState, useEffect } from 'react';
import { supabase } from '../services/supabaseClient';
import Card from '../components/Card';

const Profile = ({ session }) => {
  const [loading, setLoading] = useState(true);
  const [username, setUsername] = useState(null);
  const [fullName, setFullName] = useState(null);
  const [goal, setGoal] = useState(null);

  useEffect(() => {
    let ignore = false;
    async function getProfile() {
      setLoading(true);
      const { user } = session;

      const { data, error } = await supabase
        .from('profiles')
        .select(`username, full_name, goal`)
        .eq('id', user.id)
        .single();

      if (!ignore) {
        if (error) {
          console.warn(error);
        } else if (data) {
          setUsername(data.username);
          setFullName(data.full_name);
          setGoal(data.goal);
        }
      }

      setLoading(false);
    }

    getProfile();
    return () => {
      ignore = true;
    };
  }, [session]);

  async function updateProfile(event) {
    event.preventDefault();
    setLoading(true);
    const { user } = session;

    const updates = {
      id: user.id,
      username,
      full_name: fullName,
      goal,
      updated_at: new Date(),
    };

    const { error } = await supabase.from('profiles').upsert(updates);
    if (error) {
      alert(error.message);
    } else {
      alert('Profile updated successfully!');
    }
    setLoading(false);
  }

  return (
    <Card className="w-full max-w-md">
      <h2 className="text-2xl font-bold text-center mb-6">User Profile</h2>
      <form onSubmit={updateProfile} className="space-y-4">
        <div>Email: {session.user.email}</div>
        <div>
          <label htmlFor="username">Username</label>
          <input
            id="username"
            type="text"
            value={username || ''}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full px-4 py-2 mt-1 bg-black/20 rounded-lg border border-white/20 focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
        <div>
          <label htmlFor="fullName">Full Name</label>
          <input
            id="fullName"
            type="text"
            value={fullName || ''}
            onChange={(e) => setFullName(e.target.value)}
            className="w-full px-4 py-2 mt-1 bg-black/20 rounded-lg border border-white/20 focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
        <div>
          <label htmlFor="goal">Fitness Goal</label>
          <select 
            id="goal" 
            value={goal || ''}
            onChange={(e) => setGoal(e.target.value)}
            className="w-full px-4 py-2 mt-1 bg-black/20 rounded-lg border border-white/20 focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="">Select a goal</option>
            <option value="fat_loss">Fat Loss</option>
            <option value="muscle_gain">Muscle Gain</option>
            <option value="maintenance">Maintain Wellness</option>
          </select>
        </div>

        <div className="flex gap-4 pt-2">
          <button className="w-full py-2 bg-primary hover:bg-primary-dark font-bold rounded-lg transition-colors" type="submit" disabled={loading}>
            {loading ? 'Saving...' : 'Update Profile'}
          </button>
           <button className="w-full py-2 bg-gray-600 hover:bg-gray-700 font-bold rounded-lg transition-colors" type="button" onClick={() => supabase.auth.signOut()}>
            Sign Out
          </button>
        </div>
      </form>
    </Card>
  );
};

export default Profile;
