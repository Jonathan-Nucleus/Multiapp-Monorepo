import { FC, useState } from "react";
import { MagnifyingGlass } from "phosphor-react";

interface SearchProps {
  onSearch: (text: string) => void;
}

const Search: FC<SearchProps> = ({ onSearch }) => {
  const [searchText, setSearchText] = useState("");

  const handleSearch = (e: any) => {
    setSearchText(e.target.value);
    onSearch(e.target.value);
  };
  return (
    <form className="w-full">
      <div className="relative">
        <div className="flex absolute inset-y-0 left-0 items-center pl-3 pointer-events-none">
          <MagnifyingGlass size={22} color={"#333"} />
        </div>
        <input
          className="block p-4 pl-10 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-900 ring-0"
          placeholder="Search..."
          value={searchText}
          onChange={handleSearch}
        />
      </div>
    </form>
  );
};

export default Search;
