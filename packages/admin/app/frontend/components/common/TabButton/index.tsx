import { FC } from "react";

type VF = () => void;

interface TabButtonProps {
  tabTitle: string;
  selected: boolean;
  onPressed: VF;
}

const TabButton: FC<TabButtonProps> = ({ onPressed, selected, tabTitle }) => {
  const activeStyle =
    "inline-block p-4 rounded-t-lg border-b-2 text-blue-600 hover:text-blue-600 border-blue-600";
  const inactiveStyle =
    "inline-block p-4 rounded-t-lg border-b-2 border-transparent hover:text-gray-600 hover:border-gray-300 text-gray-500 border-gray-100";
  return (
    <button
      className={selected === true ? activeStyle : inactiveStyle}
      type="button"
      role="tab"
      aria-selected={selected}
      onClick={onPressed}
    >
      {tabTitle}
    </button>
  );
};

export default TabButton;
