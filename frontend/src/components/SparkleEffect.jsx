import React, { useEffect, useState } from 'react';

const SparkleEffect = ({ duration = 1000, count = 25, spread = 50, minSize = 4, maxSize = 12 }) => {
  const [sparkles, setSparkles] = useState([]);

  useEffect(() => {
    const colors = ['#FFD700', '#FFA500', '#FF4500', '#00BFFF', '#32CD32', '#FF69B4'];
    const newSparkles = Array.from({ length: count }).map((_, i) => ({
      id: i,
      size: Math.random() * (maxSize - minSize) + minSize,
      left: Math.random() * (spread * 2) - spread, 
      top: Math.random() * (spread * 2) - spread, 
      delay: Math.random() * 0.2, 
      duration: Math.random() * 0.7 + 0.8, // 0.8-1.5s
      color: colors[Math.floor(Math.random() * colors.length)]
    }));
    setSparkles(newSparkles);

    const timer = setTimeout(() => {
      setSparkles([]); // Clear sparkles after animation
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, count, spread, minSize, maxSize]);

  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none" style={{ zIndex: 100 }}>
      {sparkles.map(s => (
        <div
          key={s.id}
          className="absolute rounded-full sparkle-burst-effect"
          style={{
            backgroundColor: s.color,
            boxShadow: '0 0 4px 1px rgba(255, 255, 255, 0.8)',
            width: `${s.size}px`,
            height: `${s.size}px`,
            '--tx': `${s.left}px`,
            '--ty': `${s.top}px`,
            '--animation-duration': `${s.duration}s`,
            animationDelay: `${s.delay}s`,
          }}
        />
      ))}
    </div>
  );
};

export default SparkleEffect;
