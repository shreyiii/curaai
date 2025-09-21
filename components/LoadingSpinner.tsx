import React from 'react';

const LoadingSpinner: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center p-8 space-y-4">
      <div className="w-12 h-12 border-4 border-t-teal-500 border-gray-200 rounded-full animate-spin"></div>
      <p className="text-teal-700">AI is analyzing your symptoms...</p>
    </div>
  );
};

export default LoadingSpinner;