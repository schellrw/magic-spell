import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/auth/ProtectedRoute';
import Login from './components/auth/Login';
import SignUp from './components/auth/SignUp';
import NavBar from './components/NavBar';
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
    <AuthProvider>
      <Router>
        {/* Background Layer - Removed, handled in CSS body */}
        
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
          <NavBar />
          <div className="pt-16"> {/* Add padding for NavBar */}
            <Routes>
              {/* Public Routes */}
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<SignUp />} />

              {/* Protected Routes */}
              <Route path="/" element={
                <ProtectedRoute>
                  <HomePage />
                </ProtectedRoute>
              } />
              
              <Route path="/manage" element={
                <ProtectedRoute requiredRole="parent">
                  <WordListManager />
                </ProtectedRoute>
              } />
              
              <Route path="/test" element={
                <ProtectedRoute>
                  <PreTest />
                </ProtectedRoute>
              } />
            </Routes>
          </div>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
