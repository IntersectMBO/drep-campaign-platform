import React from 'react';

const SearchBar = ({ searchText, setSearchText }) => {
  return (
    <div className="flex flex-row gap-3">
      <div className="relative flex  w-[232px] flex-row items-center justify-start rounded-full border border-blue-800">
        <div className="pointer-events-none absolute flex items-center justify-center pl-6">
          <img src="/search.svg" alt="Search Icon" />
        </div>
        <input
          type="text"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          data-testid="drep-search-input"
          className="h-full w-full rounded-full bg-transparent py-3 pl-14 placeholder:font-black focus:border-none"
          placeholder="Search..."
        />
      </div>
      <div className="flex flex-row gap-3">
        <img src="/filter.svg" alt="Filter Icon" />
        <img src="/filter.svg" alt="Filter Icon" />
      </div>
    </div>
  );
};

export default SearchBar;
