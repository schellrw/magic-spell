import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './components/HomePage';
import WordListManager from './components/WordListManager';
import PreTest from './components/PreTest';
import Stars from './components/Stars';

function App() {
  return (
    <Router>
      <div className="h-screen w-screen bg-gradient-to-br from-gray-900 via-indigo-900 to-purple-900 relative overflow-auto">
        <Stars />
        <div className="relative z-20">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/manage" element={<WordListManager />} />
            <Route path="/test" element={<PreTest />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
