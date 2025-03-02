import React from 'react';

const ResponsiveNavbar = ({ handleAddRef , handleSearchRef }) => {
  return (
    <nav className="bg-white shadow-md fixed w-full top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo or Brand Name */}
          <div className="flex-shrink-0 flex items-center">
            <span className="text-xl font-bold text-blue-600">MyApp</span>
          </div>

          {/* Navigation Buttons */}
          <div className="flex items-center space-x-4">
            <button onClick={handleAddRef} className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition duration-300">
              Add 
            </button>
            <button onClick={handleSearchRef} className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition duration-300">
              Search
            </button>
            <button className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition duration-300">
              Dashboard
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default ResponsiveNavbar;