import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../services/supabaseClient';
import Card from '../components/Card.jsx';
import toast from 'react-hot-toast';

export default function AuthPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async (event) => {
    event.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    
    if (error) {
      toast.error(error.error_description || error.message);
    } else {
      toast.success('Signed in successfully!');
      navigate('/'); // Redirect to dashboard on success
    }
    setLoading(false);
  };

  const handleSignup = async (event) => {
    event.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signUp({ email, password });
    
    if (error) {
      toast.error(error.error_description || error.message);
    } else {
      toast.success('Check your email for the verification link!');
    }
    setLoading(false);
  };

  const inputStyles = "w-full px-4 py-2 bg-black/20 rounded-lg border border-white/20 focus:outline-none focus:ring-2 focus:ring-primary";

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background">
      <Card className="w-full max-w-sm">
        <h1 className="text-2xl font-bold text-center mb-2 text-primary">Welcome to CALPLATE</h1>
        <p className="text-center text-text-secondary mb-8">Sign in or create an account</p>
        <form className="space-y-4">
          <input className={inputStyles} type="email" placeholder="Your email" value={email} onChange={(e) => setEmail(e.target.value)} />
          <input className={inputStyles} type="password" placeholder="Your password" value={password} onChange={(e) => setPassword(e.target.value)} />
          <div className="flex flex-col sm:flex-row gap-4 pt-2">
            <button onClick={handleLogin} className="w-full py-2 bg-primary hover:bg-primary-dark font-bold rounded-lg transition-colors" disabled={loading}>
              {loading ? 'Signing In...' : 'Sign In'}
            </button>
            <button onClick={handleSignup} className="w-full py-2 bg-transparent border border-primary text-primary hover:bg-primary/20 font-bold rounded-lg transition-colors" disabled={loading}>
              {loading ? 'Signing Up...' : 'Sign Up'}
            </button>
          </div>
        </form>
      </Card>
    </div>
  );
}
