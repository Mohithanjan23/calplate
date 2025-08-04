import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../services/supabaseClient';
import toast from 'react-hot-toast';

export default function AuthPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Define your theme colors for easy use
  const theme = {
    background: '#152238',
    text: '#ffffff',
    primaryButton: 'bg-white text-black',
    secondaryButton: 'bg-transparent border border-white text-white',
  };

  const handleLogin = async (event) => {
    event.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    
    if (error) {
      toast.error(error.error_description || error.message);
    } else {
      toast.success('Signed in successfully!');
<<<<<<< HEAD
      navigate('/'); // Redirect to dashboard on success
=======
      navigate('/');
>>>>>>> 3963d41 (Feat: Finalize all pages and components)
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

  const inputStyles = "w-full bg-transparent border-b-2 border-white/50 py-3 text-white placeholder-white/70 focus:outline-none focus:border-white transition";

  return (
<<<<<<< HEAD
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
=======
    <div className="min-h-screen flex flex-col justify-center p-6" style={{ backgroundColor: theme.background, color: theme.text }}>
      <div className="w-full max-w-sm mx-auto">
        <h1 className="text-4xl font-bold mb-4">Log In</h1>
        <p className="text-white/80 mb-12">Enter your account details</p>
        
        <form className="space-y-8">
          <div>
            <label className="text-sm font-medium text-white/80">Email</label>
            <input 
              type="email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              className={inputStyles}
            />
          </div>
          <div>
            <label className="text-sm font-medium text-white/80">Password</label>
            <input 
              type="password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              className={inputStyles}
            />
          </div>

          <div className="flex flex-col gap-4 pt-8">
            <button 
              onClick={handleLogin} 
              className={`w-full py-3 font-bold rounded-full transition ${theme.primaryButton}`}
              disabled={loading}
            >
              {loading ? 'Logging In...' : 'Log In'}
>>>>>>> 3963d41 (Feat: Finalize all pages and components)
            </button>
            <button 
              onClick={handleSignup} 
              className={`w-full py-3 font-bold rounded-full transition ${theme.secondaryButton}`}
              disabled={loading}
            >
              {loading ? 'Signing Up...' : 'Sign Up'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
