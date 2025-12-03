import React, { useMemo } from 'react';

const Star = ({ style, className }) => (
  <div
    className={`absolute bg-white ${className}`}
    style={{
      ...style,
      clipPath: 'polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)'
    }}
  ></div>
);

const Stars = ({ count = 75 }) => {
  const stars = useMemo(() => {
    return Array.from({ length: count }).map((_, i) => {
      const size = Math.random() * 8 + 4; // 4px - 12px
      const left = Math.random() * 100;
      const top = Math.random() * 100;
      const duration = Math.random() * 3 + 2; // 2s - 5s
      const delay = Math.random() * 2;

      return (
        <Star
          key={i}
          className="animate-pulse"
          style={{
            width: `${size}px`,
            height: `${size}px`,
            left: `${left}%`,
            top: `${top}%`,
            opacity: Math.random() * 0.5 + 0.2, // 0.2 - 0.7 opacity
            animationDuration: `${duration}s`,
            animationDelay: `${delay}s`,
          }}
        />
      );
    });
  }, [count]);

  return (
    <div className="fixed inset-0 w-full h-full pointer-events-none" style={{ zIndex: 0 }}>
      {stars}
    </div>
  );
};

export default Stars;
