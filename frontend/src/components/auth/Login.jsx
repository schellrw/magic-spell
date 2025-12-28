import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authService } from '../../services/supabase';
import MagicButton from '../MagicButton';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await authService.signIn(email, password);
      navigate('/');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <div className="bg-white/90 backdrop-blur-sm p-8 rounded-2xl shadow-xl w-full max-w-md border-4 border-blue-300">
        <h2 className="text-3xl font-bold text-blue-600 mb-6 text-center">Magic Login</h2>
        
        {error && (
          <div className="bg-red-100 border-2 border-red-400 text-red-700 px-4 py-3 rounded mb-4 text-center font-bold">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-blue-800 font-bold mb-2" htmlFor="email">
              Email Address
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border-2 border-blue-200 focus:border-blue-500 focus:outline-none text-lg text-blue-900 bg-white"
              placeholder="wizard@magicspell.com"
              required
              autoComplete="username email"
            />
          </div>

          <div>
            <label className="block text-blue-800 font-bold mb-2" htmlFor="password">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border-2 border-blue-200 focus:border-blue-500 focus:outline-none text-lg text-blue-900 bg-white"
              placeholder="********"
              required
              autoComplete="current-password"
            />
          </div>

          <div className="flex justify-center pt-4">
            <MagicButton 
              type="submit" 
              disabled={loading}
              className="text-2xl px-12 py-4 w-full"
            >
              {loading ? 'Casting Spell...' : 'Enter Castle'}
            </MagicButton>
          </div>
        </form>

        <div className="mt-6 text-center">
          <p className="text-blue-800">
            Need a spell book?{' '}
            <Link to="/signup" className="text-blue-600 font-bold hover:underline">
              Join the Guild
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;

