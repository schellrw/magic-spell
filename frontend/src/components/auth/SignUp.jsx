import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authService } from '../../services/supabase';
import MagicButton from '../MagicButton';

const SignUp = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [role, setRole] = useState('learner');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSignUp = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await authService.signUp(email, password, username, role);
      // Supabase may require email confirmation, but for now we'll assume auto-confirm or redirect
      navigate('/');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <div className="bg-white/90 backdrop-blur-sm p-8 rounded-2xl shadow-xl w-full max-w-md border-4 border-purple-300">
        <h2 className="text-3xl font-bold text-purple-600 mb-6 text-center">Join the Guild</h2>
        
        {error && (
          <div className="bg-red-100 border-2 border-red-400 text-red-700 px-4 py-3 rounded mb-4 text-center font-bold">
            {error}
          </div>
        )}

        <form onSubmit={handleSignUp} className="space-y-4">
          <div>
            <label className="block text-purple-800 font-bold mb-1" htmlFor="username">
              Wizard Name
            </label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border-2 border-purple-200 focus:border-purple-500 focus:outline-none text-lg"
              placeholder="Merlin the Great"
              required
            />
          </div>

          <div>
            <label className="block text-purple-800 font-bold mb-1" htmlFor="email">
              Email Address
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border-2 border-purple-200 focus:border-purple-500 focus:outline-none text-lg"
              placeholder="wizard@magicspell.com"
              required
            />
          </div>

          <div>
            <label className="block text-purple-800 font-bold mb-1" htmlFor="password">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border-2 border-purple-200 focus:border-purple-500 focus:outline-none text-lg"
              placeholder="********"
              required
            />
          </div>

          <div>
            <label className="block text-purple-800 font-bold mb-2">I am a...</label>
            <div className="flex space-x-4">
              <label className={`flex-1 cursor-pointer p-4 rounded-xl border-2 text-center transition-all ${
                role === 'learner' 
                  ? 'bg-purple-100 border-purple-500 text-purple-900 font-bold' 
                  : 'bg-gray-50 border-gray-200 hover:border-purple-300'
              }`}>
                <input 
                  type="radio" 
                  name="role" 
                  value="learner" 
                  checked={role === 'learner'}
                  onChange={(e) => setRole(e.target.value)}
                  className="hidden"
                />
                <span className="text-2xl block mb-1">🎓</span>
                Learner
              </label>
              
              <label className={`flex-1 cursor-pointer p-4 rounded-xl border-2 text-center transition-all ${
                role === 'parent' 
                  ? 'bg-blue-100 border-blue-500 text-blue-900 font-bold' 
                  : 'bg-gray-50 border-gray-200 hover:border-blue-300'
              }`}>
                <input 
                  type="radio" 
                  name="role" 
                  value="parent" 
                  checked={role === 'parent'}
                  onChange={(e) => setRole(e.target.value)}
                  className="hidden"
                />
                <span className="text-2xl block mb-1">👑</span>
                Parent
              </label>
            </div>
          </div>

          <div className="flex justify-center pt-4">
            <MagicButton 
              type="submit" 
              disabled={loading}
              className="text-2xl px-12 py-4 w-full bg-purple-500 hover:bg-purple-600"
            >
              {loading ? 'Creating...' : 'Start Adventure'}
            </MagicButton>
          </div>
        </form>

        <div className="mt-6 text-center">
          <p className="text-purple-800">
            Already have a spell book?{' '}
            <Link to="/login" className="text-purple-600 font-bold hover:underline">
              Enter Castle
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignUp;

