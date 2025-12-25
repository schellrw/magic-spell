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
      {/* Background Layer - Fixed z-0 */}
      <div className="fixed inset-0 z-0 bg-gradient-to-br from-gray-900 via-indigo-900 to-purple-900"></div>
      
      {/* Stars Layer - Fixed z-10 */}
      <div className="fixed inset-0 z-10 pointer-events-none">
        <Stars />
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

      {/* Content Layer - Relative z-20 */}
      <div className="relative z-20 h-screen w-screen overflow-auto">
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
