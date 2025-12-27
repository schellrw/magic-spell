import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './components/HomePage';
import WordListManager from './components/WordListManager';
import PreTest from './components/PreTest';
import Stars from './components/Stars';
import SparkleEffect from './components/SparkleEffect';

function App() {
  const [sparkles, setSparkles] = useState([]);

  useEffect(() => {
    const handleClick = (e) => {
      // Create a unique ID for each click event
      const id = Date.now() + Math.random();
      setSparkles(prev => [...prev, { id, x: e.clientX, y: e.clientY }]);
      
      // Remove sparkle after animation (1s)
      setTimeout(() => {
        setSparkles(prev => prev.filter(s => s.id !== id));
      }, 1000);
    };

    window.addEventListener('click', handleClick);
    return () => window.removeEventListener('click', handleClick);
  }, []);

  return (
    <Router>
      {/* Background Layer - Fixed z-negative */}
      <div 
        className="fixed inset-0 bg-gradient-to-br from-gray-900 via-indigo-950 to-purple-950" 
        style={{ zIndex: -10, background: 'linear-gradient(to bottom right, #111827, #1e1b4b, #3b0764)' }}
      ></div>
      
      {/* Stars Layer - Fixed z-0 */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <Stars count={100} />
      </div>

      {/* Global Sparkles Layer - Fixed z-50 */}
      <div className="fixed inset-0 pointer-events-none z-50">
        {sparkles.map(s => (
          <div 
            key={s.id} 
            style={{ 
              position: 'absolute', 
              left: s.x, 
              top: s.y,
              width: 0,
              height: 0,
              overflow: 'visible' 
            }}
          >
            <SparkleEffect count={12} duration={1000} />
          </div>
        ))}
      </div>

      {/* Content Layer - Relative z-10 */}
      <div className="relative z-10 h-screen w-screen overflow-auto">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/manage" element={<WordListManager />} />
          <Route path="/test" element={<PreTest />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
