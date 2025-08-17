import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useData } from '../contexts/DataContext';
import { LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ProfilePage = () => {
  const { user, session, signOut } = useAuth();
  const { meals } = useData();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate('/auth'); // Redirect to login page after sign out
  };

  // ... copy the entire Profile component logic here ...
  // Make sure to call `handleSignOut` on the button click.
};

export default ProfilePage;