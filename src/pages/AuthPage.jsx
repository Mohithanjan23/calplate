import { useState } from 'react';
import { supabase } from '../services/supabaseClient'; // Make sure this path is correct
import { Eye, EyeOff } from 'lucide-react';
import toast from 'react-hot-toast';

export default function AuthPage() {
    const [authMode, setAuthMode] = useState('login');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleAuth = async (e) => {
        e.preventDefault();
        
        if (authMode === 'signup' && password !== confirmPassword) {
            toast.error('Passwords do not match');
            return;
        }
        
        setLoading(true);
        const { error } = authMode === 'login'
            ? await supabase.auth.signInWithPassword({ email, password })
            : await supabase.auth.signUp({ email, password });
        
        if (error) {
            toast.error(error.message);
        } else if (authMode === 'signup') {
            toast.success('Check your email for the confirmation link!');
        }
        setLoading(false);
    };

    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full">
          <h1 className="text-3xl font-bold text-center text-gray-800 mb-2">Calplate</h1>
          <p className="text-gray-600 text-center mt-2 mb-8">Your AI-powered nutrition companion</p>

          <form onSubmit={handleAuth} className="space-y-6">
            {/* ... Email, Password, Confirm Password inputs from your code ... */}
            <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required className="w-full p-3 border rounded-lg"/>
            <div className="relative">
              <input type={showPassword ? 'text' : 'password'} placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} required className="w-full p-3 border rounded-lg pr-12"/>
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">
                {showPassword ? <EyeOff size={20}/> : <Eye size={20}/>}
              </button>
            </div>
            {authMode === 'signup' && (
              <input type={showPassword ? 'text' : 'password'} placeholder="Confirm Password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} required className="w-full p-3 border rounded-lg"/>
            )}
            <button type="submit" disabled={loading} className="w-full bg-green-600 text-white py-3 rounded-lg font-medium hover:bg-green-700 disabled:opacity-50">
              {loading ? 'Processing...' : (authMode === 'login' ? 'Sign In' : 'Create Account')}
            </button>
          </form>

          <p className="text-center text-sm text-gray-600 mt-4">
            {authMode === 'login' ? "Don't have an account? " : "Already have an account? "}
            <button onClick={() => setAuthMode(authMode === 'login' ? 'signup' : 'login')} className="text-green-600 hover:text-green-700 font-medium">
              {authMode === 'login' ? 'Sign up' : 'Sign in'}
            </button>
          </p>
        </div>
      </div>
    );
};