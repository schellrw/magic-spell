import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './components/HomePage';
import WordListManager from './components/WordListManager';
import PreTest from './components/PreTest';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/manage" element={<WordListManager />} />
        <Route path="/test" element={<PreTest />} />
      </Routes>
    </Router>
  );
}

export default App;
