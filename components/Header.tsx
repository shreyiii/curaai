import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="bg-white shadow-sm">
      <div className="container mx-auto px-4 py-4 md:px-8">
        <h1 className="text-3xl font-bold text-center text-teal-600">
          <span role="img" aria-label="sparkle icon" className="mr-2"></span>
          Cura Gennie
        </h1>
      </div>
    </header>
  );
};

export default Header;