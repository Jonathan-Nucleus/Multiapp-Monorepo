import { ReactElement } from "react";

interface MenuItemProps<Option extends Readonly<string>> {
  options: Readonly<Option[]>;
  selectedOption: Option;
  onOptionSelected: (option: Option) => void;
}

function FundsHeader<Option extends Readonly<string>>({
  options,
  selectedOption,
  onOptionSelected,
}: MenuItemProps<Option>): ReactElement {
  return (
    <div className="flex flex-row w-full bg-gray-200 h-16 justify-between items-center">
      {options.map((option) => (
        <button
          key={option}
          className={
            selectedOption === option
              ? "flex justify-center text-sm text-blue-600 border border-blue-600 items-center h-12 mx-2 my-2 rounded-lg w-6/12 bg-gray-50 hover:bg-gray-100"
              : "flex justify-center text-sm text-gray-600 items-center h-12 mx-2 my-2 rounded-lg w-6/12 bg-gray-50 hover:bg-gray-100"
          }
          onClick={() => onOptionSelected(option)}
        >
          {option}
        </button>
      ))}
    </div>
  );
}

export default FundsHeader;
