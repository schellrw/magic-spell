import React, { useState } from 'react';

const MagicButton = ({ children, onClick, className = '' }) => {
  const [showSparkles, setShowSparkles] = useState(false);

  const handleMouseEnter = () => {
    setShowSparkles(true);
  };

  const handleMouseLeave = () => {
    setShowSparkles(false);
  };

  const handleClick = (e) => {
    onClick && onClick(e);
    // You can also trigger a click-specific sparkle effect here if desired
  };

  return (
    <button
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
      className={`relative px-6 py-3 rounded-full font-bold text-white shadow-lg
        bg-gradient-to-r from-purple-500 to-pink-500
        hover:from-purple-600 hover:to-pink-600
        active:from-purple-700 active:to-pink-700
        border-2 border-transparent hover:border-white/40
        hover:shadow-[0_0_20px_rgba(192,132,252,0.6)]
        transition-all duration-300 ease-in-out
        transform hover:scale-105 hover:-translate-y-1 active:scale-95 active:translate-y-0
        ${className}`}
    >
      {children}
      {showSparkles && ( // Render sparkles only when hovered
        <div className="absolute inset-0 overflow-hidden rounded-full">
          {Array.from({ length: 10 }).map((_, i) => (
            <span
              key={i}
              className="absolute bg-white rounded-full sparkle-effect"
              style={{
                width: `${Math.random() * 5 + 2}px`, // 2-7px
                height: `${Math.random() * 5 + 2}px`,
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 0.5}s`,
                animationDuration: `${Math.random() * 1 + 0.5}s`,
              }}
            ></span>
          ))}
        </div>
      )}
    </button>
  );
};

export default MagicButton;
