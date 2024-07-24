import React from 'react';

const SearchBar = ({
  searchText,
  setSearchText,
  handleFilter,
  handleSort,
}: {
  searchText: string;
  setSearchText: any;
  handleFilter?: Function;
  handleSort?: Function;
}) => {
  return (
    <div className="flex flex-row gap-7">
      <div className="relative flex flex-row items-center justify-start rounded-full border border-blue-800">
        <div className="pointer-events-none absolute flex items-center justify-center pl-6">
          <img src="/svgs/search.svg" alt="Search Icon" />
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
      <div className="flex max-w-5 flex-row items-center justify-center gap-2">
        <div className="w-full shrink-0 cursor-pointer" onClick={() => handleFilter()}>
          <img src="/svgs/filter.svg" alt="Filter Icon" />
        </div>
        <div className="w-full shrink-0 cursor-pointer" onClick={() => handleSort()}>
          <img src="/svgs/arrows-sort.svg" alt="Arrows Sort" />
        </div>
      </div>
    </div>
  );
};

export default SearchBar;
