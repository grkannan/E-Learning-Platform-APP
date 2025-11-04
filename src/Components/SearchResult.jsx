import React, { useState, useRef, useEffect } from 'react';
import SearchBar from './SearchBar';

const SearchResults = () => {
  const [results, setResults] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const popupRef = useRef(null);

  // Show popup when results exist
  useEffect(() => {
    setShowPopup(results.length > 0);
  }, [results]);

  // Hide popup when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (popupRef.current && !popupRef.current.contains(event.target)) {
        setShowPopup(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative max-w-xl mx-auto">
      <SearchBar onResults={setResults} />

      {showPopup && (
        <div
          ref={popupRef}
          className="absolute w-full mt-3 bg-white border border-gray-200 rounded-lg shadow-lg max-h-72 overflow-y-auto z-50 transition-all"
        >
          {results.map((course) => (
            <div
              key={course.id}
              onClick={() => alert(`You selected ${course.title}`)}
              className="px-4 py-3 border-b border-gray-100 hover:bg-indigo-50 cursor-pointer transition"
            >
              <h3 className="text-sm font-semibold text-gray-800">{course.title}</h3>
              <p className="text-xs text-gray-600 truncate">{course.description}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchResults;
