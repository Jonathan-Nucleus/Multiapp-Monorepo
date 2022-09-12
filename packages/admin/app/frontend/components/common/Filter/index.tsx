import { ReactElement, useState } from "react";
import { Funnel } from "phosphor-react";

interface FilterProps<Option extends Readonly<string>> {
  value: Option;
  options: Readonly<
    {
      label: string;
      value: Option;
    }[]
  >;
  onOptionSelected: (option: Option) => void;
  className?: string;
}

function Filter<Option extends Readonly<string>>({
  value,
  options,
  onOptionSelected,
  className,
}: FilterProps<Option>): ReactElement {
  const [showDropdown, setShowDropdown] = useState(false);
  const toggleDropdown = () => setShowDropdown(!showDropdown);

  return (
    <div>
      <button
        className={`flex py-4 justify-center ml-2 rounded-lg items-center bg-gray-50 hover:bg-gray-100 text-white font-medium ${className}`}
        type="button"
        onClick={toggleDropdown}
      >
        <p className="text-sm text-gray-700 mr-1">
          {options.find((option) => option.value === value)?.label}
        </p>
        <Funnel size={22} color={"#333"} />
      </button>
      {showDropdown && (
        <div className="z-10 w-32 mt-2 mr-10 shadow absolute bg-white rounded divide-y divide-gray-100">
          {options.map(({ label, value }) => (
            <button
              key={value}
              className="py-2 px-2 w-full hover:bg-gray-100"
              onClick={() => {
                onOptionSelected(value);
                setShowDropdown(false);
              }}
            >
              <p className="text-sm text-gray-700">{label}</p>
            </button>
          ))}
        </div>
      )}
      {/*activityDropdown && (
        <div className="z-10 w-36 mt-2 shadow absolute bg-white rounded divide-y divide-gray-100">
          <FilterOption title={"All"} onClickItem={onClickItem} />
          <FilterOption title={"Posts"} onClickItem={onClickItem} />
          <FilterOption title={"Comments"} onClickItem={onClickItem} />
        </div>
      )*/}
    </div>
  );
}

export default Filter;
