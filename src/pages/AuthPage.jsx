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
  
  const inputStyles = "w-full px-4 py-3 bg-surface text-text-primary border border-white/20 rounded-lg focus:ring-2 focus:ring-primary focus:outline-none transition";

  return (
    <div className="min-h-screen bg-background flex flex-col justify-center items-center p-4">
      <div className="w-full max-w-md">
        <h1 className="text-4xl font-bold text-center mb-2 text-primary">Cal AI</h1>
        <p className="text-center text-text-secondary mb-8">{isLogin ? 'Welcome back.' : 'Create your account.'}</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input 
            type="email" 
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={inputStyles}
          />
          <input 
            type="password" 
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={inputStyles}
          />
          <button 
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-primary text-white font-semibold rounded-lg hover:bg-violet-700 disabled:bg-primary/50 transition"
          >
            {loading ? 'Processing...' : (isLogin ? 'Log In' : 'Sign Up')}
          </button>
        </form>

        <button onClick={() => setIsLogin(!isLogin)} className="w-full mt-4 text-sm text-center text-text-secondary hover:underline">
          {isLogin ? 'Need an account? Sign Up' : 'Already have an account? Log In'}
        </button>
      </div>
    </div>
  );
}