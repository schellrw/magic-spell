import React from 'react';
import { Link } from 'react-router-dom';
import MagicButton from '../MagicButton';

const LogoutPage = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <div className="bg-white/90 backdrop-blur-sm p-8 rounded-2xl shadow-xl w-full max-w-lg border-4 border-blue-300 text-center animate-fade-in">
        <div className="mb-6 text-6xl">✨</div>
        <h2 className="text-4xl font-bold text-blue-600 mb-6 drop-shadow-sm">
          Spell Cast Complete!
        </h2>
        
        <p className="text-xl text-blue-800 mb-8 leading-relaxed">
          You have successfully left the castle. <br/>
          Your magical progress has been saved safely in the archives.
        </p>

        <p className="text-lg text-blue-700 mb-8 italic">
          "A wizard is never late, nor is he early, he arrives precisely when he means to."
        </p>

        <div className="flex flex-col space-y-4">
          <Link to="/login">
            <MagicButton className="w-full text-xl py-4">
              Return to Castle (Login)
            </MagicButton>
          </Link>
          
          <Link to="/" className="text-blue-500 hover:text-blue-700 font-semibold transition-colors mt-2 block">
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LogoutPage;

