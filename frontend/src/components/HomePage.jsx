import { Link } from 'react-router-dom';

const HomePage = () => (
  <div className="flex flex-col items-center justify-center min-h-screen bg-blue-100 p-4">
    <h1 className="text-5xl font-bold text-blue-800 mb-12">Magic Spell</h1>
    <div className="flex flex-col space-y-8">
      <Link to="/test" className="bg-green-500 hover:bg-green-600 text-white font-bold py-6 px-12 rounded-xl shadow-lg text-4xl text-center transition duration-300 ease-in-out transform hover:scale-105">
        Practice Words
      </Link>
      <Link to="/manage" className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-6 px-12 rounded-xl shadow-lg text-4xl text-center transition duration-300 ease-in-out transform hover:scale-105">
        Manage Words
      </Link>
    </div>
  </div>
);

export default HomePage;
