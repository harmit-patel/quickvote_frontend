import React from "react";

const BackgroundAnimation = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <div className="absolute w-64 h-64 bg-blue-400 opacity-20 blur-3xl animate-pulse rounded-full top-0 left-0"></div>
      <div className="absolute w-96 h-96 bg-purple-400 opacity-30 blur-3xl animate-pulse rounded-full bottom-0 right-0"></div>
    </div>
  );
};

export default BackgroundAnimation;