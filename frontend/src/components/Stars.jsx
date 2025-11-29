import React from 'react';

const Star = ({ className, style }) => (
  <div className={`absolute bg-white rounded-full animate-pulse ${className}`} style={style}></div>
);

const Stars = () => {
  const generateStars = (count) => {
    const stars = [];
    for (let i = 0; i < count; i++) {
      const size = Math.random() * 2 + 1; // 1 to 3 pixels
      const left = Math.random() * 100;
      const top = Math.random() * 100;
      const duration = Math.random() * 3 + 2; // 2 to 5 seconds
      const delay = Math.random() * 2;

      stars.push(
        <Star
          key={i}
          className=""
          style={{
            width: `${size}px`,
            height: `${size}px`,
            left: `${left}%`,
            top: `${top}%`,
            animationDuration: `${duration}s`,
            animationDelay: `${delay}s`,
          }}
        />
      );
    }
    return stars;
  };

  return (
    <div className="absolute inset-0 z-0">
      {generateStars(100)} {/* Adjust number of stars as needed */}
    </div>
  );
};

export default Stars;
