import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { authService } from '../services/supabase';

const NavBar = () => {
  const { user, profile, isAdmin } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await authService.signOut();
      navigate('/login');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  if (!user) return null;

  return (
    <nav className="fixed top-0 left-0 right-0 z-40 bg-white/10 backdrop-blur-md border-b border-white/20 px-4 py-3">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-6">
          <Link to="/" className="text-2xl font-bold text-white drop-shadow-md hover:scale-105 transition-transform">
            ✨ Magic Spell
          </Link>
          
          <div className="hidden md:flex space-x-4">
            <Link 
              to="/test" 
              className="text-white hover:bg-white/20 px-3 py-1 rounded-lg transition-colors font-medium"
            >
              Practice
            </Link>
            {isAdmin && (
              <Link 
                to="/manage" 
                className="text-white hover:bg-white/20 px-3 py-1 rounded-lg transition-colors font-medium"
              >
                Manage Words
              </Link>
            )}
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <div className="text-white text-sm md:text-base">
            <span className="opacity-75">Wizard: </span>
            <span className="font-bold">{profile?.username || user.email}</span>
            {isAdmin && <span className="ml-2 text-xs bg-yellow-400 text-yellow-900 px-2 py-0.5 rounded-full font-bold">Parent</span>}
          </div>
          
          <button
            onClick={handleLogout}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-1.5 rounded-lg text-sm font-bold shadow-sm transition-colors"
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;

