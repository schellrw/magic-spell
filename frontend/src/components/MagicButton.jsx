import React, { useState, useMemo } from 'react';

const MagicButton = ({ children, onClick, className = '', type = 'button', ...props }) => {
  const [showSparkles, setShowSparkles] = useState(false);

  const sparkles = useMemo(() => {
    return Array.from({ length: 10 }).map((_, i) => ({
      id: i,
      width: Math.random() * 5 + 2,
      height: Math.random() * 5 + 2,
      left: Math.random() * 100,
      top: Math.random() * 100,
      delay: Math.random() * 0.5,
      duration: Math.random() * 1 + 0.5
    }));
  }, []);

  const handleMouseEnter = () => {
    setShowSparkles(true);
  };

  const handleMouseLeave = () => {
    setShowSparkles(false);
  };

  const handleClick = (e) => {
    onClick && onClick(e);
  };

  return (
    <button
      type={type}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
      {...props}
      className={`relative px-6 py-3 rounded-full font-bold text-white shadow-lg
        bg-gradient-to-r from-purple-500 to-pink-500
        hover:from-purple-600 hover:to-pink-600
        active:from-purple-700 active:to-pink-700
        border-2 border-white/20 hover:border-white/80
        hover:shadow-[0_0_20px_rgba(255,215,0,0.6)]
        transition-all duration-300 ease-in-out
        transform hover:scale-105 hover:-translate-y-1 active:scale-95 active:translate-y-0
        ${className}`}
    >
      {children}
      {showSparkles && ( // Render sparkles only when hovered
        <div className="absolute inset-0 overflow-hidden rounded-full">
          {sparkles.map((s) => (
            <span
              key={s.id}
              className="absolute bg-white rounded-full sparkle-effect"
              style={{
                width: `${s.width}px`,
                height: `${s.height}px`,
                left: `${s.left}%`,
                top: `${s.top}%`,
                animationDelay: `${s.delay}s`,
                animationDuration: `${s.duration}s`,
              }}
            ></span>
          ))}
        </div>
      )}
    </button>
  );
};

export default MagicButton;
