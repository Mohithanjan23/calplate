import { useAuth } from '../contexts/AuthContext';
import { User, LogOut } from 'lucide-react';
import toast from 'react-hot-toast';

export default function ProfilePage() {
    const { user, signOut } = useAuth();

    const handleSignOut = async () => {
        const { error } = await signOut();
        if (error) {
            toast.error("Failed to sign out.");
        }
    };

    return (
      <div className="p-4 space-y-6">
        <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                <User size={32} className="text-gray-500"/>
            </div>
            <div>
                <h2 className="text-xl font-semibold">{user?.email}</h2>
                <p className="text-sm text-gray-500">Member</p>
            </div>
        </div>
        
        <button
          onClick={handleSignOut}
          className="w-full bg-red-500 text-white py-3 px-4 rounded-lg font-medium hover:bg-red-600 flex items-center justify-center space-x-2"
        >
          <LogOut className="w-5 h-5" />
          <span>Sign Out</span>
        </button>
      </div>
    );
};