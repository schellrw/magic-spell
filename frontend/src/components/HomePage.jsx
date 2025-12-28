import { useNavigate } from 'react-router-dom';
import MagicButton from './MagicButton';
import { useAuth } from '../context/AuthContext';

const HomePage = () => {
  const navigate = useNavigate();
  const { isAdmin } = useAuth();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <h1 className="text-5xl font-bold text-blue-100 mb-12 drop-shadow-[0_2px_2px_rgba(0,0,0,0.5)]">Magic Spell</h1>
      <div className="flex flex-row space-x-12">
        <MagicButton 
          onClick={() => navigate('/test')}
          className="text-4xl py-6 px-12 shadow-xl"
        >
          Practice Words
        </MagicButton>
        {isAdmin && (
          <MagicButton 
            onClick={() => navigate('/manage')}
            className="text-4xl py-6 px-12 shadow-xl"
          >
            Manage Words
          </MagicButton>
        )}
      </div>
    </div>
  );
};

export default HomePage;
