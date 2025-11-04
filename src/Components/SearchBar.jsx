import React, { useState } from 'react';
import axiosInstance from '../utils/axiosInstance';

const SearchBar = ({ onResults }) => {
  const [query, setQuery] = useState('');

  const handleSearch = async () => {
    if (query.trim()) {
      try {
        const response = await axiosInstance.get(`/api/search-courses/?q=${query}`);
        onResults(response.data);
      } catch (err) {
        console.error('Search failed:', err);
      }
    }
  };

  return (
    <div className="max-w-xl mx-auto my-6 px-4">
      <div className="flex items-center bg-gray-100 rounded-full shadow-md px-4 py-2">
        <input
          type="search"
          name="sch"
          placeholder="Search for courses here..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
          className="flex-1 bg-transparent text-gray-800 placeholder-gray-500 focus:outline-none px-2 py-2"
        />
        <button
          onClick={handleSearch}
          className="bg-indigo-600 text-white px-4 py-2 rounded-full hover:bg-indigo-700 transition font-medium text-sm"
        >
          🔍
        </button>
      </div>
    </div>
  );
};

export default SearchBar;
