import { FC } from "react";

interface MenuItemProps {
  letter: string;
}

const SortHeader: FC<MenuItemProps> = ({ letter }: MenuItemProps) => {
  return (
    <div className="flex w-full bg-gray-200 h-10 justify-left items-center pl-3">
      <p className="text-sm text-black">{letter}</p>
    </div>
  );
};

export default SortHeader;
