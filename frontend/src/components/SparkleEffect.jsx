import React, { useEffect, useState } from 'react';

const SparkleEffect = ({ duration = 1000, count = 20 }) => {
  const [sparkles, setSparkles] = useState([]);

  useEffect(() => {
    const newSparkles = Array.from({ length: count }).map((_, i) => ({
      id: i,
      size: Math.random() * 5 + 3, // 3-8px
      left: Math.random() * 100 - 50, // -50 to 50 relative to center
      top: Math.random() * 100 - 50, // -50 to 50 relative to center
      delay: Math.random() * 0.2, // 0-0.2s
      duration: Math.random() * 0.5 + 0.5, // 0.5-1s
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
            transform: `translate(${s.left}px, ${s.top}px) scale(0)`,
            animationDelay: `${s.delay}s`,
            animationDuration: `${s.duration}s`,
          }}
        />
      ))}
    </div>
  );
};

export default SparkleEffect;
