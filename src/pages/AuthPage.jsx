import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../services/supabaseClient';
import toast from 'react-hot-toast';

export default function AuthPage() {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    const { error } = isLogin 
      ? await supabase.auth.signInWithPassword({ email, password })
      : await supabase.auth.signUp({ email, password });

    if (error) {
      toast.error(error.message);
    } else {
      toast.success(isLogin ? 'Welcome back!' : 'Account created! Check your email to verify.');
      if (isLogin) navigate('/');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center p-4">
      <div className="w-full max-w-md">
        <h1 className="text-4xl font-bold text-center mb-2">Cal AI</h1>
        <p className="text-center text-gray-500 mb-8">{isLogin ? 'Welcome back.' : 'Create your account.'}</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input 
            type="email" 
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500"
          />
          <input 
            type="password" 
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500"
          />
          <button 
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-black text-white font-semibold rounded-lg hover:bg-gray-800 disabled:bg-gray-300 transition"
          >
            {loading ? 'Processing...' : (isLogin ? 'Log In' : 'Sign Up')}
          </button>
        </form>

        <button onClick={() => setIsLogin(!isLogin)} className="w-full mt-4 text-sm text-center text-gray-600 hover:underline">
          {isLogin ? 'Need an account? Sign Up' : 'Already have an account? Log In'}
        </button>
      </div>
    </div>
  );
}