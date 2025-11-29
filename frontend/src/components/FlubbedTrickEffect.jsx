import React, { useEffect, useState } from 'react';

const FlubbedTrickEffect = ({ duration = 1000 }) => {
  const [showEffect, setShowEffect] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowEffect(false);
    }, duration);

    return () => clearTimeout(timer);
  }, [duration]);

  if (!showEffect) return null;

  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
      <div className="flubbed-trick-animation bg-gray-400 rounded-full opacity-0"
        style={{
          width: '50px',
          height: '50px',
          animationDuration: `${duration / 1000}s`,
        }}
      ></div>
      <p className="absolute text-red-500 font-bold text-lg animate-fade-out"
        style={{ animationDuration: `${duration / 1000}s` }}>Oops!</p>
    </div>
  );
};

export default FlubbedTrickEffect;
