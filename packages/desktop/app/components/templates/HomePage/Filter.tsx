import { FC, useState } from "react";
import {
  SlidersHorizontal,
  CaretDown,
  CheckSquare,
  Square,
} from "phosphor-react";

type FilterProps = {
  onClick: () => void;
  isVisible: boolean;
};

const items = [
  {
    id: "all",
    label: "All",
  },
  {
    id: "news",
    label: "News",
  },
  {
    id: "ideas",
    label: "Ideas",
  },
  {
    id: "education",
    label: "Education",
  },
];
const Filter: FC<FilterProps> = (props) => {
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);

  const handleFilter = (id: string) => {
    const _selectedFilters = [...selectedFilters];
    const _index = _selectedFilters.findIndex((v) => v === id);
    if (_index > -1) {
      _selectedFilters.splice(_index, 1);
    } else {
      _selectedFilters.push(id);
    }
    setSelectedFilters(_selectedFilters);
  };

  return (
    <div className="relative">
      <div className="flex items-center mt-4" onClick={props.onClick}>
        <SlidersHorizontal size={32} />
        <div className="ml-1 mr-1">All posts from everyone</div>
        <CaretDown size={32} />
      </div>
      {props.isVisible && (
        <div className="absolute z-50 w-full rounded-md py-2 px-4 bg-gray">
          <div className="uppercase mb-3 text-sm">topics</div>
          {items.map((v) => (
            <div className="flex items-center mb-2" key={v.id}>
              <div onClick={() => handleFilter(v.id)}>
                {selectedFilters.findIndex((_v) => _v === v.id) > -1 ? (
                  <CheckSquare size={24} color="#00AAE0" weight="fill" />
                ) : (
                  <Square size={24} />
                )}
              </div>

              <span className="capitalize ml-1">{v.label}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Filter;
