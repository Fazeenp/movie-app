import React from 'react';

const Search = ({ searchTerm, setSearchTerm }) => {
  return (
    <div className="w-full">
      <div className="flex w-full max-w-2xl mx-auto rounded-full overflow-hidden  bg-white/5 backdrop-blur-sm shadow-md transition-all focus-within:shadow-xl focus-within:ring-2 focus-within:ring-purple-500">
        <input
          type="text"
          placeholder="Search for movies..."
          value={searchTerm}
          className="flex-1 px-5 py-3 border border-white/15 text-white placeholder-gray-400 bg-transparent outline-none text-base sm:text-lg"
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
    </div>
  );
};

export default Search;
