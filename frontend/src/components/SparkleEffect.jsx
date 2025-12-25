import React, { useEffect, useState } from 'react';

const SparkleEffect = ({ duration = 1000, count = 25 }) => {
  const [sparkles, setSparkles] = useState([]);

  useEffect(() => {
    const newSparkles = Array.from({ length: count }).map((_, i) => ({
      id: i,
      size: Math.random() * 8 + 4, // 4-12px
      left: Math.random() * 100 - 50, 
      top: Math.random() * 100 - 50, 
      delay: Math.random() * 0.2, 
      duration: Math.random() * 0.7 + 0.8, // 0.8-1.5s
    }));
    setSparkles(newSparkles);

    const timer = setTimeout(() => {
      setSparkles([]); // Clear sparkles after animation
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, count]);

  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
      {sparkles.map(s => (
        <div
          key={s.id}
          className="absolute bg-yellow-300 rounded-full sparkle-burst-effect"
          style={{
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
