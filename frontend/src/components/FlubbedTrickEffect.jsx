import React, { useEffect, useState } from 'react';

const FlubbedTrickEffect = ({ duration = 1000, count = 20 }) => {
  const [particles, setParticles] = useState([]);

  useEffect(() => {
    const newParticles = Array.from({ length: count }).map((_, i) => ({
      id: i,
      size: Math.random() * 8 + 4, // 4-12px
      left: Math.random() * 100 - 50,
      top: Math.random() * 100 - 50,
      delay: Math.random() * 0.3,
      duration: Math.random() * 0.8 + 0.6, // 0.6-1.4s
    }));
    setParticles(newParticles);

    const timer = setTimeout(() => {
      setParticles([]);
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, count]);

  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
      {particles.map(p => (
        <div
          key={p.id}
          className="absolute bg-red-400 rounded-full flubbed-particle-animation"
          style={{
            width: `${p.size}px`,
            height: `${p.size}px`,
            transform: `translate(${p.left}px, ${p.top}px) scale(0)`,
            animationDelay: `${p.delay}s`,
            animationDuration: `${p.duration}s`,
          }}
        />
      ))}
      <p className="absolute text-red-500 font-bold text-lg animate-fade-out"
        style={{ animationDuration: `${duration / 1000}s` }}>Oops!</p>
    </div>
  );
};

export default FlubbedTrickEffect;
